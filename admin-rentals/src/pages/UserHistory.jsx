// src/pages/UserHistory.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";

function UserHistory() {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Fetch all bookings and filter by userId
    fetch("http://localhost:5007/api/bookings/allBookings", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Bookings data:", data);
        const allBookings = data.bookings || data || [];
        const userBookings = allBookings.filter(
          (booking) => booking.user && booking.user._id === userId
        );
        console.log("User bookings:", userBookings);
        setBookings(userBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });

    // Fetch user info for header display
    fetch(`http://localhost:5007/api/users/${userId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserInfo(data.user);
        }
      })
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">
          {userInfo ? `${userInfo.name}'s Travel History` : "User Travel History"}
        </h1>
        {loading ? (
          <Loader />
        ) : bookings.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              // Handle both old (car) and new (vehicle) field names
              const vehicle = booking.vehicle || booking.car;
              
              return (
                <div key={booking._id} className="card bg-base-100 shadow-xl p-4">
                  <div className="card-body">
                    <p className="font-semibold">
                      User: {booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})
                    </p>
                    <p>
                      Vehicle: {vehicle?.name || 'N/A'} {vehicle?.year || vehicle?.model || ''}
                    </p>
                    <p>
                      Journey Start: {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      Journey End: {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p>From: {booking.from}</p>
                    <p>To: {booking.to}</p>
                    <p>Total Cost: ₹{booking.totalPrice || booking.totalCost}</p>
                    <p>Status: {booking.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No travel history found for this user.</p>
        )}
      </div>
    </>
  );
}

export default UserHistory;