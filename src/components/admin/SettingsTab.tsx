'use client'
import React from 'react';
import { Settings as SettingsIcon, Phone, Share2, MapPin, Clock, Save, Loader2, Globe } from 'lucide-react';

interface SettingsTabProps {
  settings: Record<string, string>;
  setSettings: (settings: any) => void;
  isSubmitting: boolean;
  submitSettings: (e: React.FormEvent) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, setSettings, isSubmitting, submitSettings }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <SettingsIcon className="text-slate-500" /> Pengaturan Toko
      </h2>
      <form onSubmit={submitSettings} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="font-bold text-gray-800 border-b pb-2">Kontak & Sosmed</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone size={14} /> Nomor WhatsApp
            </label>
            <input 
              value={settings.whatsapp_number || ''} 
              onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="6281234567890" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Share2 size={14} /> Instagram URL
            </label>
            <input 
              value={settings.instagram_url || ''} 
              onChange={e => setSettings({ ...settings, instagram_url: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="https://instagram.com/..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Share2 size={14} /> TikTok URL
            </label>
            <input 
              value={settings.tiktok_url || ''} 
              onChange={e => setSettings({ ...settings, tiktok_url: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="https://tiktok.com/..." 
            />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="font-bold text-gray-800 border-b pb-2">SEO & Metadata</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe size={14} /> SEO Meta Title
            </label>
            <input 
              value={settings.seo_title || ''} 
              onChange={e => setSettings({ ...settings, seo_title: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="Tharabouqet - Florist & Bouquet Specialist" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe size={14} /> SEO Meta Description
            </label>
            <textarea 
              value={settings.seo_description || ''} 
              onChange={e => setSettings({ ...settings, seo_description: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="Deskripsi toko Anda untuk Google Search..." 
              rows={2} 
            />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="font-bold text-gray-800 border-b pb-2">Lokasi & Jam Operasional</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={14} /> Alamat Baris 1
            </label>
            <input 
              value={settings.address_line1 || ''} 
              onChange={e => setSettings({ ...settings, address_line1: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="Jl. Mawar No. 123" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={14} /> Alamat Baris 2
            </label>
            <input 
              value={settings.address_line2 || ''} 
              onChange={e => setSettings({ ...settings, address_line2: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="Jakarta Selatan, 12345" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={14} /> Jam Kerja (Weekdays)
            </label>
            <input 
              value={settings.hours_weekdays || ''} 
              onChange={e => setSettings({ ...settings, hours_weekdays: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="Mon - Sat: 09:00 - 17:00" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={14} /> Jam Kerja (Weekend)
            </label>
            <input 
              value={settings.hours_weekends || ''} 
              onChange={e => setSettings({ ...settings, hours_weekends: e.target.value })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" 
              placeholder="Sun: Closed" 
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex items-center justify-center gap-2 bg-green-600 text-white w-full py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};
