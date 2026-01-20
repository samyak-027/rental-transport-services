import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
  adminCreateBooking,
  getBookingById
} from "../controllers/BookingController.js";

import { authenticateUser } from "../middleware/authUser.js";
import { authenticateAdmin } from "../middleware/Auth.js";

const router = express.Router();

/* USER */
router.post("/user-booking", authenticateUser, createBooking);
router.get("/my-bookings", authenticateUser, getMyBookings);

/* ADMIN */
router.get("/allBookings", authenticateAdmin, getAllBookings);
router.put("/update/:id", authenticateAdmin, updateBooking);
router.delete("/:id", authenticateAdmin, deleteBooking);
router.post(
  "/admin-booking",
  authenticateAdmin,
  adminCreateBooking
);
router.get(
  "/:id",
  authenticateAdmin,
  getBookingById
);


export default router;
