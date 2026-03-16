import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import RoomCard from '../components/shared/RoomCard';

const Rooms = () => {
  const [rooms, setRooms] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/rooms');
        // API returns { success, count, data: [rooms], page, pages, total }
        setRooms((response.data.data || []).sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))); // Extract rooms and sort numerically
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);


  return (
    <div className="min-h-screen bg-soft-ivory pt-32">{/* Added pt-32 for navbar clearance */}
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-warm-cream border-b border-pale-champagne"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-playfair font-bold text-deep-charcoal mb-4 tracking-tight"
          >
            Our Sanctuaries
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-rich-espresso font-lato max-w-2xl mx-auto"
          >
            Discover your perfect retreat. Each room is thoughtfully designed to provide the ultimate in comfort and luxury.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8"
          >
            <p className="font-lato">{error}</p>
          </motion.div>
        )}

        {/* Loading State - Shimmer Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-luxury"
              >
                {/* Image Skeleton */}
                <div className="h-64 bg-warm-cream animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-warm-cream via-pale-champagne to-warm-cream animate-shimmer"></div>
                </div>
                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-warm-cream rounded animate-pulse"></div>
                  <div className="h-4 bg-warm-cream rounded w-1/2 animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-warm-cream rounded-full w-16 animate-pulse"></div>
                    <div className="h-6 bg-warm-cream rounded-full w-16 animate-pulse"></div>
                    <div className="h-6 bg-warm-cream rounded-full w-16 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-10 bg-warm-cream rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-warm-cream rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !error && rooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {rooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <RoomCard room={room} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results Message - For Search */}
        {!loading && !error && rooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            <div className="bg-gradient-to-br from-champagne-gold/10 via-pale-champagne to-champagne-gold/5 border-2 border-champagne-gold/30 rounded-lg p-8 md:p-12 shadow-luxury">
              <h3 className="text-2xl md:text-3xl font-playfair font-bold text-deep-charcoal mb-4">
                No Available Rooms
              </h3>
              <p className="text-lg text-rich-espresso font-lato mb-8 leading-relaxed">
                We apologize, but no rooms currently match your selection. Please contact us directly for last-minute availability.
              </p>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}


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
    </div>
  );
};

export default Rooms;
