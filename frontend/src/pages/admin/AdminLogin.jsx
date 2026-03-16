import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import toast, { Toaster } from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAdminAuthenticated } = useAdmin();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.password)) {
      setError('Password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    setLoading(true);

    try {
      // Pass only email and password, rememberMe logic is handled by browser/cookie persistence
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Welcome back to Rudraksh Inn Admin', {
          style: {
            border: '1px solid #D4AF37',
            padding: '16px',
            color: '#2B2B2B',
            background: '#FFFEF7',
          },
          iconTheme: {
            primary: '#D4AF37',
            secondary: '#FFFEF7',
          },
        });
        navigate('/admin/dashboard');
      } else {
        // Unified error message
        setError('Invalid email or password');
        toast.error('Invalid credentials');
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      toast.error('Server error');
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-charcoal via-rich-espresso to-deep-charcoal flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-soft-ivory rounded-luxury shadow-luxury-hover p-8 md:p-10 border border-champagne-gold/20">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              <div className="text-3xl font-playfair font-bold text-deep-charcoal mb-2">
                <span className="text-champagne-gold">Rudraksh</span> Inn
              </div>
              <div className="h-1 w-20 bg-champagne-gold mx-auto rounded-full mb-4"></div>
            </motion.div>
            <h2 className="text-2xl font-playfair font-bold text-deep-charcoal mb-2">
              Admin Portal
            </h2>
            <p className="text-rich-espresso font-lato text-sm">
              Sign in to manage your property
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="text-red-700 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-lato">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-deep-charcoal font-lato font-bold text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-champagne-gold" size={20} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@rudrakshinn.com"
                  className="input-field w-full pl-12 focus:ring-champagne-gold focus:border-champagne-gold"
                  required
                  disabled={loading}
                  autoFocus
                  aria-label="Email Address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-deep-charcoal font-lato font-bold text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-champagne-gold" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field w-full pl-12 pr-12 focus:ring-champagne-gold focus:border-champagne-gold"
                  required
                  disabled={loading}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-rich-espresso hover:text-champagne-gold transition-colors focus:outline-none"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-champagne-gold bg-white border-gray-300 rounded focus:ring-champagne-gold focus:ring-2"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm font-lato text-deep-charcoal">
                Remember me
              </label>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed bg-champagne-gold text-deep-charcoal font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-pale-champagne/30 text-center">
            <p className="text-rich-espresso/70 text-xs font-lato">
              © 2026 Rudraksh Inn. Secure Admin Access.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
