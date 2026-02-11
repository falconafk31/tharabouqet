'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // State untuk menyimpan semua setting dengan nilai default
  const [settings, setSettings] = useState({
    whatsapp_number: '6281234567890',
    instagram_url: '#',
    tiktok_url: '#',
    address_line1: 'Jl. Bunga Mawar No. 88, Kemang',
    address_line2: 'Jakarta Selatan, DKI Jakarta 12730',
    hours_weekdays: 'Mon - Sat: 09:00 - 17:00',
    hours_weekends: 'Sun: Closed (Pre-order only)'
  });

  // Fetch Semua Settings dari Database
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*');
      
      if (data) {
        // Konversi array [{key: 'a', value: 'b'}] menjadi object {a: 'b'}
        const newSettings: any = {};
        data.forEach(item => {
          newSettings[item.key] = item.value;
        });
        
        // Gabungkan dengan default state
        setSettings(prev => ({ ...prev, ...newSettings }));
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="relative bg-slate-50 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Section: CTA Big Text */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
          <div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
              Crafting joy,<br />
              <span className="text-rose-500">one petal at a time.</span>
            </h2>
          </div>
          <div>
            <button 
              onClick={() => window.open(`https://wa.me/${settings.whatsapp_number}`, '_blank')}
              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-500 transition-all duration-500 hover:pr-6 shadow-xl shadow-slate-200"
            >
              Order Now
              <div className="bg-white text-slate-900 rounded-full p-1 transition-transform group-hover:rotate-45 duration-500">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 my-10" />

        {/* Middle Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-600 hover:text-rose-500 transition">Home</Link></li>
              <li><Link href="/#products" className="text-slate-600 hover:text-rose-500 transition">Catalog</Link></li>
              <li><Link href="/#testimonials" className="text-slate-600 hover:text-rose-500 transition">Stories</Link></li>
            </ul>
          </div>
          
          {/* Dynamic Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Socials</h4>
            <ul className="space-y-3">
              <li>
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-rose-500 transition flex items-center gap-2">
                  Instagram <ArrowUpRight size={14}/>
                </a>
              </li>
              <li>
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-rose-500 transition flex items-center gap-2">
                  TikTok <ArrowUpRight size={14}/>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Dynamic Address & Hours */}
          <div className="space-y-6 md:col-span-2 pl-0 md:pl-10 border-l-0 md:border-l border-slate-200">
            <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <MapPin size={16}/> Our Studio
                </h4>
                <p className="text-slate-600 leading-relaxed">
                    {settings.address_line1}<br/>
                    {settings.address_line2}
                </p>
            </div>
            <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <Clock size={16}/> Operational Hours
                </h4>
                <p className="text-slate-600">
                    {settings.hours_weekdays}<br/>
                    {settings.hours_weekends}
                </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 gap-4 pt-8 border-t border-slate-200">
          <p>© {currentYear} Tharabouqet. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}