import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [token, setToken] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminUser');

    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
      setIsAdminAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password
      });

      const { token: newToken, user } = response.data;

      // Store in state
      setToken(newToken);
      setAdmin(user);
      setIsAdminAuthenticated(true);

      // Store in localStorage
      localStorage.setItem('adminToken', newToken);
      localStorage.setItem('adminUser', JSON.stringify(user));

      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setAdmin(null);
    setIsAdminAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const value = {
    admin,
    token,
    isAdminAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
