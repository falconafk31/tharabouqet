'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Calendar, FileText, User, Copy, Facebook } from 'lucide-react';
import { Product } from '@/types';
import { supabase } from '../lib/supabase'; // Path relatif
import Link from 'next/link';

// Default nomor WA (jika database belum diset)
const DEFAULT_WA = '6281234567890'; 

// --- ICON SVG CUSTOM ---
const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    recipient: '',
    message: ''
  });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [copied, setCopied] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WA);

  // Fetch Settings & Related
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchInitialData = async () => {
        // 1. Fetch WA Number
        const { data: settings } = await supabase
            .from('store_settings')
            .select('value')
            .eq('key', 'whatsapp_number')
            .single();
        
        if (settings) {
            setWhatsappNumber(settings.value);
        }

        // 2. Fetch Related
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .neq('id', product.id)
            .limit(3); 
        
        if (products) {
            setRelatedProducts(products as Product[]);
        }
    };

    fetchInitialData();
  }, [isOpen, product.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const text = `Halo Tharabouqet, saya ingin memesan:
--------------------------------
🌸 *${product.name}*
💰 Harga: Rp ${product.price.toLocaleString('id-ID')}
--------------------------------
📅 Tanggal Kirim: ${formData.date}
👤 Penerima: ${formData.recipient}
💌 Kartu Ucapan: ${formData.message || '-'}
--------------------------------
Mohon info ketersediaan & ongkirnya ya kak. Terima kasih!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Cek buket cantik ini: ${product.name}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'instagram') {
      window.open(`https://www.instagram.com/`, '_blank');
    } else if (platform === 'tiktok') {
      window.open(`https://www.tiktok.com/`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header Sticky */}
            <div className="bg-white px-5 py-4 border-b border-gray-100 flex justify-between items-center shrink-0 z-20">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Detail Pemesanan</h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-5 space-y-6">
              
              {/* Product Info */}
              <div className="flex gap-4 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                  <p className="text-rose-600 font-bold text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                  {product.discount && <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">{product.discount}</span>}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tanggal Pengiriman</label>
                  <div className="relative">
                    <Calendar className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      required
                      className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Penerima & Alamat</label>
                  <div className="relative">
                    <User className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      required
                      placeholder="Nama & Area (e.g. Dinda, Jaksel)"
                      className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                      onChange={e => setFormData({...formData, recipient: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Isi Kartu Ucapan</label>
                  <div className="relative">
                    <FileText className="absolute top-3 left-3 text-gray-400" size={16} />
                    <textarea 
                      rows={2}
                      placeholder="Ucapan singkat..."
                      className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                </div>

                {/* Social Share & Action */}
                <div className="pt-2">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mr-1">Bagikan:</span>
                    
                    <button type="button" onClick={() => handleShare('copy')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition relative group" title="Copy Link">
                      <Copy size={14} />
                      {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded">Copied!</span>}
                    </button>
                    
                    <button type="button" onClick={() => handleShare('facebook')} className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition" title="Share to Facebook">
                      <Facebook size={16} />
                    </button>
                    
                    <button type="button" onClick={() => handleShare('instagram')} className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition" title="Open Instagram">
                      <InstagramIcon size={16} />
                    </button>

                    <button type="button" onClick={() => handleShare('tiktok')} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black hover:bg-black/10 transition" title="Open TikTok">
                      <TikTokIcon size={14} />
                    </button>

                    <button type="button" onClick={() => handleShare('twitter')} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black hover:bg-black/10 transition" title="Share to X">
                      <XIcon size={14} />
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-100 transform active:scale-[0.98]"
                  >
                    <MessageCircle size={20} />
                    Lanjut ke WhatsApp
                  </button>
                </div>
              </form>

              {/* Related Products Section */}
              {relatedProducts.length > 0 && (
                <div className="pt-6 border-t border-dashed border-gray-200">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider text-center">Lihat Koleksi Lainnya</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {relatedProducts.map(p => (
                      <Link href={`/product/${p.id}`} key={p.id} onClick={onClose} className="group cursor-pointer block">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 relative border border-gray-100 shadow-sm">
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          {p.discount && <span className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">{p.discount}</span>}
                        </div>
                        <p className="text-[11px] font-medium text-gray-700 line-clamp-1 group-hover:text-rose-600 transition">{p.name}</p>
                        <p className="text-[11px] font-bold text-rose-600">Rp {p.price.toLocaleString('id-ID')}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}