import Booking from "../models/BookingModel.js";
import Car from "../models/CarModel.js";
import User from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";

/* ===========================
   DATE VALIDATION
=========================== */
const validateBookingDates = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  if (start < today) return "Start date cannot be in the past.";
  if (end <= start) return "End date must be after start date.";
  if (end > maxDate) return "Booking allowed only up to 2 months.";

  return null;
};

/* ===========================
   SEND BOOKING EMAIL
=========================== */
const sendBookingEmail = async (user, car, booking, type = "created") => {
  const days = Math.ceil(
    (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
  ) || 1;

  const subject = type === "created" 
    ? "Booking Confirmed - RideSurf" 
    : "Booking Updated - RideSurf";

  const headerText = type === "created"
    ? "🎉 Booking Confirmed!"
    : "📝 Booking Updated";

  const messageText = type === "created"
    ? "Your booking has been successfully confirmed. Here are the details:"
    : "Your booking has been updated. Here are the new details:";

  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
      to: user.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">${headerText}</h2>
          <p>Dear ${user.name},</p>
          <p>${messageText}</p>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">${car.name}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">From:</td>
                <td style="padding: 8px 0; font-weight: bold;">${booking.from}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">To:</td>
                <td style="padding: 8px 0; font-weight: bold;">${booking.to}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Start Date:</td>
                <td style="padding: 8px 0; font-weight: bold;">${new Date(booking.startDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">End Date:</td>
                <td style="padding: 8px 0; font-weight: bold;">${new Date(booking.endDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Duration:</td>
                <td style="padding: 8px 0; font-weight: bold;">${days} days</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #059669;">
              <strong>Total Amount:</strong> ₹${booking.totalPrice?.toLocaleString() || 'N/A'}<br>
              <strong>Advance Paid:</strong> ₹${booking.advancePaid?.toLocaleString() || '0'}
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">Thank you for choosing RideSurf. Have a safe journey!</p>
        </div>
      `,
    });
    console.log(`Booking ${type} email sent to ${user.email}`);
  } catch (e) {
    console.log("Mail error:", e.message);
  }
};

/* ===========================
   CREATE BOOKING (USER)
=========================== */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vehicleId, startDate, endDate, from, to } = req.body;

    if (!vehicleId || !startDate || !endDate || !from || !to) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const dateError = validateBookingDates(startDate, endDate);
    if (dateError) return res.status(400).json({ message: dateError });

    const car = await Car.findById(vehicleId);
    if (!car || !car.available)
      return res.status(400).json({ message: "Vehicle not available" });

    const overlap = await Booking.findOne({
      vehicle: vehicleId,
      $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
    });

    if (overlap)
      return res.status(400).json({ message: "Vehicle already booked" });

    const days =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) /
          (1000 * 60 * 60 * 24)
      ) || 1;

    const totalPrice = days * car.pricePerDay;
    const advancePaid = totalPrice * 0.2;

    const booking = await Booking.create({
      user: userId,
      vehicle: vehicleId,
      from,
      to,
      startDate,
      endDate,
      totalPrice,
      advancePaid,
      status: "UPCOMING",
    });

    // Send confirmation email
    const user = await User.findById(userId);
    await sendBookingEmail(user, car, booking, "created");

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   UPDATE BOOKING STATUSES
   Auto-update based on dates
=========================== */
const updateBookingStatuses = async (bookings) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const booking of bookings) {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let newStatus = booking.status;

    // Determine correct status based on dates
    if (today > endDate) {
      newStatus = "COMPLETED";
    } else if (today >= startDate && today <= endDate) {
      newStatus = "ONGOING";
    } else if (today < startDate) {
      newStatus = "UPCOMING";
    }

    // Update if status changed
    if (newStatus !== booking.status) {
      booking.status = newStatus;
      await booking.save();
    }
  }

  return bookings;
};

/* ===========================
   USER BOOKINGS
=========================== */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    // Auto-update booking statuses based on dates
    await updateBookingStatuses(bookings);

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================
   ADMIN: ALL BOOKINGS
=========================== */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle")
      .sort({ createdAt: -1 });

    // Auto-update booking statuses based on dates
    await updateBookingStatuses(bookings);

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================
   GET BOOKING BY ID
=========================== */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle");

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================
   UPDATE BOOKING
=========================== */
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    const { vehicle, startDate, endDate, from, to } = req.body;

    // Validate dates
    const dateError = validateBookingDates(
      startDate || booking.startDate,
      endDate || booking.endDate
    );
    if (dateError) return res.status(400).json({ success: false, message: dateError });

    // Check for overlapping bookings (excluding current booking)
    if (vehicle && startDate && endDate) {
      const overlap = await Booking.findOne({
        _id: { $ne: booking._id },
        vehicle: vehicle,
        $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
      });

      if (overlap)
        return res.status(400).json({ success: false, message: "Vehicle already booked for these dates" });
    }

    // Recalculate price if dates or vehicle changed
    if (vehicle || startDate || endDate) {
      const car = await Car.findById(vehicle || booking.vehicle);
      if (car) {
        const days = Math.ceil(
          (new Date(endDate || booking.endDate) - new Date(startDate || booking.startDate)) /
            (1000 * 60 * 60 * 24)
        ) || 1;
        booking.totalPrice = days * car.pricePerDay;
      }
    }

    // Update fields
    if (vehicle) booking.vehicle = vehicle;
    if (startDate) booking.startDate = startDate;
    if (endDate) booking.endDate = endDate;
    if (from) booking.from = from;
    if (to) booking.to = to;

    await booking.save();

    // Send update email to user
    const user = await User.findById(booking.user);
    const car = await Car.findById(booking.vehicle);
    if (user && car) {
      await sendBookingEmail(user, car, booking, "updated");
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================
   DELETE BOOKING
=========================== */
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle");

    if (booking) {
      // Send cancellation email
      try {
        await transporter.sendMail({
          from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
          to: booking.user.email,
          subject: "Booking Cancelled - RideSurf",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ef4444;">❌ Booking Cancelled</h2>
              <p>Dear ${booking.user.name},</p>
              <p>Your booking has been cancelled. Here were the details:</p>
              
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #334155;">${booking.vehicle?.name || 'Vehicle'}</h3>
                <p><strong>From:</strong> ${booking.from}</p>
                <p><strong>To:</strong> ${booking.to}</p>
                <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
              </div>
              
              <p style="color: #64748b; font-size: 14px;">If you have any questions, please contact our support team.</p>
            </div>
          `,
        });
        console.log(`Booking cancellation email sent to ${booking.user.email}`);
      } catch (e) {
        console.log("Mail error:", e.message);
      }
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================
   ADMIN CREATE BOOKING
=========================== */
export const adminCreateBooking = async (req, res) => {
  try {
    const { user, vehicle, startDate, endDate, from, to } = req.body;

    if (!user || !vehicle || !startDate || !endDate || !from || !to) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const dateError = validateBookingDates(startDate, endDate);
    if (dateError) return res.status(400).json({ success: false, message: dateError });

    const car = await Car.findById(vehicle);
    if (!car || !car.available)
      return res.status(400).json({ success: false, message: "Vehicle not available" });

    const overlap = await Booking.findOne({
      vehicle,
      $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
    });

    if (overlap)
      return res.status(400).json({ success: false, message: "Vehicle already booked" });

    const days =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      ) || 1;

    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      user,
      vehicle,
      from,
      to,
      startDate,
      endDate,
      totalPrice,
      advancePaid: 0,
      status: "UPCOMING",
    });

    // Send confirmation email to user
    const userData = await User.findById(user);
    if (userData) {
      await sendBookingEmail(userData, car, booking, "created");
    }

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
