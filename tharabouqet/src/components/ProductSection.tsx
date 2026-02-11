'use client'
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product, Category } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  categories: Category[];
}

const ITEMS_PER_PAGE = 10; // Menampilkan 10 produk per halaman

export default function ProductSection({ products, categories }: ProductSectionProps) {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter Logic
  const filterOptions = ['All', ...categories.map(c => c.name)];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  // 2. Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // 3. Pagination Logic (Slicing Data)
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const scrollToSection = () => {
    const section = document.getElementById('products');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    scrollToSection(); // Scroll ke atas grid saat ganti halaman
  };

  return (
    <section id="products" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Our Collections</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Dibuat dengan bunga segar pilihan dan sentuhan artistik untuk setiap momen spesial Anda.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 sticky top-20 z-30 py-2 bg-white/80 backdrop-blur-md">
          {filterOptions.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                filter === cat 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid - UPDATED: grid-cols-2 for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {currentData.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl mt-4">
            <p className="text-gray-400">Belum ada produk di kategori {filter}.</p>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}