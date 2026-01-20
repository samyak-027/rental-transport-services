// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";
import axios from "axios";
import { X } from "lucide-react";

// Rejection Modal Component
const RejectionModal = ({ isOpen, onClose, onConfirm, userName, loading }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold mb-2">Reject License</h3>
        <p className="text-gray-600 text-sm mb-4">
          Please provide a reason for rejecting <strong>{userName}'s</strong> license.
          This will be sent to the user.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason (e.g., Image is blurry, License expired, etc.)"
            className="w-full border rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-error"
              disabled={loading || !reason.trim()}
            >
              {loading ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Avatar Component
const UserAvatar = ({ user }) => {
  const firstLetter = user.name?.charAt(0)?.toUpperCase() || "?";
  
  // Generate a consistent color based on the user's name
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  const colorIndex = user.name ? user.name.charCodeAt(0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  if (user.profilePicture) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img 
          src={user.profilePicture} 
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-bold`}>
      {firstLetter}
    </div>
  );
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const navigate = useNavigate();

  // Modal state
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    userId: null,
    userName: ""
  });

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:5007/api/users/getAllusers", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error("Expected array of users but got:", data);
          setUsers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const viewJourneys = (userId) => {
    navigate(`/user-history/${userId}`);
  };

  const handleVerify = async (userId) => {
    if (!window.confirm("Are you sure you want to VERIFY this user?")) return;
    setProcessing(userId);

    try {
      const res = await axios.patch(
        `http://localhost:5007/api/users/verify-license/${userId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("User verified successfully!");
        fetchUsers();
      }
    } catch (err) {
      alert("Verification failed.");
      console.error(err);
    }
    setProcessing(null);
  };

  const openRejectionModal = (userId, userName) => {
    setRejectionModal({
      isOpen: true,
      userId,
      userName
    });
  };

  const closeRejectionModal = () => {
    setRejectionModal({
      isOpen: false,
      userId: null,
      userName: ""
    });
  };

  const handleReject = async (reason) => {
    const { userId } = rejectionModal;
    setProcessing(userId);

    try {
      const res = await axios.patch(
        `http://localhost:5007/api/users/reject-license/${userId}`,
        { reason },
        { withCredentials: true }
      );
      if (res.data.success) {
        closeRejectionModal();
        fetchUsers();
      }
    } catch (err) {
      alert("Rejection failed.");
      console.error(err);
    }
    setProcessing(null);
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>License Status</th>
                  <th>Rejection Reason</th>
                  <th>License Images</th>
                  <th>Actions</th>
                  <th>Journeys</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <UserAvatar user={user} />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.licenseStatus || "NOT_UPLOADED"}</td>
                    <td>
                      {user.licenseStatus === "REJECTED" && user.licenseRejectionReason ? (
                        <span className="text-red-600 text-sm">
                          {user.licenseRejectionReason}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      {(user.licenseFront || user.licenseFrontUrl) && (user.licenseBack || user.licenseBackUrl) ? (
                        <div className="flex gap-2">
                          <a href={user.licenseFront || user.licenseFrontUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={user.licenseFront || user.licenseFrontUrl}
                              alt="Front"
                              className="w-12 h-12 object-cover border rounded"
                            />
                          </a>
                          <a href={user.licenseBack || user.licenseBackUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={user.licenseBack || user.licenseBackUrl}
                              alt="Back"
                              className="w-12 h-12 object-cover border rounded"
                            />
                          </a>
                        </div>
                      ) : (
                        <span>No uploads</span>
                      )}
                    </td>
                    <td>
                      {(user.licenseStatus === "PENDING" || (!user.licenseStatus && !user.isAccountVerified)) &&
                        (user.licenseFront || user.licenseFrontUrl) &&
                        (user.licenseBack || user.licenseBackUrl) && (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleVerify(user._id)}
                              className="btn btn-xs btn-success"
                              disabled={processing === user._id}
                            >
                              {processing === user._id ? "Verifying..." : "✅ Verify"}
                            </button>
                            <button
                              onClick={() => openRejectionModal(user._id, user.name)}
                              className="btn btn-xs btn-error"
                              disabled={processing === user._id}
                            >
                              {processing === user._id ? "Rejecting..." : "❌ Reject"}
                            </button>
                          </div>
                        )}
                      {(user.licenseStatus === "APPROVED" || user.isAccountVerified) && (
                        <span className="badge badge-success">Approved</span>
                      )}
                      {user.licenseStatus === "REJECTED" && (
                        <span className="badge badge-error">Rejected</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => viewJourneys(user._id)}
                        className="btn btn-sm btn-primary"
                      >
                        View Journeys
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={closeRejectionModal}
        onConfirm={handleReject}
        userName={rejectionModal.userName}
        loading={processing === rejectionModal.userId}
      />
    </>
  );
}

export default Users;
