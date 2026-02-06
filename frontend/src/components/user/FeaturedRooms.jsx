import { motion } from 'framer-motion';
import { Bed, Users, Maximize, Wifi, Coffee, Tv, ArrowRight } from 'lucide-react';

const FeaturedRooms = () => {
  const rooms = [
    {
      id: 1,
      type: 'Deluxe Room',
      price: 8999,
      image: 'deluxe',
      size: '350 sq ft',
      guests: 2,
      beds: '1 King Bed',
      amenities: ['Free WiFi', 'Smart TV', 'Mini Bar', 'City View'],
      description: 'Elegant comfort with modern amenities and stunning city views.',
    },
    {
      id: 2,
      type: 'Executive Suite',
      price: 15999,
      image: 'suite',
      size: '600 sq ft',
      guests: 3,
      beds: '1 King + Sofa Bed',
      amenities: ['Free WiFi', 'Smart TV', 'Kitchenette', 'Balcony'],
      description: 'Spacious luxury with separate living area and premium facilities.',
      featured: true,
    },
    {
      id: 3,
      type: 'Presidential Suite',
      price: 29999,
      image: 'presidential',
      size: '1200 sq ft',
      guests: 4,
      beds: '2 King Beds',
      amenities: ['Free WiFi', 'Home Theater', 'Butler Service', 'Panoramic View'],
      description: 'Ultimate luxury experience with exclusive amenities and services.',
    },
  ];

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

  // Generate gradient background for room cards
  const getRoomGradient = (type) => {
    const gradients = {
      deluxe: 'from-rich-espresso to-deep-charcoal',
      suite: 'from-deep-charcoal via-rich-espresso to-deep-charcoal',
      presidential: 'from-champagne-gold/20 via-deep-charcoal to-rich-espresso',
    };
    return gradients[type] || gradients.deluxe;
  };

  return (
    <section className="py-20 bg-warm-cream">
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
              key={room.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="card-primary overflow-hidden h-full flex flex-col">
                {/* Featured Badge */}
                {room.featured && (
                  <div className="absolute top-4 right-4 z-10 bg-champagne-gold text-deep-charcoal px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                {/* Room Image Placeholder with Gradient */}
                <div className={`relative h-64 bg-gradient-to-br ${getRoomGradient(room.image)} overflow-hidden`}>
                  {/* Decorative pattern overlay */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                  
                  {/* Room type overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Bed className="text-champagne-gold mx-auto mb-2" size={48} />
                      <div className="text-warm-cream font-playfair text-2xl font-bold">
                        {room.type}
                      </div>
                    </div>
                  </div>

                  {/* Wood accent border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-champagne-gold to-transparent" />
                </div>

                {/* Room Details */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-playfair font-bold text-deep-charcoal">
                      {room.type}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-rich-espresso font-lato">From</div>
                      <div className="text-2xl font-playfair font-bold text-champagne-gold">
                        ₹{room.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-rich-espresso">per night</div>
                    </div>
                  </div>

                  <p className="text-rich-espresso font-lato mb-4 flex-grow">
                    {room.description}
                  </p>

                  {/* Room Specs */}
                  <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-pale-champagne">
                    <div className="text-center">
                      <Maximize className="text-champagne-gold mx-auto mb-1" size={20} />
                      <div className="text-xs text-rich-espresso">{room.size}</div>
                    </div>
                    <div className="text-center">
                      <Users className="text-champagne-gold mx-auto mb-1" size={20} />
                      <div className="text-xs text-rich-espresso">{room.guests} Guests</div>
                    </div>
                    <div className="text-center">
                      <Bed className="text-champagne-gold mx-auto mb-1" size={20} />
                      <div className="text-xs text-rich-espresso">{room.beds}</div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 4).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-pale-champagne text-rich-espresso px-3 py-1 rounded-full font-lato"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full flex items-center justify-center space-x-2 group-hover:shadow-gold"
                  >
                    <span>View Details</span>
                    <ArrowRight size={18} />
                  </motion.button>
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary text-lg px-10 py-4"
          >
            View All Rooms
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
