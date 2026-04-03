'use client'
import React from 'react';
import { Search, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Testimonial } from '@/types';

interface TestimonialTabProps {
  testimonials: Testimonial[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  resetForms: () => void;
  loading: boolean;
  getFilteredData: (data: any[]) => { data: any[], totalPages: number, totalItems: number };
  handleEdit: (item: any, type: string) => void;
  handleDelete: (table: string, id: string) => void;
  PaginationControls: React.FC<{ totalPages: number }>;
}

export const TestimonialTab: React.FC<TestimonialTabProps> = ({
  testimonials, searchQuery, setSearchQuery, setCurrentPage,
  showForm, setShowForm, resetForms, loading,
  getFilteredData, handleEdit, handleDelete, PaginationControls
}) => {
  const { data, totalPages } = getFilteredData(testimonials);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search testimonials..." 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm" 
          />
        </div>
        <button onClick={() => { if (showForm) resetForms(); else setShowForm(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold transition shadow-lg hover:bg-slate-800 whitespace-nowrap w-full md:w-auto justify-center">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-6 py-4 animate-pulse border-b border-gray-50">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-4 bg-yellow-100/50 rounded w-20" />
                <div className="h-4 bg-gray-50 rounded flex-1" />
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
                    <th className="pb-4">Customer</th>
                    <th className="pb-4">Rating</th>
                    <th className="pb-4">Review</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {data.length === 0 ? (
                    <tr><td colSpan={4} className="py-10 text-center text-gray-400">Tidak ada testimonial ditemukan.</td></tr>
                  ) : (
                    data.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition group">
                        <td className="py-4 pr-4 font-medium">{item.name}</td>
                        <td className="py-4 pr-4 text-yellow-500 font-bold">{'★'.repeat(item.rating)}</td>
                        <td className="py-4 pr-4 text-gray-500 italic truncate max-w-xs">"{item.text}"</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-2 md:group-hover:translate-x-0">
                            <button onClick={() => handleEdit(item, 'testimonials')} className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition" title="Edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete('testimonials', item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition" title="Hapus">
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
