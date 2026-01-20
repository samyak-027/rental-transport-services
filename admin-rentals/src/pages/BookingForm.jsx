// src/pages/BookingForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";
import { getCountries, getStates, getCities } from "../services/locationApi";
import { ChevronDown, Search, Loader2 } from "lucide-react";

// Custom Dropdown Component
const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  loading 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between select select-bordered ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className={selectedOption ? '' : 'text-gray-400'}>
          {loading ? 'Loading...' : (selectedOption?.name || placeholder)}
        </span>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b sticky top-0 bg-white">
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">No results found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value, option);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-primary hover:text-white ${
                    value === option.value ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  {option.emoji && <span className="mr-2">{option.emoji}</span>}
                  {option.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function BookingForm() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [allCars, setAllCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookingData, setBookingData] = useState({
    car: "",
    user: "",
    userName: "",
    userEmail: "",
    startDate: "",
    endDate: "",
    from: "",
    to: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Location state
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [fromStates, setFromStates] = useState([]);
  const [fromCities, setFromCities] = useState([]);
  const [fromState, setFromState] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toStates, setToStates] = useState([]);
  const [toCities, setToCities] = useState([]);
  const [toState, setToState] = useState('');
  const [toCity, setToCity] = useState('');
  const [locationLoading, setLocationLoading] = useState({
    countries: false,
    fromStates: false,
    fromCities: false,
    toStates: false,
    toCities: false
  });

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setLocationLoading(prev => ({ ...prev, countries: true }));
      const data = await getCountries();
      setCountries(data.map(c => ({ value: c.iso2, name: c.name, emoji: c.emoji })));
      setLocationLoading(prev => ({ ...prev, countries: false }));
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const loadStates = async () => {
        setLocationLoading(prev => ({ ...prev, fromStates: true, toStates: true }));
        const data = await getStates(selectedCountry);
        const stateOptions = data.map(s => ({ value: s.iso2, name: s.name }));
        setFromStates(stateOptions);
        setToStates(stateOptions);
        setLocationLoading(prev => ({ ...prev, fromStates: false, toStates: false }));
      };
      loadStates();
      setFromState('');
      setFromCity('');
      setToState('');
      setToCity('');
      setFromCities([]);
      setToCities([]);
    }
  }, [selectedCountry]);

  // Load FROM cities
  useEffect(() => {
    if (selectedCountry && fromState) {
      const loadCities = async () => {
        setLocationLoading(prev => ({ ...prev, fromCities: true }));
        const data = await getCities(selectedCountry, fromState);
        setFromCities(data.map(c => ({ value: c.id, name: c.name })));
        setLocationLoading(prev => ({ ...prev, fromCities: false }));
      };
      loadCities();
      setFromCity('');
    }
  }, [selectedCountry, fromState]);

  // Load TO cities
  useEffect(() => {
    if (selectedCountry && toState) {
      const loadCities = async () => {
        setLocationLoading(prev => ({ ...prev, toCities: true }));
        const data = await getCities(selectedCountry, toState);
        setToCities(data.map(c => ({ value: c.id, name: c.name })));
        setLocationLoading(prev => ({ ...prev, toCities: false }));
      };
      loadCities();
      setToCity('');
    }
  }, [selectedCountry, toState]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:5007/api/cars/for-booking", { credentials: "include" }),
          fetch("http://localhost:5007/api/users/for-booking", { credentials: "include" }),
        ]);

        if (!carsResponse.ok) throw new Error("Failed to fetch cars");
        if (!usersResponse.ok) throw new Error("Failed to fetch users");

        const carsData = await carsResponse.json();
        const usersData = await usersResponse.json();

        const cars = Array.isArray(carsData.cars) ? carsData.cars : carsData;
        setAllCars(cars);
        setAvailableCars(cars);
        setUsers(Array.isArray(usersData.users) ? usersData.users : usersData);

        if (bookingId) {
          const bookingRes = await fetch(`http://localhost:5007/api/bookings/${bookingId}`, {
            credentials: "include"
          });
          if (!bookingRes.ok) throw new Error("Failed to fetch booking");
          const bookingData = await bookingRes.json();
          const booking = bookingData.booking || bookingData;
          setBookingData({
            car: booking.vehicle?._id || "",
            user: booking.user?._id || "",
            userName: booking.user?.name || "",
            userEmail: booking.user?.email || "",
            startDate: booking.startDate,
            endDate: booking.endDate,
            from: booking.from,
            to: booking.to,
          });
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  // Filter available cars when dates change
  useEffect(() => {
    const filterAvailableCars = async () => {
      if (!bookingData.startDate || !bookingData.endDate) {
        setAvailableCars(allCars);
        return;
      }

      try {
        const response = await fetch("http://localhost:5007/api/cars/available", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: bookingData.startDate,
            endDate: bookingData.endDate
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAvailableCars(data.cars || data || []);
          if (bookingData.car && !data.cars?.find(c => c._id === bookingData.car)) {
            setBookingData(prev => ({ ...prev, car: "" }));
          }
        }
      } catch (err) {
        console.error("Error filtering cars:", err);
        setAvailableCars(allCars);
      }
    };

    filterAvailableCars();
  }, [bookingData.startDate, bookingData.endDate, allCars]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fromLocation = fromCity && fromState && selectedCountry
      ? `${fromCities.find(c => c.value === fromCity)?.name}, ${fromStates.find(s => s.value === fromState)?.name}, ${countries.find(c => c.value === selectedCountry)?.name}`
      : bookingData.from;
    
    const toLocation = toCity && toState && selectedCountry
      ? `${toCities.find(c => c.value === toCity)?.name}, ${toStates.find(s => s.value === toState)?.name}, ${countries.find(c => c.value === selectedCountry)?.name}`
      : bookingData.to;

    const submissionData = {
      user: bookingData.user,
      vehicle: bookingData.car,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      from: fromLocation,
      to: toLocation,
    };

    const endpoint = bookingId
      ? `http://localhost:5007/api/bookings/update/${bookingId}`
      : "http://localhost:5007/api/bookings/admin-booking";

    try {
      const res = await fetch(endpoint, {
        method: bookingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }
      navigate("/bookings");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {bookingId ? "Update Booking" : "New Booking"}
        </h1>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-700 mb-2">
                📅 Select dates first to see available vehicles
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Journey Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingData.startDate ? bookingData.startDate.substring(0, 10) : ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    min={todayStr}
                  />
                </div>
                <div>
                  <label className="block mb-1">Journey End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={bookingData.endDate ? bookingData.endDate.substring(0, 10) : ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    min={bookingData.startDate ? bookingData.startDate.substring(0, 10) : todayStr}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1">
                Select Vehicle 
                {bookingData.startDate && bookingData.endDate && (
                  <span className="text-sm text-green-600 ml-2">
                    ({availableCars.length} available)
                  </span>
                )}
              </label>
              <select
                name="car"
                value={bookingData.car}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
                disabled={!bookingData.startDate || !bookingData.endDate}
              >
                <option value="">
                  {!bookingData.startDate || !bookingData.endDate 
                    ? "Select dates first" 
                    : "Select Vehicle"}
                </option>
                {availableCars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.name} ({car.year}) - ₹{car.pricePerDay}/day
                  </option>
                ))}
              </select>
            </div>

            <div>
              {bookingId ? (
                <>
                  <label className="block mb-1">User</label>
                  <div className="p-2 border rounded">
                    {bookingData.userName} ({bookingData.userEmail})
                  </div>
                </>
              ) : (
                <>
                  <label className="block mb-1">Select User</label>
                  <select
                    name="user"
                    value={bookingData.user}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <div className="space-y-4">
              <CustomDropdown
                label="Select Country"
                options={countries}
                value={selectedCountry}
                onChange={(val) => setSelectedCountry(val)}
                placeholder="Select Country"
                loading={locationLoading.countries}
              />

              <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                  label="From State"
                  options={fromStates}
                  value={fromState}
                  onChange={(val) => setFromState(val)}
                  placeholder="Select State"
                  disabled={!selectedCountry}
                  loading={locationLoading.fromStates}
                />
                <CustomDropdown
                  label="From City"
                  options={fromCities}
                  value={fromCity}
                  onChange={(val) => setFromCity(val)}
                  placeholder="Select City"
                  disabled={!fromState}
                  loading={locationLoading.fromCities}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                  label="To State"
                  options={toStates}
                  value={toState}
                  onChange={(val) => setToState(val)}
                  placeholder="Select State"
                  disabled={!selectedCountry}
                  loading={locationLoading.toStates}
                />
                <CustomDropdown
                  label="To City"
                  options={toCities}
                  value={toCity}
                  onChange={(val) => setToCity(val)}
                  placeholder="Select City"
                  disabled={!toState}
                  loading={locationLoading.toCities}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : bookingId ? "Update Booking" : "Create Booking"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default BookingForm;
