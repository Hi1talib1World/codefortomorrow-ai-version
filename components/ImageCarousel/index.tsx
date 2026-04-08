import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const images = [
  {
    src: '/assets/images/carousel_kids_coding_1775683501578.png',
    alt: 'Kids having fun coding together',
    caption: 'Collaborative Learning Environments'
  },
  {
    src: '/assets/images/carousel_abstract_interface_1775683515413.png',
    alt: 'Visual coding puzzle interface',
    caption: 'Interactive Visual Puzzles'
  },
  {
    src: '/assets/images/carousel_robot_tutor_1775683529316.png',
    alt: 'Friendly AI Robot Tutor',
    caption: 'Personalized AI Tutors'
  }
];

export const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl group">
      {/* Aspect Ratio Container (16:9) */}
      <div className="relative aspect-video bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Caption Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-10 pt-20">
          <motion.h3 
            key={`caption-${currentIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-xl md:text-3xl font-bold translate-y-2 pointer-events-none drop-shadow-md"
          >
            {images[currentIndex].caption}
          </motion.h3>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={goToPrev}
            className="p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-10 pointer-events-none">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
              className={`w-2.5 h-2.5 rounded-full transition-all pointer-events-auto shadow-sm ${
                currentIndex === idx 
                  ? 'bg-brand-500 w-8' 
                  : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
