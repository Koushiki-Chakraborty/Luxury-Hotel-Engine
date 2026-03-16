import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, X, Save } from 'lucide-react';

const AdminRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fetch existing restaurant data
  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant');
      setRestaurant(response.data.data);
      setExistingImages(response.data.data.images || []);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setMessage({ type: 'error', text: 'Failed to load restaurant data' });
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  // Remove selected file
  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const formData = new FormData();

      // Add existing images as JSON
      formData.append('existingImages', JSON.stringify(existingImages));

      // Add new files
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        'http://localhost:5000/api/restaurant',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Restaurant updated successfully!' });
      setRestaurant(response.data.data);
      setExistingImages(response.data.data.images || []);
      setSelectedFiles([]);
      setPreviewUrls([]);

      // Clear previews
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    } catch (error) {
      console.error('Error updating restaurant:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update restaurant'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle clear all images
  const handleClearGallery = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('existingImages', JSON.stringify([]));

      const response = await axios.put(
        'http://localhost:5000/api/restaurant',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Gallery cleared successfully!' });
      setRestaurant(response.data.data);
      setExistingImages([]);
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing gallery:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to clear gallery'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-deep-charcoal mb-2">
            Restaurant Gallery
          </h1>
          <p className="text-rich-espresso font-lato text-sm md:text-base">
            Upload and manage images for the restaurant gallery
          </p>
        </div>
        {existingImages.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowClearConfirm(true)}
            disabled={loading}
            className="w-full md:w-auto px-4 py-3 bg-error-burgundy text-white rounded-lg hover:bg-error-burgundy/90 transition-colors disabled:opacity-50 font-lato font-medium touch-target"
          >
            Clear Gallery
          </motion.button>
        )}
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-playfair font-bold text-deep-charcoal mb-4">
            Current Images ({existingImages.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Restaurant ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity touch-target shadow-lg"
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-xl font-playfair font-bold text-deep-charcoal mb-4">
          Add New Images
        </h2>

        {/* Dropzone */}
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-champagne-gold border-dashed rounded-lg cursor-pointer bg-pale-champagne hover:bg-warm-cream transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload size={48} className="text-champagne-gold mb-4" />
            <p className="mb-2 text-lg font-lato text-charcoal-gray">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-charcoal-gray font-lato">
              PNG, JPG, WEBP (MAX. 10MB each)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
          />
        </label>

        {/* Preview New Images */}
        {previewUrls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-lato font-semibold text-deep-charcoal mb-3">
              New Images to Upload ({previewUrls.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => removeSelectedFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity touch-target shadow-lg"
                    aria-label="Remove preview"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading || (selectedFiles.length === 0 && existingImages.length === restaurant?.images?.length)}
          className="w-full md:w-auto btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
        >
          <Save size={20} />
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </motion.button>
      </div>

      {/* Clear Gallery Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-soft-ivory border-2 border-pale-champagne rounded-lg shadow-luxury-hover p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-playfair font-bold text-deep-charcoal mb-4">
              Clear Gallery?
            </h3>
            <p className="text-rich-espresso font-lato mb-6">
              This will permanently delete all restaurant images from the gallery. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-pale-champagne text-deep-charcoal rounded-lg hover:bg-warm-cream transition-colors disabled:opacity-50 font-lato font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearGallery}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-error-burgundy text-white rounded-lg hover:bg-error-burgundy/90 transition-colors disabled:opacity-50 font-lato font-medium"
              >
                {loading ? 'Clearing...' : 'Clear All'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurant;
