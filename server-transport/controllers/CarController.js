import Car from "../models/CarModel.js";
import Booking from "../models/BookingModel.js";
import { cloudinary } from '../config/cloudinary.js';

// Get all cars
export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars' });
    }
};

// Get car by ID
export const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching car details' });
    }
};

// controllers/carController.js
export const getCarsForBooking = async (req, res) => {
  try {
    const cars = await Car.find({ available: true }, 'name model pricePerDay _id');
    res.status(200).json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching available cars' });
  }
};


// Create a new car (Admin only)
export const createCar = async (req, res) => {
  try {
    const { name, model, category,  capacity, fueltype, pricePerDay } = req.body;
    
    if (!req.file) return res.status(400).json({ error: "Image is required" });
    
    const newCar = new Car({
      name,
      model,
      category,
      capacity,
      fueltype,
      pricePerDay,
      image: req.file.path // Cloudinary URL is stored here
    });

    await newCar.save();
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    res.status(500).json({ error: 'Error creating car', details: error.message });
  }
};

// Update Car (Admin only)
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    // Delete old image from Cloudinary if new image is uploaded
    if (req.file) {
      const publicId = car.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`car-rentals/${publicId}`);
      car.image = req.file.path;
    }

    // Update other fields
    car.name = req.body.name || car.name;
    car.model = req.body.model || car.model;
    car.category = req.body.category || car.category;
    car.capacity = req.body.capacity || car.capacity;
    car.fueltype = req.body.fueltype || car.fueltype;
    car.pricePerDay = req.body.pricePerDay || car.pricePerDay;

    await car.save();
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    res.status(500).json({ error: 'Error updating car' });
  }
};


export const getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: "startDate and endDate are required" });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, error: "Invalid date format" });
    }
    
    if (start >= end) {
      return res.status(400).json({ success: false, error: "End date must be after start date" });
    }
    
    let cars = await Car.find({ available: true });
    
    const bookings = await Booking.find({
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }]
    }).select("car");
    
    const bookedCarIds = bookings.map(booking => booking.car.toString());
    cars = cars.filter(car => !bookedCarIds.includes(car._id.toString()));
    
    return res.json({ success: true, cars });
  } catch (error) {
    console.error("Error in getAvailableCars:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


// Admin marks a car as available/unavailable
export const toggleCarAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    car.available = req.body.available; // true/false from admin UI
    await car.save();

    res.json({ success: true, message: 'Car availability updated', car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a car (Admin only)
export const deleteCar = async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting car' });
    }
};
