import { useState, useEffect, useRef } from 'react';
import { getCountries, getStates, getCities } from '../services/locationApi.js';
import { ChevronDown, Loader2, MapPin, Search } from 'lucide-react';

// Custom Dropdown Component
const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  loading,
  icon: Icon = MapPin 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
      {label && (
        <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-3 bg-slate-50 text-left ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-slate-400" />
          <span className={selectedOption ? 'text-slate-800' : 'text-slate-400'}>
            {loading ? 'Loading...' : (selectedOption?.name || placeholder)}
          </span>
        </div>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        ) : (
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b sticky top-0 bg-white">
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded">
              <Search className="w-4 h-4 text-slate-400" />
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

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">No results found</div>
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
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-primary hover:text-white transition-colors ${
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

// Main Location Selector Component
export const LocationSelector = ({ 
  onFromChange, 
  onToChange,
  fromValue,
  toValue 
}) => {
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
  
  const [loading, setLoading] = useState({
    countries: false,
    fromStates: false,
    fromCities: false,
    toStates: false,
    toCities: false
  });

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setLoading(prev => ({ ...prev, countries: true }));
      const data = await getCountries();
      setCountries(data.map(c => ({ 
        value: c.iso2, 
        name: c.name, 
        emoji: c.emoji 
      })));
      setLoading(prev => ({ ...prev, countries: false }));
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const loadStates = async () => {
        setLoading(prev => ({ ...prev, fromStates: true, toStates: true }));
        const data = await getStates(selectedCountry);
        const stateOptions = data.map(s => ({ value: s.iso2, name: s.name }));
        setFromStates(stateOptions);
        setToStates(stateOptions);
        setLoading(prev => ({ ...prev, fromStates: false, toStates: false }));
      };
      loadStates();
      // Reset selections
      setFromState('');
      setFromCity('');
      setToState('');
      setToCity('');
      setFromCities([]);
      setToCities([]);
    }
  }, [selectedCountry]);

  // Load FROM cities when FROM state changes
  useEffect(() => {
    if (selectedCountry && fromState) {
      const loadCities = async () => {
        setLoading(prev => ({ ...prev, fromCities: true }));
        const data = await getCities(selectedCountry, fromState);
        setFromCities(data.map(c => ({ value: c.id, name: c.name })));
        setLoading(prev => ({ ...prev, fromCities: false }));
      };
      loadCities();
      setFromCity('');
    }
  }, [selectedCountry, fromState]);

  // Load TO cities when TO state changes
  useEffect(() => {
    if (selectedCountry && toState) {
      const loadCities = async () => {
        setLoading(prev => ({ ...prev, toCities: true }));
        const data = await getCities(selectedCountry, toState);
        setToCities(data.map(c => ({ value: c.id, name: c.name })));
        setLoading(prev => ({ ...prev, toCities: false }));
      };
      loadCities();
      setToCity('');
    }
  }, [selectedCountry, toState]);

  // Update parent when FROM location changes
  useEffect(() => {
    if (fromCity && fromState && selectedCountry) {
      const cityName = fromCities.find(c => c.value === fromCity)?.name || '';
      const stateName = fromStates.find(s => s.value === fromState)?.name || '';
      const countryName = countries.find(c => c.value === selectedCountry)?.name || '';
      onFromChange(`${cityName}, ${stateName}, ${countryName}`);
    }
  }, [fromCity, fromState, selectedCountry, fromCities, fromStates, countries]);

  // Update parent when TO location changes
  useEffect(() => {
    if (toCity && toState && selectedCountry) {
      const cityName = toCities.find(c => c.value === toCity)?.name || '';
      const stateName = toStates.find(s => s.value === toState)?.name || '';
      const countryName = countries.find(c => c.value === selectedCountry)?.name || '';
      onToChange(`${cityName}, ${stateName}, ${countryName}`);
    }
  }, [toCity, toState, selectedCountry, toCities, toStates, countries]);

  return (
    <div className="space-y-4">
      {/* Country Selection */}
      <CustomDropdown
        label="Select Country"
        options={countries}
        value={selectedCountry}
        onChange={(val) => setSelectedCountry(val)}
        placeholder="Select Country"
        loading={loading.countries}
      />

      {/* FROM Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDropdown
          label="From - State"
          options={fromStates}
          value={fromState}
          onChange={(val) => setFromState(val)}
          placeholder="Select State"
          disabled={!selectedCountry}
          loading={loading.fromStates}
        />
        <CustomDropdown
          label="From - City"
          options={fromCities}
          value={fromCity}
          onChange={(val) => setFromCity(val)}
          placeholder="Select City"
          disabled={!fromState}
          loading={loading.fromCities}
        />
      </div>

      {/* TO Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDropdown
          label="To - State"
          options={toStates}
          value={toState}
          onChange={(val) => setToState(val)}
          placeholder="Select State"
          disabled={!selectedCountry}
          loading={loading.toStates}
        />
        <CustomDropdown
          label="To - City"
          options={toCities}
          value={toCity}
          onChange={(val) => setToCity(val)}
          placeholder="Select City"
          disabled={!toState}
          loading={loading.toCities}
        />
      </div>
    </div>
  );
};

export default LocationSelector;
