'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, Download, Upload, Plus, Loader2, Image as ImageIcon, 
  ChevronUp, ChevronDown, ArrowUpDown, Eye, Pencil, Trash2 
} from 'lucide-react';
import { Product } from '@/types';

interface ProductTabProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  handleDownloadTemplate: () => void;
  handleExportExcel: () => void;
  handleImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  isSubmitting: boolean;
  uploadStatus: string;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  resetForms: () => void;
  loading: boolean;
  sortConfig: { key: string, direction: 'asc' | 'desc' | null };
  handleSort: (key: string) => void;
  getFilteredData: (data: any[]) => { data: any[], totalPages: number, totalItems: number };
  handleEdit: (item: any, type: string) => void;
  handleDelete: (table: string, id: string) => void;
  PaginationControls: React.FC<{ totalPages: number }>;
}

export const ProductTab: React.FC<ProductTabProps> = ({
  products, searchQuery, setSearchQuery, setCurrentPage, 
  handleDownloadTemplate, handleExportExcel, handleImportExcel,
  uploading, isSubmitting, uploadStatus, showForm, setShowForm,
  resetForms, loading, sortConfig, handleSort, getFilteredData,
  handleEdit, handleDelete, PaginationControls
}) => {
  const { data, totalPages } = getFilteredData(products);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm" 
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-bold transition shadow-sm whitespace-nowrap">
            <Download size={16} /> Template
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-bold transition shadow-sm whitespace-nowrap">
            <Download size={16} /> Export
          </button>
          <label className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-bold transition shadow-sm cursor-pointer whitespace-nowrap ${(uploading || isSubmitting) ? 'opacity-50 pointer-events-none' : ''}`}>
            {(uploading || isSubmitting) ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploadStatus || 'Import .xls'}
            <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" />
          </label>
          <button onClick={() => { if (showForm) resetForms(); else setShowForm(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold transition shadow-lg hover:bg-slate-800 whitespace-nowrap">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse border-b border-gray-50">
                <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-50 rounded w-1/6" />
                </div>
                <div className="w-24 h-4 bg-gray-100 rounded" />
                <div className="w-16 h-4 bg-gray-50 rounded" />
                <div className="w-24 h-4 bg-gray-100 rounded" />
                <div className="w-20 h-8 bg-gray-50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-4 w-20">Image</th>
                    <th className="pb-4">Produk & Kategori</th>
                    <th className="pb-4 cursor-pointer hover:text-gray-700 transition select-none" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">
                        Harga {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-30" />}
                      </div>
                    </th>
                    <th className="pb-4 cursor-pointer hover:text-gray-700 transition select-none" onClick={() => handleSort('discount')}>
                      <div className="flex items-center gap-1">
                        Diskon {sortConfig.key === 'discount' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-30" />}
                      </div>
                    </th>
                    <th className="pb-4 cursor-pointer hover:text-gray-700 transition select-none" onClick={() => handleSort('created_at')}>
                      <div className="flex items-center gap-1">
                        Tanggal {sortConfig.key === 'created_at' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-30" />}
                      </div>
                    </th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {data.length === 0 ? (
                    <tr><td colSpan={6} className="py-10 text-center text-gray-400">Tidak ada produk ditemukan.</td></tr>
                  ) : (
                    data.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition group">
                        <td className="py-4 pr-4 w-20">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden">
                            {(item.image_url || item.images?.[0]) ? (
                              <Image src={item.image_url || item.images?.[0]} alt={item.name} fill className="object-cover hover:scale-110 transition-transform" />
                            ) : (
                              <ImageIcon className="m-auto text-gray-300" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <span className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{item.name}</span>
                            <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-600 rounded text-[10px] font-bold uppercase tracking-wider">{item.category}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">Rp {item.price.toLocaleString()}</span>
                            {item.original_price && <span className="text-xs text-rose-500 line-through">Rp {item.original_price.toLocaleString()}</span>}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          {item.discount ? (
                            <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-100 shadow-sm">{item.discount}</span>
                          ) : <span className="text-gray-300">-</span>}
                        </td>
                        <td className="py-4 pr-4 text-xs text-gray-500 font-medium">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-2 md:group-hover:translate-x-0">
                            <Link href={`/product/${item.id}`} target="_blank" className="p-2 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition" title="Lihat di Web">
                              <Eye size={16} />
                            </Link>
                            <button onClick={() => handleEdit(item, 'products')} className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition" title="Edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete('products', item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition" title="Hapus">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
};
