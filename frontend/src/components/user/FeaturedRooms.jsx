import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import axios from 'axios';

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/rooms');

        // Access nested data structure
        const roomsArray = response.data.data || [];

        // Filter for featured rooms, sort by room number, and limit to 3
        const featuredRooms = roomsArray
          .filter(room => room.isFeatured === true)
          .sort((a, b) => a.roomNumber - b.roomNumber)
          .slice(0, 3);

        setRooms(featuredRooms);
      } catch (err) {
        console.error('Error fetching featured rooms:', err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-12 md:py-20 bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-champagne-gold/10 border border-champagne-gold/30 rounded-full px-6 py-2 mb-4">
            <span className="text-champagne-gold font-lato text-sm uppercase tracking-wider font-bold">
              Luxury Accommodations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-deep-charcoal mb-4">
            Featured Rooms & Suites
          </h2>
          <p className="text-lg text-rich-espresso font-lato max-w-2xl mx-auto">
            Discover our meticulously designed rooms, each offering a unique blend of comfort and elegance
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-primary h-96 animate-pulse bg-pale-champagne"></div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          /* No Featured Rooms Message */
          <div className="text-center py-12">
            <p className="text-xl text-rich-espresso font-cormorant italic">
              Explore our signature sanctuaries
            </p>
            <Link to="/rooms" className="inline-block mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-10 py-4"
              >
                View All Rooms
              </motion.button>
            </Link>
          </div>
        ) : (
          <>
            {/* Rooms Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {rooms.map((room) => (
                <motion.div
                  key={room._id}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="card-primary overflow-hidden h-full flex flex-col">
                    {/* Room Image */}
                    <div className="relative h-72 overflow-hidden bg-gradient-to-br from-rich-espresso to-deep-charcoal">
                      {room.images && room.images.length > 0 ? (
                        <motion.img
                          src={room.images[0]}
                          alt={room.type}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          whileHover={{ scale: 1.05 }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-warm-cream font-playfair text-2xl font-bold">
                              {room.type}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-transparent to-transparent" />

                      {/* Wood accent border */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-champagne-gold to-transparent" />
                    </div>

                    {/* Room Details */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Room Number & Type */}
                      <div className="mb-4">
                        <div className="text-sm text-champagne-gold font-lato font-semibold mb-1">
                          Sanctuary {room.roomNumber}
                        </div>
                        <h3 className="text-2xl font-playfair font-bold text-deep-charcoal">
                          {room.type}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-rich-espresso font-lato mb-6 flex-grow leading-relaxed">
                        {room.description}
                      </p>

                      {/* Capacity */}
                      <div className="flex items-center gap-2 mb-6 pb-6 border-b border-pale-champagne">
                        <Users className="text-champagne-gold" size={20} />
                        <span className="text-sm text-rich-espresso font-lato">
                          Up to {room.capacity} Guests
                        </span>
                      </div>

                      {/* CTA Button - Link to Room Details */}
                      <Link to={`/rooms/${room._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn-primary w-full flex items-center justify-center space-x-2 group-hover:shadow-gold"
                        >
                          <span>View Details</span>
                          <ArrowRight size={18} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Rooms CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link to="/rooms">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-10 py-4"
                >
                  View All Rooms
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedRooms;
