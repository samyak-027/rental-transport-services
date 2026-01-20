// Country State City API Service
const API_KEY = '1c517d8d9ac61b81afca2621232e0d245d1098a57eb208436deeda74039bfc06';
const BASE_URL = 'https://api.countrystatecity.in/v1';

const headers = {
  'X-CSCAPI-KEY': API_KEY
};

export const getCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/countries`, { headers });
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export const getStates = async (countryCode) => {
  try {
    const response = await fetch(`${BASE_URL}/countries/${countryCode}/states`, { headers });
    if (!response.ok) throw new Error('Failed to fetch states');
    return await response.json();
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

export const getCities = async (countryCode, stateCode) => {
  try {
    const response = await fetch(`${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`, { headers });
    if (!response.ok) throw new Error('Failed to fetch cities');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};
