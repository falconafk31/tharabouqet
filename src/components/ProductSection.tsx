'use client'
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product, Category } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  categories: Category[];
}

const ITEMS_PER_PAGE = 12; // Diubah dari 10 menjadi 12 agar presisi

export default function ProductSection({ products, categories }: ProductSectionProps) {
  const [filter, setFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter Logic
  const filterOptions = ['All', ...categories.map(c => c.name)];
  
  const priceOptions = [
    { label: 'Semua Harga', value: 'All' },
    { label: 'Di bawah 150rb', value: 'under_150' },
    { label: '150rb - 300rb', value: '150_to_300' },
    { label: 'Di atas 300rb', value: 'above_300' }
  ];

  const filteredProducts = products.filter(p => {
    if (filter !== 'All' && p.category !== filter) return false;
    
    if (priceFilter === 'under_150' && p.price >= 150000) return false;
    if (priceFilter === '150_to_300' && (p.price < 150000 || p.price > 300000)) return false;
    if (priceFilter === 'above_300' && p.price <= 300000) return false;

    return true;
  });

  // 2. Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, priceFilter]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    // Ganti logika scroll agar tidak melompat.
    // Gunakan setTimeout agar React merender jumlah produk yang sedikit dulu (di page terakhir)
    // sebelum browser menghitung jarak scroll ke atas.
    setTimeout(() => {
        const section = document.getElementById('products');
        if (section) {
            const yOffset = -80; // Offset untuk header
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, 100);
  };

  return (
    <section id="products" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Our Collections</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Dibuat dengan bunga segar pilihan dan sentuhan artistik untuk setiap momen spesial Anda.
          </p>
        </div>

        {/* Filter Controls - Sticky */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10 sticky top-20 z-30 py-3 px-4 bg-white/90 backdrop-blur-md rounded-b-xl transition-all shadow-sm border-b border-gray-50">
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
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

          {/* Price Filter Divider (Desktop only) */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

          {/* Budget Filter */}
          <select 
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-700 text-xs md:text-sm rounded-full font-medium focus:ring-2 focus:ring-rose-200 outline-none cursor-pointer hover:bg-gray-100 transition"
          >
            {priceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* FIX: Tambahkan min-h (Minimum Height) yang cukup panjang.
           12 Produk di mobile (grid-cols-2) butuh sekitar 1800px tinggi. 
           Desktop butuh sekitar 900px. Jika tinggi dijaga, testimoni tidak akan mendadak tertarik ke atas.
        */}
        <div className="min-h-[1700px] md:min-h-[900px] transition-all duration-500"> 
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
            {currentData.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl mt-4 flex flex-col items-center justify-center h-[400px]">
              <p className="text-gray-400">Belum ada produk di kategori {filter}.</p>
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-100">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}