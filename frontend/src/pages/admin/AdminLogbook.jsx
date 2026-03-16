import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, Calendar, TrendingUp, Edit2, Check, X, AlertTriangle, Archive, Clock } from 'lucide-react';
import axios from 'axios';
import { getDerivedStatus } from '../../utils/statusHelpers';

const AdminLogbook = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [settings, setSettings] = useState({ defaultCheckInTime: '12:00' });
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-CA'),
    source: 'Walk-in',
    category: 'Room',
    roomNumber: '',
    customerName: '',
    phoneNumber: '',
    description: '',
    units: 1,
    duration: 1,
    unitPrice: 0,
    startTime: '',
    endTime: '',
    status: 'Active'
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'delete', 'checkout', 'archive'
    id: null,
    step: 1 // 1: Initial, 2: Final Confirmation
  });

  // Auto-calculate total
  const calculatedTotal = formData.units * formData.duration * formData.unitPrice;

  // Fetch all logs
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

  // Fetch rooms for dropdown
  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms?limit=100');
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchRooms();
    fetchSettings();

    // Auto-refresh every 60 seconds to update derived statuses
    const refreshInterval = setInterval(() => {
      fetchLogs();
    }, 60000); // 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Fetch settings for dynamic check-in time
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

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Restaurant Logic: Auto-set status to Completed
      if (field === 'category') {
        if (value === 'Restaurant') {
          newData.status = 'Completed';
        } else {
          newData.status = 'Active';
        }
      }

      return newData;
    });
  };

  // Date Badge Logic
  const getDateStatus = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const selected = formData.date;

    if (selected === today) return { label: 'Live Entry', color: 'bg-success-green/10 text-success-green border-success-green/20' };
    if (selected > today) return { label: 'Pre-Booking', color: 'bg-alert-amber/10 text-alert-amber border-alert-amber/20' };
    return null;
  };

  // Create new log entry
  const handleCreateLog = async (e) => {
    e.preventDefault();

    if (formData.category === 'Room') {
      if (!formData.roomNumber || !formData.customerName) {
        alert('Please provide Room Number and Customer Name');
        return;
      }
      if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber)) {
        alert('Please provide a valid 10-digit phone number');
        return;
      }
    }

    if (formData.category === 'Restaurant') {
      if (!formData.description || formData.description.trim().length < 3) {
        alert('Please provide description (minimum 3 characters)');
        return;
      }
    }

    if (formData.category === 'Party/Event') {
      if (!formData.description || formData.description.trim().length < 3) {
        alert('Please provide description (minimum 3 characters)');
        return;
      }
      if (!formData.startTime || !formData.endTime) {
        alert('Please provide Start Time and End Time for Party/Event');
        return;
      }
      if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber)) {
        alert('Please provide a valid 10-digit phone number');
        return;
      }
    }

    if (parseInt(formData.duration) < 1) {
      alert('Duration must be at least 1 day');
      return;
    }

    if (formData.unitPrice <= 0) {
      alert('Please provide valid unit price (greater than 0)');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/logs', formData);

      // Reset form
      setFormData({
        date: new Date().toLocaleDateString('en-CA'),
        source: 'Walk-in',
        category: 'Room',
        roomNumber: '',
        customerName: '',
        phoneNumber: '',
        description: '',
        units: 1,
        duration: 1,
        unitPrice: 0,
        startTime: '',
        endTime: '',
        status: 'Active'
      });

      fetchLogs();
      fetchRooms();
    } catch (error) {
      console.error('Error creating log:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create log entry';
      alert(errorMsg);
    }
  };

  // Start Editing
  const handleStartEdit = (log) => {
    setEditingId(log._id);

    // Ensure the date is formatted correctly for the HTML5 date input (YYYY-MM-DD)
    const formattedDate = log.date ? new Date(log.date).toISOString().split('T')[0] : '';

    setEditFormData({
      ...log,
      date: formattedDate
    });
  };
  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Handle Edit Input Change
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => {
      const newData = { ...prev, [field]: value };


      if (field === 'category') {
        if (value === 'Restaurant') {
          newData.status = 'Completed';
        } else {
          newData.status = 'Active';
        }
      }

      return newData;
    });
  };

  // Save Edit
  const handleUpdateLog = async () => {
    if (e) e.preventDefault();
    if (editFormData.category === 'Room') {
      if (!editFormData.roomNumber || !editFormData.customerName) {
        alert('Room Number and Customer Name are required');
        return;
      }
      if (!editFormData.phoneNumber || !/^[0-9]{10}$/.test(editFormData.phoneNumber)) {
        alert('Please provide a valid 10-digit phone number');
        return;
      }
    }

    if (editFormData.category === 'Restaurant') {
      if (!editFormData.description || editFormData.description.trim().length < 3) {
        alert('Please provide description (minimum 3 characters)');
        return;
      }
    }

    if (editFormData.category === 'Party/Event') {
      if (!editFormData.description || editFormData.description.trim().length < 3) {
        alert('Please provide description (minimum 3 characters)');
        return;
      }
      if (!editFormData.startTime || !editFormData.endTime) {
        alert('Please provide Start Time and End Time for Party/Event');
        return;
      }
      if (!editFormData.phoneNumber || !/^[0-9]{10}$/.test(editFormData.phoneNumber)) {
        alert('Please provide a valid 10-digit phone number');
        return;
      }
    }

    if (parseInt(editFormData.duration) < 1) {
      alert('Duration must be at least 1 day');
      return;
    }

    if (parseFloat(editFormData.unitPrice) <= 0) {
      alert('Unit price must be greater than 0');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/logs/${editingId}`, editFormData);

      setEditingId(null);
      setEditFormData({});
      fetchLogs();
      fetchRooms();
    } catch (error) {
      console.error('Error updating log:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update log entry';
      alert(errorMsg);
    }
  };

  // Open Confirmation Modal
  const openConfirmModal = (type, id = null) => {
    setConfirmModal({
      isOpen: true,
      type,
      id,
      step: 1
    });
  };

  // Handle Confirmation Logic
  const handleConfirmAction = async () => {
    // For Archive: First step is CSV Download
    if (confirmModal.type === 'archive' && confirmModal.step === 1) {
      downloadCSV();
      setConfirmModal(prev => ({ ...prev, step: 2 }));
      return;
    }

    if (confirmModal.step === 1) {
      setConfirmModal(prev => ({ ...prev, step: 2 }));
      return;
    }

    // Execute Action on Step 2
    try {
      if (confirmModal.type === 'checkout') {
        await axios.put(`http://localhost:5000/api/logs/${confirmModal.id}/checkout`);
      } else if (confirmModal.type === 'delete') {
        await axios.delete(`http://localhost:5000/api/logs/${confirmModal.id}`);
      } else if (confirmModal.type === 'archive') {
        await axios.delete('http://localhost:5000/api/logs/reset-month');
      }

      fetchLogs();
      fetchRooms();
      setConfirmModal({ isOpen: false, type: null, id: null, step: 1 });
    } catch (error) {
      console.error(`Error processing ${confirmModal.type}:`, error);
      alert(`Failed to ${confirmModal.type}`);
      setConfirmModal({ isOpen: false, type: null, id: null, step: 1 });
    }
  };

  const handleCheckoutClick = (id) => {
    openConfirmModal('checkout', id);
  };

  const handleDeleteClick = (id) => {
    openConfirmModal('delete', id);
  };

  const handleArchiveClick = () => {
    openConfirmModal('archive');
  };

  // CSV Export
  const downloadCSV = () => {
    if (logs.length === 0) {
      alert('No logs to export');
      return;
    }

    const headers = ['Date', 'Source', 'Category', 'Room No', 'Customer Name', 'Description', 'Start Time', 'End Time', 'Units', 'Days', 'Unit Price', 'Total Amount', 'Status'];

    const rows = logs.map(log => [
      new Date(log.date).toLocaleDateString('en-CA'),
      log.source,
      log.category,
      log.roomNumber || '-',
      log.customerName || '-',
      `"${log.description || ''}"`,
      log.startTime || '-',
      log.endTime || '-',
      log.units,
      log.duration,
      log.unitPrice,
      log.totalAmount,
      log.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rudraksh_Logbook_${new Date().toLocaleDateString('en-CA')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Room': return 'bg-success-green/10 text-success-green border-success-green/20';
      case 'Restaurant': return 'bg-info-navy/10 text-info-navy border-info-navy/20';
      case 'Party/Event': return 'bg-alert-amber/10 text-alert-amber border-alert-amber/20';
      default: return 'bg-pale-champagne text-deep-charcoal';
    }
  };

  const dateStatus = getDateStatus();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ... (previous code)

  // Calculate Pagination
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-warm-cream p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="text-champagne-gold" size={32} />
            <h1 className="text-3xl font-playfair font-bold text-deep-charcoal">
              Digital Logbook
            </h1>
          </div>
          <p className="text-rich-espresso font-lato">
            High-Speed Property Management Ledger
          </p>
        </motion.div>

        {/* Quick Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 border-2 border-champagne-gold/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <Plus className="text-champagne-gold" size={20} />
            <h2 className="text-lg md:text-xl font-playfair font-bold text-deep-charcoal">
              Quick Entry
            </h2>
          </div>

          <form onSubmit={editingId ? handleUpdateLog : handleCreateLog}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1 flex justify-between">
                  Date
                  {dateStatus && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${dateStatus.color} font-bold`}>
                      {dateStatus.label}
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  value={editingId ? (editFormData.date ? new Date(editFormData.date).toISOString().split('T')[0] : '') : formData.date}
                  onChange={(e) => editingId ? handleEditInputChange('date', e.target.value) : handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Source
                </label>
                <select
                  value={editingId ? editFormData.source : formData.source}
                  onChange={(e) => editingId ? handleEditInputChange('source', e.target.value) : handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                >
                  <option value="MMT">MMT</option>
                  <option value="Goibibo">Goibibo</option>
                  <option value="Booking.com">Booking.com</option>
                  <option value="Call">Call</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Category
                </label>
                <select
                  value={editingId ? editFormData.category : formData.category}
                  onChange={(e) => editingId ? handleEditInputChange('category', e.target.value) : handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                >
                  <option value="Room">Room</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Party/Event">Party/Event</option>
                </select>
              </div>

              {/* Room Number (Only for Room category) */}
              {(editingId ? editFormData.category : formData.category) === 'Room' ? (
                <div>
                  <label className="block text-sm font-medium text-deep-charcoal mb-1">
                    Room Number
                  </label>
                  <select
                    value={editingId ? editFormData.roomNumber : formData.roomNumber}
                    onChange={(e) => editingId ? handleEditInputChange('roomNumber', e.target.value) : handleInputChange('roomNumber', e.target.value)}
                    className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room._id} value={room.roomNumber}>
                        {room.roomNumber} - {room.type} ({room.status})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Description (For non-Room categories) */
                <div>
                  <label className="block text-sm font-medium text-deep-charcoal mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingId ? editFormData.description : formData.description}
                    onChange={(e) => editingId ? handleEditInputChange('description', e.target.value) : handleInputChange('description', e.target.value)}
                    placeholder="e.g., Dinner Party"
                    className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                  />
                </div>
              )}

              {/* Customer Name (Only for Room category) */}
              {(editingId ? editFormData.category : formData.category) === 'Room' && (
                <div>
                  <label className="block text-sm font-medium text-deep-charcoal mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editingId ? editFormData.customerName : formData.customerName}
                    onChange={(e) => editingId ? handleEditInputChange('customerName', e.target.value) : handleInputChange('customerName', e.target.value)}
                    placeholder="Guest Name"
                    className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                  />
                </div>
              )}

              {/* Phone Number (Only for Room and Party/Event categories) */}
              {((editingId ? editFormData.category : formData.category) === 'Room' ||
                (editingId ? editFormData.category : formData.category) === 'Party/Event') && (
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editingId ? editFormData.phoneNumber : formData.phoneNumber}
                      onChange={(e) => editingId ? handleEditInputChange('phoneNumber', e.target.value) : handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Contact Number"
                      className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                    />
                  </div>
                )}

              {/* Event Times (Only for Event category) */}
              {(editingId ? editFormData.category : formData.category) === 'Party/Event' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-1">Start Time</label>
                    <input
                      type="time"
                      value={editingId ? editFormData.startTime : formData.startTime}
                      onChange={(e) => editingId ? handleEditInputChange('startTime', e.target.value) : handleInputChange('startTime', e.target.value)}
                      className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-1">End Time</label>
                    <input
                      type="time"
                      value={editingId ? editFormData.endTime : formData.endTime}
                      onChange={(e) => editingId ? handleEditInputChange('endTime', e.target.value) : handleInputChange('endTime', e.target.value)}
                      className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                    />
                  </div>
                </>
              )}

              {/* Units */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Units
                </label>
                <input
                  type="number"
                  value={editingId ? editFormData.units : formData.units}
                  onChange={(e) => editingId ? handleEditInputChange('units', parseInt(e.target.value) || 1) : handleInputChange('units', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                />
              </div>

              {/* Duration (Days) */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Days
                </label>
                <input
                  type="number"
                  value={editingId ? editFormData.duration : formData.duration}
                  onChange={(e) => editingId ? handleEditInputChange('duration', parseInt(e.target.value) || 1) : handleInputChange('duration', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Unit Price (₹)
                </label>
                <input
                  type="number"
                  value={editingId ? editFormData.unitPrice : formData.unitPrice}
                  onChange={(e) => editingId ? handleEditInputChange('unitPrice', parseFloat(e.target.value) || 0) : handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-3 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm touch-target"
                  required
                />
              </div>

              {/* Total (Read-only, Auto-calculated) */}
              <div>
                <label className="block text-sm font-medium text-champagne-gold mb-1">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={editingId
                    ? `₹${((editFormData.units || 1) * (editFormData.duration || 1) * (editFormData.unitPrice || 0)).toLocaleString('en-IN')}`
                    : `₹${calculatedTotal.toLocaleString('en-IN')}`}
                  readOnly
                  className="w-full px-3 py-3 border-2 border-champagne-gold bg-champagne-gold/10 rounded-lg text-sm font-bold text-deep-charcoal touch-target"
                />
              </div>
            </div>

            {/* Save/Update Button */}
            <div className="flex gap-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3 bg-champagne-gold text-deep-charcoal font-lato font-semibold rounded-lg hover:bg-champagne-gold/90 transition-colors flex items-center justify-center gap-2 touch-target"
              >
                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                {editingId ? 'Update Entry' : 'Save Entry'}
              </motion.button>
              {editingId && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-200 text-deep-charcoal font-lato font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Logbook Table/Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 bg-deep-charcoal border-b border-pale-champagne">
            <h2 className="text-lg font-playfair font-bold text-warm-cream flex items-center gap-2">
              <TrendingUp size={20} className="text-champagne-gold" />
              All Entries ({logs.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-rich-espresso">
              Loading entries...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-rich-espresso">
              No entries yet. Create your first entry above!
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden">
                <div className="p-4 space-y-4">
                  <AnimatePresence>
                    {currentLogs.map((log) => (
                      <motion.div
                        key={log._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-warm-cream border-2 border-pale-champagne rounded-lg overflow-hidden shadow-md"
                      >
                        {/* Card Header - Category Badge + Total */}
                        <div className="bg-pale-champagne p-3 flex items-center justify-between border-b border-champagne-gold/20">
                          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${getCategoryBadgeClass(log.category)}`}>
                            {log.category}
                          </span>
                          <div className="text-right">
                            <div className="text-xs text-rich-espresso font-medium">Total</div>
                            <div className="text-lg font-bold text-champagne-gold">
                              ₹{log.totalAmount.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-3">
                          {/* Date + Status */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-deep-charcoal font-medium">
                              {formatDate(log.date)}
                            </div>
                            {(() => {
                              const derivedStatus = getDerivedStatus(log, settings?.defaultCheckInTime || '12:00');
                              return (
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${derivedStatus.color}`}>
                                  {derivedStatus.label}
                                </span>
                              );
                            })()}
                          </div>

                          {/* Details */}
                          <div className="space-y-2">
                            {log.category === 'Room' ? (
                              <>
                                <div className="text-base font-bold text-deep-charcoal">
                                  Room {log.roomNumber}
                                </div>
                                <div className="text-sm text-rich-espresso">
                                  {log.customerName}
                                </div>
                              </>
                            ) : (
                              <div className="text-base font-bold text-deep-charcoal">
                                {log.description}
                                {log.category === 'Party/Event' && log.startTime && (
                                  <div className="text-xs text-soft-taupe flex items-center gap-1 mt-1 font-normal">
                                    <Clock size={12} />
                                    {log.startTime} - {log.endTime}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Source Badge */}
                          <div>
                            <span className="inline-block px-2 py-1 bg-info-navy/10 text-info-navy rounded text-xs font-medium">
                              {log.source}
                            </span>
                          </div>

                          {/* Calculation Details */}
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-pale-champagne">
                            <div className="text-center">
                              <div className="text-xs text-soft-taupe">Units</div>
                              <div className="text-sm font-bold text-deep-charcoal">{log.units}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-soft-taupe">Days</div>
                              <div className="text-sm font-bold text-deep-charcoal">{log.duration}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-soft-taupe">Unit Price</div>
                              <div className="text-sm font-bold text-deep-charcoal">
                                ₹{log.unitPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons - Touch-Friendly */}
                          <div className="flex gap-2 pt-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStartEdit(log)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-info-navy/10 text-info-navy font-semibold rounded-lg hover:bg-info-navy/20 transition-colors touch-target"
                            >
                              <Edit2 size={18} />
                              <span>Edit</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDeleteClick(log._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-error-burgundy/10 text-error-burgundy font-semibold rounded-lg hover:bg-error-burgundy/20 transition-colors touch-target"
                            >
                              <Trash2 size={18} />
                              <span>Delete</span>
                            </motion.button>
                            {(log.category === 'Room' || log.category === 'Party/Event') && log.status !== 'Completed' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCheckoutClick(log._id)}
                                className="flex items-center justify-center gap-1 px-3 py-3 bg-champagne-gold text-deep-charcoal font-semibold rounded-lg hover:bg-muted-gold transition-colors touch-target"
                                title={log.category === 'Room' ? 'Check-out' : 'Finish Event'}
                              >
                                <span className="text-sm">{log.category === 'Room' ? 'Out' : 'Finish'}</span>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-pale-champagne">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-deep-charcoal border border-pale-champagne">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-deep-charcoal border border-pale-champagne">Source</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-deep-charcoal border border-pale-champagne">Category</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-deep-charcoal border border-pale-champagne">Details</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-deep-charcoal border border-pale-champagne">Status</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-deep-charcoal border border-pale-champagne">Units</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-deep-charcoal border border-pale-champagne">Days</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-deep-charcoal border border-pale-champagne">Unit Price</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-champagne-gold border border-pale-champagne">Total</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-deep-charcoal border border-pale-champagne">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {currentLogs.map((log, index) => (
                        <motion.tr
                          key={log._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-warm-cream/30'} hover:bg-pale-champagne/50 transition-colors`}
                        >
                          <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne whitespace-nowrap">
                            {formatDate(log.date)}
                          </td>
                          <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne">
                            <span className="inline-block px-2 py-1 bg-info-navy/10 text-info-navy rounded text-xs font-medium">
                              {log.source}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getCategoryBadgeClass(log.category)}`}>
                              {log.category}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne">
                            {log.category === 'Room' ? (
                              <div>
                                <span className="font-bold">Room {log.roomNumber}</span>
                                <div className="text-rich-espresso/70">{log.customerName}</div>
                              </div>
                            ) : (
                              <div>
                                {log.description}
                                {log.category === 'Party/Event' && log.startTime && (
                                  <div className="text-[10px] text-soft-taupe flex items-center gap-1 mt-1">
                                    <Clock size={10} />
                                    {log.startTime} - {log.endTime}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-center border border-pale-champagne">
                            {(() => {
                              const derivedStatus = getDerivedStatus(log, settings?.defaultCheckInTime || '12:00');
                              return (
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${derivedStatus.color}`}>
                                  {derivedStatus.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne text-center">
                            {log.units}
                          </td>
                          <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne text-center">
                            {log.duration}
                          </td>
                          <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne text-right">
                            ₹{log.unitPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="px-3 py-2 text-xs font-bold text-champagne-gold border border-pale-champagne text-right">
                            ₹{log.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-3 py-2 border border-pale-champagne text-center">
                            <div className="flex items-center justify-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleStartEdit(log)}
                                className="p-1 text-info-navy hover:bg-info-navy/10 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteClick(log._id)}
                                className="p-1 text-error-burgundy hover:bg-error-burgundy/10 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </motion.button>

                              {(log.category === 'Room' || log.category === 'Party/Event') && log.status !== 'Completed' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleCheckoutClick(log._id)}
                                  className="p-1 ml-2 text-info-navy hover:bg-info-navy/10 rounded transition-colors"
                                  title={log.category === 'Room' ? 'Check-out' : 'Finish Event'}
                                >
                                  <span className="text-xs font-bold border border-info-navy px-1 rounded">{log.category === 'Room' ? 'Out' : 'Finish'}</span>
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-6 border-t border-pale-champagne mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-pale-champagne rounded-lg text-deep-charcoal font-medium hover:bg-pale-champagne/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-rich-espresso font-lato">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-pale-champagne rounded-lg text-deep-charcoal font-medium hover:bg-pale-champagne/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-charcoal/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full border border-champagne-gold"
            >
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="text-alert-amber mb-4" size={48} />
                <h3 className="text-xl font-playfair font-bold text-deep-charcoal mb-2">
                  {confirmModal.step === 1 ? 'Are you sure?' : 'Double Confirmation'}
                </h3>
                <p className="text-rich-espresso font-lato mb-6">
                  {confirmModal.type === 'archive' && confirmModal.step === 1 ? (
                    'We will export a CSV of all current data first. Then, proceed to clean the month?'
                  ) : confirmModal.type === 'archive' && confirmModal.step === 2 ? (
                    <span className="text-error-burgundy font-bold">WARNING: This will delete ALL non-active room logs. This cannot be undone.</span>
                  ) : (
                    confirmModal.step === 1
                      ? `You are about to ${confirmModal.type === 'checkout' ? 'Check-out' : 'Delete'} this entry.`
                      : 'This action is irreversible. Please confirm again.'
                  )}
                </p>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setConfirmModal({ isOpen: false, type: null, id: null, step: 1 })}
                    className="flex-1 py-3 border border-pale-champagne rounded-lg text-rich-espresso font-semibold hover:bg-soft-ivory transition-colors touch-target"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className={`flex-1 py-3 rounded-lg text-white font-semibold transition-colors touch-target ${confirmModal.type === 'delete' || confirmModal.type === 'archive' ? 'bg-error-burgundy hover:bg-error-burgundy/90' : 'bg-info-navy hover:bg-info-navy/90'
                      }`}
                  >
                    {confirmModal.step === 1 && confirmModal.type !== 'archive' ? 'Proceed' : 'Confirm'}
                    {confirmModal.type === 'archive' && confirmModal.step === 1 ? 'Export & Proceed' : ''}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLogbook;
