'use client'
import { useState } from 'react';
import ProductCard from './ProductCard';
import { Product, Category } from '@/types';

interface ProductSectionProps {
  products: Product[];
  categories: Category[];
}

export default function ProductSection({ products, categories }: ProductSectionProps) {
  const [filter, setFilter] = useState('All');

  // Gabungkan 'All' dengan kategori dari database
  const filterOptions = ['All', ...categories.map(c => c.name)];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Collections</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Dibuat dengan bunga segar pilihan dan sentuhan artistik untuk setiap momen spesial Anda.
          </p>
        </div>

        {/* Dynamic Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterOptions.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">Belum ada produk di kategori {filter}.</p>
          </div>
        )}
      </div>
    </section>
  );
}