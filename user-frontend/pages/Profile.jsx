import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "../context/store.jsx";
import * as api from "../services/api.js";
import { Check, Clock, XCircle, User, Camera, Loader2 } from "lucide-react";

export const Profile = () => {
  const { state, dispatch } = useStore();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const fileInputRef = useRef(null);

  const user = userData || state.auth.user;

  /* =======================
     FETCH USER DATA & BOOKINGS
  ======================= */
  useEffect(() => {
    // Fetch data every time user navigates to profile page
    if (state.auth.user) {
      fetchUserData();
      fetchBookings();
    }
  }, [location.pathname, state.auth.user?.id]); // Re-fetch when route changes or user changes

  const fetchUserData = async () => {
    try {
      const res = await api.getUserProfile();
      if (res.data.success) {
        setUserData(res.data.user);
        dispatch({
          type: "UPDATE_USER",
          payload: res.data.user,
        });
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await api.getMyBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setBookings([]); // Set empty array on error
    } finally {
      setBookingsLoading(false);
    }
  };

  /* =======================
     PROFILE PICTURE UPLOAD
  ======================= */
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingPicture(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await api.uploadProfilePicture(formData);
      
      if (res.data.success) {
        setUserData(prev => ({
          ...prev,
          profilePicture: res.data.profilePicture
        }));
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...user,
            profilePicture: res.data.profilePicture
          },
        });
      }
    } catch (err) {
      console.error("Profile picture upload failed", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploadingPicture(false);
    }
  };

  /* =======================
     LICENSE UPLOAD
  ======================= */
  const handleUpload = async () => {
    if (!frontFile || !backFile) {
      alert("Please upload both license images");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("licenseFront", frontFile);
      formData.append("licenseBack", backFile);

      await api.uploadLicense(formData);

      setUserData(prev => ({
        ...prev,
        licenseStatus: "PENDING"
      }));
      dispatch({
        type: "UPDATE_USER",
        payload: {
          ...user,
          licenseStatus: "PENDING",
        },
      });

      setFrontFile(null);
      setBackFile(null);
      alert("License uploaded successfully. Await admin approval.");
    } catch (err) {
      console.error(err);
      alert("License upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =======================
     STATUS BADGE
  ======================= */
  const renderStatus = () => {
    switch (user?.licenseStatus) {
      case "APPROVED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded flex items-center gap-1 text-sm">
            <Check size={14} /> Verified
          </span>
        );
      case "PENDING":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded flex items-center gap-1 text-sm">
            <Clock size={14} /> Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center gap-1 text-sm">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
            Not Uploaded
          </span>
        );
    }
  };

  if (!user)
    return <div className="p-10 text-center">Please login</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT PANEL */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
            {/* Profile Picture */}
            <div className="relative w-24 h-24 mx-auto mb-3">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center cursor-pointer group"
                onClick={handleProfilePictureClick}
              >
                {uploadingPicture ? (
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                ) : user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>

            <p className="text-xs text-gray-400 mb-3">Click to change photo</p>

            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>

            <div className="mt-4 flex justify-center">
              {renderStatus()}
            </div>
          </div>

          {/* LICENSE UPLOAD */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-4">License Verification</h3>

            {user.licenseStatus === "APPROVED" ? (
              <p className="text-green-600 text-sm">
                Your license has been verified.
              </p>
            ) : (
              <>
                {user.licenseStatus === "REJECTED" && user.licenseRejectionReason && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    <p className="font-semibold mb-1">Rejection Reason:</p>
                    <p>{user.licenseRejectionReason}</p>
                  </div>
                )}

                <p className="text-sm text-gray-500 mb-3">
                  Upload front and back images of your driving license
                </p>

                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">License Front</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFrontFile(e.target.files[0])}
                    className="w-full text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-1">License Back</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBackFile(e.target.files[0])}
                    className="w-full text-sm"
                  />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-primary text-white py-2 rounded hover:bg-sky-600 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload License"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

          {bookingsLoading ? (
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading bookings...</span>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border text-center">
              <p className="text-gray-500 mb-4">No bookings yet.</p>
              <a 
                href="/vehicles" 
                className="text-primary hover:underline font-medium"
              >
                Browse vehicles to make your first booking
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-4"
                >
                  <img
                    src={b.vehicle?.image || '/placeholder-car.jpg'}
                    alt={b.vehicle?.name || 'Vehicle'}
                    className="w-24 h-16 rounded object-cover"
                  />

                  <div className="flex-grow">
                    <h4 className="font-bold">{b.vehicle?.name || 'Vehicle'}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(b.startDate).toDateString()} →{" "}
                      {new Date(b.endDate).toDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {b.from} → {b.to}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">₹{b.totalPrice?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Paid: ₹{b.advancePaid?.toLocaleString()}</p>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
