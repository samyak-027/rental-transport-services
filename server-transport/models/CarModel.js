// models/CarModel.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true},
  capacity: { type: String, required: true },
  fueltype: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

carSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Car = mongoose.models.Cars || mongoose.model("Cars", carSchema);
export default Car;