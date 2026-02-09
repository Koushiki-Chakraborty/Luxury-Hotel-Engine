import axios from 'axios';

// Request interceptor - Attach token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
        
        // Redirect to login page
        window.location.href = '/admin/login';
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
