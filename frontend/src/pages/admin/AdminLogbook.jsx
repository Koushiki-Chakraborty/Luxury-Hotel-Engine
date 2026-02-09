import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, Calendar, TrendingUp, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const AdminLogbook = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    source: 'Walk-in',
    category: 'Room',
    roomNumber: '',
    customerName: '',
    description: '',
    units: 1,
    duration: 1,
    unitPrice: 0
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'delete', 'checkout'
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
      // console.log('Rooms fetched:', response.data); 
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchRooms();
  }, []);

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Create new log entry
  const handleCreateLog = async (e) => {
    e.preventDefault();
    
    if (formData.category === 'Room') {
      if (!formData.roomNumber || !formData.customerName) {
        alert('Please provide Room Number and Customer Name');
        return;
      }
    } else {
      if (!formData.description) {
        alert('Please provide description');
        return;
      }
    }



    if (parseInt(formData.duration) < 1) {
      alert('Duration must be at least 1 day');
      return;
    }

    if (formData.unitPrice <= 0) {
      alert('Please provide valid unit price');
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
        description: '',
        units: 1,
        duration: 1,
        unitPrice: 0
      });
      
      // Refresh logs
      // Refresh logs and rooms (status might change)
      fetchLogs();
      fetchRooms();
    } catch (error) {
      console.error('Error creating log:', error);
      alert('Failed to create log entry');
    }
  };

  // Start Editing
  const handleStartEdit = (log) => {
    setEditingId(log._id);
    setEditFormData({ ...log });
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Handle Edit Input Change
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save Edit
  const handleUpdateLog = async () => {
    // Validation
    if (editFormData.category === 'Room' && (!editFormData.roomNumber || !editFormData.customerName)) {
        alert('Room Number and Customer Name are required');
        return;
    }
    if (parseInt(editFormData.duration) < 1) {
        alert('Duration must be at least 1 day');
        return;
    }

    try {
      await axios.put(`http://localhost:5000/api/logs/${editingId}`, editFormData);
      
      setEditingId(null);
      setEditFormData({});
      fetchLogs();
      fetchRooms(); // Update room status if changed
    } catch (error) {
      console.error('Error updating log:', error);
      alert('Failed to update log entry');
    }
  };

  // Open Confirmation Modal
  const openConfirmModal = (type, id) => {
    setConfirmModal({
      isOpen: true,
      type,
      id,
      step: 1
    });
  };

  // Handle Confirmation Logic
  const handleConfirmAction = async () => {
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
      }
      
      // Success
      fetchLogs();
      fetchRooms();
      setConfirmModal({ isOpen: false, type: null, id: null, step: 1 });
    } catch (error) {
      console.error(`Error processing ${confirmModal.type}:`, error);
      alert(`Failed to ${confirmModal.type === 'checkout' ? 'check-out' : 'delete'} entry`);
      setConfirmModal({ isOpen: false, type: null, id: null, step: 1 });
    }
  };

  // Checkout room wrapper
  const handleCheckoutClick = (id) => {
    openConfirmModal('checkout', id);
  };

  // Delete log wrapper
  // CSV Export
  const downloadCSV = () => {
    if (logs.length === 0) {
      alert('No logs to export');
      return;
    }

    // CSV Header
    const headers = ['Date', 'Source', 'Category', 'Room No', 'Customer Name', 'Description', 'Units', 'Days', 'Unit Price', 'Total Amount', 'Status'];
    
    // CSV Rows
    const rows = logs.map(log => [
      new Date(log.date).toLocaleDateString('en-CA'),
      log.source,
      log.category,
      log.roomNumber || '-',
      log.customerName || '-',
      `"${log.description || ''}"`, // Quote description to handle commas
      log.units,
      log.duration,
      log.unitPrice,
      log.totalAmount,
      log.status
    ]);

    // Construct CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Logbook_${new Date().toLocaleDateString('en-CA')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-warm-cream p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-end"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="text-champagne-gold" size={32} />
              <h1 className="text-3xl font-playfair font-bold text-deep-charcoal">
                Digital Logbook
              </h1>
            </div>
            <p className="text-rich-espresso font-lato">
              Manual Property Management System - Track all revenue entries
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-success-green/10 text-success-green border border-success-green/30 rounded-lg hover:bg-success-green/20 transition-colors font-semibold"
          >
            <TrendingUp size={18} />
            Download CSV
          </button>
        </motion.div>

        {/* Quick Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-champagne-gold/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <Plus className="text-champagne-gold" size={20} />
            <h2 className="text-xl font-playfair font-bold text-deep-charcoal">
              Quick Entry
            </h2>
          </div>

          <form onSubmit={handleCreateLog}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
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
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
                >
                  <option value="Room">Room</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Party/Event">Party/Event</option>
                </select>
              </div>

              {/* Room Number (Only for Room category) */}
              {formData.category === 'Room' ? (
                <div>
                  <label className="block text-sm font-medium text-deep-charcoal mb-1">
                    Room Number
                  </label>
                  <select
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
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
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="e.g., Dinner Party"
                    className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
                  />
                </div>
              )}

              {/* Customer Name (Only for Room category) */}
              {formData.category === 'Room' && (
                <div>
                  <label className="block text-sm font-medium text-deep-charcoal mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Guest Name"
                    className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
                  />
                </div>
              )}

              {/* Units */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Units
                </label>
                <input
                  type="number"
                  value={formData.units}
                  onChange={(e) => handleInputChange('units', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
                />
              </div>

              {/* Duration (Days) */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Days
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal mb-1">
                  Unit Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold text-sm"
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
                  value={`₹${calculatedTotal.toLocaleString('en-IN')}`}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-champagne-gold bg-champagne-gold/10 rounded-lg text-sm font-bold text-deep-charcoal"
                />
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto px-6 py-2 bg-champagne-gold text-deep-charcoal font-lato font-semibold rounded-lg hover:bg-champagne-gold/90 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Save Entry
            </motion.button>
          </form>
        </motion.div>

        {/* Logbook Table */}
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
            <div className="overflow-x-auto">
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
                    {logs.map((log, index) => (
                      <motion.tr
                        key={log._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-warm-cream/30'} hover:bg-pale-champagne/50 transition-colors`}
                      >
                        <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne whitespace-nowrap">
                          {editingId === log._id ? (
                            <input 
                              type="date"
                              value={editFormData.date ? editFormData.date.split('T')[0] : ''}
                              onChange={(e) => handleEditInputChange('date', e.target.value)}
                              className="w-full px-1 border rounded"
                            />
                          ) : (
                            formatDate(log.date)
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne">
                          {editingId === log._id ? (
                            <select
                              value={editFormData.source}
                              onChange={(e) => handleEditInputChange('source', e.target.value)}
                              className="w-full px-1 border rounded"
                            >
                               <option value="MMT">MMT</option>
                               <option value="Goibibo">Goibibo</option>
                               <option value="Booking.com">Booking.com</option>
                               <option value="Call">Call</option>
                               <option value="Walk-in">Walk-in</option>
                               <option value="WhatsApp">WhatsApp</option>
                               <option value="Event">Event</option>
                            </select>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-info-navy/10 text-info-navy rounded text-xs font-medium">
                              {log.source}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne">
                          {editingId === log._id ? (
                            <select
                              value={editFormData.category}
                              onChange={(e) => handleEditInputChange('category', e.target.value)}
                              className="w-full px-1 border rounded"
                            >
                              <option value="Room">Room</option>
                              <option value="Restaurant">Restaurant</option>
                              <option value="Party/Event">Party/Event</option>
                            </select>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-success-green/10 text-success-green rounded text-xs font-medium">
                              {log.category}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne">
                          {editingId === log._id ? (
                             editFormData.category === 'Room' ? (
                                <div className="space-y-1">
                                  <select
                                    value={editFormData.roomNumber}
                                    onChange={(e) => handleEditInputChange('roomNumber', e.target.value)}
                                    className="w-full px-1 border rounded"
                                  >
                                    <option value="">Room</option>
                                    {rooms.filter(r => r.status === 'Available' || r.roomNumber === log.roomNumber).map(room => (
                                      <option key={room._id} value={room.roomNumber}>
                                        {room.roomNumber}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="text"
                                    value={editFormData.customerName}
                                    onChange={(e) => handleEditInputChange('customerName', e.target.value)}
                                    className="w-full px-1 border rounded"
                                    placeholder="Guest"
                                  />
                                </div>
                             ) : (
                                <input
                                  type="text"
                                  value={editFormData.description}
                                  onChange={(e) => handleEditInputChange('description', e.target.value)}
                                  className="w-full px-1 border rounded"
                                />
                             )
                          ) : (
                            log.category === 'Room' ? (
                              <div>
                                <span className="font-bold">Room {log.roomNumber}</span>
                                <div className="text-rich-espresso/70">{log.customerName}</div>
                              </div>
                            ) : (
                              log.description
                            )
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-center border border-pale-champagne">
                           <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                             log.status === 'Completed' 
                               ? 'bg-success-green/10 text-success-green' 
                               : 'bg-champagne-gold/20 text-deep-charcoal'
                           }`}>
                            {log.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne text-center">
                          {editingId === log._id ? (
                            <input
                              type="number"
                              value={editFormData.units}
                              onChange={(e) => handleEditInputChange('units', Number(e.target.value))}
                              className="w-12 px-1 border rounded text-center"
                            />
                          ) : (
                            log.units
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne text-center">
                          {editingId === log._id ? (
                            <input
                              type="number"
                              value={editFormData.duration}
                              onChange={(e) => handleEditInputChange('duration', Number(e.target.value))}
                              min="1"
                              className="w-12 px-1 border rounded text-center"
                            />
                          ) : (
                            log.duration
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-deep-charcoal border border-pale-champagne text-right">
                          {editingId === log._id ? (
                            <input
                              type="number"
                              value={editFormData.unitPrice}
                              onChange={(e) => handleEditInputChange('unitPrice', Number(e.target.value))}
                              className="w-20 px-1 border rounded text-right"
                            />
                          ) : (
                            `₹${log.unitPrice.toLocaleString('en-IN')}`
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs font-bold text-champagne-gold border border-pale-champagne text-right">
                          ₹{log.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3 py-2 border border-pale-champagne text-center">
                          {editingId === log._id ? (
                            <div className="flex items-center justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={handleUpdateLog}
                                className="p-1 text-success-green hover:bg-success-green/10 rounded"
                                title="Save"
                              >
                                <Check size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={handleCancelEdit}
                                className="p-1 text-error-burgundy hover:bg-error-burgundy/10 rounded"
                                title="Cancel"
                              >
                                <X size={16} />
                              </motion.button>
                            </div>
                          ) : (
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
                              
                              {/* Checkout Button */}
                              {log.category === 'Room' && log.status !== 'Completed' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleCheckoutClick(log._id)}
                                  className="p-1 ml-2 text-info-navy hover:bg-info-navy/10 rounded transition-colors"
                                  title="Check-out"
                                >
                                  <span className="text-xs font-bold border border-info-navy px-1 rounded">Out</span>
                                </motion.button>
                              )}
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
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
                  {confirmModal.step === 1 
                    ? `You are about to ${confirmModal.type === 'checkout' ? 'Check-out' : 'Delete'} this entry.` 
                    : 'This action is irreversible. Please confirm again.'}
                </p>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setConfirmModal({ isOpen: false, type: null, id: null, step: 1 })}
                    className="flex-1 py-2 border border-pale-champagne rounded-lg text-rich-espresso font-semibold hover:bg-soft-ivory transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className={`flex-1 py-2 rounded-lg text-white font-semibold transition-colors ${
                      confirmModal.type === 'delete' ? 'bg-error-burgundy hover:bg-error-burgundy/90' : 'bg-info-navy hover:bg-info-navy/90'
                    }`}
                  >
                    {confirmModal.step === 1 ? 'Proceed' : 'Confirm'}
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
