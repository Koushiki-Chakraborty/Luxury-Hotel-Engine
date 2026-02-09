import { motion } from 'framer-motion';
import useScrollToTop from '../hooks/useScrollToTop';
import heritageImg from '../assets/Frontview.jpg';
import comfortImg from '../assets/room.jpg'; 
import hospitalityImg from '../assets/desk.jpg';

const About = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-soft-ivory pt-32">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-warm-cream border-b border-pale-champagne"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-deep-charcoal mb-6 tracking-tight"
          >
            About Rudraksh Inn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-rich-espresso font-lato max-w-3xl mx-auto leading-relaxed"
          >
            Where tradition meets modern luxury in the heart of Durgapur
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Our Heritage Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-deep-charcoal mb-6">
                Our Heritage
              </h2>
              <p className="text-lg text-rich-espresso font-lato leading-relaxed mb-4">
                Founded on the principles of classic Indian warmth, Rudraksh Inn began as a vision 
                to bring a sanctuary of peace to the industrial heart of Durgapur.
              </p>
              <p className="text-lg text-rich-espresso font-lato leading-relaxed">
                Our journey has been defined by a commitment to excellence and a deep respect for 
                the cultural tapestry of West Bengal.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-luxury h-96">
              <img 
                src={heritageImg} 
                alt="Our Heritage" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Modern Comfort Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-pale-champagne rounded-lg h-96 flex items-center justify-center shadow-luxury">
             <img 
                src={comfortImg} 
                alt="Modern Comfort" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-deep-charcoal mb-6">
                Modern Comfort
              </h2>
              <p className="text-lg text-rich-espresso font-lato leading-relaxed mb-4">
                We believe luxury is in the details. From high-speed connectivity to ergonomic 
                designs, our rooms are crafted to be your home away from home.
              </p>
              <p className="text-lg text-rich-espresso font-lato leading-relaxed">
                Experience a blend of smart technology and plush interiors designed for the 
                modern traveler.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Unmatched Hospitality Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-deep-charcoal mb-6">
                Unmatched Hospitality
              </h2>
              <p className="text-lg text-rich-espresso font-lato leading-relaxed mb-4">
                At Rudraksh Inn, you aren't just a guest; you are part of our family. Our 
                dedicated staff is here 24/7 to ensure your stay is seamless.
              </p>
              <p className="text-lg text-rich-espresso font-lato leading-relaxed">
                Personalized service is the hallmark of our identity, making every visit 
                unforgettable.
              </p>
            </div>
            <div className="bg-pale-champagne rounded-lg h-96 flex items-center justify-center shadow-luxury">
              <img 
                src={hospitalityImg} 
                alt="Hospitality" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-champagne-gold/10 to-pale-champagne rounded-lg p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-charcoal mb-4">
            Experience the Difference
          </h2>
          <p className="text-lg text-rich-espresso font-lato mb-8 max-w-2xl mx-auto">
            Discover why Rudraksh Inn is the preferred choice for discerning travelers seeking luxury and comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/rooms" className="btn-primary inline-flex items-center justify-center">
              Explore Our Rooms
            </a>
            <a href="/contact" className="btn-secondary inline-flex items-center justify-center">
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
