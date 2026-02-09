import { useState } from 'react';
import { motion } from 'framer-motion';
import eventImg1 from '../assets/event1.jpg';
import eventImg2 from '../assets/event2.jpg';
import useScrollToTop from '../hooks/useScrollToTop';

const Events = () => {
  useScrollToTop();

  // Event packages with images
  const eventPackages = [
    {
      id: 1,
      title: 'Party & Celebrations',
      description: 'Make your special moments unforgettable with our celebration packages for birthdays, anniversaries, and private parties',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
      features: ['Birthday Parties', 'Anniversary Celebrations', 'Private Events']
    },
    {
      id: 2,
      title: 'Corporate Meetings',
      description: 'Professional spaces equipped for productive business gatherings',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800',
      features: ['AV Equipment', 'High-Speed WiFi', 'Catering Options']
    },
    {
      id: 3,
      title: 'Special Celebrations',
      description: 'Host memorable celebrations in our versatile event spaces',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
      features: ['Flexible Layouts', 'Custom Menus', 'Dedicated Support']
    }
  ];

  // Event Image Card Component with Error Handling
  const EventImageCard = ({ image, title }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="relative h-64 overflow-hidden group">
        {!imageError ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-warm-cream flex items-center justify-center">
            <span className="text-charcoal-gray font-lato text-sm opacity-50">Event Image</span>
          </div>
        )}
      </div>
    );
  };

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
            Events & Celebrations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-rich-espresso font-lato max-w-3xl mx-auto leading-relaxed"
          >
            Exceptional venues for your most important moments
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Event Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {eventPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-luxury hover:shadow-luxury-lg transition-all duration-300 overflow-hidden h-full flex flex-col"
            >
              {/* Event Image with Error Handling */}
              <EventImageCard image={pkg.image} title={pkg.title} />

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-playfair font-bold text-deep-charcoal mb-3">
                  {pkg.title}
                </h3>
                <p className="text-rich-espresso font-lato mb-4 flex-grow">
                  {pkg.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-champagne-gold rounded-full"></div>
                      <span className="text-sm text-rich-espresso font-lato">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href="/contact"
                  className="btn-primary flex items-center justify-center w-full"
                >
                  Inquire Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Event Spaces Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-luxury p-8 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-charcoal mb-6 text-center">
            Our Event Spaces
          </h2>
          <p className="text-lg text-rich-espresso font-lato text-center mb-8 max-w-3xl mx-auto leading-relaxed">
            From intimate birthday celebrations to high-impact corporate conferences, Rudraksh Inn offers versatile venues designed to elevate every occasion. Whether you are hosting a private anniversary dinner or a professional seminar, our team ensures every detail is executed with grace.
          </p>

          {/* Event Spaces Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-luxury group">
              <img
                src={eventImg1}
                alt="Event Space 1"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg shadow-luxury group">
              <img
                src={eventImg2}
                alt="Event Space 2"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-champagne-gold/10 to-pale-champagne rounded-lg p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-deep-charcoal mb-4">
            Plan Your Perfect Event
          </h2>
          <p className="text-lg text-rich-espresso font-lato mb-8 max-w-2xl mx-auto">
            Our dedicated events team is ready to help you create an unforgettable experience. Contact us to discuss your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary inline-flex items-center justify-center">
              Contact Events Team
            </a>
            <a
              href="https://wa.me/919635553346?text=Hi, I would like to inquire about event packages at Rudraksh Inn."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center justify-center"
            >
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;
