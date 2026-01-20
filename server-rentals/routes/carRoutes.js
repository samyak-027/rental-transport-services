import express from "express";
import upload from "../middleware/upload.js";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarsForBooking,
  getAvailableCars,
  toggleCarAvailability,
} from "../controllers/CarController.js";

import { authenticateAdmin } from "../middleware/Auth.js";

const router = express.Router();

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error("Multer error:", err.message);
    return res.status(400).json({ 
      success: false, 
      message: err.message || "File upload error" 
    });
  }
  next();
};

/* PUBLIC */
router.get("/getCars", getAllCars);
router.get("/for-booking", getCarsForBooking);
router.post("/available", getAvailableCars);
router.get("/:id", getCarById);

/* ADMIN */
router.post(
  "/add-car",
  authenticateAdmin,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          message: err.message || "Image upload failed" 
        });
      }
      next();
    });
  },
  createCar
);

router.put(
  "/availability/:id",
  authenticateAdmin,
  toggleCarAvailability
);

router.put(
  "/:id",
  authenticateAdmin,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          message: err.message || "Image upload failed" 
        });
      }
      next();
    });
  },
  updateCar
);

router.delete("/:id", authenticateAdmin, deleteCar);

export default router;
