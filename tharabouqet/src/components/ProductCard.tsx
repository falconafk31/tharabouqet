'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import OrderModal from '@/components/OrderModal'; // Import Modal yang sudah kita buat

export default function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk kontrol modal

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah navigasi jika ada link
    e.stopPropagation(); // Mencegah event bubbling
    setIsModalOpen(true); // Buka Modal
  };

  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
      >
        <Link href={`/product/${product.id}`}>
          <div className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* DISCOUNT BADGE */}
            {product.discount && (
              <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                {product.discount}
              </div>
            )}
            
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-600 shadow-sm">
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
            <div>
              {/* HARGA CORET */}
              {hasDiscount && (
                 <span className="text-xs text-gray-400 line-through block mb-0.5">
                    Rp {product.original_price?.toLocaleString('id-ID')}
                 </span>
              )}
              <span className="text-lg font-bold text-rose-600">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
            
            <button 
              onClick={handleOrderClick} // Menggunakan handler baru untuk membuka modal
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition shadow-green-100 shadow-md transform hover:-translate-y-0.5"
            >
              <MessageCircle size={16} />
              Pesan
            </button>
          </div>
        </div>
      </motion.div>

      {/* Render Modal Order di sini */}
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
      />
    </>
  );
}