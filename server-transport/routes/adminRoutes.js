import express from 'express';
import { adminLogin, adminLogout, initializeAdmins, getAdminProfile } from '../controllers/Admincontroller.js';
import { authenticateAdmin } from '../middleware/Auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize admins on server start
initializeAdmins();

// Admin Login Route
router.post('/login', adminLogin);
router.get('/check-auth', (req, res) => {
    console.log('Cookies received:', req.cookies);
    const token = req.cookies.adminToken;
    if (!token) return res.json({ isAuthenticated: false });
  
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      res.json({ isAuthenticated: true });
    } catch (err) {
      res.json({ 
        isAuthenticated: false ,
        error: err.message
      });
    }
  });
router.get('/profile', authenticateAdmin, getAdminProfile);
router.post('/logout', adminLogout);

export default router;