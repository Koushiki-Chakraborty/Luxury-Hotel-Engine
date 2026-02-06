import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Building2, TrendingUp, DollarSign, X, Check, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const AdminRooms = () => {
  const { setIsLoading } = useOutletContext();
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, room: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, room: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    price: '',
    originalPrice: '',
    status: 'Available',
    amenities: [],
    description: '',
    images: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenitiesList = [
    'Wi-Fi', 'AC', 'TV', 'Mini Bar', 'Room Service', 
    'Balcony', 'Sea View', 'Bathtub', 'Safe', 'Coffee Maker'
  ];

  // Fetch rooms and stats on mount
  useEffect(() => {
    fetchRoomsAndStats();
  }, []);

  const sortRooms = (roomsToSort) => {
    return [...roomsToSort].sort((a, b) => 
      a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
    );
  };

  const fetchRoomsAndStats = async () => {
    setIsLoading(true);
    try {
      // Fetch rooms
      const roomsResponse = await axios.get('http://localhost:5000/api/rooms');
      setRooms(sortRooms(roomsResponse.data.data || []));

      // Fetch stats
      const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (room) => {
    setDeleteModal({ isOpen: true, room });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.room) return;

    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${deleteModal.room._id}`);
      
      // Remove room from state immediately (optimistic update)
      setRooms(prevRooms => prevRooms.filter(r => r._id !== deleteModal.room._id));
      
      // Refresh stats
      const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(statsResponse.data.data);
      
      setDeleteModal({ isOpen: false, room: null });
      showToast(`Room ${deleteModal.room.roomNumber} deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting room:', error);
      showToast('Failed to delete room. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddRoomClick = () => {
    setAddModal(true);
    setFormData({
      roomNumber: '',
      type: '',
      price: '',
      originalPrice: '',
      status: 'Available',
      amenities: [],
      description: '',
      images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800']
    });
    setFormErrors({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for price vs originalPrice
    if (field === 'price' || field === 'originalPrice') {
      const newFormData = { ...formData, [field]: value };
      
      // Only validate if both fields have valid values
      if (newFormData.price !== '' && newFormData.originalPrice !== '') {
        const price = Number(newFormData.price);
        const originalPrice = Number(newFormData.originalPrice);
        
        if (!isNaN(price) && !isNaN(originalPrice) && price > originalPrice) {
          setFormErrors(prev => ({
            ...prev,
            price: `Current price cannot exceed the original price (₹${originalPrice.toLocaleString('en-IN')})`
          }));
        } else {
          // Clear price error if validation passes
          setFormErrors(prev => ({ ...prev, price: '' }));
        }
      }
    }
    
    // Clear error for other fields
    if (formErrors[field] && field !== 'price') {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.roomNumber.trim()) {
      errors.roomNumber = 'Room number is required';
    }

    if (!formData.type) {
      errors.type = 'Room type is required';
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!formData.originalPrice || formData.originalPrice <= 0) {
      errors.originalPrice = 'Original price must be greater than 0';
    }

    if (formData.price && formData.originalPrice) {
      const price = Number(formData.price);
      const originalPrice = Number(formData.originalPrice);
      
      if (price > originalPrice) {
        errors.price = `Current price cannot exceed the original price (₹${originalPrice.toLocaleString('en-IN')})`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createFormData = () => {
    const data = new FormData();
    data.append('roomNumber', formData.roomNumber);
    data.append('type', formData.type);
    data.append('price', formData.price);
    data.append('originalPrice', formData.originalPrice);
    data.append('status', formData.status);
    data.append('description', formData.description);

    // Append amenities
    formData.amenities.forEach(amenity => {
      data.append('amenities', amenity);
    });

    // Append images
    formData.images.forEach(image => {
      data.append('images', image);
    });

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      const data = createFormData();
      const response = await axios.post('http://localhost:5000/api/rooms', data, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      // Add new room to state and sort
      setRooms(prev => sortRooms([response.data.data, ...prev]));

      // Refresh stats
      const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(statsResponse.data.data);

      // Close modal and show success
      setAddModal(false);
      showToast(`Room ${formData.roomNumber} added successfully!`, 'success');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error adding room:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add room. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (room) => {
    setEditModal({ isOpen: true, room });
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
      originalPrice: room.originalPrice,
      status: room.status,
      amenities: room.amenities || [],
      description: room.description || '',
      images: room.images || []
    });
    setFormErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      const data = createFormData();
      const response = await axios.put(`http://localhost:5000/api/rooms/${editModal.room._id}`, data, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      // Update room in state (optimistic update) and sort
      setRooms(prev => sortRooms(prev.map(r => 
        r._id === editModal.room._id ? response.data.data : r
      )));

      // Refresh stats
      const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(statsResponse.data.data);

      // Close modal and show success
      setEditModal({ isOpen: false, room: null });
      showToast(`Room ${formData.roomNumber} updated successfully!`, 'success');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error updating room:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update room. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-success-green/10 text-success-green border-success-green';
      case 'Booked':
        return 'bg-alert-amber/10 text-alert-amber border-alert-amber';
      case 'Maintenance':
        return 'bg-error-burgundy/10 text-error-burgundy border-error-burgundy';
      default:
        return 'bg-soft-taupe/10 text-soft-taupe border-soft-taupe';
    }
  };

  const isFormValid = formData.roomNumber.trim() && 
                      formData.type && 
                      formData.price > 0 && 
                      formData.originalPrice > 0 &&
                      Number(formData.price) <= Number(formData.originalPrice);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-deep-charcoal">Room Management</h1>
          <p className="text-soft-taupe mt-1">Manage your hotel rooms and availability</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddRoomClick}
          className="flex items-center gap-2 px-6 py-3 bg-champagne-gold text-deep-charcoal font-semibold rounded-lg hover:bg-muted-gold transition-colors shadow-luxury"
        >
          <Plus className="w-5 h-5" />
          ₹ Add New Room
        </motion.button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Rooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-soft-ivory border-2 border-pale-champagne rounded-lg p-6 shadow-luxury"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft-taupe text-sm font-medium">Total Rooms</p>
                <p className="text-3xl font-bold text-deep-charcoal mt-2">{stats.totalRooms}</p>
              </div>
              <div className="w-12 h-12 bg-champagne-gold/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-champagne-gold" />
              </div>
            </div>
          </motion.div>

          {/* Occupancy Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-soft-ivory border-2 border-pale-champagne rounded-lg p-6 shadow-luxury"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft-taupe text-sm font-medium">Occupancy Rate</p>
                <p className="text-3xl font-bold text-deep-charcoal mt-2">{stats.occupancy.rate}%</p>
                <p className="text-xs text-soft-taupe mt-1">
                  {stats.occupancy.occupied} of {stats.occupancy.total} rooms
                </p>
              </div>
              <div className="w-12 h-12 bg-success-green/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-green" />
              </div>
            </div>
          </motion.div>

          {/* Potential Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-soft-ivory border-2 border-pale-champagne rounded-lg p-6 shadow-luxury"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-soft-taupe text-sm font-medium">Current Revenue</p>
                <p className="text-3xl font-bold text-deep-charcoal mt-2">{stats.revenue.totalINR}</p>
                <p className="text-xs text-soft-taupe mt-1">From booked rooms</p>
              </div>
              <div className="w-12 h-12 bg-info-navy/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-info-navy" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rooms Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-soft-ivory border-2 border-pale-champagne rounded-lg shadow-luxury overflow-hidden"
      >
        <div className="p-6 border-b border-pale-champagne">
          <h2 className="text-xl font-playfair font-bold text-deep-charcoal">All Rooms</h2>
        </div>

        {rooms.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-16 h-16 text-soft-taupe mx-auto mb-4" />
            <p className="text-soft-taupe text-lg">No rooms found</p>
            <p className="text-soft-taupe/70 text-sm mt-2">Add your first room to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-cream border-b border-pale-champagne">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Room Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Original Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-deep-charcoal uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pale-champagne">
                <AnimatePresence>
                  {rooms.map((room) => (
                    <motion.tr
                      key={room._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-warm-cream/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-deep-charcoal">{room.roomNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-pale-champagne bg-soft-taupe/10 relative group">
                          {room.images && room.images.length > 0 ? (
                            <img 
                              src={room.images[0]} 
                              alt={`Room ${room.roomNumber}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="absolute inset-0 items-center justify-center bg-soft-ivory" 
                            style={{ display: room.images && room.images.length > 0 ? 'none' : 'flex' }}
                          >
                             <ImageIcon className="w-4 h-4 text-champagne-gold/50" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-soft-taupe">{room.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-deep-charcoal">{room.priceINR}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-soft-taupe line-through">{room.originalPriceINR}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {room.discountPercentage > 0 ? (
                          <span className="text-sm font-semibold text-success-green">
                            {room.discountPercentage}% OFF
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-soft-taupe/10 text-soft-taupe border-soft-taupe">
                            No Discount
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyles(
                            room.status
                          )}`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditClick(room)}
                            className="p-2 text-info-navy hover:bg-info-navy/10 rounded-lg transition-colors"
                            title="Edit Room"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(room)}
                            className="p-2 text-error-burgundy hover:bg-error-burgundy/10 rounded-lg transition-colors"
                            title="Delete Room"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add Room Modal */}
      <AnimatePresence>
        {addModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSubmitting && setAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-soft-ivory border-2 border-pale-champagne rounded-lg shadow-luxury-hover max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-soft-ivory border-b border-pale-champagne p-6 flex items-center justify-between">
                <h3 className="text-2xl font-playfair font-bold text-deep-charcoal">Add New Room</h3>
                <button
                  onClick={() => !isSubmitting && setAddModal(false)}
                  disabled={isSubmitting}
                  className="text-soft-taupe hover:text-deep-charcoal transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-playfair font-semibold text-deep-charcoal border-b border-pale-champagne pb-2">
                    Basic Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Room Number */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Room Number <span className="text-error-burgundy">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => handleFormChange('roomNumber', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.roomNumber ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                        placeholder="e.g., 101"
                      />
                      {formErrors.roomNumber && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.roomNumber}</p>
                      )}
                    </div>

                    {/* Room Type */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Room Type <span className="text-error-burgundy">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleFormChange('type', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.type ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                      >
                        <option value="">Select type</option>
                        <option value="Single">Single</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                      {formErrors.type && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.type}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Price (₹) <span className="text-error-burgundy">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.price ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                        placeholder="5000"
                        min="0"
                      />
                      {formErrors.price && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.price}</p>
                      )}
                    </div>

                    {/* Original Price */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Original Price (₹) <span className="text-error-burgundy">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => handleFormChange('originalPrice', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.originalPrice ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                        placeholder="7000"
                        min="0"
                      />
                      {formErrors.originalPrice && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.originalPrice}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Status <span className="text-error-burgundy">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    >
                      <option value="Available">Available</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-playfair font-semibold text-deep-charcoal border-b border-pale-champagne pb-2">
                    Details & Amenities
                  </h4>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                      rows="3"
                      placeholder="Describe the room..."
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {amenitiesList.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 p-2 border-2 border-pale-champagne rounded-lg cursor-pointer hover:bg-warm-cream transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="w-4 h-4 text-champagne-gold focus:ring-champagne-gold"
                          />
                          <span className="text-sm text-deep-charcoal">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                  {/* Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Room Images
                    </label>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-champagne-gold rounded-lg p-6 text-center hover:bg-warm-cream/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-champagne-gold mx-auto mb-2" />
                      <p className="text-sm font-medium text-deep-charcoal">Click to upload or drag images here</p>
                      <p className="text-xs text-soft-taupe mt-1">Supports JPG, PNG, WEBP</p>
                    </div>

                    {/* Preview Gallery */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group aspect-video bg-soft-taupe/10 rounded-lg overflow-hidden border border-pale-champagne">
                            <img
                              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                              alt={`Room preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-error-burgundy opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                {/* Submit Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-pale-champagne">
                  {isSubmitting && uploadProgress > 0 && (
                     <div className="w-full bg-pale-champagne rounded-full h-2 mb-2 overflow-hidden">
                       <div 
                         className="bg-champagne-gold h-full transition-all duration-300"
                         style={{ width: `${uploadProgress}%` }}
                       />
                     </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAddModal(false)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 border-2 border-pale-champagne text-deep-charcoal font-semibold rounded-lg hover:bg-warm-cream transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="flex-1 px-4 py-3 bg-champagne-gold text-deep-charcoal font-semibold rounded-lg hover:bg-muted-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-deep-charcoal border-t-transparent rounded-full"
                          />
                          {uploadProgress > 0 ? `Uploading Images... ${uploadProgress}%` : 'Uploading Images...'}
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Add Room
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Room Modal */}
      <AnimatePresence>
        {editModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSubmitting && setEditModal({ isOpen: false, room: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-soft-ivory border-2 border-pale-champagne rounded-lg shadow-luxury-hover max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-soft-ivory border-b border-pale-champagne p-6 flex items-center justify-between">
                <h3 className="text-2xl font-playfair font-bold text-deep-charcoal">Edit Room</h3>
                <button
                  onClick={() => !isSubmitting && setEditModal({ isOpen: false, room: null })}
                  disabled={isSubmitting}
                  className="text-soft-taupe hover:text-deep-charcoal transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-playfair font-semibold text-deep-charcoal border-b border-pale-champagne pb-2">
                    Basic Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Room Number */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Room Number <span className="text-error-burgundy">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => handleFormChange('roomNumber', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.roomNumber ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                        placeholder="e.g., 101"
                      />
                      {formErrors.roomNumber && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.roomNumber}</p>
                      )}
                    </div>

                    {/* Room Type */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Room Type <span className="text-error-burgundy">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleFormChange('type', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.type ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                      >
                        <option value="">Select type</option>
                        <option value="Single">Single</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                      {formErrors.type && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.type}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Price (₹) <span className="text-error-burgundy">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.price ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                        placeholder="5000"
                        min="0"
                      />
                      {formErrors.price && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.price}</p>
                      )}
                    </div>

                    {/* Original Price */}
                    <div>
                      <label className="block text-sm font-medium text-deep-charcoal mb-2">
                        Original Price (₹) <span className="text-error-burgundy">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => handleFormChange('originalPrice', e.target.value)}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold ${
                          formErrors.originalPrice ? 'border-error-burgundy' : 'border-pale-champagne'
                        }`}
                        placeholder="7000"
                        min="0"
                      />
                      {formErrors.originalPrice && (
                        <p className="text-error-burgundy text-xs mt-1">{formErrors.originalPrice}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Status <span className="text-error-burgundy">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-playfair font-semibold text-deep-charcoal border-b border-pale-champagne pb-2">
                    Details & Amenities
                  </h4>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-pale-champagne rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                      rows="3"
                      placeholder="Describe the room..."
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {amenitiesList.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 p-2 border-2 border-pale-champagne rounded-lg cursor-pointer hover:bg-warm-cream transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="w-4 h-4 text-champagne-gold focus:ring-champagne-gold"
                          />
                          <span className="text-sm text-deep-charcoal">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                  {/* Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-2">
                      Room Images
                    </label>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-champagne-gold rounded-lg p-6 text-center hover:bg-warm-cream/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-champagne-gold mx-auto mb-2" />
                      <p className="text-sm font-medium text-deep-charcoal">Click to upload or drag images here</p>
                      <p className="text-xs text-soft-taupe mt-1">Supports JPG, PNG, WEBP</p>
                    </div>

                    {/* Preview Gallery */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group aspect-video bg-soft-taupe/10 rounded-lg overflow-hidden border border-pale-champagne">
                            {image ? (
                                <img
                                  src={
                                    typeof image === 'string' 
                                      ? image 
                                      : URL.createObjectURL(image)
                                  }
                                  alt={`Room preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                            ) : null}
                            <div className="absolute inset-0 hidden items-center justify-center bg-soft-ivory" style={{ display: image ? 'none' : 'flex' }}>
                                <ImageIcon className="w-8 h-8 text-champagne-gold/50" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-error-burgundy opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                {/* Submit Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-pale-champagne">
                  {isSubmitting && uploadProgress > 0 && (
                     <div className="w-full bg-pale-champagne rounded-full h-2 mb-2 overflow-hidden">
                       <div 
                         className="bg-champagne-gold h-full transition-all duration-300"
                         style={{ width: `${uploadProgress}%` }}
                       />
                     </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditModal({ isOpen: false, room: null })}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 border-2 border-pale-champagne text-deep-charcoal font-semibold rounded-lg hover:bg-warm-cream transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="flex-1 px-4 py-3 bg-champagne-gold text-deep-charcoal font-semibold rounded-lg hover:bg-muted-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-deep-charcoal border-t-transparent rounded-full"
                          />
                          {uploadProgress > 0 ? `Uploading Images... ${uploadProgress}%` : 'Uploading Images...'}
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isDeleting && setDeleteModal({ isOpen: false, room: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-soft-ivory border-2 border-pale-champagne rounded-lg shadow-luxury-hover max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-playfair font-bold text-deep-charcoal">Confirm Delete</h3>
                <button
                  onClick={() => !isDeleting && setDeleteModal({ isOpen: false, room: null })}
                  disabled={isDeleting}
                  className="text-soft-taupe hover:text-deep-charcoal transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-soft-taupe mb-4">
                  Are you sure you want to delete this room? This action cannot be undone.
                </p>
                {deleteModal.room && (
                  <div className="bg-warm-cream border border-pale-champagne rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-soft-taupe">Room Number:</span>
                      <span className="text-sm font-semibold text-deep-charcoal">
                        {deleteModal.room.roomNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-soft-taupe">Type:</span>
                      <span className="text-sm font-semibold text-deep-charcoal">{deleteModal.room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-soft-taupe">Price:</span>
                      <span className="text-sm font-semibold text-deep-charcoal">
                        {deleteModal.room.priceINR}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, room: null })}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border-2 border-pale-champagne text-deep-charcoal font-semibold rounded-lg hover:bg-warm-cream transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-error-burgundy text-white font-semibold rounded-lg hover:bg-error-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Room
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div
              className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-luxury-hover ${
                toast.type === 'success'
                  ? 'bg-success-green text-white'
                  : 'bg-error-burgundy text-white'
              }`}
            >
              {toast.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRooms;
