import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, User, Save, Lock, Clock, Phone, AlertTriangle, Check } from 'lucide-react';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';
import toast, { Toaster } from 'react-hot-toast';

const AdminSettings = () => {
  const { admin } = useAdmin();
  const [loading, setLoading] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Settings State
  const [settingsData, setSettingsData] = useState({
    defaultCheckoutTime: '11:00',
    defaultCheckInTime: '12:00',
    hotelContactNumber: ''
  });
  const [initialSettingsLoading, setInitialSettingsLoading] = useState(true);

  // Fetch Settings on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/settings`, {
          withCredentials: true
        });
        if (response.data.success) {
          setSettingsData({
            defaultCheckoutTime: response.data.data.defaultCheckoutTime || '11:00',
            defaultCheckInTime: response.data.data.defaultCheckInTime || '12:00',
            hotelContactNumber: response.data.data.hotelContactNumber || ''
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setInitialSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle Password Change
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(passwordData.newPassword)) {
      toast.error('Password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, { withCredentials: true });

      toast.success('Password updated successfully', {
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
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Settings Change
  const handleSettingsChange = (e) => {
    setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
  };

  const submitSettingsUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.put(`${import.meta.env.VITE_API_URL}/settings`, settingsData, { withCredentials: true });
      toast.success('Global settings updated successfully', {
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
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update settings';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Toaster position="top-right" />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Settings className="text-champagne-gold" size={32} />
          <h1 className="text-3xl font-playfair font-bold text-deep-charcoal">
            Settings
          </h1>
        </div>
        <p className="text-rich-espresso font-lato">
          Configure system preferences and manage your account security.
        </p>
      </motion.div>

      {/* Profile Overview (Read-Only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-soft-ivory rounded-luxury shadow-luxury p-4 md:p-8 border border-pale-champagne"
      >
        <div className="flex items-center gap-2 mb-6 border-b border-pale-champagne pb-4">
          <User className="text-info-navy" size={24} />
          <h2 className="text-xl font-playfair font-bold text-deep-charcoal">Profile Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg border border-pale-champagne/50">
            <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-1">Name</label>
            <p className="text-lg font-lato text-deep-charcoal font-medium">{admin?.name || 'Admin User'}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-pale-champagne/50">
            <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-1">Email</label>
            <p className="text-lg font-lato text-deep-charcoal font-medium break-all">{admin?.email || 'admin@example.com'}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-pale-champagne/50">
            <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-1">Role</label>
            <span className="inline-block px-3 py-1 bg-champagne-gold/20 text-deep-charcoal rounded-full text-sm font-bold capitalize">
              {admin?.role || 'Administrator'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-luxury shadow-luxury p-4 md:p-8 border border-pale-champagne"
        >
          <div className="flex items-center gap-2 mb-6 border-b border-pale-champagne pb-4">
            <Shield className="text-success-green" size={24} />
            <h2 className="text-xl font-playfair font-bold text-deep-charcoal">Security</h2>
          </div>

          <form onSubmit={submitPasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-charcoal mb-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold touch-target"
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-charcoal mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold touch-target"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-charcoal mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold touch-target"
                  placeholder="Re-enter new password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-deep-charcoal text-white py-3 rounded-lg hover:bg-black transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 touch-target"
            >
              {loading ? 'Updating...' : <><Save size={18} /> Update Password</>}
            </button>
          </form>
        </motion.div>

        {/* Hotel Identity Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-luxury shadow-luxury p-4 md:p-8 border border-pale-champagne"
        >
          <div className="flex items-center gap-2 mb-6 border-b border-pale-champagne pb-4">
            <Settings className="text-alert-amber" size={24} />
            <h2 className="text-xl font-playfair font-bold text-deep-charcoal">Hotel Identity</h2>
          </div>

          {initialSettingsLoading ? (
            <div className="text-center py-8 text-rich-espresso">Loading settings...</div>
          ) : (
            <form onSubmit={submitSettingsUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">Default Check-out Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
                  <input
                    type="time"
                    name="defaultCheckoutTime"
                    value={settingsData.defaultCheckoutTime}
                    onChange={handleSettingsChange}
                    className="w-full pl-10 pr-4 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold touch-target"
                    required
                  />
                </div>
                <p className="text-xs text-rich-espresso/70 mt-1">Used for Dashboard morning alerts.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">Global Check-in Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
                  <input
                    type="time"
                    name="defaultCheckInTime"
                    value={settingsData.defaultCheckInTime}
                    onChange={handleSettingsChange}
                    className="w-full pl-10 pr-4 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold touch-target"
                    required
                  />
                </div>
                <p className="text-xs text-rich-espresso/70 mt-1">Rooms automatically become 'Active' at this time on check-in date.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">Hotel Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
                  <input
                    type="text"
                    name="hotelContactNumber"
                    value={settingsData.hotelContactNumber}
                    onChange={handleSettingsChange}
                    className="w-full pl-10 pr-4 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold touch-target"
                    placeholder="+91 96355 53346"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-champagne-gold text-deep-charcoal py-3 rounded-lg hover:bg-champagne-gold/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 touch-target"
                >
                  {loading ? 'Saving...' : <><Save size={18} /> Save Settings</>}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      {/* Notifications */}


    </div>
  );
};

export default AdminSettings;
