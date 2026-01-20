import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";

function CarForm() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isLoadingCar, setIsLoadingCar] = useState(!!carId);
  const [error, setError] = useState("");

  const [carData, setCarData] = useState({
    name: "",
    type: "",
    pricePerDay: "",
    fuelType: "",
    seats: "",
    transmission: "",
    mileage: "",
    year: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");

  /* =======================
     FETCH CAR (EDIT MODE)
  ======================= */
  useEffect(() => {
    if (!carId) return;

    const fetchCar = async () => {
      try {
        const res = await fetch(
          `http://localhost:5007/api/cars/${carId}`
        );
        const data = await res.json();

        setCarData({
          name: data.name,
          type: data.type,
          pricePerDay: data.pricePerDay,
          fuelType: data.fuelType,
          seats: data.seats,
          transmission: data.transmission,
          mileage: data.mileage || "",
          year: data.year,
          image: null,
        });

        setImagePreview(data.image);
      } catch (err) {
        setError("Failed to load vehicle");
      } finally {
        setIsLoadingCar(false);
      }
    };

    fetchCar();
  }, [carId]);

  /* =======================
     HANDLE INPUT
  ======================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length) {
      setCarData((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setCarData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* =======================
     SUBMIT FORM
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      name,
      type,
      pricePerDay,
      fuelType,
      seats,
      transmission,
      year,
    } = carData;

    if (
      !name ||
      !type ||
      !pricePerDay ||
      !fuelType ||
      !seats ||
      !transmission ||
      !year
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (!carId && !carData.image) {
      setError("Image is required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(carData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    const endpoint = carId
      ? `http://localhost:5007/api/cars/${carId}`
      : `http://localhost:5007/api/cars/add-car`;

    try {
      const res = await fetch(endpoint, {
        method: carId ? "PUT" : "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to save vehicle");
      }
      
      if (!data.success) {
        throw new Error(data.message || "Failed to save vehicle");
      }

      alert(carId ? "Vehicle Updated" : "Vehicle Added");
      navigate("/dashboard");
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingCar) {
    return (
      <>
        <AdminNavbar />
        <div className="p-4">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          {carId ? "Update Vehicle" : "Add Vehicle"}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-4"
          encType="multipart/form-data"
        >
          <input name="name" value={carData.name} onChange={handleChange} className="input input-bordered w-full" placeholder="Name" />

          <select name="type" value={carData.type} onChange={handleChange} className="select select-bordered w-full">
            <option value="">Vehicle Type</option>
            <option value="CAR">CAR</option>
            <option value="BIKE">BIKE</option>
            <option value="PICKUP">PICKUP</option>
            <option value="BUS">BUS</option>
            <option value="BOAT">BOAT</option>
            <option value="HELICOPTER">HELICOPTER</option>
            <option value="JET">JET</option>
            <option value="JET-SKI">JET-SKI</option>
          </select>

          <input type="number" name="pricePerDay" value={carData.pricePerDay} onChange={handleChange} className="input input-bordered w-full" placeholder="Price / Day" />

          <select name="fuelType" value={carData.fuelType} onChange={handleChange} className="select select-bordered w-full">
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <input type="number" name="seats" value={carData.seats} onChange={handleChange} className="input input-bordered w-full" placeholder="Seats" />

          <select name="transmission" value={carData.transmission} onChange={handleChange} className="select select-bordered w-full">
            <option value="">Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <input type="number" name="mileage" value={carData.mileage} onChange={handleChange} className="input input-bordered w-full" placeholder="Mileage" />

          <input type="number" name="year" value={carData.year} onChange={handleChange} className="input input-bordered w-full" placeholder="Manufacturing Year" />

          <input type="file" name="image" onChange={handleChange} className="file-input file-input-bordered w-full" />

          {imagePreview && (
            <img src={imagePreview} className="w-32 h-32 object-cover rounded" />
          )}

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Loader /> : carId ? "Update Vehicle" : "Add Vehicle"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CarForm;
