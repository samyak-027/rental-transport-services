import express from 'express';
import { 
  getAllBookings, 
  getBookingById, 
  createBooking,
  createUserBooking,
  updateBooking,
  deleteBooking, 
  getMyBookings,
  // getUserBookingHistory 
} from "../controllers/BookingController.js";
import { authenticateSession } from "../middleware/Auth.js";


const router = express.Router();
router.post('/new-booking', createBooking);
router.post('/user-booking',createUserBooking);
router.get('/allBookings', getAllBookings);
router.get('/my-bookings',authenticateSession, getMyBookings);
router.get('/:id', getBookingById);
router.put('/update/:id', updateBooking);
router.delete('/:id',  deleteBooking);

export default router;