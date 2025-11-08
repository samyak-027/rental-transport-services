import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUserProfile, 
  deleteUser, 
  getUsersForBooking,
  getUserData,
  UpdateProfileCheck,
  uploadLicense,
  verifyLicense,
  rejectLicense
} from '../controllers/UserController.js';
import { authenticateSession } from '../middleware/Auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/for-booking', getUsersForBooking);
router.get('/getAllusers', getAllUsers);
router.get('/delete', authenticateSession, deleteUser);
router.put('/update-profile', authenticateSession, updateUserProfile);
router.post('/verify-profile-update', authenticateSession, UpdateProfileCheck);
router.get('/data', authenticateSession, getUserData);
router.post(
  '/upload-license',
  upload.fields([
    { name: 'licenseFront', maxCount: 1 },
    { name: 'licenseBack', maxCount: 1 },
  ]),
  uploadLicense
);
router.patch("/verify-license/:userId", verifyLicense);
router.patch("/reject-license/:userId", rejectLicense);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;