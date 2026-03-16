import axios from 'axios';

// Request interceptor - Attach token to all requests
// NOTE: With HttpOnly cookies, we don't need to manually attach the token.
// The browser handles it automatically with `withCredentials: true`.
axios.interceptors.request.use(
  (config) => {
    // config.withCredentials = true; // Already set globally in AdminContext, but good to know.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors (auto-logout)
axios.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response.status === 401) {
        // Clear authentication data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        // We do NOT redirect globally here anymore.
        // Protected routes will handle redirects.
        // Public routes will just fail gracefully (or show generic error).
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (error.response.status === 403) {
        console.error('Access forbidden: Insufficient permissions');
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
