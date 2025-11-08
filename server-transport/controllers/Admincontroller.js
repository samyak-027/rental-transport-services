import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/AdminModel.js';

dotenv.config();

// Predefined admins
const FIXED_ADMINS = [
  {
    email: 'sam@rentals.com',
    password: '$2y$10$lgVVPjFvBrDNR4j0/BAa6Ob.jpo3XIxyglyG49xOg6uimW6HX0bwe', // sam@admin
    name: 'Samyak',
  },
  {
    email: 'khush@rentals.com',
    password: '$2y$10$4WcDg8QZqUURfcqbGndEL.nb5rAPviN6nWGhaY88w2I0/J9QviGoe', // khush@admin
    name: 'Khush',
  },
];

// Initialize predefined admins on server start
export const initializeAdmins = async () => {
  try {
    for (const admin of FIXED_ADMINS) {
      const existingAdmin = await Admin.findOne({ email: admin.email });
      if (!existingAdmin) {
        const passwordToStore = admin.password.startsWith('$2')
          ? admin.password
          : await bcrypt.hash(admin.password, 10);
        await Admin.create({
          name: admin.name,
          email: admin.email,
          password: passwordToStore,
          role: 'admin',
        });
      }
    }
    console.log('Admin accounts initialized');
  } catch (error) {
    console.error('Admin initialization error:', error);
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = email?.trim().toLowerCase();
  try {
    const admin = await Admin.findOne({ email: trimmedEmail });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    if (!(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    const token = jwt.sign(
      { id: admin._id,
        email: admin.trimmedEmail,
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('adminToken', token, {
      httpOnly: true,
      //secure: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: 'localhost',
      path: '/',
    });
    res.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Admin login failed', error: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id; // Extracted from middleware
    const admin = await Admin.findById(adminId).select('name email');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching admin profile', error: error.message });
  }
};


// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    // Clear the adminToken cookie
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });

    res.json({ success: true, message: 'Admin logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
};