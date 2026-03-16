import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

const RoomCard = ({ room }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get main image (first image in array) - database uses 'images' field
  const mainImage = room.images && room.images.length > 0 ? room.images[0] : null;

  // Check if room is unavailable (Booked or Maintenance)
  const isUnavailable = room.status === 'Booked' || room.status === 'Maintenance';

  // WhatsApp message with room number
  const getWhatsAppLink = () => {
    const message = `Hi, I am interested in Room ${room.roomNumber}.`;
    return `https://wa.me/919635553346?text=${encodeURIComponent(message)}`;
  };

  return (
    <Link to={`/rooms/${room._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-300 h-full flex flex-col"
      >
        {/* Image Container with Hover Zoom */}
        <div className="block relative h-64 overflow-hidden group">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-warm-cream animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-warm-cream via-pale-champagne to-warm-cream animate-shimmer"></div>
            </div>
          )}

          {/* Room Image */}
          {mainImage ? (
            <img
              src={mainImage}
              alt={`${room.type} - ${room.roomNumber}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-warm-cream flex items-center justify-center">
              <span className="text-charcoal-gray">No Image Available</span>
            </div>
          )}

          {/* Status Badge Overlay */}
          <div className="absolute top-4 right-4">
            {room.status === 'Available' ? (
              <div className="flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-lato font-medium">
                <CheckCircle size={14} />
                <span>Available</span>
              </div>
            ) : room.status === 'Booked' ? (
              <div className="flex items-center space-x-1 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-lato font-medium">
                <XCircle size={14} />
                <span>Booked</span>
              </div>
            ) : room.status === 'Maintenance' ? (
              <div className="flex items-center space-x-1 bg-gray-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-lato font-medium">
                <XCircle size={14} />
                <span>Under Maintenance</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Room Type */}
          <h3 className="text-2xl font-playfair font-bold text-deep-charcoal mb-2">
            {room.type}
          </h3>

          {/* Room Number */}
          <p className="text-sm text-rich-espresso mb-4 font-lato">
            Room {room.roomNumber}
          </p>

          {/* Amenities Preview (first 2 only) */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.slice(0, 2).map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs bg-pale-champagne text-charcoal-gray px-2 py-1 rounded-full font-lato"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 2 && (
                <span className="text-xs text-muted-gold font-lato">
                  +{room.amenities.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-pale-champagne">
            {/* View Booking Options (Google Search) */}
            <motion.a
              href="https://www.google.com/search?q=rudraksh+inn+durgapur"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={!isUnavailable ? { scale: 1.02 } : {}}
              whileTap={!isUnavailable ? { scale: 0.98 } : {}}
              className={`btn-primary flex items-center justify-center space-x-2 text-sm px-4 py-3 min-h-[44px] w-full relative overflow-hidden group ${isUnavailable ? 'opacity-50 grayscale pointer-events-none' : ''
                }`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{
                  x: '100%',
                  transition: { duration: 0.6, ease: 'easeInOut' }
                }}
              />
              <span className="relative z-10">
                {isUnavailable
                  ? (room.status === 'Maintenance' ? 'Under Maintenance' : 'Currently Occupied')
                  : 'View Booking Options'
                }
              </span>
              <ArrowRight size={16} className="relative z-10" />
            </motion.a>

            {/* Contact to Reserve */}
            <Link
              to="/contact"
              onClick={(e) => e.stopPropagation()}
              className={isUnavailable ? 'pointer-events-none' : ''}
            >
              <motion.button
                whileHover={!isUnavailable ? { scale: 1.02 } : {}}
                whileTap={!isUnavailable ? { scale: 0.98 } : {}}
                className={`btn-secondary flex items-center justify-center space-x-2 text-sm px-4 py-3 min-h-[44px] w-full ${isUnavailable ? 'opacity-50 grayscale' : ''
                  }`}
              >
                <span>
                  {isUnavailable
                    ? (room.status === 'Maintenance' ? 'Under Maintenance' : 'Currently Occupied')
                    : 'Contact to Reserve'
                  }
                </span>
                <ArrowRight size={16} />
              </motion.button>
            </Link>

            {/* WhatsApp Inquiry - Luxury Theme */}
            <motion.a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={!isUnavailable ? { scale: 1.02 } : {}}
              whileTap={!isUnavailable ? { scale: 0.98 } : {}}
              className={`flex items-center justify-center space-x-2 border-2 border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-white px-4 py-3 min-h-[44px] rounded-lg transition-colors duration-300 font-lato text-sm font-medium w-full ${isUnavailable ? 'opacity-50 grayscale pointer-events-none' : ''
                }`}
            >
              <MessageCircle size={16} />
              <span>
                {isUnavailable
                  ? (room.status === 'Maintenance' ? 'Under Maintenance' : 'Currently Occupied')
                  : 'WhatsApp Inquiry'
                }
              </span>
            </motion.a>
          </div>
        </div>

        {/* Shimmer Animation CSS */}
        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </motion.div>
    </Link>
  );
};

export default RoomCard;
