import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Search } from 'lucide-react';
import { format } from 'date-fns';

const QuickBookingWidget = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ checkIn, checkOut, guests });
    // Navigate to rooms page with filters
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative -mt-32 z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-warm-cream rounded-luxury shadow-xl border-2 border-champagne-gold/20 p-6 md:p-8">
        {/* Decorative wood accent */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-champagne-gold px-6 py-2 rounded-full">
          <span className="text-deep-charcoal font-lato font-bold text-sm uppercase tracking-wider">
            Quick Booking
          </span>
        </div>

        <form onSubmit={handleSearch} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* Check-in Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-deep-charcoal font-lato font-bold text-sm">
                <Calendar size={16} className="text-champagne-gold" />
                <span>Check-in</span>
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="input-field w-full"
                required
              />
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-deep-charcoal font-lato font-bold text-sm">
                <Calendar size={16} className="text-champagne-gold" />
                <span>Check-out</span>
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                className="input-field w-full"
                required
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-deep-charcoal font-lato font-bold text-sm">
                <Users size={16} className="text-champagne-gold" />
                <span>Guests</span>
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="input-field w-full"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Search size={20} />
                <span>Search Rooms</span>
              </motion.button>
            </div>
          </div>
        </form>

        {/* Quick stats */}
        <div className="mt-6 pt-6 border-t border-pale-champagne grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-playfair font-bold text-champagne-gold">50+</div>
            <div className="text-sm text-rich-espresso font-lato">Luxury Rooms</div>
          </div>
          <div>
            <div className="text-2xl font-playfair font-bold text-champagne-gold">5★</div>
            <div className="text-sm text-rich-espresso font-lato">Rating</div>
          </div>
          <div>
            <div className="text-2xl font-playfair font-bold text-champagne-gold">24/7</div>
            <div className="text-sm text-rich-espresso font-lato">Service</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickBookingWidget;
