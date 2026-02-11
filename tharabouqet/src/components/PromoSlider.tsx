'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Promo } from '@/types';
import Image from 'next/image'; // Import Next Image

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
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-100 mt-16 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* OPTIMISASI GAMBAR: Menggunakan next/image */}
          <div className="absolute inset-0">
            <Image 
              src={promos[current].image_url}
              alt={promos[current].title}
              fill
              priority={true} // Wajib true untuk hero image agar loading cepat
              className="object-cover"
              sizes="100vw" // Banner selalu selebar layar
            />
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10">
            <div className="max-w-3xl relative">
              
              {/* DISCOUNT BADGE */}
              {promos[current].discount && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-block mb-4 bg-rose-600 text-white font-bold text-sm md:text-lg px-6 py-2 rounded-full shadow-lg"
                >
                  {promos[current].discount}
                </motion.div>
              )}

              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md leading-tight"
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
              <motion.a
                href={promos[current].button_link || '#products'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-rose-500 hover:text-white transition-all transform hover:scale-105 shadow-xl"
              >
                {promos[current].button_text}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
        {promos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
              current === idx ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}