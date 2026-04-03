'use client'
import React from 'react';
import { Phone, Share2, Calculator } from 'lucide-react';

interface AnalyticsTabProps {
  totalClicks: { orders: number, shares: number };
  analyticsData: { product_id: string, name: string, count: number }[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ totalClicks, analyticsData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-6">
          <div className="p-4 bg-green-500 text-white rounded-2xl shadow-lg">
            <Phone size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Pesanan WA</p>
            <h3 className="text-4xl font-black text-gray-900">{totalClicks.orders}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-6">
          <div className="p-4 bg-blue-500 text-white rounded-2xl shadow-lg">
            <Share2 size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Share Produk</p>
            <h3 className="text-4xl font-black text-gray-900">{totalClicks.shares}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Performa Produk (Klik Terbanyak)</h3>
          <Calculator className="text-gray-400" size={20} />
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="pb-4">Nama Produk</th>
                  <th className="pb-4 text-right">Jumlah Klik</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {analyticsData.map((item) => (
                  <tr key={item.product_id} className="border-b border-gray-50 hover:bg-gray-50 transition group">
                    <td className="py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="py-4 text-right">
                      <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-black">
                        {item.count} Klik
                      </span>
                    </td>
                  </tr>
                ))}
                {analyticsData.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-10 text-center text-gray-400">
                      Belum ada data pelacakan klik.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
