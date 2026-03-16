import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Restaurant', path: '/restaurant' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      clipPath: "inset(0% 0% 100% 0%)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-[60] pt-[env(safe-area-inset-top)] h-16 md:h-20 transition-all duration-300 ${!isHomePage || isScrolled
          ? 'bg-soft-ivory/80 backdrop-blur-md shadow-sm border-b border-champagne-gold/20'
          : 'bg-transparent'
          }`}
      >
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 z-[70] relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl md:text-2xl font-playfair font-bold"
              >
                <span className="text-champagne-gold">Rudraksh</span>{' '}
                <span className={`transition-colors duration-500 ${isMobileMenuOpen ? 'text-deep-charcoal' : (!isHomePage || isScrolled ? 'text-deep-charcoal' : 'text-warm-cream')
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
                  className={`font-lato font-medium tracking-[0.2em] text-xs uppercase transition-colors duration-500 relative group ${!isHomePage || isScrolled
                    ? 'text-deep-charcoal hover:text-champagne-gold'
                    : 'text-warm-cream hover:text-champagne-gold'
                    }`}
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-champagne-gold group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="hidden lg:flex items-center">
              <a
                href="tel:+919635553346"
                className={`flex items-center space-x-2 text-sm tracking-widest transition-colors duration-500 hover:text-champagne-gold ${!isHomePage || isScrolled ? 'text-rich-espresso' : 'text-warm-cream'
                  }`}
              >
                <Phone size={16} />
                <span className="font-lato font-medium">+91 9635553346</span>
              </a>
            </div>

            {/* Mobile Menu Button - Custom Animated Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden z-[70] relative flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none`}
            >
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className={`block w-8 h-0.5 transform transition-colors duration-300 ${isMobileMenuOpen ? 'bg-deep-charcoal' : (!isHomePage || isScrolled ? 'bg-deep-charcoal' : 'bg-warm-cream')}`}
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`block w-8 h-0.5 transform transition-colors duration-300 ${isMobileMenuOpen ? 'bg-deep-charcoal' : (!isHomePage || isScrolled ? 'bg-deep-charcoal' : 'bg-warm-cream')}`}
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className={`block w-8 h-0.5 transform transition-colors duration-300 ${isMobileMenuOpen ? 'bg-deep-charcoal' : (!isHomePage || isScrolled ? 'bg-deep-charcoal' : 'bg-warm-cream')}`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[55] bg-soft-ivory flex flex-col justify-center items-center lg:hidden"
          >
            <div className="flex flex-col items-center space-y-8">
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={linkVariants}>
                  <Link
                    to={link.path}
                    className="text-3xl font-playfair text-deep-charcoal hover:text-champagne-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Footer */}
            <motion.div
              variants={linkVariants}
              className="absolute bottom-12 left-0 right-0 flex flex-col items-center space-y-4 px-6"
            >
              <div className="w-12 h-0.5 bg-champagne-gold/30 mb-4"></div>
              <a href="tel:+919635553346" className="flex items-center space-x-3 text-rich-espresso hover:text-champagne-gold transition-colors">
                <Phone size={20} />
                <span className="font-lato tracking-wide">+91 9635553346</span>
              </a>
              <a href="mailto:info@rudrakshinn.com" className="flex items-center space-x-3 text-rich-espresso hover:text-champagne-gold transition-colors">
                <Mail size={20} />
                <span className="font-lato tracking-wide">info@rudrakshinn.com</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
