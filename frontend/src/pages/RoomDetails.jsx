import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import RoomGallery from '../components/shared/RoomGallery';
import { ArrowLeft, CheckCircle, MessageCircle } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const RoomDetails = () => {
  useScrollToTop();
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // Generate WhatsApp message with room details
  const getWhatsAppLink = () => {
    if (!room) return '#';
    const message = `Hi, I am interested in booking Room ${room.roomNumber} (${room.type}) at Rudraksh Inn.`;
    return `https://wa.me/919635553346?text=${encodeURIComponent(message)}`;
  };

  // Check if room is unavailable (Booked or Maintenance)
  const isUnavailable = room?.status === 'Booked' || room?.status === 'Maintenance';

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-ivory pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-champagne-gold mx-auto mb-4"></div>
          <p className="text-xl font-playfair text-deep-charcoal">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-soft-ivory pt-32 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-2xl font-playfair text-deep-charcoal mb-4">
            {error || 'Room not found'}
          </p>
          <Link to="/rooms" className="btn-primary inline-flex items-center space-x-2">
            <ArrowLeft size={20} />
            <span>Back to Rooms</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-ivory pt-32">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          to="/rooms" 
          className="inline-flex items-center space-x-2 text-champagne-gold hover:text-muted-gold transition-colors font-lato"
        >
          <ArrowLeft size={20} />
          <span>Back to All Rooms</span>
        </Link>
      </div>

      {/* Room Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <RoomGallery images={room.images || []} />
      </div>

      {/* Room Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Room Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-playfair font-bold text-deep-charcoal mb-2">
                    {room.type} Room
                  </h1>
                  <p className="text-xl text-rich-espresso font-lato">
                    Room {room.roomNumber}
                  </p>
                </div>
                
                {/* Status Badge */}
                {room.status === 'Available' ? (
                  <div className="flex items-center space-x-2 bg-green-500/10 text-green-700 px-4 py-2 rounded-full font-lato font-medium">
                    <CheckCircle size={20} />
                    <span>Available</span>
                  </div>
                ) : room.status === 'Booked' ? (
                  <div className="flex items-center space-x-2 bg-red-500/10 text-red-700 px-4 py-2 rounded-full font-lato font-medium">
                    <span>Currently Booked</span>
                  </div>
                ) : room.status === 'Maintenance' ? (
                  <div className="flex items-center space-x-2 bg-gray-500/10 text-gray-700 px-4 py-2 rounded-full font-lato font-medium">
                    <span>Under Maintenance</span>
                  </div>
                ) : null}
              </div>
            </motion.div>

            {/* Description */}
            {room.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-playfair font-bold text-deep-charcoal mb-4">
                  Description
                </h2>
                <p className="text-rich-espresso font-lato leading-relaxed">
                  {room.description}
                </p>
              </motion.div>
            )}

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-playfair font-bold text-deep-charcoal mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-pale-champagne px-4 py-3 rounded-lg"
                    >
                      <CheckCircle size={16} className="text-champagne-gold flex-shrink-0" />
                      <span className="text-sm font-lato text-charcoal-gray">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-luxury p-6 sticky top-36"
            >
              <h3 className="text-2xl font-playfair font-bold text-deep-charcoal mb-4">
                Ready to Book?
              </h3>
              <p className="text-rich-espresso font-lato mb-6">
                Contact us directly to check availability and get the best rates for your stay.
              </p>

              {/* WhatsApp Button */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-primary flex items-center justify-center space-x-2 w-full mb-3 ${
                  isUnavailable ? 'opacity-50 grayscale pointer-events-none' : ''
                }`}
              >
                <MessageCircle size={20} />
                <span>
                  {isUnavailable
                    ? (room.status === 'Maintenance' ? 'Under Maintenance' : 'Currently Occupied')
                    : 'Book via WhatsApp'
                  }
                </span>
              </a>

              {/* Contact Button */}
              <Link
                to="/contact"
                className={`btn-secondary flex items-center justify-center space-x-2 w-full ${
                  isUnavailable ? 'opacity-50 grayscale pointer-events-none' : ''
                }`}
              >
                <span>
                  {isUnavailable
                    ? (room.status === 'Maintenance' ? 'Under Maintenance' : 'Currently Occupied')
                    : 'Contact to Reserve'
                  }
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button (Mobile) */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 lg:hidden bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-luxury-hover transition-all duration-300 z-50 ${
          isUnavailable ? 'opacity-50 grayscale pointer-events-none' : ''
        }`}
        aria-label="Book via WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default RoomDetails;
