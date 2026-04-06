// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // adjust to your backend
  withCredentials: true,
});

// Example interceptor for attaching token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;