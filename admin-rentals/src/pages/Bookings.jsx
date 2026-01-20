// src/pages/Bookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";
import BookingCard from "../components/BookingCard";
import CreateBookingIcon from "../assets/edit.svg";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5007/api/bookings/allBookings", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Bookings response:", data);
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else if (Array.isArray(data)) {
          // Handle old response format
          setBookings(data);
        } else {
          console.error("Unexpected bookings response:", data);
          setBookings([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const handleDeleteBooking = (bookingId) => {
    fetch(`http://localhost:5007/api/bookings/${bookingId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        setDeleteModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  const openDeleteModal = (booking) => {
    setBookingToDelete(booking);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setBookingToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleUpdateBooking = (booking) => {
    navigate(`/booking-form/${booking._id}`);
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-extrabold">All Bookings</h1>
          <button
            onClick={() => navigate("/booking-form")}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            <img src={CreateBookingIcon} alt="Add Car" className="w-5 h-5" />
            Create Booking
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length ? (
              bookings
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onUpdate={handleUpdateBooking}
                    onDelete={openDeleteModal}
                  />
                ))
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        )}

        {deleteModalOpen && bookingToDelete && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Cancel Booking?</h3>
              <p className="py-4">
                Do you want to cancel booking for {bookingToDelete.vehicle?.name || 'this vehicle'}?
              </p>
              <div className="modal-action">
                <button
                  onClick={() => handleDeleteBooking(bookingToDelete._id)}
                  className="btn btn-error"
                >
                  Delete
                </button>
                <button onClick={closeDeleteModal} className="btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Bookings;