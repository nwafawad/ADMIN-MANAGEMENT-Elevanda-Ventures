import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we get a 401 AND we're not already on the login page
    // AND the failing request wasn't the initial /auth/me check
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login' &&
      !error.config.url.includes('/auth/me')
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
