// controllers/BookingController.js
import Booking from "../models/BookingModel.js";
import Car from "../models/CarModel.js";
import User from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";

// Get only active/future bookings (endDate >= today)
export const getAllBookings = async (req, res) => {
  try {
    const today = new Date();
    const bookings = await Booking.find({ endDate: { $gte: today } })
      .populate("user", "name email")
      .populate("car");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car", "name")
      .populate("user", "email name");
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.session.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. User ID not found." });
    }

    const bookings = await Booking.find({ user: userId }).populate("car");

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error in getMyBookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { car, user, startDate, endDate, from, to } = req.body;
    if (!car || !user || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    // Validate user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ success: false, error: "Invalid user selected" });
    }
    // Validate car exists and available
    const carDetails = await Car.findById(car);
    if (!carDetails || !carDetails.available) {
      return res.status(400).json({ success: false, error: "Selected car is not available" });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ success: false, error: "End date must be after start date" });
    }
    
    // Check for overlapping booking (double-booking prevention)
    const overlappingBooking = await Booking.findOne({
      car: car,
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });
    if (overlappingBooking) {
      return res.status(400).json({ success: false, error: "Selected car is already booked for the selected dates" });
    }
    
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const totalCost = rentalDays * carDetails.pricePerDay;
    const newBooking = await Booking.create({
      user,
      car,
      startDate: start,
      endDate: end,
      from,
      to,
      totalCost,
    });
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("user", "name email")
      .populate("car", "name model");
      
    // Send response first
    res.status(201).json({ success: true, booking: populatedBooking });
    
    // Then attempt to send confirmation email
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: userExists.email,
        subject: "Booking Confirmed!",
        text: `Hello ${userExists.name},\n\nYour booking for ${carDetails.name} is confirmed from ${startDate} to ${endDate}.\nTotal Cost: ₹${totalCost}\n\nThank you for choosing us!`
      });
    } catch (mailError) {
      console.error("Error sending confirmation email:", mailError);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createUserBooking = async (req, res) => {
  try {
    const { car, user, startDate, endDate, from, to } = req.body;
    
    // Validate user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ success: false, error: "Invalid user selected" });
    }
    
    // Validate car exists and is available
    const carDetails = await Car.findById(car);
    if (!carDetails || !carDetails.available) {
      return res.status(400).json({ success: false, error: "Selected car is not available" });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ success: false, error: "End date must be after start date" });
    }
    
    // Check for overlapping booking
    const overlappingBooking = await Booking.findOne({
      car: car,
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });
    if (overlappingBooking) {
      return res.status(400).json({ success: false, error: "Selected car is already booked for the selected dates" });
    }
    
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const totalCost = rentalDays * carDetails.pricePerDay;
    
    const newBooking = await Booking.create({
      user,
      car,
      startDate: start,
      endDate: end,
      from,
      to,
      totalCost,
    });
    
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("user", "name email")
      .populate("car", "name model");
    
    // Send confirmation email (if email fails, log the error but do not block the response)
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: userExists.email,
        subject: "Booking Confirmed!",
        text: `Hello ${userExists.name},\n\nYour booking for ${carDetails.name} is confirmed from ${startDate} to ${endDate}.\nTotal Cost: ₹${totalCost}\n\nThank you for choosing us!`
      });
    } catch (mailError) {
      console.error("Error sending confirmation email:", mailError);
    }
    
    return res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }
    // Determine updated car and dates
    const updatedCar = updates.car ? updates.car : existingBooking.car;
    const startDate = updates.startDate
      ? new Date(updates.startDate)
      : existingBooking.startDate;
    const endDate = updates.endDate
      ? new Date(updates.endDate)
      : existingBooking.endDate;
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        error: "End date must be after start date",
      });
    }
    // If car is updated, check availability
    if (updates.car) {
      const newCar = await Car.findById(updates.car);
      if (!newCar?.available) {
        return res
          .status(400)
          .json({ success: false, error: "New car is not available" });
      }
    }
    // Check for overlapping booking (exclude the current booking)
    const overlappingBooking = await Booking.findOne({
      _id: { $ne: id },
      car: updatedCar,
      $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
    });
    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        error: "Selected car is already booked for the selected dates",
      });
    }
    const finalCar = await Car.findById(updatedCar);
    const rentalDays =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    const totalCost = rentalDays * finalCar.pricePerDay;
    // Update booking with new values; also update updatedAt timestamp
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { ...updates, startDate, endDate, totalCost, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("user car", "name email name");
    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
