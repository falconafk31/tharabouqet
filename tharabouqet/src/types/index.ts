// Interface untuk Produk
export interface Product {
  id: string;
  name: string;
  price: number; // Harga Akhir (yang dibayar setelah diskon jika ada)
  original_price?: number; // Harga Asli (harga coret sebelum diskon)
  category: string;
  image_url: string; // Thumbnail utama
  images?: string[]; // Galeri foto tambahan (opsional)
  description: string;
  discount?: string; // Label diskon (misal "40% OFF" atau "Best Seller")
  created_at?: string;
}

// Interface untuk Banner Promo
export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  discount?: string;
  is_active: boolean;
  created_at?: string;
}

// Interface untuk Testimoni Pelanggan
export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  created_at?: string;
}

// Interface untuk Kategori Produk
export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

// Interface untuk Pengaturan Toko (No WA, dll)
export interface StoreSetting {
  key: string;
  value: string;
  created_at?: string;
}