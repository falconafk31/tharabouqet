'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Promo } from '@/types';

export default function PromoSlider({ promos }: { promos: Promo[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || promos.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promos.length, isPaused]);

  if (!promos || promos.length === 0) return null;

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-100 mt-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${promos[current].image_url})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-3xl relative">
              
              {/* DISCOUNT BADGE */}
              {promos[current].discount && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-24 md:-top-32 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-bold text-lg md:text-xl px-6 py-2 rounded-full shadow-lg z-20"
                >
                  {promos[current].discount}
                </motion.div>
              )}

              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md"
              >
                {promos[current].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl text-white/90 mb-8 font-light"
              >
                {promos[current].subtitle}
              </motion.p>
              <a
                href={promos[current].button_link || '#products'}
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-rose-50 transition transform hover:scale-105 shadow-lg"
              >
                {promos[current].button_text}
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-10">
        {promos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              current === idx ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}