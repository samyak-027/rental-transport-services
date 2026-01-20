// src/components/BookingCard.jsx
import React from "react";
import UpdateBookingIcon from "../assets/edit.svg";
import CancelBookingIcon from "../assets/cancel-booking.svg";

function BookingCard({ booking, onUpdate, onDelete }) {
  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <div className="card-body">
        <p className="font-semibold">
          User: {booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})
        </p>
        <p>
          Vehicle: {booking.vehicle?.name || 'N/A'} {booking.vehicle?.model || ''}
        </p>
        <p>Journey Start: {new Date(booking.startDate).toLocaleDateString()}</p>
        <p>Journey End: {new Date(booking.endDate).toLocaleDateString()}</p>
        <p>From: {booking.from}</p>
        <p>To: {booking.to}</p>
        <p>Total Cost: ₹{booking.totalPrice?.toLocaleString()}</p>
        <p>Status: {booking.status}</p>
        <p>
          Booking Date: {new Date(booking.createdAt).toLocaleDateString()}{" "}
          {new Date(booking.createdAt).toLocaleTimeString()}
        </p>
        <p>
          Updated At: {new Date(booking.updatedAt).toLocaleDateString()}{" "}
          {new Date(booking.updatedAt).toLocaleTimeString()}
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onUpdate(booking)}
            className="btn btn-success btn-sm"
          >
            <img
              src={UpdateBookingIcon}
              alt="Update Booking"
              className="w-6 h-6"
            />
          </button>
          <button
            onClick={() => onDelete(booking)}
            className="btn btn-error btn-sm"
          >
            <img
              src={CancelBookingIcon}
              alt="Delete Booking"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;
