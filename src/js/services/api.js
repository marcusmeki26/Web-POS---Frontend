import axios from 'axios';
import { getAccessToken } from './authservice';

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_API_BASE_PATH_V1,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Middleware: Automatically grabs JWT from storage and attaches it to headers
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle expired tokens automatically
// api.interceptors.response.use(
//   (response) => response, // Pass successful responses straight through
//   async (error) => {
//       const originalRequest = error.config;

//       // If the server returns 401 and we haven't tried retrying this specific request yet
//       if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true; // Mark request so we don't loop endlessly

//           try {
//               // Hit your backend refresh endpoint to get a new access token.
//               // The browser automatically attaches the HttpOnly refresh cookie here.
//               const refreshResponse = await axios.post('https://example.com/auth/refresh', {}, {
//                   withCredentials: true 
//               });

//               const newAccessToken = refreshResponse.data.accessToken;

//               // Save the brand new token into our private JS memory
//               setToken(newAccessToken);

//               // Update the Authorization header of the original failed request
//               originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

//               // Re-execute and return the original request with the new token
//               return api(originalRequest);
//           } catch (refreshError) {
//               // If the refresh token is also expired or invalid, log the user out
//               clearToken();
//               window.location.href = '/login.html'; 
//               return Promise.reject(refreshError);
//           }
//       }

//       return Promise.reject(error);
//   }
// );

// for global error logging
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

export default api;