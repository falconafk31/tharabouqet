'use client'
import React from 'react';
import { Search, Plus, Loader2, Trash2 } from 'lucide-react';
import { Category } from '@/types';

interface CategoryTabProps {
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  resetForms: () => void;
  loading: boolean;
  getFilteredData: (data: any[]) => { data: any[], totalPages: number, totalItems: number };
  handleDelete: (table: string, id: string) => void;
  PaginationControls: React.FC<{ totalPages: number }>;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  categories, searchQuery, setSearchQuery, setCurrentPage,
  showForm, setShowForm, resetForms, loading,
  getFilteredData, handleDelete, PaginationControls
}) => {
  const { data, totalPages } = getFilteredData(categories);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm" 
          />
        </div>
        <button onClick={() => { if (showForm) resetForms(); else setShowForm(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold transition shadow-lg hover:bg-slate-800 whitespace-nowrap w-full md:w-auto justify-center">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 animate-pulse border-b border-gray-50">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="w-10 h-10 bg-gray-50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-4">Category Name</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {data.length === 0 ? (
                    <tr><td colSpan={2} className="py-10 text-center text-gray-400">Tidak ada kategori ditemukan.</td></tr>
                  ) : (
                    data.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition group">
                        <td className="py-4 pr-4 font-bold text-gray-800">{item.name}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDelete('categories', item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition inline-flex opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-2 md:group-hover:translate-x-0" title="Hapus">
                            <Trash2 size={16} />
                          </button>
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
