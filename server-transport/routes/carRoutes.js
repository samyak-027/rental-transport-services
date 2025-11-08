import express from 'express';
import upload from '../middleware/upload.js';
import { getAllCars, 
         getCarById, 
         createCar, 
         updateCar, 
         deleteCar, 
         getCarsForBooking,
         getAvailableCars,
         toggleCarAvailability } from "../controllers/CarController.js";
import { authenticateAdmin } from '../middleware/Auth.js';

const router = express.Router();

router.get('/for-booking', getCarsForBooking);
router.get('/getCars', getAllCars);
router.post('/available', getAvailableCars);
router.post('/add-car', (req, res, next) => {
     upload.single('image')(req, res, (err) => {
       if (err) {
         // Handle multer errors
         return res.status(400).json({ error: err.message });
       }
     next();
     });
},  createCar);
router.get('/:id', getCarById);
router.put('/availability/:id', authenticateAdmin, toggleCarAvailability);

router.put('/:id', upload.single('image'), updateCar);
router.delete('/:id',  deleteCar);

router.post('/upload-car-image', upload.single('carImage'), (req, res) => {
     if (!req.file) {
       return res.status(400).json({ message: 'No file uploaded' });
     }
     res.json({ filePath: `/uploads/${req.file.filename}` });
   }
);

export default router;