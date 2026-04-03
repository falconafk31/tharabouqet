'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import OrderModal from '@/components/OrderModal';

export default function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsModalOpen(true);
  };

  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
      >
        <Link href={`/product/${product.id}`}>
          {/* Height disesuaikan untuk mobile agar proporsional */}
          <div className="relative h-40 md:h-72 overflow-hidden bg-gray-50 cursor-pointer">
            
            <Image 
              src={product.image_url} 
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Discount Badge - Smaller on Mobile */}
            {product.discount && (
              <div className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 tracking-wide uppercase">
                {product.discount}
              </div>
            )}
            
            {/* Category Badge - Hidden on very small screens to save space, or make smaller */}
            <div className="absolute top-2 right-2 hidden md:block">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full text-gray-600 shadow-sm border border-gray-100">
                {product.category}
              </span>
            </div>
          </div>
        </Link>
        
        <div className="p-3 md:p-5 flex flex-col flex-grow">
          <Link href={`/product/${product.id}`}>
            {/* Judul lebih kecil di mobile */}
            <h3 className="text-sm md:text-lg font-serif font-bold text-gray-900 mb-1 hover:text-rose-600 transition cursor-pointer line-clamp-2 md:line-clamp-1 leading-tight">
              {product.name}
            </h3>
          </Link>
          
          {/* Deskripsi disembunyikan di mobile agar layout 2 kolom rapi */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10 hidden md:block">{product.description}</p>
          
          <div className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-0">
            <div className="flex flex-col">
              {hasDiscount && (
                 <span className="text-[10px] md:text-xs text-gray-400 line-through mb-0">
                    Rp {product.original_price?.toLocaleString('id-ID')}
                 </span>
              )}
              <span className="text-sm md:text-lg font-bold text-rose-600">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
            
            {/* Tombol Pesan - Icon only on Mobile to save space, Full on Desktop */}
            <button 
              onClick={handleOrderClick} 
              className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition shadow-green-100 shadow-md transform hover:-translate-y-0.5 active:scale-95 w-full md:w-auto"
            >
              <MessageCircle size={16} />
              <span className="md:inline">Pesan</span>
            </button>
          </div>
        </div>
      </motion.div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
      />
    </>
  );
}