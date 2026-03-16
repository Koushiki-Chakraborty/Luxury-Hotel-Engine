import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import PrimaryButton from '../shared/PrimaryButton';

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background with luxury gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rich-espresso via-deep-charcoal to-rich-espresso">
        {/* Subtle pattern overlay for texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-deep-charcoal/50 to-transparent" />
      </div>

      {/* Champagne gold accent - top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-champagne-gold to-transparent opacity-60" />

      {/* Decorative glow elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-muted-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-champagne-gold/10 rounded-full blur-3xl" />

      {/* Content with Staggered Animations */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 sm:pt-20 md:pt-24 pb-32 sm:pb-36 md:pb-40">
        {/* Subtle Luxury Badge - Appears First (0.2s) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 mb-8"
        >
          <Sparkles className="text-champagne-gold" size={20} />
          <span className="text-warm-cream font-lato text-sm tracking-[0.2em] uppercase">
            5-Star Luxury Experience
          </span>
        </motion.div>

        {/* Main Heading - Appears Second (0.4s) */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-warm-cream mb-6 tracking-tighter leading-tight"
        >
          Experience Unparalleled
          <br />
          <span className="text-champagne-gold">Luxury</span>
        </motion.h1>

        {/* Subheading - Appears Third (0.6s) */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-pale-champagne font-lato max-w-2xl mx-auto mb-1 leading-relaxed"
        >
          Discover the perfect blend of contemporary elegance and timeless hospitality
          at Rudraksh Inn, where every moment is crafted for your comfort.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-1"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-champagne-gold"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-champagne-gold opacity-60"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-soft-ivory/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default Hero;
