import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

/* ================================
   CHECK EMAIL AVAILABILITY
================================ */
export const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ 
        success: false, 
        available: false, 
        message: "Email is already registered. Please use a different email or try logging in." 
      });
    }

    res.json({ 
      success: true, 
      available: true, 
      message: "Email is available" 
    });
  } catch (err) {
    console.error('Email check error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Error checking email availability" 
    });
  }
};

/* ================================
   REGISTER
================================ */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashed,
      verifyotp: otp,
      verifyOtpExpireAt: Date.now() + 15 * 60 * 1000,
      isAuth: false,
    });

    // Try to send email
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
        to: email,
        subject: "Verify Your Account - RideSurf",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Welcome to RideSurf!</h2>
            <p>Thank you for registering. Please use the following OTP to verify your email:</p>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #0ea5e9; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #64748b; font-size: 14px;">This OTP will expire in 15 minutes.</p>
          </div>
        `,
      });
      console.log(`OTP sent to ${email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    res.json({
      success: true,
      message: "Registration successful. Please check your email for OTP.",
      userId: user._id,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   VERIFY EMAIL OTP
================================ */
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);

  if (
    !user ||
    user.verifyotp !== otp ||
    user.verifyOtpExpireAt < Date.now()
  ) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  user.verifyotp = null;
  user.verifyOtpExpireAt = null;
  user.isAuth = true;
  await user.save();

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      licenseStatus: user.licenseStatus,
    },
  });
};

/* ================================
   LOGIN
================================ */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found. Please check your email or sign up for a new account." 
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid password. Please check your password and try again." 
      });
    }

    if (!user.isAuth) {
      return res.status(403).json({ 
        success: false, 
        message: "Please verify your email first. Check your email for the verification OTP." 
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        licenseStatus: user.licenseStatus,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred during login. Please try again." 
    });
  }
};

/* ================================
   RESEND OTP
================================ */
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.isAuth)
      return res.json({ success: false, message: "Already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyotp = otp;
    user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
        to: user.email,
        subject: "Resend OTP - RideSurf",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Your New OTP</h2>
            <p>Here is your new verification code:</p>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #0ea5e9; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #64748b; font-size: 14px;">This OTP will expire in 15 minutes.</p>
          </div>
        `,
      });
      console.log(`OTP resent to ${user.email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    res.json({ 
      success: true, 
      message: "OTP resent successfully. Check your email."
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   FORGOT PASSWORD
================================ */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyotp = otp;
    user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
        to: email,
        subject: "Password Reset OTP - RideSurf",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Password Reset Request</h2>
            <p>You requested to reset your password. Use the following OTP:</p>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #0ea5e9; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #64748b; font-size: 14px;">This OTP will expire in 15 minutes.</p>
            <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
      console.log(`Password reset OTP sent to ${email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      return res.status(500).json({ success: false, message: "Failed to send email" });
    }

    res.json({ 
      success: true, 
      message: "OTP sent to your email"
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   RESET PASSWORD
================================ */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verifyotp !== otp || user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.verifyotp = null;
    user.verifyOtpExpireAt = null;
    await user.save();

    // Send confirmation email
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
        to: email,
        subject: "Password Changed Successfully - RideSurf",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Password Changed</h2>
            <p>Your password has been successfully changed.</p>
            <p style="color: #64748b; font-size: 14px;">If you didn't make this change, please contact support immediately.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError.message);
    }

    res.json({ 
      success: true, 
      message: "Password reset successfully"
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   REFRESH TOKEN
================================ */
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid token" });

    const newAccessToken = generateAccessToken(user);
    res.json({ token: newAccessToken });
  } catch {
    res.status(403).json({ message: "Token expired" });
  }
};

/* ================================
   LOGOUT
================================ */
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await User.findOneAndUpdate(
      { refreshToken: token },
      { refreshToken: null }
    );
  }

  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out" });
};

/* ================================
   AUTH CHECK
================================ */
export const checkSession = async (req, res) => {
  res.json({ success: true, user: req.user });
};

/* ================================
   CONTACT FORM SUBMISSION
================================ */
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Send email to support team
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
      to: 'surfyourride@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">New Contact Form Submission</h2>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; color: #059669;"><strong>Reply to:</strong> ${email}</p>
        </div>
      `,
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL || 'noreply@ridesurf.com',
      to: email,
      subject: "We received your message - RideSurf",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <p style="color: #64748b;">Best regards,<br>RideSurf Support Team</p>
        </div>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message. Please email us directly at surfyourride@gmail.com" 
    });
  }
};