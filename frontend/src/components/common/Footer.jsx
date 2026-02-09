import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: 'About Us', path: '/about' },
      { name: 'Rooms & Suites', path: '/rooms' },
      { name: 'Restaurant', path: '/restaurant' },
      { name: 'Events & Parties', path: '/events' },
    ],
    services: [
      { name: 'Rooms & Suites', path: '/rooms' },
      { name: 'Restaurant', path: '/restaurant' },
      { name: 'Events & Parties', path: '/events' },
      { name: 'Contact Us', path: '/contact' },
    ],

  };

  const socialLinks = [
    { icon: Facebook, url: 'https://www.facebook.com/share/1CDsRyRsQJ/', label: 'Facebook' },
  ];

  return (
    <footer className="bg-deep-charcoal text-warm-cream relative overflow-hidden">
      {/* Decorative top border with gold accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-champagne-gold to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="inline-block mb-4">
                <h3 className="text-3xl font-playfair font-bold">
                  <span className="text-champagne-gold">Rudraksh</span> Inn
                </h3>
              </Link>
              <p className="text-pale-champagne font-lato mb-6 leading-relaxed max-w-sm">
                Experience unparalleled luxury and hospitality at Rudraksh Inn, where every moment
                is crafted for your comfort and delight.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="tel:+919635553346"
                  className="flex items-center space-x-3 text-pale-champagne hover:text-champagne-gold transition-colors group"
                >
                  <div className="bg-rich-espresso p-2 rounded-lg group-hover:bg-champagne-gold/20 transition-colors">
                    <Phone size={18} className="text-champagne-gold" />
                  </div>
                  <span className="font-lato">+91 9635553346</span>
                </a>
                <a
                  href="mailto:info@rudrakshinn.com"
                  className="flex items-center space-x-3 text-pale-champagne hover:text-champagne-gold transition-colors group"
                >
                  <div className="bg-rich-espresso p-2 rounded-lg group-hover:bg-champagne-gold/20 transition-colors">
                    <Mail size={18} className="text-champagne-gold" />
                  </div>
                  <span className="font-lato">info@rudrakshinn.com</span>
                </a>
                <div className="flex items-start space-x-3 text-pale-champagne">
                  <div className="bg-rich-espresso p-2 rounded-lg">
                    <MapPin size={18} className="text-champagne-gold" />
                  </div>
                  <span className="font-lato">
                    Rudraksh Inn, Near City Centre
                    <br />
                    Durgapur, West Bengal - 713212
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-champagne-gold font-lato font-bold text-lg mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-pale-champagne hover:text-champagne-gold transition-colors font-lato inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-champagne-gold font-lato font-bold text-lg mb-4 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-pale-champagne hover:text-champagne-gold transition-colors font-lato inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>


        </div>

        {/* Social Media & Bottom Bar */}
        <div className="pt-8 border-t border-pale-champagne/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Facebook CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full md:w-auto flex justify-center"
            >
              <a
                href="https://www.facebook.com/share/1CDsRyRsQJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-6 py-3 bg-rich-espresso border border-champagne-gold/30 rounded-full text-champagne-gold hover:bg-champagne-gold hover:text-deep-charcoal transition-all duration-300 font-lato font-semibold"
              >
                <Facebook size={20} />
                <span>Follow us on Facebook</span>
              </a>
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-pale-champagne font-lato text-sm text-center md:text-right"
            >
              <p>
                © {currentYear} <span className="text-champagne-gold font-bold">Rudraksh Inn</span>.
                All rights reserved.
              </p>
              <p className="text-xs mt-1">
                Crafted with excellence for discerning travelers
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="h-2 bg-gradient-to-r from-champagne-gold via-muted-gold to-champagne-gold" />
    </footer>
  );
};

export default Footer;
