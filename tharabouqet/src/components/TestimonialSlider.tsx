'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types';

export default function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto scroll setiap 3 detik
  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [testimonials.length, isPaused]);

  if (!testimonials || testimonials.length === 0) return <p className="text-center text-gray-500">Belum ada testimoni.</p>;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Helper untuk menampilkan 3 item sekaligus di desktop (optional logic)
  // Tapi untuk slider yang diminta user, kita fokus menampilkan 1 item focus atau carousel sederhana.
  // Di sini saya buat single card slider yang elegan agar fokus.

  return (
    <div 
      className="relative max-w-4xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-rose-100 relative mx-auto max-w-2xl">
              <Quote className="absolute top-6 left-6 text-rose-200 w-10 h-10" />
              
              <div className="flex justify-center gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < testimonials[current].rating ? "currentColor" : "none"} className={i < testimonials[current].rating ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              
              <p className="text-gray-700 italic text-lg md:text-xl mb-8 leading-relaxed">
                "{testimonials[current].text}"
              </p>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {testimonials[current].name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{testimonials[current].name}</h4>
                  <span className="text-sm text-gray-500">Verified Customer</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-rose-500 hover:scale-110 transition z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-rose-500 hover:scale-110 transition z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === idx ? 'w-8 bg-rose-500' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}