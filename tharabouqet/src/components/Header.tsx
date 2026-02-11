'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890'); // Default fallback

  // 1. Deteksi scroll untuk mengubah style header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Fetch Nomor WA dari Database
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'whatsapp_number')
        .single();
      
      if (data) {
        setWhatsappNumber(data.value);
      }
    };
    fetchSettings();
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catalog', href: '/#products' },
    { name: 'Stories', href: '/#testimonials' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center p-4 transition-all duration-300 pointer-events-none`}
      >
        <div 
          className={`
            pointer-events-auto
            flex items-center justify-between 
            px-6 py-3 
            transition-all duration-500 ease-in-out
            ${isScrolled 
              ? 'w-[90%] md:w-[70%] bg-white/70 backdrop-blur-xl shadow-lg border border-white/40 rounded-full' 
              : 'w-full max-w-7xl bg-transparent'
            }
          `}
        >
          {/* LOGO */}
          <Link href="/" className="group relative z-50">
            <span className="font-serif text-2xl font-bold tracking-tighter text-slate-800 group-hover:text-rose-500 transition-colors">
              tharabouqet<span className="text-rose-500 group-hover:text-slate-800">.</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* ACTION BUTTONS (Updated to use Dynamic WA) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-rose-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-200"
            >
              Let's Talk
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden p-2 text-slate-800 bg-white/50 backdrop-blur-md rounded-full"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-3xl font-serif font-bold text-slate-800 hover:text-rose-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile Button (Updated to use Dynamic WA) */}
            <button 
              onClick={() => {
                window.open(`https://wa.me/${whatsappNumber}`, '_blank');
                setIsMobileOpen(false);
              }}
              className="mt-8 px-8 py-3 bg-rose-500 text-white text-lg font-medium rounded-full shadow-xl shadow-rose-200"
            >
              Chat WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}