'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ChevronLeft, ChevronRight, Loader2, Copy, Facebook, Check, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import OrderModal from '@/components/OrderModal';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';

// --- CUSTOM SOCIAL ICONS ---
const XIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom Toast Message State
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      const { data: currentData, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !currentData) {
        setLoading(false);
        return;
      }

      setProduct(currentData);

      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .neq('id', id) 
        .limit(4);     
      
      if (relatedData) {
        setRelatedProducts(relatedData as Product[]);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500); // Sembunyikan setelah 3.5 detik
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-rose-500" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Produk tidak ditemukan</div>;

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const hasDiscount = product.original_price && product.original_price > product.price;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Cek buket cantik ini dari Tharabouqet: ${product.name}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showToast('Link berhasil disalin!');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'instagram' || platform === 'tiktok') {
      // Logic Khusus IG & TikTok: Copy Link + Info User
      navigator.clipboard.writeText(url);
      const appName = platform === 'instagram' ? 'Instagram' : 'TikTok';
      showToast(`Link disalin! Silakan paste di aplikasi ${appName}.`);
      
      // Delay sedikit sebelum membuka webnya agar user sempat membaca notifikasi
      setTimeout(() => {
        window.open(`https://www.${platform}.com/`, '_blank');
      }, 2000);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 relative">
      {/* Toast Notification Element */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-full flex items-center gap-2 shadow-xl whitespace-nowrap"
          >
            <CheckCircle size={18} className="text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-rose-600 transition">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden group border border-gray-100 shadow-sm">
              {/* DISCOUNT BADGE */}
              {product.discount && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg z-20">
                  {product.discount}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-white hover:scale-110 z-10 text-gray-700">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-white hover:scale-110 z-10 text-gray-700">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-rose-500 ring-2 ring-rose-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wide border border-rose-100">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex flex-col items-start gap-1">
                {hasDiscount && (
                   <span className="text-lg text-gray-400 line-through">
                     Rp {product.original_price?.toLocaleString('id-ID')}
                   </span>
                )}
                <div className="flex items-center gap-3">
                   <p className="text-3xl font-bold text-rose-600">
                      Rp {product.price.toLocaleString('id-ID')}
                   </p>
                   {product.discount && (
                      <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-100">
                        Hemat {product.discount}
                      </span>
                   )}
                </div>
              </div>
            </div>
            
            <div className="prose prose-slate prose-sm text-gray-600 leading-relaxed whitespace-pre-line mb-8 border-t border-b border-gray-100 py-6">
              {product.description}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mb-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition shadow-lg shadow-green-100 transform active:scale-[0.98]"
              >
                <MessageCircle size={24} />
                Pesan Sekarang via WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400">
                *Pembayaran & Detail Pengiriman akan dikonfirmasi via WhatsApp
              </p>
            </div>

            {/* SHARE SECTION */}
            <div className="mt-auto pt-6 border-t border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bagikan Produk Ini</p>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition" title="Share via WhatsApp">
                  <WhatsAppIcon size={18} />
                </button>
                <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition" title="Share to Facebook">
                  <Facebook size={18} />
                </button>
                <button onClick={() => handleShare('instagram')} className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition" title="Share to Instagram">
                  <InstagramIcon size={18} />
                </button>
                <button onClick={() => handleShare('tiktok')} className="w-10 h-10 rounded-full bg-black/5 text-black flex items-center justify-center hover:bg-black/10 transition" title="Share to TikTok">
                  <TikTokIcon size={16} />
                </button>
                <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-black/5 text-black flex items-center justify-center hover:bg-black/10 transition" title="Share to X">
                  <XIcon size={16} />
                </button>
                <button onClick={() => handleShare('copy')} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition relative" title="Copy Link">
                  {toastMsg.includes('disalin') ? <Check size={18} className="text-green-600"/> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Mungkin Anda Suka</h2>
              <Link href="/#products" className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL ORDER */}
      {product && (
        <OrderModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={product} 
        />
      )}
    </main>
  );
}