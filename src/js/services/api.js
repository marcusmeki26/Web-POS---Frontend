import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_API_BASE_PATH_V1,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Middleware: Automatically grabs JWT from storage and attaches it to headers
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('jwt_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// for global error logging
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

export default api;