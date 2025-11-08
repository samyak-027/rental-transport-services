import express from 'express';
import jwt from 'jsonwebtoken';
import { 
  registerUser, 
  userLogin,  
  verifyEmail,
  checkSession,
  sendVerifyOTP, 
  logout,
  resendOTP
} from '../controllers/AuthController.js';


const router = express.Router();
router.post('/register', registerUser);
router.post('/login', userLogin);
router.get("/me", checkSession);
router.post('/send-otp', sendVerifyOTP);
router.post('/verify-email', verifyEmail);
router.post('/logout', logout);
router.post("/resend-otp", resendOTP);

export default router;