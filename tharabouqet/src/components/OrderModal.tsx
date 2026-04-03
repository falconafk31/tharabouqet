'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, User, Copy, Facebook, CheckCircle } from 'lucide-react';

// Menggunakan alias import standar proyek Next.js Anda
import { Product } from '@/types';
import { supabase } from '@/lib/supabase'; 
import Link from 'next/link';

const DEFAULT_WA = '6281234567890'; 

// --- ICON SVG CUSTOM ---
const WhatsAppIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

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
  const [formData, setFormData] = useState({ date: '', recipient: '', message: '' });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WA);
  
  const [toastMsg, setToastMsg] = useState('');

  // 1. Menghitung Minimal Tanggal Pengiriman (Hari ini + 3 hari)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // Tambah 3 hari pengerjaan PO
    return date.toISOString().split('T')[0]; // Format ke YYYY-MM-DD
  };
  const minDate = getMinDate();

  useEffect(() => {
    if (!isOpen) return;
    const fetchInitialData = async () => {
        const { data: settings } = await supabase.from('store_settings').select('value').eq('key', 'whatsapp_number').single();
        if (settings) setWhatsappNumber(settings.value);

        const { data: products } = await supabase.from('products').select('*').neq('id', product.id).limit(3); 
        if (products) setRelatedProducts(products as Product[]);
    };
    fetchInitialData();
  }, [isOpen, product.id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Menghapus emoji dan menggunakan array join('\n') 
    // agar pesan otomatis memiliki baris baru (enter) di WhatsApp
    const messageLines = [
      "Halo Tharabouqet, saya ingin memesan:",
      "--------------------------------",
      `Produk: *${product.name}*`,
      `Harga: Rp ${product.price.toLocaleString('id-ID')}`,
      "--------------------------------",
      `Tanggal Kirim: ${formData.date}`,
      `Penerima: ${formData.recipient}`,
      `Kartu Ucapan: ${formData.message || '-'}`,
      "--------------------------------",
      "Mohon info ketersediaan & ongkirnya ya kak. Terima kasih!"
    ];
    
    const text = messageLines.join('\n');
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
    onClose();
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Cek buket cantik ini: ${product.name}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showToast('Link berhasil disalin!');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'instagram' || platform === 'tiktok') {
      navigator.clipboard.writeText(url);
      const appName = platform === 'instagram' ? 'Instagram' : 'TikTok';
      showToast(`Link disalin! Silakan paste di aplikasi ${appName}.`);
      
      setTimeout(() => {
        window.open(`https://www.${platform}.com/`, '_blank');
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col"
          >
            <AnimatePresence>
              {toastMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-xl whitespace-nowrap"
                >
                  <CheckCircle size={14} className="text-green-400" />
                  {toastMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white px-5 py-4 border-b border-gray-100 flex justify-between items-center shrink-0 z-20">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Detail Pemesanan</h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"><X size={20} /></button>
            </div>

            <div className="overflow-y-auto p-5 space-y-6">
              <div className="flex gap-4 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                  <p className="text-rose-600 font-bold text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                  {product.discount && <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">{product.discount}</span>}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tanggal Pengiriman</label>
                  <div className="relative">
                    <Calendar className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      required 
                      min={minDate} 
                      className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" 
                      onChange={e => setFormData({...formData, date: e.target.value})} 
                    />
                  </div>
                  <p className="text-[10px] text-rose-500 mt-1.5 font-medium">*Sistem PO: Pengiriman minimal 3 hari dari hari pemesanan.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Penerima & Alamat</label>
                  <div className="relative">
                    <User className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input type="text" required placeholder="Nama & Area (e.g. Dinda, Jaksel)" className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" onChange={e => setFormData({...formData, recipient: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Isi Kartu Ucapan</label>
                  <div className="relative">
                    <FileText className="absolute top-3 left-3 text-gray-400" size={16} />
                    <textarea rows={2} placeholder="Ucapan singkat..." className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" onChange={e => setFormData({...formData, message: e.target.value})} />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mr-1">Bagikan:</span>
                    
                    <button type="button" onClick={() => handleShare('copy')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition" title="Copy Link">
                      <Copy size={14} />
                    </button>

                    <button type="button" onClick={() => handleShare('whatsapp')} className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition" title="Share via WhatsApp">
                      <WhatsAppIcon size={14} />
                    </button>
                    
                    <button type="button" onClick={() => handleShare('facebook')} className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition" title="Share to Facebook">
                      <Facebook size={16} />
                    </button>
                    
                    <button type="button" onClick={() => handleShare('instagram')} className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition" title="Share to Instagram">
                      <InstagramIcon size={16} />
                    </button>

                    <button type="button" onClick={() => handleShare('tiktok')} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black hover:bg-black/10 transition" title="Share to TikTok">
                      <TikTokIcon size={14} />
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg transform active:scale-95">
                    <WhatsAppIcon size={20} /> Lanjut ke WhatsApp
                  </button>
                </div>
              </form>

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