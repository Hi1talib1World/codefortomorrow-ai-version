// src/api.ts
import axios from 'axios';

// Base URL of the backend API (adjust if needed)
const API_BASE = 'http://localhost:3000/api';

// Create an Axios instance that always sends cookies
const api = axios.create({
  baseURL: API_BASE,
  // IMPORTANT: include cookies on cross‑origin requests
  withCredentials: true,
});

// Optional: interceptors for debugging
api.interceptors.request.use((config) => {
  console.log('➡️ API request', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('⬅️ API response', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❗ API error', error);
    return Promise.reject(error);
  },
);

export default api;
