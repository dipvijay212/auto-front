import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to extract backend error messages and statuses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    const newError = new Error(message);
    newError.status = status;
    newError.data = error.response?.data;
    return Promise.reject(newError);
  }
);

export default api;
