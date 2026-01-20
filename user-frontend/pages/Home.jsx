import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store.jsx';
import { LocationSelector } from '../components/LocationSelector.jsx';
import { Search, Calendar, Clock, Star } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { dispatch } = useStore();

  const [search, setSearch] = useState({
    fromLocation: '',
    toLocation: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });

  // 🔹 Date limits
  const today = new Date().toISOString().split("T")[0];
  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split("T")[0];
  })();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.fromLocation || !search.toLocation) {
      alert("Please select pickup and drop-off locations");
      return;
    }

    if (!search.startDate || !search.endDate) {
      alert("Please select valid dates");
      return;
    }

    if (new Date(search.endDate) <= new Date(search.startDate)) {
      alert("Drop-off date must be after pickup date");
      return;
    }

    dispatch({
      type: 'SET_SEARCH_PARAMS',
      payload: search
    });

    navigate('/vehicles');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-[750px] bg-slate-900 flex items-center justify-center py-12">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2021" 
            alt="Road trip" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
            Find Your Perfect Ride
          </h1>

          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
            <form onSubmit={handleSearch} className="space-y-6">

              {/* Location Selector with API */}
              <LocationSelector
                fromValue={search.fromLocation}
                toValue={search.toLocation}
                onFromChange={(location) => setSearch(prev => ({ ...prev, fromLocation: location }))}
                onToChange={(location) => setSearch(prev => ({ ...prev, toLocation: location }))}
              />

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Pick-up Date</label>
                  <div className="flex items-center border rounded-lg px-3 py-3 bg-slate-50">
                    <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                      type="date"
                      min={today}
                      max={maxDate}
                      value={search.startDate}
                      onChange={(e) => setSearch({ ...search, startDate: e.target.value })}
                      required
                      className="bg-transparent w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500">Pick-up Time</label>
                  <div className="flex items-center border rounded-lg px-3 py-3 bg-slate-50">
                    <Clock className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                      type="time"
                      value={search.startTime}
                      onChange={(e) => setSearch({ ...search, startTime: e.target.value })}
                      required
                      className="bg-transparent w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500">Drop-off Date</label>
                  <div className="flex items-center border rounded-lg px-3 py-3 bg-slate-50">
                    <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                      type="date"
                      min={search.startDate || today}
                      max={maxDate}
                      value={search.endDate}
                      onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
                      required
                      className="bg-transparent w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500">Drop-off Time</label>
                  <div className="flex items-center border rounded-lg px-3 py-3 bg-slate-50">
                    <Clock className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                      type="time"
                      value={search.endTime}
                      onChange={(e) => setSearch({ ...search, endTime: e.target.value })}
                      required
                      className="bg-transparent w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-sky-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Search size={20} /> Search Available Vehicles
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Trusted by Travelers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="fill-current w-5 h-5" />
                ))}
              </div>
              <p className="text-gray-600 mb-3">
                "Great service, clean vehicles and smooth booking experience!"
              </p>
              <p className="font-semibold">Verified User</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
