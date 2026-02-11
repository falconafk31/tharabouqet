'use client'
import Link from 'next/link';
import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-50 pt-20 pb-10 overflow-hidden">
      {/* Decorative Gradient Blob */}
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
              onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-500 transition-all duration-500 hover:pr-6"
            >
              Order Now
              <div className="bg-white text-slate-900 rounded-full p-1 transition-transform group-hover:rotate-45 duration-500">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 my-10" />

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-600 hover:text-rose-500 transition">Home</Link></li>
              <li><Link href="/#products" className="text-slate-600 hover:text-rose-500 transition">Catalog</Link></li>
              <li><Link href="/#testimonials" className="text-slate-600 hover:text-rose-500 transition">Stories</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Socials</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-600 hover:text-rose-500 transition flex items-center gap-2">Instagram <ArrowUpRight size={14}/></a></li>
              <li><a href="#" className="text-slate-600 hover:text-rose-500 transition flex items-center gap-2">TikTok <ArrowUpRight size={14}/></a></li>
            </ul>
          </div>
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white border border-slate-200 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
              <button className="bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-slate-800 transition">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 gap-4">
          <p>© {currentYear} Tharabouqet. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition">Terms of Service</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Operational: 09:00 - 17:00</span>
          </div>
        </div>
      </div>
    </footer>
  );
}