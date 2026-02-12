<div align="center">
  <h1>🌸 Tharabouqet</h1>
  <p><strong>Platform E-Commerce Florist Modern & Minimalis</strong></p>

  <!-- Badges -->
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"></a>
  <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer" alt="Framer Motion"></a>
</div>

<br />

<!-- Opsional: Tambahkan screenshot aplikasi Anda di dalam folder public/ dan aktifkan baris di bawah ini -->
<!-- ![Tharabouqet Preview](/public/preview.png) -->

## 📖 Tentang Proyek

**Tharabouqet** adalah platform e-commerce berdesain modern dan minimalis yang dikhususkan untuk toko bunga (*florist*). Proyek ini dibangun dengan mengutamakan performa tinggi, pengalaman pengguna (UX) yang *fluid*, dan kemudahan manajemen data menggunakan **Next.js 14 (App Router)** dan **Supabase**.

Aplikasi ini dirancang untuk bisnis yang menggunakan sistem pemesanan langsung, sehingga pesanan pelanggan akan diformat secara otomatis dan diarahkan ke **WhatsApp** tanpa memerlukan sistem *payment gateway* internal.

---

## ✨ Fitur Utama

### 🛍️ Public Storefront (Sisi Pelanggan)
- **Desain Responsif & Modern:** Antarmuka elegan dengan *Tailwind CSS* dan animasi transisi halus menggunakan *Framer Motion*.
- **Promo Slider Dinamis:** Menampilkan spanduk promosi yang bisa diklik di halaman utama.
- **Katalog Produk Cerdas:** Grid produk responsif dengan fitur filter kategori dan *pagination* yang mulus.
- **Sistem Pre-Order (PO) Pintar:** Validasi kalender pemesanan yang otomatis mengunci tanggal di masa lalu dan menetapkan minimal pengiriman **H+3** dari hari pemesanan.
- **Integrasi WhatsApp Presisi:** Formulir pemesanan cerdas yang memformat data (produk, harga, tanggal, penerima, pesan) ke dalam draf WhatsApp yang bersih (*URL Encoded* / kebal *error karakter*).
- **Smart Social Share:** Fitur bagikan produk ke WhatsApp, Facebook, X (Twitter), serta fitur *auto-copy* dengan *Toast Notification* untuk Instagram dan TikTok.
- **SEO Optimized:** Metadata dinamis, Sitemap Generator, dan *Open Graph* untuk *preview* tautan yang sempurna saat dibagikan.

### 🔒 Admin Dashboard (Sisi Pemilik Toko)
- **Otentikasi Aman:** Sistem login admin terproteksi menggunakan *Supabase Auth*.
- **Manajemen Produk (CRUD):** Tambah, edit, dan hapus produk. Mendukung multi-gambar (galeri) dengan kompresi otomatis (maks 2MB, format WebP) di sisi *client* sebelum diunggah ke *Supabase Storage*.
- **Manajemen Promo & Testimoni:** Kendali penuh atas spanduk promo dan ulasan pelanggan di halaman depan.
- **Pengaturan Toko Fleksibel:** Ubah nomor WhatsApp pesanan, tautan media sosial, jam operasional, dan alamat langsung dari *dashboard* (tanpa menyentuh kode sumber).
- **UX Modern:** Formulir berbasis *Modal* (Pop-up) dengan fitur *backdrop close*, fitur pencarian data, dan antarmuka tabel interaktif.

---

## 🛠️ Tech Stack (Teknologi)

**Frontend:**
- [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- [React.js](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [Framer Motion](https://www.framer.com/motion/) (Animasi)
- [Lucide React](https://lucide.dev/) (Ikon)

**Backend & Database:**
- [Supabase](https://supabase.com/) (PostgreSQL Database)
- Supabase Auth (Otentikasi)
- Supabase Storage (Penyimpanan Gambar)

**Utilitas:**
- `browser-image-compression` (Kompresi gambar otomatis)

---

## 🚀 Panduan Instalasi Lokal (Getting Started)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18.x atau terbaru)
- Akun [Supabase](https://supabase.com/)
- Git

### 2. Kloning Repositori
` ` `bash git clone https://github.com/falconafk31/tharabouqet.git
cd tharabouqet
npm install
` ` `

### 3. Pengaturan Supabase
1. Buat proyek baru di [Supabase Dashboard](https://database.new).
2. Buka menu **SQL Editor** dan jalankan *script* SQL yang tersedia di proyek ini secara berurutan untuk membuat tabel, pengaturan keamanan (RLS), dan data dummy:
   - `database_schema.sql`
   - `create_categories.sql`
   - `create_testimonials.sql`
   - `create_settings.sql`
   - `update_settings.sql`
   - `seed_data.sql`
3. Buka menu **Storage**, buat *bucket* baru dengan nama **`bouquets`**, dan pastikan pengaturan aksesnya diubah menjadi **Public**.

### 4. Konfigurasi Environment Variables
Buat file bernama `.env.local` di *root* folder proyek Anda dan isi dengan API Key dari Supabase:
` ` `env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT-REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR-ANON-KEY>
` ` `

### 5. Jalankan Server Pengembangan
` ` `bash
npm run dev
` ` `
Buka `http://localhost:3000` di browser Anda untuk melihat toko publik.
Untuk mengakses dashboard admin, buka `http://localhost:3000/admin`. *(Email dan Password diatur melalui menu Authentication di Supabase)*.

---
## 📦 Deployment

Proyek ini sangat dioptimalkan untuk di-deploy menggunakan **Vercel**.

1. *Push* kode Anda ke repositori GitHub.
2. Buat proyek baru di [Vercel](https://vercel.com/) dan impor repositori GitHub tersebut.
3. Di bagian **Environment Variables**, tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Klik **Deploy**.

---

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi MIT. Silakan lihat file `LICENSE` untuk informasi lebih lanjut.

<div align="center">
  <i>Dibuat dengan ❤️ oleh </i>
</div>
