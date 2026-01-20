import express from "express";
import {
  registerUser,
  userLogin,
  verifyEmail,
  resendOTP,
  logout,
  checkSession,
  refreshToken,
  forgotPassword,
  resetPassword,
  checkEmailAvailability,
  submitContactForm,
} from "../controllers/AuthController.js";
import { authenticateUser } from "../middleware/authUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/check-email", checkEmailAvailability);
router.post("/login", userLogin);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/contact", submitContactForm);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me", authenticateUser, checkSession);

export default router;
