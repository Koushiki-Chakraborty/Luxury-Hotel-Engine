import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RoomGallery = ({ images = [] }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Handle image load
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
    if (index === activeImageIndex) {
      setIsLoading(false);
    }
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    if (index !== activeImageIndex) {
      setIsLoading(!loadedImages.has(index));
      setActiveImageIndex(index);
    }
  };

  // Handle case where no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-warm-cream rounded-lg flex items-center justify-center">
        <p className="text-charcoal-gray text-lg">No images available</p>
      </div>
    );
  }

  // Single image case
  const isSingleImage = images.length === 1;

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Main Image Container */}
        <div className="relative w-full h-[500px] mb-4 overflow-hidden rounded-lg border-2 border-pale-champagne">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-warm-cream animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-warm-cream via-pale-champagne to-warm-cream animate-shimmer"></div>
            </div>
          )}

          {/* Main Image with Zoom Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full group"
            >
              <img
                src={images[activeImageIndex]}
                alt={`Room view ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onLoad={() => handleImageLoad(activeImageIndex)}
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Grid - Only show if multiple images */}
        {!isSingleImage && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === activeImageIndex
                    ? 'border-2 border-pale-champagne ring-2 ring-champagne-gold/30'
                    : 'border-2 border-transparent hover:border-pale-champagne/50'
                }`}
              >
                {/* Thumbnail Loading Skeleton */}
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 bg-warm-cream animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-warm-cream via-pale-champagne to-warm-cream animate-shimmer"></div>
                  </div>
                )}

                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-80"
                  onLoad={() => handleImageLoad(index)}
                  loading="lazy"
                />

                {/* Active Indicator Overlay */}
                {index === activeImageIndex && (
                  <div className="absolute inset-0 bg-champagne-gold/10"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Layout - Snap Scroll */}
      <div className="md:hidden">
        <div className="relative">
          {/* Snap Scroll Container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-2 pb-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full snap-center"
              >
                <div className={`relative h-[400px] rounded-lg overflow-hidden ${
                  index === activeImageIndex
                    ? 'border-2 border-pale-champagne'
                    : 'border-2 border-transparent'
                }`}>
                  {/* Loading Skeleton */}
                  {!loadedImages.has(index) && (
                    <div className="absolute inset-0 bg-warm-cream animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-r from-warm-cream via-pale-champagne to-warm-cream animate-shimmer"></div>
                    </div>
                  )}

                  <img
                    src={image}
                    alt={`Room view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(index)}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Image Counter - Only show if multiple images */}
          {!isSingleImage && (
            <div className="absolute bottom-6 right-4 bg-charcoal-gray/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {activeImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Dot Indicators - Only show if multiple images */}
        {!isSingleImage && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeImageIndex
                    ? 'w-8 bg-champagne-gold'
                    : 'w-2 bg-pale-champagne hover:bg-champagne-gold/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom Scrollbar Hide CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default RoomGallery;
