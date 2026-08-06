import axios from 'axios';

const api = axios.create({
  // Fallback to localhost if the .env variable isn't loaded yet
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Middleware: Automatically grabs JWT from storage and attaches it to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;