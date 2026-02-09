import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PrimaryButton = ({ 
  children, 
  onClick, 
  className = '', 
  icon: Icon = ArrowRight,
  showIcon = true,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`btn-primary flex items-center space-x-2 text-lg px-10 py-5 relative overflow-hidden group tracking-wide ${className}`}
      {...props}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{
          x: '100%',
          transition: { duration: 0.6, ease: 'easeInOut' }
        }}
      />
      <span className="relative z-10">{children}</span>
      {showIcon && Icon && <Icon size={20} className="relative z-10" />}
    </motion.button>
  );
};

export default PrimaryButton;
