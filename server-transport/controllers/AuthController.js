import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";

dotenv.config();

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Create new user with OTP details
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verifyotp: otp,
      verifyOtpExpireAt: Date.now() + 15 * 60 * 1000, // Valid for 15 minutes
      isAuth: false,
    });

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to Ride Rental - Verify Your Account",
      text: `Welcome ${name},\n\nThank you for registering. 
      Please verify your account using the OTP below:\n\nYour OTP: ${otp} (Valid for 15 minutes)
      Enjoy our services!`,
    };

    await transporter.sendMail(mailOptions);

    // Return the userId along with the success message
    return res.json({
      success: true,
      message: "Registration successful! OTP sent to email.",
      userId: user._id,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email not found. Please check your email or register.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    if (!user.isAuth) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please check your email.",
      });
    }

    // Instead of generating a JWT token, store user details in session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: "client",
      name: user.name,
    };

    res.json({
      success: true,
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
    console.log(error);
  }
};

// Verify OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.verifyotp || user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    if (user.verifyotp !== otp) {
      return res.json({ success: false, message: "Incorrect OTP" });
    }

    user.isAuth = true;
    user.verifyotp = null; // Clear OTP after successful verification
    user.verifyOtpExpireAt = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
        error: err.message,
      });
    }
    // Optionally, clear the cookie (adjust "connect.sid" if your session cookie name is different)
    res.clearCookie("connect.sid");
    return res.json({
      success: true,
      message: "Logout successful",
    });
  });
  console.log("Logout Successful");
};

// Resend OTP for Verification
export const resendOTP = async (req, res) => {
  const { userId } = req.body; //Get ID from session !
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAuth) {
      return res.json({
        success: false,
        message: "Account already verified with Email",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a new 6-digit OTP

    // Update OTP and expiry (15 minutes)
    user.verifyotp = otp;
    user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Resend: Account Verification OTP",
      text: `Your OTP Code: ${otp} (Valid for 15 minutes)`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send OTP to Update account
export const sendVerifyOTP = async (req, res) => {
  const { userId } = req.body; // Get ID From session do after that way !

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAuth) {
      return res.json({ success: false, message: "Account already verified" });
      //After do that : Remove this condition not check only send the OTP
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate 6-digit OTP

    // Store OTP and expiry time in user document
    user.verifyotp = otp;
    user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000; // Valid for 15 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Updation OTP",
      text: `Your OTP Code: ${otp} (Valid for 15 minutes)`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// controllers/AuthController.js
export const checkSession = async (req, res) => {
  try {
    // If using session-based auth:
    if (!req.session || !req.session.user) {
      return res.json({ success: false, user: null });
    }
    // Session found
    const user = req.session.user;
    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error in checkSession:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
