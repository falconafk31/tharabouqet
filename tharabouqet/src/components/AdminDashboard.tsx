'use client'
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Promo, Product, Testimonial, Category, StoreSetting } from '@/types';
import Image from 'next/image';
import { 
  LogOut, Plus, Trash2, X, Image as ImageIcon, Loader2, 
  ShoppingBag, Megaphone, MessageSquareQuote, MinusCircle, Pencil, 
  UploadCloud, Calculator, Layers, Settings, Save, MapPin, Clock, Share2, Phone,
  CheckCircle, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

// --- CONSTANTS ---
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp'
};
const ITEMS_PER_PAGE = 6; 

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

// Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-24 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in-down ${type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'}`}>
    {type === 'success' ? <CheckCircle size={20} className="text-green-500"/> : <AlertCircle size={20} className="text-red-500"/>}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100"><X size={16}/></button>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'promos' | 'products' | 'testimonials' | 'categories' | 'settings'>('promos');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Data State
  const [promos, setPromos] = useState<Promo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp_number: '', instagram_url: '', tiktok_url: '',
    address_line1: '', address_line2: '', hours_weekdays: '', hours_weekends: ''
  });

  // Form States
  const [promoForm, setPromoForm] = useState({ title: '', subtitle: '', image_url: '', button_text: 'Lihat Promo', button_link: '#products', discount: '' });
  const [productForm, setProductForm] = useState({ 
    name: '', price: '', original_price: '', temp_discount_percent: '', 
    category: '', image_url: '', images: [] as string[], description: '', discount: '' 
  });
  const [testiForm, setTestiForm] = useState({ name: '', text: '', rating: '5' });
  const [catForm, setCatForm] = useState({ name: '' });

  // --- HELPER: SHOW TOAST ---
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); 
  };

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [promosRes, productsRes, testiRes, catRes, settingsRes] = await Promise.all([
      supabase.from('promos').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase.from('store_settings').select('*')
    ]);

    if (promosRes.data) setPromos(promosRes.data);
    if (productsRes.data) setProducts(productsRes.data as unknown as Product[]);
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
        setSettings(prev => ({...prev, ...settingsMap}));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- HANDLERS ---
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
        setProductForm(prev => ({
          ...prev,
          original_price: newOriginal,
          temp_discount_percent: newPercent,
          price: finalPrice.toString(),
          discount: `${percent}% OFF`
        }));
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) await supabase.auth.signOut();
  };

  const handleEdit = (item: any, type: string) => {
    setEditingId(item.id);
    setShowForm(true);

    switch(type) {
      case 'promos':
        setPromoForm({ title: item.title, subtitle: item.subtitle, image_url: item.image_url, button_text: item.button_text, button_link: item.button_link || '#products', discount: item.discount || '' });
        break;
      case 'products':
        const p = item as Product;
        const images = p.images && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : []);
        let percent = '';
        if(p.original_price && p.price) {
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
    else {
      showToast('Data berhasil dihapus', 'success');
      fetchData();
    }
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
    } catch (error: any) { 
      showToast(`Gagal upload: ${error.message}`, 'error'); 
    } finally { 
      setUploading(false); setUploadStatus(''); if (fileInput) fileInput.value = ''; 
    }
  };

  const removeGalleryImage = (idx: number) => {
    setProductForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  // --- GENERIC SUBMIT HANDLER ---
  const handleFormSubmit = async (e: React.FormEvent, table: string, payload: any, resetAction: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);
    let error;
    
    if (editingId) {
      const { error: err } = await supabase.from(table).update(payload).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from(table).insert([payload]);
      error = err;
    }

    setIsSubmitting(false);
    if (!error) {
      showToast('Data berhasil disimpan!', 'success');
      resetAction();
      fetchData();
    } else {
      showToast(error.message, 'error');
    }
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

  // --- PAGINATION HELPER ---
  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const PaginationControls = ({ totalItems }: { totalItems: number }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-4 mt-10">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          // Ikon Previous diperjelas
          className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        
        <span className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          Page {currentPage} / {totalPages}
        </span>
        
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          // Ikon Next diperjelas
          className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-32">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage your florist store</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {['promos', 'products', 'categories', 'testimonials', 'settings'].map(tab => (
             <button key={tab} onClick={() => handleTabChange(tab)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 capitalize ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {tab === 'promos' && <Megaphone size={16}/>}
                {tab === 'products' && <ShoppingBag size={16}/>}
                {tab === 'categories' && <Layers size={16}/>}
                {tab === 'testimonials' && <MessageSquareQuote size={16}/>}
                {tab === 'settings' && <Settings size={16}/>}
                {tab}
             </button>
          ))}
        </div>

        {activeTab !== 'settings' && (
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab} Management</h2>
                <button onClick={() => { if(showForm) resetForms(); else setShowForm(true); }} className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium hover:opacity-90 transition shadow-lg ${showForm ? 'bg-gray-500' : 'bg-rose-500 shadow-rose-200'}`}>
                    {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : `Add ${activeTab.slice(0, -1)}`}
                </button>
            </div>
        )}

        {/* SETTINGS FORM */}
        {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8 animate-fade-in-down">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Settings className="text-slate-500"/> Pengaturan Toko</h2>
                <form onSubmit={submitSettings} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-800 border-b pb-2">Kontak & Sosmed</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Phone size={14}/> Nomor WhatsApp</label>
                            <input value={settings.whatsapp_number || ''} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="6281234567890" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Share2 size={14}/> Instagram URL</label>
                            <input value={settings.instagram_url || ''} onChange={e => setSettings({...settings, instagram_url: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="https://instagram.com/..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Share2 size={14}/> TikTok URL</label>
                            <input value={settings.tiktok_url || ''} onChange={e => setSettings({...settings, tiktok_url: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="https://tiktok.com/..." />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-800 border-b pb-2">Lokasi & Jam Operasional</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><MapPin size={14}/> Alamat Baris 1</label>
                            <input value={settings.address_line1 || ''} onChange={e => setSettings({...settings, address_line1: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Jl. Mawar No. 123" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><MapPin size={14}/> Alamat Baris 2</label>
                            <input value={settings.address_line2 || ''} onChange={e => setSettings({...settings, address_line2: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Jakarta Selatan, 12345" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Clock size={14}/> Jam Kerja (Weekdays)</label>
                            <input value={settings.hours_weekdays || ''} onChange={e => setSettings({...settings, hours_weekdays: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Mon - Sat: 09:00 - 17:00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Clock size={14}/> Jam Kerja (Weekend)</label>
                            <input value={settings.hours_weekends || ''} onChange={e => setSettings({...settings, hours_weekends: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Sun: Closed" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 bg-green-600 text-white w-full py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100">
                            {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
                            Simpan Pengaturan
                        </button>
                    </div>
                </form>
            </div>
        )}

        {showForm && activeTab !== 'settings' && (
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8 animate-fade-in-down">
            {activeTab === 'promos' && (
              <form onSubmit={submitPromo} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <input value={promoForm.title} onChange={e => setPromoForm({...promoForm, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Title" required />
                  <input value={promoForm.subtitle} onChange={e => setPromoForm({...promoForm, subtitle: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Subtitle" required />
                  <input value={promoForm.discount} onChange={e => setPromoForm({...promoForm, discount: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Label Diskon (e.g 50% OFF)" />
                  <input value={promoForm.button_link} onChange={e => setPromoForm({...promoForm, button_link: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Link (#products)" />
                  <input value={promoForm.button_text} onChange={e => setPromoForm({...promoForm, button_text: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Button Text" />
                </div>
                <div>
                   <FileUploadBox onChange={(e) => handleImageUpload(e, 'promo')} label="Banner Image" />
                   {uploading && <div className="text-center text-rose-500 flex justify-center gap-2 py-2"><Loader2 className="animate-spin" size={16} /> {uploadStatus}</div>}
                   {promoForm.image_url && <div className="relative h-40 w-full mt-4"><Image src={promoForm.image_url} alt="Promo" fill className="object-cover rounded-2xl shadow-sm" /></div>}
                   <button type="submit" disabled={uploading || isSubmitting} className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition">{isSubmitting ? 'Processing...' : 'Save Promo'}</button>
                </div>
              </form>
            )}

            {activeTab === 'products' && (
              <form onSubmit={submitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Product Name" required />
                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 grid grid-cols-2 gap-4">
                    <input type="number" value={productForm.original_price} onChange={e => handlePriceCalculation('original', e.target.value)} className="p-3 border border-gray-200 rounded-xl text-gray-900 text-sm bg-white" placeholder="Harga Asli" />
                    <input type="number" value={productForm.temp_discount_percent} onChange={e => handlePriceCalculation('percent', e.target.value)} className="p-3 border border-gray-200 rounded-xl text-gray-900 text-sm bg-white" placeholder="Diskon %" />
                    <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="col-span-2 p-3 border-2 border-rose-200 bg-white rounded-xl text-rose-600 font-bold" placeholder="Harga Jual (Final)" required />
                  </div>
                  <input value={productForm.discount} onChange={e => setProductForm({...productForm, discount: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Label Diskon" />
                  <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map(c => (<option key={c.id} value={c.name}>{c.name}</option>))}
                  </select>
                  <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Description" rows={4} />
                </div>
                <div>
                   <FileUploadBox onChange={(e) => handleImageUpload(e, 'product')} label="Main Image" />
                   {productForm.image_url && <div className="relative h-24 w-full mb-4"><Image src={productForm.image_url} alt="Main" fill className="object-cover rounded-xl border border-gray-200" /></div>}
                   <FileUploadBox onChange={(e) => handleImageUpload(e, 'gallery')} label={`Gallery (${productForm.images.length}/3)`} disabled={productForm.images.length >= 3} />
                   <div className="flex gap-3 mt-4">
                      {productForm.images.map((img, i) => (
                          <div key={i} className="relative group w-20 h-20"><Image src={img} alt="Gallery" fill className="rounded-xl border border-gray-200 object-cover" /><button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition"><MinusCircle size={14}/></button></div>
                      ))}
                   </div>
                   {uploading && <div className="text-center text-rose-500 flex justify-center gap-2 py-2"><Loader2 className="animate-spin" size={16} /> {uploadStatus}</div>}
                   <button type="submit" disabled={uploading || isSubmitting} className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition">{isSubmitting ? 'Processing...' : 'Save Product'}</button>
                </div>
              </form>
            )}

            {activeTab === 'testimonials' && (
              <form onSubmit={submitTesti} className="space-y-5">
                <input value={testiForm.name} onChange={e => setTestiForm({...testiForm, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Name" required />
                <textarea value={testiForm.text} onChange={e => setTestiForm({...testiForm, text: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" placeholder="Review" rows={3} required />
                <select value={testiForm.rating} onChange={e => setTestiForm({...testiForm, rating: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
                <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition">{isSubmitting ? 'Processing...' : 'Save'}</button>
              </form>
            )}

            {activeTab === 'categories' && (
                <form onSubmit={submitCategory} className="flex gap-4 items-end bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex-1">
                        <label className="block text-sm mb-2 text-gray-700 font-medium">Nama Kategori Baru</label>
                        <input value={catForm.name} onChange={e => setCatForm({ name: e.target.value })} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Contoh: Anniversary" required />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition h-[50px]">{isSubmitting ? '...' : 'Tambah'}</button>
                </form>
            )}
          </div>
        )}

        {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-gray-400"/></div> : activeTab !== 'settings' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* PROMOS LIST (NO 4: Using getPaginatedData) */}
                {activeTab === 'promos' && getPaginatedData(promos).map((p: any) => (
                <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 relative group hover:shadow-xl transition duration-300">
                    {/* NO 1: NEXT/IMAGE OPTIMIZATION */}
                    <div className="relative w-full h-40 mb-4">
                        <Image src={p.image_url} alt={p.title} fill className="object-cover rounded-2xl shadow-sm" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{p.title}</h3>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                        <button onClick={() => handleEdit(p, 'promos')} className="bg-white text-slate-700 p-2.5 rounded-full shadow-md hover:bg-slate-50"><Pencil size={16}/></button>
                        <button onClick={() => handleDelete('promos', p.id)} className="bg-white text-red-600 p-2.5 rounded-full shadow-md hover:bg-red-50"><Trash2 size={16}/></button>
                    </div>
                </div>
                ))}

                {/* PRODUCTS LIST */}
                {activeTab === 'products' && getPaginatedData(products).map((p: any) => {
                const displayImage = p.image_url || p.images?.[0] || (p as any).image;
                return (
                <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 relative group hover:shadow-xl transition duration-300">
                    <div className="relative w-full h-48 mb-4">
                        {/* NO 1: NEXT/IMAGE OPTIMIZATION */}
                        {displayImage ? (
                            <Image src={displayImage} alt={p.name} fill className="object-cover rounded-2xl shadow-sm" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        ) : (
                            <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><ImageIcon size={24} /></div>
                        )}
                        {p.discount && <span className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm z-10">{p.discount}</span>}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                    <p className="text-rose-600 font-medium mt-1">Rp {p.price.toLocaleString()}</p>
                    <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 mt-3 inline-block border border-gray-200">{p.category}</span>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                        <button onClick={() => handleEdit(p, 'products')} className="bg-white text-slate-700 p-2.5 rounded-full shadow-md hover:bg-slate-50"><Pencil size={16}/></button>
                        <button onClick={() => handleDelete('products', p.id)} className="bg-white text-red-600 p-2.5 rounded-full shadow-md hover:bg-red-50"><Trash2 size={16}/></button>
                    </div>
                </div>
                )})}

                {/* TESTIMONIALS LIST */}
                {activeTab === 'testimonials' && getPaginatedData(testimonials).map((t: any) => (
                <div key={t.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative group hover:shadow-xl transition duration-300 flex flex-col h-full">
                    <div className="flex gap-1 mb-3 text-yellow-400">{'★'.repeat(t.rating)}</div>
                    <p className="italic text-gray-600 text-sm mb-4 flex-grow">"{t.text}"</p>
                    <p className="font-bold text-gray-900 text-sm border-t border-gray-100 pt-3 mt-auto">- {t.name}</p>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                        <button onClick={() => handleEdit(t, 'testimonials')} className="bg-white text-slate-700 p-2.5 rounded-full shadow-md hover:bg-slate-50"><Pencil size={16}/></button>
                        <button onClick={() => handleDelete('testimonials', t.id)} className="bg-white text-red-600 p-2.5 rounded-full shadow-md hover:bg-red-50"><Trash2 size={16}/></button>
                    </div>
                </div>
                ))}

                {/* CATEGORIES LIST (No Pagination Needed usually, but handled) */}
                {activeTab === 'categories' && categories.map(c => (
                    <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex justify-between items-center group hover:shadow-md transition">
                        <span className="font-medium text-gray-900 text-lg">{c.name}</span>
                        <button onClick={() => handleDelete('categories', c.id)} className="text-red-500 hover:bg-red-50 p-2.5 rounded-full transition"><Trash2 size={20}/></button>
                    </div>
                ))}
            </div>

            {/* NO 4: PAGINATION CONTROLS */}
            {(activeTab === 'products' && products.length > ITEMS_PER_PAGE) && <PaginationControls totalItems={products.length} />}
            {(activeTab === 'promos' && promos.length > ITEMS_PER_PAGE) && <PaginationControls totalItems={promos.length} />}
            {(activeTab === 'testimonials' && testimonials.length > ITEMS_PER_PAGE) && <PaginationControls totalItems={testimonials.length} />}
          </div>
        )}
      </div>
    </div>
  );
}