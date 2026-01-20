import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store.jsx';
import * as api from "../services/api.js";
import { Filter, Users, Fuel, Settings, Gauge } from 'lucide-react';

export const Vehicles = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState('All');
  const [priceRange, setPriceRange] = useState(100000);
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [minSeats, setMinSeats] = useState(1);

  const { searchParams } = state;

  // Check if search params are valid
  const hasValidSearchParams = searchParams.startDate && 
    searchParams.endDate && 
    searchParams.fromLocation && 
    searchParams.toLocation;

  // 🔹 Fetch available vehicles from backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // If no search params, fetch all vehicles
        if (!searchParams.startDate || !searchParams.endDate) {
          const res = await api.getVehicles();
          setVehicles(res.data || []);
        } else {
          // Fetch available vehicles for the selected dates
          const res = await api.getAvailableCars({
            startDate: searchParams.startDate,
            endDate: searchParams.endDate
          });
          setVehicles(res.data.cars || res.data || []);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        // Fallback to fetching all vehicles
        try {
          const res = await api.getVehicles();
          setVehicles(res.data || []);
        } catch (fallbackError) {
          console.error("Fallback fetch failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  const handleBookNow = (vehicle) => {
    // Check if search params are valid - user must select journey details first
    if (!hasValidSearchParams) {
      alert('Please select pickup/drop-off locations and dates from the home page first.');
      navigate('/');
      return;
    }

    // Allow viewing booking summary even without login (they can see the amount)
    dispatch({ type: 'SELECT_VEHICLE', payload: vehicle });
    navigate('/booking/summary');
  };

  // 🔹 Frontend Filters
  const filteredVehicles = vehicles.filter(v => {
    const typeMatch = filterType === 'All' || v.type === filterType;
    const priceMatch = v.pricePerDay <= priceRange;
    const transmissionMatch = selectedTransmission === 'All' || v.transmission === selectedTransmission;
    const fuelMatch = selectedFuel === 'All' || v.fuelType === selectedFuel;
    const seatMatch = v.seats >= minSeats;

    return typeMatch && priceMatch && transmissionMatch && fuelMatch && seatMatch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading vehicles...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Warning banner if no search params */}
      {!hasValidSearchParams && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <span>⚠️</span>
          <span>Please select your journey details (locations & dates) from the <a href="/" className="underline font-semibold">home page</a> to book a vehicle.</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Filters */}
        <div className="w-full lg:w-72">
          <div className="bg-white p-6 rounded-lg shadow border sticky top-24 space-y-6">

            <div className="flex items-center gap-2 border-b pb-3">
              <Filter />
              <h2 className="font-bold text-lg">Filters</h2>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold mb-1">
                Max Price: ₹{priceRange}
              </label>
              <input
                type="range"
                min="100"
                max="100000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="font-bold text-sm mb-2 block">Vehicle Type</label>
              {['All', 'CAR', 'BIKE', 'SUV', 'BUS', 'BOAT', 'HELICOPTER'].map(type => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={filterType === type}
                    onChange={() => setFilterType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* Transmission */}
            <div>
              <label className="font-bold text-sm mb-2 block">Transmission</label>
              {['All', 'Automatic', 'Manual'].map(t => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={selectedTransmission === t}
                    onChange={() => setSelectedTransmission(t)}
                  />
                  {t}
                </label>
              ))}
            </div>

            {/* Fuel */}
            <div>
              <label className="font-bold text-sm mb-2 block">Fuel Type</label>
              <select
                className="w-full border rounded p-2"
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              >
                <option>All</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Seats */}
            <div>
              <label className="font-bold text-sm mb-2 block">Min Seats</label>
              <div className="flex gap-2">
                {[1, 2, 4, 5, 7, 12].map(num => (
                  <button
                    key={num}
                    onClick={() => setMinSeats(num)}
                    className={`w-8 h-8 rounded-full text-xs ${
                      minSeats === num ? 'bg-primary text-white' : 'bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Vehicles */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">
            Available Vehicles ({filteredVehicles.length})
          </h2>

          {filteredVehicles.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-lg border">
              No vehicles available for selected criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <div key={vehicle._id} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden">

                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-lg font-bold">{vehicle.name}</h3>
                    <p className="text-sm text-gray-500">{vehicle.type}</p>

                    <div className="grid grid-cols-2 gap-2 text-sm my-4">
                      <div><Users size={14} /> {vehicle.seats} Seats</div>
                      <div><Settings size={14} /> {vehicle.transmission}</div>
                      <div><Fuel size={14} /> {vehicle.fuelType}</div>
                      <div><Gauge size={14} /> ₹{vehicle.pricePerDay}/day</div>
                    </div>

                    <button
                      onClick={() => handleBookNow(vehicle)}
                      disabled={!hasValidSearchParams}
                      className={`w-full py-2 rounded flex items-center justify-center gap-2 ${
                        hasValidSearchParams
                          ? 'bg-primary text-white hover:bg-sky-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      title={!hasValidSearchParams ? 'Please select journey details first' : ''}
                    >
                      {!hasValidSearchParams ? 'Select Journey First' : 'View & Book'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Vehicles;
