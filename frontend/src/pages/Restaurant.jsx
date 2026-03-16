import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import menuPDF from '../assets/Menu.pdf';
import useScrollToTop from '../hooks/useScrollToTop';

const Restaurant = () => {
  useScrollToTop();
  const [restaurantImages, setRestaurantImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantImages();
  }, []);

  const fetchRestaurantImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant');
      setRestaurantImages(response.data.data.images || []);
    } catch (error) {
      console.error('Error fetching restaurant images:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-soft-ivory pt-32">
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
            Our Restaurant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-rich-espresso font-lato max-w-2xl mx-auto"
          >
            Experience culinary excellence with our carefully curated menu featuring local and international cuisine.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Culinary Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-deep-charcoal mb-8 text-center">
            Our Culinary Journey
          </h2>

          {/* Restaurant Image Gallery */}
          {!loading && restaurantImages.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group overflow-hidden rounded-lg shadow-luxury hover:shadow-luxury-lg transition-all duration-300"
                  >
                    <img
                      src={image}
                      alt={`Rudraksh Inn Dining Area ${index + 1}`}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Menu PDF Section */}
          <h3 className="text-3xl font-playfair font-bold text-deep-charcoal mb-6 text-center">
            Our Menu
          </h3>

          {/* PDF Viewer - Desktop Only */}
          <div className="hidden md:block bg-white rounded-lg shadow-luxury border-2 border-pale-champagne overflow-hidden">
            <iframe
              src={`${menuPDF}#view=FitH`}
              width="100%"
              height="800px"
              className="rounded-lg"
              title="Restaurant Menu"
              type="application/pdf"
            >
              <p className="p-8 text-center text-rich-espresso font-lato">
                Your browser does not support PDF viewing. Please use the button below to view the full menu.
              </p>
            </iframe>
          </div>

          {/* Download/View Button - Mobile (Primary) & Desktop (Secondary) */}
          <div className="mt-6 text-center">
            <div className="md:hidden mb-4">
              <div className="bg-soft-ivory p-6 rounded-lg border border-pale-champagne shadow-sm">
                <p className="text-rich-espresso font-lato mb-4">View our full exquisite menu on your device.</p>
                <motion.a
                  href={menuPDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary inline-flex items-center justify-center space-x-3 w-full"
                >
                  <Download size={20} />
                  <span>Open Menu (PDF)</span>
                </motion.a>
              </div>
            </div>

            <div className="hidden md:block">
              <motion.a
                href={menuPDF}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary inline-flex items-center justify-center space-x-3"
              >
                <Download size={20} />
                <span>View Full Menu (PDF)</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Reservation & Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Contact & Reservation Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-luxury p-6 md:p-8"
          >
            <h2 className="text-3xl font-playfair font-bold text-deep-charcoal mb-6">
              Make a Reservation
            </h2>

            <p className="text-rich-espresso font-lato mb-6 leading-relaxed">
              Reserve your table in advance to ensure the best dining experience. Contact us directly for reservations and special requests.
            </p>

            {/* Contact Options */}
            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:+919635553346"
                className="flex items-center space-x-4 p-4 bg-pale-champagne rounded-lg hover:bg-warm-cream transition-colors duration-300"
              >
                <div className="bg-champagne-gold p-3 rounded-full">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-rich-espresso font-lato">Call Us</p>
                  <p className="text-lg font-lato font-bold text-deep-charcoal">+91 9635553346</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@rudrakshinn.com"
                className="flex items-center space-x-4 p-4 bg-pale-champagne rounded-lg hover:bg-warm-cream transition-colors duration-300"
              >
                <div className="bg-champagne-gold p-3 rounded-full">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-rich-espresso font-lato">Email Us</p>
                  <p className="text-lg font-lato font-bold text-deep-charcoal">info@rudrakshinn.com</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Operating Hours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow-luxury p-6 md:p-8"
          >
            <h2 className="text-3xl font-playfair font-bold text-deep-charcoal mb-6">
              Operating Hours
            </h2>

            <div className="space-y-4 font-lato text-rich-espresso">
              <div className="flex justify-between items-center p-4 bg-pale-champagne rounded-lg">
                <span className="font-medium">Breakfast</span>
                <span className="font-bold text-deep-charcoal">7:00 AM - 10:30 AM</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pale-champagne rounded-lg">
                <span className="font-medium">Lunch</span>
                <span className="font-bold text-deep-charcoal">12:00 PM - 3:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pale-champagne rounded-lg">
                <span className="font-medium">Dinner</span>
                <span className="font-bold text-deep-charcoal">7:00 PM - 11:00 PM</span>
              </div>
            </div>

            {/* Additional Note */}
            <div className="mt-6 p-4 bg-gradient-to-br from-champagne-gold/10 to-pale-champagne rounded-lg">
              <p className="text-sm text-rich-espresso font-lato">
                <strong>Note:</strong> We recommend making reservations for dinner service, especially on weekends and holidays.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
