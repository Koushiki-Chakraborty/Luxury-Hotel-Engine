import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set axios default to verify cookies
  axios.defaults.withCredentials = true;

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/me`);
      if (response.data.success) {
        setAdmin(response.data.user);
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
        setAdmin(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Expected behavior if user is not logged in.
        // Just ensure state reflects this.
        setIsAdminAuthenticated(false);
        setAdmin(null);
      } else {
        console.error('Auth check failed:', error);
        setIsAdminAuthenticated(false);
        setAdmin(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
        email,
        password
      });

      if (response.data.success) {
        setAdmin(response.data.user);
        setIsAdminAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      setIsAdminAuthenticated(false);
      // Cookies are cleared by the backend response
      navigate('/admin/login');
    }
  };

  const value = {
    admin,
    isAdminAuthenticated,
    loading,
    login,
    logout,
    checkAuth // Exposed in case we need to re-verify manually
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
