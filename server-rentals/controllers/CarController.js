import Car from "../models/CarModel.js";
import Booking from "../models/BookingModel.js";

/* ===========================
   GET ALL CARS
=========================== */
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   GET CAR BY ID
=========================== */
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   CREATE CAR (ADMIN)
=========================== */
export const createCar = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Image is required" 
      });
    }

    const { name, type, pricePerDay, fuelType, seats, transmission, mileage, year } = req.body;

    // Validate required fields
    if (!name || !type || !pricePerDay || !fuelType || !seats || !transmission || !year) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const car = await Car.create({
      name,
      type,
      pricePerDay: Number(pricePerDay),
      fuelType,
      seats: Number(seats),
      transmission,
      mileage: Number(mileage) || 0,
      year: Number(year),
      image: req.file.path,
      available: true,
    });

    res.status(201).json({ success: true, car });
  } catch (err) {
    console.error("Create car error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ===========================
   UPDATE CAR
=========================== */
export const updateCar = async (req, res) => {
  try {
    const { name, type, pricePerDay, fuelType, seats, transmission, mileage, year, available } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(type && { type }),
      ...(pricePerDay && { pricePerDay: Number(pricePerDay) }),
      ...(fuelType && { fuelType }),
      ...(seats && { seats: Number(seats) }),
      ...(transmission && { transmission }),
      ...(mileage !== undefined && { mileage: Number(mileage) }),
      ...(year && { year: Number(year) }),
      ...(available !== undefined && { available: available === 'true' || available === true }),
      ...(req.file && { image: req.file.path }),
    };

    const updated = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.json({ success: true, car: updated });
  } catch (err) {
    console.error("Update car error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================
   DELETE CAR
=========================== */
export const deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   TOGGLE AVAILABILITY
=========================== */
export const toggleCarAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    car.available = !car.available;
    await car.save();

    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   GET CARS FOR BOOKING
=========================== */
export const getCarsForBooking = async (req, res) => {
  const cars = await Car.find({ available: true });
  res.json({ success: true, cars });
};

/* ===========================
   GET AVAILABLE CARS (DATE FILTER)
=========================== */
export const getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Dates required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const bookings = await Booking.find({
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    }).select("vehicle");

    const bookedIds = bookings.map(b => b.vehicle.toString());

    const cars = await Car.find({
      available: true,
      _id: { $nin: bookedIds },
    });

    res.json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
