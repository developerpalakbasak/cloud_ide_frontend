import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URI;

const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "X-Requested-With": process.env.NEXT_PUBLIC_AUTH_REQUEST_HEADER
  },
});

// Add interceptor to handle token refresh retry
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.data &&
      error.response.data.retry &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      return API(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default API;
