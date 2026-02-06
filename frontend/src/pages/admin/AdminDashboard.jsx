import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Home, 
  ShoppingCart, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
  const { setIsLoading } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

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

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.total.toLocaleString()}`,
      trend: stats.revenue.trend,
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
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: ShoppingCart,
      color: 'bg-alert-amber'
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-playfair font-bold text-deep-charcoal mb-2">
          Dashboard Overview
        </h2>
        <p className="text-rich-espresso font-lato">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-soft-ivory rounded-luxury shadow-luxury p-6 border border-pale-champagne hover:shadow-luxury-hover transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-warm-cream" size={24} />
              </div>
              {card.trend !== undefined && (
                <div className={`flex items-center space-x-1 text-sm font-lato font-bold ${
                  card.trend > 0 ? 'text-success-green' : 'text-error-burgundy'
                }`}>
                  {card.trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{Math.abs(card.trend)}%</span>
                </div>
              )}
            </div>
            <h3 className="text-rich-espresso font-lato text-sm mb-1">{card.title}</h3>
            <p className="text-3xl font-playfair font-bold text-deep-charcoal mb-1">
              {card.value}
            </p>
            {card.subtitle && (
              <p className="text-rich-espresso text-xs font-lato">{card.subtitle}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Weekly Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-soft-ivory rounded-luxury shadow-luxury p-6 border border-pale-champagne"
      >
        <h3 className="text-xl font-playfair font-bold text-deep-charcoal mb-6">
          Weekly Revenue
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.weeklyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D2" />
            <XAxis 
              dataKey="day" 
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
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#D4AF37" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-soft-ivory rounded-luxury shadow-luxury border border-pale-champagne overflow-hidden"
      >
        <div className="p-6 border-b border-pale-champagne">
          <h3 className="text-xl font-playfair font-bold text-deep-charcoal">
            Recent Bookings
          </h3>
        </div>
        <div className="overflow-x-auto">
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
                      {booking.guestName}
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
                    <span className={`inline-flex px-3 py-1 text-xs font-lato font-bold rounded-full border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-champagne-gold hover:text-muted-gold mr-3 transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="text-info-navy hover:text-info-navy/80 transition-colors">
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
