import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle response errors - check both HTTP errors and API-level errors
api.interceptors.response.use(
  (response) => {
    // Check if response has success: false (API error even with 200 status)
    if (response.data && response.data.success === false) {
      return Promise.reject({
        response: {
          status: 400,
          data: {
            message: response.data.message || "Request failed"
          }
        }
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

