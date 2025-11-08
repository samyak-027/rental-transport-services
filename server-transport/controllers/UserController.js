// controllers/userController.js
import User from '../models/UserModel.js';
import Booking from "../models/BookingModel.js";
import transporter from "../config/nodemailer.js";
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -verifyotp -verifyOtpExpireAt');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verifyotp -verifyOtpExpireAt');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

export const getUsersForBooking = async (req, res) => {
  try {
    const users = await User.find({}, 'name email');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching users for booking' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required." });
    }

    // Store pending update to session
    req.session.pendingUpdate = {
      userId: user._id,
      name,
      email,
      password,
    };

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Ride Rental - Confirm Profile Update",
      text: `Hi ${user.name},\n\nTo confirm your profile update, please use the OTP below:\n\nOTP: ${otp} (Valid for 10 minutes)\n\nIf you didn't request this change, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "OTP sent for profile update." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.session.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // First, delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Then, delete all bookings for this user
    await Booking.deleteMany({ user: userId });

    // Clear session
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
    });

    res.json({ success: true, message: "User and their bookings deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Deletion failed", error: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    // Check if session user exists
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No session found' });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log("Session Created");
    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAuth: true,
        role: "client",
      },
    });
    console.log(req.session);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const UpdateProfileCheck = async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || user.verifyotp !== otp || user.verifyOtpExpireAt < Date.now()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  const pending = req.session.pendingUpdate;
  if (pending && pending.userId == user._id.toString()) {
    user.name = pending.name;
    user.email = pending.email;
    if (pending.password) {
      user.password = await bcrypt.hash(pending.password, 10);
    }
    await user.save();
    delete req.session.pendingUpdate;
  }

  user.isAuth = true;
  user.verifyotp = null;
  user.verifyOtpExpireAt = null;
  await user.save();

  return res.status(200).json({ success: true, message: "Email verified and profile updated." });
};

export const uploadLicense = async (req, res) => {
  try {
    const userId = req.session.user.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const front = req.files["licenseFront"]?.[0];
    const back = req.files["licenseBack"]?.[0];

    if (!front || !back) {
      return res.status(400).json({ success: false, message: "Both license images are required" });
    }

    user.licenseFrontUrl = front.path;
    user.licenseBackUrl = back.path;
    user.isAccountVerified = false; // Admin must verify
    await user.save();

    return res.status(200).json({ success: true, message: "License uploaded successfully" });
  } catch (error) {
    console.error("Upload License Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// License Verification
export const verifyLicense = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isAccountVerified: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User verified", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// In userController.js
export const rejectLicense = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isAccountVerified: false,
        licenseFrontUrl: null,
        licenseBackUrl: null,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "License rejected", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Rejection failed" });
  }
};

