import axios from "axios";

/* ============================
   AXIOS INSTANCE
============================ */

const API = axios.create({
  baseURL: "http://localhost:5007/api",
  withCredentials: true, // needed for refresh token cookie
});

/* ============================
   REQUEST INTERCEPTOR
   → Attach Access Token
============================ */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
   → Auto Refresh Token
============================ */

// List of auth endpoints that should NOT trigger token refresh
const authEndpoints = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/check-email',
  '/auth/resend-otp',
  '/auth/refresh-token'
];

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // Skip token refresh for auth endpoints (login, register, etc.)
    const isAuthEndpoint = authEndpoints.some(endpoint => requestUrl.includes(endpoint));

    // Only attempt refresh for 401 errors on protected routes
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/auth/refresh-token");

        const newToken = res.data.token;
        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* =========================
   AUTH
========================= */

export const login = async (data) => {
  const res = await API.post("/auth/login", data);

  if (res.data.token) {
    localStorage.setItem("accessToken", res.data.token);
  }

  return res.data;
};

export const register = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await API.post("/auth/verify-email", data);
  return response.data;
};

export const resendOTP = async (data) => {
  const response = await API.post("/auth/resend-otp", data);
  return response.data;
};

export const logout = async () => {
  await API.post("/auth/logout");
  localStorage.removeItem("accessToken");
};

export const checkSession = () =>
  API.get("/auth/me");

export const refreshToken = async () => {
  const response = await API.post("/auth/refresh-token");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await API.post("/auth/reset-password", data);
  return response.data;
};

export const checkEmailAvailability = async (email) => {
  const response = await API.post("/auth/check-email", { email });
  return response.data;
};

export const submitContactForm = async (data) => {
  const response = await API.post("/auth/contact", data);
  return response.data;
};

/* =========================
   VEHICLES
========================= */

export const getVehicles = () =>
  API.get("/cars/getCars");

export const getAvailableCars = (payload) =>
  API.post("/cars/available", payload);

/* =========================
   BOOKINGS
========================= */

export const createBooking = (data) =>
  API.post("/bookings/user-booking", data);

export const getMyBookings = () =>
  API.get("/bookings/my-bookings");

export const getAllBookings = () =>
  API.get("/bookings/allBookings");

export const deleteBooking = (id) =>
  API.delete(`/bookings/${id}`);

/* =========================
   USER PROFILE
========================= */

export const getUserProfile = () =>
  API.get("/users/me");

export const updateProfile = (data) =>
  API.put("/users/update-profile", data);

export const verifyProfileOTP = (data) =>
  API.post("/users/verify-profile-update", data);

export const uploadLicense = (formData) =>
  API.post("/users/upload-license", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadProfilePicture = (formData) =>
  API.post("/users/upload-profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;
