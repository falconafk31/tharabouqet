'use client'
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Promo, Product, Testimonial, Category, StoreSetting } from '@/types';
import Image from 'next/image';
import {
  LogOut, Plus, Trash2, X, Image as ImageIcon, Loader2,
  ShoppingBag, Megaphone, MessageSquareQuote, MinusCircle, Pencil,
  UploadCloud, Calculator, Layers, Settings, Save, MapPin, Clock, Share2, Phone,
  CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Search, Download, Upload, ArrowUpDown, ChevronUp, ChevronDown, Eye, Globe
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { AnalyticsTab } from './admin/AnalyticsTab';
import { SettingsTab } from './admin/SettingsTab';
import { ProductTab } from './admin/ProductTab';
import { PromoTab } from './admin/PromoTab';
import { CategoryTab } from './admin/CategoryTab';
import { TestimonialTab } from './admin/TestimonialTab';

// --- CONSTANTS ---
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp'
};
const ITEMS_PER_PAGE = 10;

// --- UI COMPONENTS ---
const FileUploadBox = ({ onChange, label, disabled = false }: { onChange: (e: any) => void, label: string, disabled?: boolean }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className={`flex items-center justify-center w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 group ${disabled ? 'pointer-events-none' : ''}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-8 h-8 mb-3 text-gray-400 group-hover:text-rose-500 transition-colors" />
          <p className="mb-1 text-sm text-gray-500"><span className="font-semibold text-rose-600">Klik untuk upload</span></p>
          <p className="text-xs text-gray-400">Auto Compressed (WebP)</p>
        </div>
        <input type="file" className="hidden" onChange={onChange} accept="image/*" disabled={disabled} />
      </label>
    </div>
  </div>
);

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in-down ${type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'}`}>
    {type === 'success' ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100"><X size={16} /></button>
  </div>
);

// UPDATED: Interactive Stats Card
const StatsCard = ({ title, count, icon: Icon, color, onClick }: { title: string, count: number, icon: any, color: string, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95' : ''}`}
  >
    <div className={`p-3 rounded-full ${color} text-white shadow-md`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
    </div>
  </div>
);

// UPDATED: Modal with Backdrop Close
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden animate-fade-in"
      onClick={onClose} // Close on backdrop click
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in relative"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'promos' | 'products' | 'testimonials' | 'categories' | 'settings' | 'analytics'>('products');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: 'created_at', direction: 'desc' });
  const [totalProducts, setTotalProducts] = useState(0);

  const [promos, setPromos] = useState<Promo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp_number: '', instagram_url: '', tiktok_url: '',
    address_line1: '', address_line2: '', hours_weekdays: '', hours_weekends: '',
    seo_title: '', seo_description: '', seo_keywords: ''
  });
  const [analyticsData, setAnalyticsData] = useState<{product_id: string, name: string, count: number}[]>([]);
  const [totalClicks, setTotalClicks] = useState({ orders: 0, shares: 0 });

  const [promoForm, setPromoForm] = useState({ title: '', subtitle: '', image_url: '', button_text: 'Lihat Promo', button_link: '#products', discount: '' });
  const [productForm, setProductForm] = useState({
    name: '', price: '', original_price: '', temp_discount_percent: '',
    category: '', image_url: '', images: [] as string[], description: '', discount: ''
  });
  const [testiForm, setTestiForm] = useState({ name: '', text: '', rating: '5' });
  const [catForm, setCatForm] = useState({ name: '' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // Fetch Settings, Categories, Promos, Testimonials (can be kept simple for now)
    const [promosRes, testiRes, catRes, settingsRes, totalProductsRes] = await Promise.all([
      supabase.from('promos').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase.from('store_settings').select('*'),
      supabase.from('products').select('*', { count: 'exact', head: true })
    ]);
    
    if (totalProductsRes.count !== null) setTotalProducts(totalProductsRes.count);

    // Fetch Products with Server-Side Pagination & Search
    let productQuery = supabase.from('products').select('*', { count: 'exact' });
    
    if (searchQuery) {
      productQuery = productQuery.ilike('name', `%${searchQuery}%`);
    }

    if (sortConfig.key) {
      productQuery = productQuery.order(sortConfig.key as any, { ascending: sortConfig.direction === 'asc' });
    } else {
      productQuery = productQuery.order('created_at', { ascending: false });
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;
    const productsRes = await productQuery.range(start, end);

    // Fetch Analytics
    const { data: clicks } = await supabase.from('click_analytics').select('*, products(name)');
    if (clicks) {
      const orderCount = clicks.filter(c => c.type === 'whatsapp_order').length;
      const shareCount = clicks.filter(c => c.type === 'whatsapp_share').length;
      setTotalClicks({ orders: orderCount, shares: shareCount });

      // Group by product
      const productStats: Record<string, {name: string, count: number}> = {};
      clicks.forEach(c => {
        if (!c.product_id) return;
        if (!productStats[c.product_id]) {
          productStats[c.product_id] = { name: c.products?.name || 'Unknown', count: 0 };
        }
        productStats[c.product_id].count++;
      });
      setAnalyticsData(Object.entries(productStats).map(([id, stats]) => ({ product_id: id, ...stats })).sort((a,b) => b.count - a.count));
    }

    if (promosRes.data) setPromos(promosRes.data);
    if (productsRes.data) setProducts(productsRes.data as unknown as Product[]);
    if (productsRes.count !== null) setTotalProducts(productsRes.count);
    
    if (testiRes.data) setTestimonials(testiRes.data);
    if (catRes.data) {
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !productForm.category) {
        setProductForm(prev => ({ ...prev, category: catRes.data[0].name }));
      }
    }
    if (settingsRes.data) {
      const settingsMap: Record<string, string> = {};
      settingsRes.data.forEach((item: StoreSetting) => settingsMap[item.key] = item.value);
      setSettings(prev => ({ ...prev, ...settingsMap }));
    }
    setLoading(false);
  }, [currentPage, searchQuery, sortConfig]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForms = () => {
    setShowForm(false);
    setEditingId(null);
    setPromoForm({ title: '', subtitle: '', image_url: '', button_text: 'Lihat Promo', button_link: '#products', discount: '' });
    const defaultCat = categories.length > 0 ? categories[0].name : '';
    setProductForm({ name: '', price: '', original_price: '', temp_discount_percent: '', category: defaultCat, image_url: '', images: [], description: '', discount: '' });
    setTestiForm({ name: '', text: '', rating: '5' });
    setCatForm({ name: '' });
    setIsSubmitting(false);
    setUploadStatus('');
  };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    resetForms();
    setCurrentPage(1);
    setSearchQuery('');
    setSortConfig({ key: 'created_at', direction: 'desc' });
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
    setSortConfig({ key, direction });
  };

  const handlePriceCalculation = (field: 'original' | 'percent', value: string) => {
    let newOriginal = field === 'original' ? value : productForm.original_price;
    let newPercent = field === 'percent' ? value : productForm.temp_discount_percent;
    setProductForm(prev => ({ ...prev, original_price: newOriginal, temp_discount_percent: newPercent }));
    if (newOriginal && newPercent) {
      const original = parseInt(newOriginal);
      const percent = parseInt(newPercent);
      if (!isNaN(original) && !isNaN(percent)) {
        const discountAmount = original * (percent / 100);
        const finalPrice = original - discountAmount;
        setProductForm(prev => ({ ...prev, original_price: newOriginal, temp_discount_percent: newPercent, price: finalPrice.toString(), discount: `${percent}% OFF` }));
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) await supabase.auth.signOut();
  };

  const handleEdit = (item: any, type: string) => {
    setEditingId(item.id);
    setShowForm(true);

    switch (type) {
      case 'promos':
        setPromoForm({ title: item.title, subtitle: item.subtitle, image_url: item.image_url, button_text: item.button_text, button_link: item.button_link || '#products', discount: item.discount || '' });
        break;
      case 'products':
        const p = item as Product;
        const images = p.images && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : []);
        let percent = '';
        if (p.original_price && p.price) {
          percent = Math.round(((p.original_price - p.price) / p.original_price) * 100).toString();
        }
        setProductForm({
          name: p.name, price: p.price.toString(), original_price: p.original_price ? p.original_price.toString() : '', temp_discount_percent: percent,
          category: p.category, image_url: p.image_url, images: images, description: p.description, discount: p.discount || ''
        });
        break;
      case 'testimonials':
        setTestiForm({ name: item.name, text: item.text, rating: item.rating.toString() });
        break;
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Hapus data ini permanen?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Data berhasil dihapus', 'success'); fetchData(); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'promo' | 'product' | 'gallery') => {
    const fileInput = e.target;
    try {
      if (!fileInput.files || fileInput.files.length === 0) return;
      const originalFile = fileInput.files[0];
      if (!originalFile.type.startsWith('image/')) { showToast('File harus berupa gambar', 'error'); return; }
      if (originalFile.size > MAX_FILE_SIZE) { showToast('Ukuran file maks 2MB', 'error'); return; }

      setUploading(true);
      setUploadStatus('Loading Library...');
      const imageCompression = (await import('browser-image-compression')).default;
      setUploadStatus('Compressing...');
      const compressedFile = await imageCompression(originalFile, COMPRESSION_OPTIONS);
      setUploadStatus('Uploading...');
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.webp`;
      const filePath = type === 'gallery' ? `products/gallery/${fileName}` : `${type}s/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('bouquets').upload(filePath, compressedFile);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('bouquets').getPublicUrl(filePath);

      if (type === 'promo') setPromoForm(prev => ({ ...prev, image_url: data.publicUrl }));
      else if (type === 'product') setProductForm(prev => ({ ...prev, image_url: data.publicUrl }));
      else if (type === 'gallery') {
        if (productForm.images.length >= 3) showToast("Maksimal 3 foto gallery", 'error');
        else setProductForm(prev => ({ ...prev, images: [...prev.images, data.publicUrl] }));
      }
    } catch (error: any) { showToast(`Gagal upload: ${error.message}`, 'error'); }
    finally { setUploading(false); setUploadStatus(''); if (fileInput) fileInput.value = ''; }
  };

  const removeGalleryImage = (idx: number) => {
    setProductForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleFormSubmit = async (e: React.FormEvent, table: string, payload: any, resetAction: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);
    let error;
    if (editingId) { const { error: err } = await supabase.from(table).update(payload).eq('id', editingId); error = err; }
    else { const { error: err } = await supabase.from(table).insert([payload]); error = err; }
    setIsSubmitting(false);
    if (!error) { showToast('Data berhasil disimpan!', 'success'); resetAction(); fetchData(); }
    else { showToast(error.message, 'error'); }
  };

  const submitPromo = (e: React.FormEvent) => handleFormSubmit(e, 'promos', { ...promoForm, is_active: true }, resetForms);
  const submitProduct = (e: React.FormEvent) => {
    const finalImages = productForm.images.length > 0 ? productForm.images : (productForm.image_url ? [productForm.image_url] : []);
    const mainImage = productForm.image_url || (finalImages.length > 0 ? finalImages[0] : '');
    const payload = {
      name: productForm.name, price: parseInt(productForm.price.toString()), original_price: productForm.original_price ? parseInt(productForm.original_price.toString()) : null,
      category: productForm.category, image_url: mainImage, images: finalImages, description: productForm.description, discount: productForm.discount
    };
    handleFormSubmit(e, 'products', payload, resetForms);
  };
  const submitTesti = (e: React.FormEvent) => handleFormSubmit(e, 'testimonials', { ...testiForm, rating: parseInt(testiForm.rating) }, resetForms);
  const submitCategory = (e: React.FormEvent) => handleFormSubmit(e, 'categories', { name: catForm.name }, resetForms);
  const submitSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    const updates = Object.keys(settings).map(key => ({ key, value: settings[key] }));
    const { error } = await supabase.from('store_settings').upsert(updates);
    setIsSubmitting(false);
    if (!error) { showToast("Pengaturan disimpan!", 'success'); fetchData(); }
    else showToast(error.message, 'error');
  };

  const getFilteredData = (data: any[]) => {
    if (activeTab === 'products') {
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
        return { data: products, totalPages, totalItems: totalProducts };
    }

    let filtered = data;
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      filtered = data.filter(item =>
        (item.name && item.name.toLowerCase().includes(lowerQ)) ||
        (item.title && item.title.toLowerCase().includes(lowerQ)) ||
        (item.text && item.text.toLowerCase().includes(lowerQ))
      );
    }
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return { data: paginatedData, totalPages, totalItems };
  };

  const PaginationControls = ({ totalPages }: { totalPages: number }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-end items-center gap-2 mt-6">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30"><ChevronLeft size={18} /></button>
        <span className="text-sm font-medium text-gray-600 px-2">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30"><ChevronRight size={18} /></button>
      </div>
    );
  };

  // --- BULK EXCEL IMPORT EXPORT ---
  const handleDownloadTemplate = () => {
    try {
      const templateData = [{
        name: 'Contoh Buket Spesial',
        price: '150000',
        original_price: '200000',
        discount_percent: '25',
        category: 'Graduation (Penyamaan huruf besar kecil wajib sama di database)',
        description: 'Deskripsi lengkap buket Anda.',
        discount: '25% OFF',
        image_url: 'https://images.unsplash.com/contoh-utama',
        images_gallery: 'https://gambar1.jpg, https://gambar2.jpg'
      }];
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template Import");

      // Auto-size columns slightly for better readability
      worksheet['!cols'] = Object.keys(templateData[0]).map(() => ({ wch: 25 }));

      XLSX.writeFile(workbook, `Template_Import_Tharabouqet.xlsx`);
      showToast("Template Excel telah diunduh", "success");
    } catch (err: any) {
      showToast("Gagal download template: " + err.message, "error");
    }
  };

  const handleExportExcel = () => {
    try {
      const flattenedData = products.map(p => ({
        name: p.name,
        price: p.price,
        original_price: p.original_price || '',
        category: p.category,
        description: p.description || '',
        discount: p.discount || '',
        image_url: p.image_url || '',
        images_gallery: p.images ? p.images.join(',') : ''
      }));
      const worksheet = XLSX.utils.json_to_sheet(flattenedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, `Tharabouqet_Products_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast("Berhasil export ke Excel", "success");
    } catch (err: any) {
      showToast("Gagal export excel: " + err.message, "error");
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus("Membaca File Excel...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const buffer = event.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        setUploadStatus(`Menyimpan ${jsonData.length} produk ke database...`);
        setIsSubmitting(true);

        const newProducts = jsonData.map(row => {
          let gallery = [];
          if (row.images_gallery && typeof row.images_gallery === 'string') {
            gallery = row.images_gallery.split(',').map((u: string) => u.trim()).filter(Boolean);
          }

          // Sistem Auto-Kalkulator Diskon jika kolom Excel `price` sengaja dibiarkan kosong
          let finalPrice = row.price;
          let labelDiscount = row.discount;

          if (!finalPrice && row.original_price && row.discount_percent) {
            const orig = parseInt(row.original_price.toString());
            const perc = parseInt(row.discount_percent.toString());
            finalPrice = orig - (orig * (perc / 100));
            if (!labelDiscount) labelDiscount = `${perc}% OFF`;
          }

          return {
            name: row.name || 'Produk Tanpa Nama',
            price: finalPrice ? parseInt(finalPrice.toString()) : 0,
            original_price: row.original_price ? parseInt(row.original_price.toString()) : null,
            category: row.category || 'Lainnya',
            description: row.description || '',
            discount: labelDiscount || '',
            image_url: row.image_url || '',
            images: gallery
          };
        });

        // Supabase bulk insert
        const { error } = await supabase.from('products').insert(newProducts);

        if (error) throw error;

        showToast(`Berhasil upload ${newProducts.length} produk!`, 'success');
        fetchData();
      } catch (err: any) {
        showToast("Error import: " + err.message, "error");
      } finally {
        setUploading(false);
        setIsSubmitting(false);
        setUploadStatus('');
        e.target.value = ''; // reset input
      }
    };
    reader.onerror = () => {
      showToast("Gagal membaca file excel", "error");
      setUploading(false);
      e.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="col-span-1 md:col-span-4 bg-slate-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
            <div>
              <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">Manage your florist store</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-medium text-sm transition-all shadow-md">
              <LogOut size={16} /> Logout
            </button>
          </div>

          <StatsCard title="Total Products" count={totalProducts} icon={ShoppingBag} color="bg-rose-500" onClick={() => handleTabChange('products')} />
          <StatsCard title="Active Promos" count={promos.length} icon={Megaphone} color="bg-blue-500" onClick={() => handleTabChange('promos')} />
          <StatsCard title="Categories" count={categories.length} icon={Layers} color="bg-orange-500" onClick={() => handleTabChange('categories')} />
          <StatsCard title="Testimonials" count={testimonials.length} icon={MessageSquareQuote} color="bg-green-500" onClick={() => handleTabChange('testimonials')} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {['products', 'promos', 'categories', 'testimonials', 'analytics', 'settings'].map(tab => (
             <button key={tab} onClick={() => handleTabChange(tab)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 capitalize ${activeTab === tab ? 'bg-rose-50 text-rose-600 shadow-sm ring-1 ring-rose-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                {tab === 'promos' && <Megaphone size={16}/>}
                {tab === 'products' && <ShoppingBag size={16}/>}
                {tab === 'categories' && <Layers size={16}/>}
                {tab === 'testimonials' && <MessageSquareQuote size={16}/>}
                {tab === 'analytics' && <Calculator size={16}/>}
                {tab === 'settings' && <Settings size={16}/>}
                {tab}
             </button>
          ))}
        </div>

        {/* REFACTORED CONTENT AREA */}
        {activeTab === 'products' && (
          <ProductTab 
            products={products} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage} handleDownloadTemplate={handleDownloadTemplate}
            handleExportExcel={handleExportExcel} handleImportExcel={handleImportExcel}
            uploading={uploading} isSubmitting={isSubmitting} uploadStatus={uploadStatus}
            showForm={showForm} setShowForm={setShowForm} resetForms={resetForms}
            loading={loading} sortConfig={sortConfig} handleSort={handleSort}
            getFilteredData={getFilteredData} handleEdit={handleEdit} handleDelete={handleDelete}
            PaginationControls={PaginationControls}
          />
        )}
        {activeTab === 'promos' && (
          <PromoTab 
            promos={promos} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage} showForm={showForm} setShowForm={setShowForm}
            resetForms={resetForms} loading={loading} getFilteredData={getFilteredData}
            handleEdit={handleEdit} handleDelete={handleDelete} PaginationControls={PaginationControls}
          />
        )}
        {activeTab === 'categories' && (
          <CategoryTab 
            categories={categories} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage} showForm={showForm} setShowForm={setShowForm}
            resetForms={resetForms} loading={loading} getFilteredData={getFilteredData}
            handleDelete={handleDelete} PaginationControls={PaginationControls}
          />
        )}
        {activeTab === 'testimonials' && (
          <TestimonialTab 
            testimonials={testimonials} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage} showForm={showForm} setShowForm={setShowForm}
            resetForms={resetForms} loading={loading} getFilteredData={getFilteredData}
            handleEdit={handleEdit} handleDelete={handleDelete} PaginationControls={PaginationControls}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsTab totalClicks={totalClicks} analyticsData={analyticsData} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab 
            settings={settings} setSettings={setSettings} 
            isSubmitting={isSubmitting} submitSettings={submitSettings} 
          />
        )}

        <Modal isOpen={showForm && activeTab !== 'settings'} onClose={resetForms} title={editingId ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}>
          {activeTab === 'products' && (
            <form onSubmit={submitProduct} className="grid grid-cols-1 gap-6">
              <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900" placeholder="Product Name" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={productForm.original_price} onChange={e => handlePriceCalculation('original', e.target.value)} className="p-3 border rounded-xl text-gray-900" placeholder="Harga Asli" />
                <input type="number" value={productForm.temp_discount_percent} onChange={e => handlePriceCalculation('percent', e.target.value)} className="p-3 border rounded-xl text-gray-900" placeholder="Diskon %" />
              </div>
              <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full p-3 border-2 border-rose-200 bg-rose-50 rounded-xl text-rose-600 font-bold" placeholder="Harga Final (Wajib)" required />
              <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900">
                <option value="" disabled>Pilih Kategori</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Description" rows={3} />
              <input value={productForm.discount} onChange={e => setProductForm({ ...productForm, discount: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Label Diskon (Opsional)" />
              <div>
                <FileUploadBox onChange={(e) => handleImageUpload(e, 'product')} label="Main Image" />
                {productForm.image_url && <img src={productForm.image_url} className="h-24 rounded-lg object-cover mb-4 border" />}
                <FileUploadBox onChange={(e) => handleImageUpload(e, 'gallery')} label={`Gallery (${productForm.images.length}/3)`} disabled={productForm.images.length >= 3} />
                <div className="flex gap-2 mb-2">{productForm.images.map((img, i) => (<div key={i} className="relative group"><img src={img} className="h-16 w-16 rounded border object-cover" /><button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><MinusCircle size={12} /></button></div>))}</div>
                {uploading && <div className="text-rose-500 text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> {uploadStatus}</div>}
              </div>
              <button type="submit" disabled={uploading || isSubmitting} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">{isSubmitting ? 'Saving...' : 'Save Product'}</button>
            </form>
          )}
          {activeTab === 'promos' && (
            <form onSubmit={submitPromo} className="grid grid-cols-1 gap-6">
              <input value={promoForm.title} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Title" required />
              <input value={promoForm.subtitle} onChange={e => setPromoForm({ ...promoForm, subtitle: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Subtitle" required />
              <input value={promoForm.discount} onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Label Diskon" />
              <input value={promoForm.button_link} onChange={e => setPromoForm({ ...promoForm, button_link: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Link (#products)" />
              <input value={promoForm.button_text} onChange={e => setPromoForm({ ...promoForm, button_text: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Button Text" />
              <FileUploadBox onChange={(e) => handleImageUpload(e, 'promo')} label="Banner Image" />
              {promoForm.image_url && <img src={promoForm.image_url} className="h-32 w-full object-cover rounded-xl border" />}
              <button type="submit" disabled={uploading || isSubmitting} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">{isSubmitting ? 'Saving...' : 'Save Promo'}</button>
            </form>
          )}
          {activeTab === 'testimonials' && (
            <form onSubmit={submitTesti} className="grid grid-cols-1 gap-6">
              <input value={testiForm.name} onChange={e => setTestiForm({ ...testiForm, name: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Name" required />
              <textarea value={testiForm.text} onChange={e => setTestiForm({ ...testiForm, text: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="Review" rows={4} required />
              <select value={testiForm.rating} onChange={e => setTestiForm({ ...testiForm, rating: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900">
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">{isSubmitting ? 'Saving...' : 'Save Testimonial'}</button>
            </form>
          )}
          {activeTab === 'categories' && (
            <form onSubmit={submitCategory} className="flex gap-4 items-end">
              <div className="flex-1"><label className="block text-sm mb-2 text-gray-700">Nama Kategori</label><input value={catForm.name} onChange={e => setCatForm({ name: e.target.value })} className="w-full p-3 border rounded-xl text-gray-900" placeholder="e.g. Anniversary" required /></div>
              <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold h-[50px]">{isSubmitting ? '...' : 'Add'}</button>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}