import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Calendar } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const Contact = () => {
  useScrollToTop();

  const whatsappLink = "https://wa.me/919635553346?text=Hi, I would like to inquire about Rudraksh Inn.";

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
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-rich-espresso font-lato max-w-2xl mx-auto"
          >
            We're here to make your stay exceptional. Reach out to us anytime.
          </motion.p>
        </div>
      </motion.div>

      {/* Booking Notice Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
      >
        <div className="bg-gradient-to-br from-champagne-gold/10 via-pale-champagne to-champagne-gold/5 border-2 border-champagne-gold/30 rounded-lg p-6 md:p-8 text-center shadow-luxury">
          <div className="flex justify-center mb-4">
            <div className="bg-champagne-gold p-3 rounded-full">
              <Calendar size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-deep-charcoal mb-3">
            Booking Notice
          </h2>
          <p className="text-lg text-rich-espresso font-lato max-w-3xl mx-auto mb-6 leading-relaxed">
            Note: To ensure a personalized experience, we do not process direct bookings through our website.
            You can directly contact us at the number given below or use the Google options to reserve your sanctuary.
          </p>
          <motion.a
            href="https://www.google.com/search?q=rudraksh+inn+durgapur"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center space-x-3 bg-champagne-gold hover:bg-muted-gold text-white px-8 py-4 rounded-lg transition-colors duration-300 font-lato font-bold text-lg shadow-luxury"
          >
            <Calendar size={24} />
            <span>View Booking Options on Google</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-playfair font-bold text-deep-charcoal mb-6">
              Contact Information
            </h2>

            {/* Phone */}
            <a
              href="tel:+919635553346"
              className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-luxury hover:shadow-luxury-lg transition-all duration-300 mb-4"
            >
              <div className="bg-champagne-gold p-4 rounded-full">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-rich-espresso font-lato">Call Us</p>
                <p className="text-xl font-lato font-bold text-deep-charcoal">+91 9635553346</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@rudrakshinn.com"
              className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-luxury hover:shadow-luxury-lg transition-all duration-300 mb-4"
            >
              <div className="bg-champagne-gold p-4 rounded-full">
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-rich-espresso font-lato">Email Us</p>
                <p className="text-xl font-lato font-bold text-deep-charcoal">info@rudrakshinn.com</p>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-luxury mb-6">
              <div className="bg-champagne-gold p-4 rounded-full">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-rich-espresso font-lato">Visit Us</p>
                <p className="text-lg font-lato font-bold text-deep-charcoal">Rudraksh Inn</p>
                <p className="text-rich-espresso font-lato">Durgapur, West Bengal</p>
              </div>
            </div>

            {/* WhatsApp Button - Large and Prominent for Mobile */}
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-3 bg-champagne-gold hover:bg-muted-gold text-white px-8 py-6 md:py-5 rounded-lg transition-colors duration-300 font-lato font-bold text-lg md:text-base w-full shadow-luxury-lg"
            >
              <MessageCircle size={32} className="md:hidden" />
              <MessageCircle size={24} className="hidden md:block" />
              <span className="text-xl md:text-base">Chat on WhatsApp</span>
            </motion.a>
          </motion.div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-playfair font-bold text-deep-charcoal mb-6">
              Find Us
            </h2>
            <div className="bg-white rounded-lg shadow-luxury overflow-hidden h-[400px] md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.439!2d87.3606!3d23.4981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f7714344691a67%3A0x51974da1ba588085!2sRudraksh%20Inn%2C%20Durgapur%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1738923900000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rudraksh Inn Location"
              ></iframe>
            </div>
          </motion.div>
        </div>

        {/* Operating Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white rounded-lg shadow-luxury p-8"
        >
          <h2 className="text-3xl font-playfair font-bold text-deep-charcoal mb-6 text-center">
            Operating Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-pale-champagne rounded-lg">
              <h3 className="text-xl font-playfair font-bold text-deep-charcoal mb-2">
                Front Desk
              </h3>
              <p className="text-rich-espresso font-lato">24/7</p>
            </div>
            <div className="text-center p-6 bg-pale-champagne rounded-lg">
              <h3 className="text-xl font-playfair font-bold text-deep-charcoal mb-2">
                Restaurant
              </h3>
              <p className="text-rich-espresso font-lato">7:00 AM - 11:00 PM</p>
            </div>
            <div className="text-center p-6 bg-pale-champagne rounded-lg">
              <h3 className="text-xl font-playfair font-bold text-deep-charcoal mb-2">
                Check-in / Check-out
              </h3>
              <p className="text-rich-espresso font-lato">12:00 PM / 11:00 AM</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
