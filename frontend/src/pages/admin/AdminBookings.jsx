import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Archive, Search, Calendar, Filter, DollarSign, FileText } from 'lucide-react';
import axios from 'axios';
import { getDerivedStatus } from '../../utils/statusHelpers';

const AdminBookings = () => {
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({ defaultCheckInTime: '12:00' });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Fetch logs and settings on mount
  useEffect(() => {
    fetchLogs();
    fetchSettings();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/logs');
      setLogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Client-side filtering with useMemo for performance
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Search filter (Customer Name or Room Number)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.customerName?.toLowerCase().includes(query) ||
        log.roomNumber?.toString().includes(query)
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(log => new Date(log.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(log => new Date(log.date) <= new Date(dateTo));
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Smart status filter (using derived status)
    if (selectedStatus !== 'All') {
      const checkInTime = settings?.defaultCheckInTime || '12:00';
      filtered = filtered.filter(log => {
        const derivedStatus = getDerivedStatus(log, checkInTime);
        return derivedStatus.label === selectedStatus;
      });
    }

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
  }, [logs, searchQuery, dateFrom, dateTo, selectedCategory, selectedStatus, settings]);

  // Calculate live revenue
  const liveRevenue = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + (log.totalAmount || 0), 0);
  }, [filteredLogs]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const categories = ['All', 'Room', 'Restaurant', 'Party/Event'];
  const statuses = ['All', 'Pre-booked', 'Active', 'Live Now', 'Time Over', 'Completed'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Archive className="text-champagne-gold" size={32} />
          <h1 className="text-3xl font-playfair font-bold text-deep-charcoal">
            Bookings Archive
          </h1>
        </div>
        <p className="text-rich-espresso font-lato">
          Central archive for all property records with advanced filtering and analytics.
        </p>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-luxury shadow-luxury p-4 md:p-6 border border-pale-champagne"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-info-navy" size={20} />
          <h2 className="text-lg font-playfair font-bold text-deep-charcoal">Advanced Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div>
            <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Guest name or room..."
                className="w-full pl-10 pr-4 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
              />
            </div>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-1">
              From Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-1">
              To Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-espresso/50" size={18} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Toggle Buttons */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-rich-espresso uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-lato font-medium text-sm transition-all ${selectedCategory === category
                    ? 'bg-champagne-gold text-deep-charcoal shadow-gold'
                    : 'bg-soft-ivory text-rich-espresso hover:bg-pale-champagne border border-pale-champagne'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Live Revenue Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Records Found */}
        <div className="bg-gradient-to-br from-info-navy to-info-navy/80 rounded-luxury shadow-luxury p-6 border border-info-navy/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warm-cream/80 text-sm font-lato mb-1">Records Found</p>
              <p className="text-3xl font-playfair font-bold text-warm-cream">{filteredLogs.length}</p>
            </div>
            <FileText className="text-warm-cream/50" size={40} />
          </div>
        </div>

        {/* Total Period Revenue */}
        <div className="bg-gradient-to-br from-success-green to-success-green/80 rounded-luxury shadow-luxury p-6 border border-success-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warm-cream/80 text-sm font-lato mb-1">Total Period Revenue</p>
              <p className="text-3xl font-playfair font-bold text-warm-cream">{formatCurrency(liveRevenue)}</p>
            </div>
            <DollarSign className="text-warm-cream/50" size={40} />
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-luxury shadow-luxury border border-pale-champagne overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-champagne-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-20">
            <Archive className="mx-auto text-rich-espresso/30 mb-4" size={64} />
            <p className="text-rich-espresso font-lato text-lg">No records found</p>
            <p className="text-rich-espresso/60 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-pale-champagne">
              {filteredLogs.map((log) => {
                const derivedStatus = getDerivedStatus(log, settings?.defaultCheckInTime || '12:00');
                return (
                  <div key={log._id} className="p-4 hover:bg-soft-ivory/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-lato font-bold text-deep-charcoal">{log.customerName || 'N/A'}</p>
                        <p className="text-xs text-rich-espresso/70">{formatDate(log.date)}</p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${derivedStatus.color}`}>
                        {derivedStatus.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-rich-espresso/70">Category:</span>
                        <span className="ml-1 font-medium text-deep-charcoal">{log.category}</span>
                      </div>
                      <div>
                        <span className="text-rich-espresso/70">Units:</span>
                        <span className="ml-1 font-medium text-deep-charcoal">{log.units || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-rich-espresso/70">Room:</span>
                        <span className="ml-1 font-medium text-deep-charcoal">{log.roomNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-rich-espresso/70">Amount:</span>
                        <span className="ml-1 font-bold text-success-green">{formatCurrency(log.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-deep-charcoal text-warm-cream">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Guest</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Room</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Units</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pale-champagne">
                  {filteredLogs.map((log) => {
                    const derivedStatus = getDerivedStatus(log, settings?.defaultCheckInTime || '12:00');
                    return (
                      <tr key={log._id} className="hover:bg-soft-ivory/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-deep-charcoal font-medium">
                          {formatDate(log.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-deep-charcoal font-medium">
                          {log.customerName || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-deep-charcoal">
                          {log.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-deep-charcoal">
                          {log.roomNumber || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-deep-charcoal">
                          {log.units || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-success-green">
                          {formatCurrency(log.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded text-xs font-medium border ${derivedStatus.color}`}>
                            {derivedStatus.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminBookings;
