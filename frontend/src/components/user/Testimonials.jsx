import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Swapnendu Roy',
      location: 'Durgapur, India',
      rating: 5,
      text: 'Great place. Great food!!!',
      date: 'December 2025',
    },
    {
      id: 2,
      name: 'Surojit Majumdar',
      location: 'Durgapur, India',
      rating: 5,
      text: 'Very good staff 😊, Nice property , Amazing food 🥑 🥝 🥑 🥝.',
      date: 'November 2025',
    },
    {
      id: 3,
      name: 'Arup Mukherjee',
      location: 'Durgapur, India',
      rating: 5,
      text: 'Good food. Nice and spacious accommodation.',
      date: 'January 2026',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-soft-ivory relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-champagne-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-muted-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-champagne-gold/10 border border-champagne-gold/30 rounded-full px-6 py-2 mb-4">
            <span className="text-champagne-gold font-lato text-sm uppercase tracking-wider font-bold">
              Guest Experiences
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-deep-charcoal mb-4">
            What Our Guests Say
          </h2>
          <p className="text-lg text-rich-espresso font-lato max-w-2xl mx-auto">
            Discover why discerning travelers choose Rudraksh Inn for their luxury stays
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <div className="card-primary h-full flex flex-col">
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 bg-champagne-gold rounded-full p-3 shadow-gold">
                  <Quote className="text-deep-charcoal" size={24} />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4 mt-2">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="text-champagne-gold fill-champagne-gold"
                      size={18}
                    />
                  ))}
                </div>

                {/* Testimonial Text - Cormorant Garamond */}
                <blockquote className="flex-grow mb-6">
                  <p className="text-rich-espresso font-cormorant text-lg leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </blockquote>

                {/* Author Info */}
                <div className="pt-4 border-t border-pale-champagne">
                  <div className="font-lato font-bold text-deep-charcoal">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-rich-espresso">
                    {testimonial.location}
                  </div>
                  <div className="text-xs text-muted-gold mt-1">
                    {testimonial.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col md:flex-row items-center gap-6 md:gap-8 md:space-x-8 bg-warm-cream rounded-2xl md:rounded-full px-8 py-6 md:py-4 shadow-luxury w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Star className="text-champagne-gold fill-champagne-gold" size={24} />
              <div className="text-left">
                <div className="font-playfair font-bold text-2xl text-deep-charcoal">5/5</div>
                <div className="text-xs text-rich-espresso font-lato">Guest Rating</div>
              </div>
            </div>
            <div className="h-px w-full md:h-12 md:w-px bg-pale-champagne" />
            <div>
              <div className="font-playfair font-bold text-2xl text-deep-charcoal">100+</div>
              <div className="text-xs text-rich-espresso font-lato">Happy Guests</div>
            </div>
            <div className="h-px w-full md:h-12 md:w-px bg-pale-champagne" />
            <div>
              <div className="font-playfair font-bold text-2xl text-deep-charcoal">98%</div>
              <div className="text-xs text-rich-espresso font-lato">Recommend Us</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
