import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Home,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  AlertTriangle,
  Bell,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { getDerivedStatus, countByDerivedStatus } from '../../utils/statusHelpers';

const AdminDashboard = () => {
  const { setIsLoading } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [logbookStats, setLogbookStats] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  const [dueCheckouts, setDueCheckouts] = useState([]);
  const [settings, setSettings] = useState({ defaultCheckoutTime: '11:00' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchLogbookStats();
    fetchAllLogs();
    fetchDueCheckouts();
    fetchSettings();

    // Auto-refresh every 60 seconds to update derived statuses
    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchLogbookStats();
      fetchAllLogs();
      fetchDueCheckouts();
    }, 60000); // 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings', { withCredentials: true });
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogbookStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/logs/stats');
      setLogbookStats(response.data);
    } catch (err) {
      console.error('Error fetching logbook stats:', err);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/logs');
      setAllLogs(response.data.data || []);
    } catch (err) {
      console.error('Error fetching all logs:', err);
    }
  };

  const fetchDueCheckouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/logs/checkouts/due');
      setDueCheckouts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching due checkouts:', err);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-error-burgundy font-lato">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null; // Loading spinner will show
  }

  // Calculate upcoming activity count using derived status
  const upcomingActivityCount = countByDerivedStatus(allLogs, 'Pre-booked', settings?.defaultCheckInTime || '12:00');

  const statCards = [
    {
      title: 'Total Revenue (Logbook)',
      value: `₹${(logbookStats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtitle: `${logbookStats?.data?.length || 0} entries`,
      icon: DollarSign,
      color: 'bg-success-green'
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancy.rate}%`,
      subtitle: `${stats.occupancy.occupied}/${stats.occupancy.total} rooms`,
      icon: Home,
      color: 'bg-info-navy'
    },
    {
      title: 'Upcoming Activity',
      value: upcomingActivityCount,
      subtitle: 'Pre-booked entries',
      icon: Calendar,
      color: 'bg-[#4B4E6D]'
    },
    {
      title: 'Total Reservations',
      value: stats.reservations,
      icon: Calendar,
      color: 'bg-champagne-gold'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-green/10 text-success-green border-success-green/30';
      case 'pending':
        return 'bg-alert-amber/10 text-alert-amber border-alert-amber/30';
      default:
        return 'bg-pale-champagne text-rich-espresso border-pale-champagne';
    }
  };

  // Get derived status for a booking (if it has the required fields)
  const getBookingDerivedStatus = (booking) => {
    // Convert booking to log-like format for getDerivedStatus
    const logFormat = {
      date: booking.checkIn,
      category: 'Room',
      status: booking.status === 'confirmed' ? 'Active' : 'Active'
    };
    return getDerivedStatus(logFormat, settings?.defaultCheckInTime || '12:00');
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-deep-charcoal mb-2">
          Dashboard Overview
        </h2>
        <p className="text-sm md:text-base text-rich-espresso font-lato">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {dueCheckouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-burgundy/10 border-l-4 border-error-burgundy p-3 md:p-4 rounded-r-lg shadow-sm"
        >
          <div className="flex items-start gap-2 md:gap-3">
            <Bell className="text-error-burgundy mt-1 animate-pulse flex-shrink-0" size={20} />
            <div className="flex-1 min-w-0">
              <h3 className="font-playfair font-bold text-deep-charcoal text-base md:text-lg">
                Due Checkouts ({dueCheckouts.length})
              </h3>
              <div className="mt-2 space-y-2">
                {dueCheckouts.map((log) => (
                  <div key={log._id} className="text-rich-espresso font-lato text-xs md:text-sm flex items-start gap-2">
                    <Clock size={14} className="text-error-burgundy flex-shrink-0 mt-0.5" />
                    <span className="break-words">
                      <span className="font-bold text-deep-charcoal">{log.customerName}</span> - Room <span className="font-bold text-champagne-gold">{log.roomNumber}</span> (11:00 AM)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-soft-ivory rounded-luxury shadow-luxury p-3 md:p-6 border border-pale-champagne hover:shadow-luxury-hover transition-shadow flex flex-col justify-between ${index === 0 ? 'col-span-2' : 'col-span-1'
              }`}
          >
            <div>
              <div className="flex items-start justify-between mb-2 md:mb-4">
                <div className={`${card.color} p-2 md:p-3 rounded-lg`}>
                  <card.icon className="text-warm-cream" size={18} />
                </div>
                {card.trend !== undefined && (
                  <div className={`flex items-center space-x-0.5 text-[10px] md:text-sm font-lato font-bold ${card.trend > 0 ? 'text-success-green' : 'text-error-burgundy'
                    }`}>
                    {card.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{Math.abs(card.trend)}%</span>
                  </div>
                )}
              </div>
              <h3 className="text-rich-espresso font-lato text-[10px] md:text-sm mb-0.5 md:mb-1 uppercase tracking-wide truncate">{card.title}</h3>
              <p className="text-xl md:text-3xl font-playfair font-bold text-deep-charcoal mb-0.5 md:mb-1 truncate">
                {card.value}
              </p>
            </div>
            {card.subtitle && (
              <p className="text-rich-espresso text-[10px] md:text-xs font-lato truncate">{card.subtitle}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend Chart (Logbook Data) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-soft-ivory rounded-luxury shadow-luxury p-6 border border-pale-champagne"
      >
        <h3 className="text-xl font-playfair font-bold text-deep-charcoal mb-6">
          Revenue Trend (Logbook)
        </h3>
        {logbookStats && logbookStats.data && logbookStats.data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={logbookStats.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D2" />
              <XAxis
                dataKey="date"
                stroke="#3E2723"
                style={{ fontFamily: 'Lato', fontSize: '12px' }}
              />
              <YAxis
                stroke="#3E2723"
                style={{ fontFamily: 'Lato', fontSize: '12px' }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFEF7',
                  border: '1px solid #D4AF37',
                  borderRadius: '8px',
                  fontFamily: 'Lato'
                }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-rich-espresso">
            No revenue data available. Start adding entries to the logbook!
          </div>
        )}
      </motion.div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-soft-ivory rounded-luxury shadow-luxury border border-pale-champagne overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-pale-champagne">
          <h3 className="text-lg md:text-xl font-playfair font-bold text-deep-charcoal">
            Recent Bookings
          </h3>
        </div>
        <div className="md:hidden">
          <ul className="divide-y divide-pale-champagne">
            {stats.recentBookings.map((booking) => (
              <li key={booking.id} className="p-4 flex items-center justify-between hover:bg-warm-cream transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-deep-charcoal">{booking.customerName || 'Guest'}</span>
                  <span className="text-xs text-rich-espresso">Room {booking.room}</span>
                  <span className="text-xs text-soft-taupe">
                    {new Date(booking.checkIn).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {(() => {
                    const derivedStatus = getBookingDerivedStatus(booking);
                    return (
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${derivedStatus.color}`}>
                        {derivedStatus.label}
                      </span>
                    );
                  })()}
                  <div className="flex gap-2">
                    <button className="text-champagne-gold hover:text-muted-gold p-1 touch-target">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pale-champagne">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-lato font-bold text-deep-charcoal uppercase tracking-wider">
                  Guest Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-lato font-bold text-deep-charcoal uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-lato font-bold text-deep-charcoal uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-lato font-bold text-deep-charcoal uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-lato font-bold text-deep-charcoal uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pale-champagne">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-warm-cream transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-lato font-bold text-deep-charcoal">
                      {booking.customerName || 'Guest'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-lato text-rich-espresso">
                      {booking.room}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-lato text-rich-espresso">
                      {new Date(booking.checkIn).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const derivedStatus = getBookingDerivedStatus(booking);
                      return (
                        <span className={`inline-flex px-3 py-1 text-xs font-lato font-bold rounded-full border ${derivedStatus.color}`}>
                          {derivedStatus.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-champagne-gold hover:text-muted-gold mr-3 transition-colors touch-target inline-flex items-center justify-center">
                      <Eye size={18} />
                    </button>
                    <button className="text-info-navy hover:text-info-navy/80 transition-colors touch-target inline-flex items-center justify-center">
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
