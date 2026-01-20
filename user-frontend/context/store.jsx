import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import * as api from "../services/api.js";

// Initialize state from localStorage
const getInitialAuthState = () => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  
  if (token && user) {
    try {
      return {
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState = {
  auth: getInitialAuthState(),
  vehicles: [],
  searchParams: {
    fromLocation: "",
    toLocation: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  },
  selectedVehicle: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        auth: {
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
        },
      };

    case "TOKEN_REFRESH":
      return {
        ...state,
        auth: {
          ...state.auth,
          token: action.payload,
        },
      };

    case "LOGOUT":
      return {
        ...state,
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
        },
      };

    case "UPDATE_USER":
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload,
        },
      };

    case "SET_SEARCH_PARAMS":
      return { ...state, searchParams: action.payload };

    case "SELECT_VEHICLE":
      return { ...state, selectedVehicle: action.payload };

    case "CLEAR_BOOKING":
      return {
        ...state,
        selectedVehicle: null,
        searchParams: initialState.searchParams,
      };

    default:
      return state;
  }
};

const StoreContext = createContext(null);

// Decode JWT payload
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* ===============================
     SAVE AUTH TO LOCAL STORAGE
  =============================== */
  useEffect(() => {
    if (state.auth.isAuthenticated && state.auth.token) {
      localStorage.setItem("accessToken", state.auth.token);
      localStorage.setItem("user", JSON.stringify(state.auth.user));
    }
  }, [state.auth]);

  /* ===============================
     AUTO REFRESH TOKEN
  =============================== */
  useEffect(() => {
    if (!state.auth.token) return;

    const decoded = decodeToken(state.auth.token);
    if (!decoded?.exp) return;

    const expiryTime = decoded.exp * 1000;
    const now = Date.now();
    const refreshBefore = 2 * 60 * 1000; // 2 minutes

    const timeout = expiryTime - now - refreshBefore;

    if (timeout <= 0) {
      refreshToken();
      return;
    }

    const timer = setTimeout(refreshToken, timeout);

    return () => clearTimeout(timer);
  }, [state.auth.token]);

  const refreshToken = async () => {
    try {
      const res = await api.refreshToken();
      if (res.token) {
        localStorage.setItem("accessToken", res.token);
        dispatch({
          type: "TOKEN_REFRESH",
          payload: res.token,
        });
      }
    } catch (err) {
      console.error("Refresh failed", err);
      // Don't logout immediately, let user continue with existing token
    }
  };

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
