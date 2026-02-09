import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Restaurant', path: '/restaurant' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        !isHomePage || isScrolled
          ? 'bg-soft-ivory backdrop-blur-md shadow-luxury py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-playfair font-bold"
            >
              <span className="text-champagne-gold">Rudraksh</span>{' '}
              <span className={`transition-colors duration-500 ${
                !isHomePage || isScrolled ? 'text-deep-charcoal' : 'text-warm-cream'
              }`}>
                Inn
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Boutique Typography */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-lato font-medium tracking-widest text-xs uppercase transition-colors duration-500 relative group ${
                  !isHomePage || isScrolled 
                    ? 'text-deep-charcoal hover:text-champagne-gold' 
                    : 'text-warm-cream hover:text-champagne-gold'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-champagne-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center">
            <a 
              href="tel:+919635553346" 
              className={`flex items-center space-x-2 text-sm tracking-wider transition-colors duration-500 hover:text-champagne-gold ${
                !isHomePage || isScrolled ? 'text-rich-espresso' : 'text-pale-champagne'
              }`}
            >
              <Phone size={18} />
              <span className="font-lato font-medium">+91 9635553346</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden transition-colors duration-500 ${
              !isHomePage || isScrolled ? 'text-deep-charcoal' : 'text-warm-cream'
            } hover:text-champagne-gold`}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-warm-cream/95 backdrop-blur-md border-t border-pale-champagne overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-deep-charcoal hover:text-champagne-gold font-lato font-medium tracking-wide py-2 transition-colors uppercase text-sm"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-pale-champagne space-y-3">
                <a href="tel:+919635553346" className="flex items-center space-x-2 text-rich-espresso hover:text-champagne-gold text-sm">
                  <Phone size={18} />
                  <span>+91 9635553346</span>
                </a>
                <a href="mailto:info@rudrakshinn.com" className="flex items-center space-x-2 text-rich-espresso hover:text-champagne-gold text-sm">
                  <Mail size={18} />
                  <span>info@rudrakshinn.com</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
