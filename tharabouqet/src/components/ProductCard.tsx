'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image'; // Import Next Image
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
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
      >
        <Link href={`/product/${product.id}`}>
          <div className="relative h-72 overflow-hidden bg-gray-50 cursor-pointer">
            
            {/* OPTIMISASI GAMBAR: Menggunakan next/image */}
            <Image 
              src={product.image_url} 
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              // Sizes sangat penting untuk performa grid!
              // Artinya: Di HP ambil lebar 100vw, di Tablet 50vw, di Desktop 25vw
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            {/* DISCOUNT BADGE */}
            {product.discount && (
              <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10 tracking-wide uppercase">
                {product.discount}
              </div>
            )}
            
            {/* CATEGORY BADGE */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full text-gray-600 shadow-sm border border-gray-100">
                {product.category}
              </span>
            </div>
          </div>
        </Link>
        
        <div className="p-5 flex flex-col flex-grow">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1 hover:text-rose-600 transition cursor-pointer line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
          
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {hasDiscount && (
                 <span className="text-xs text-gray-400 line-through mb-0.5">
                    Rp {product.original_price?.toLocaleString('id-ID')}
                 </span>
              )}
              <span className="text-lg font-bold text-rose-600">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
            
            <button 
              onClick={handleOrderClick} 
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-green-100 transform hover:-translate-y-0.5"
            >
              <MessageCircle size={16} />
              Pesan
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