# 🌸 Tharabouqet - Premium Florist E-Commerce Platform

Selamat datang di repositori resmi **Tharabouqet** – sebuah platform perniagaan elektronik *(E-Commerce)* khusus Florist bergaya premium. Situs web ini didesain sepenuhnya dengan antarmuka yang sangat responsif, dilengkapi animasi nan mulus, fitur manajemen toko kelas _Enterprise_, hingga pemesanan seketika menuju WhatsApp.

![Tharabouqet Banner](https://images.unsplash.com/photo-1563241598-bb4868f77341?q=80&w=1920&auto=format&fit=crop)

---

## ✨ Fitur Unggulan

### 1. 🛍️ Katalog Etalase Dinamis
- Visualisasi produk diurutkan secara otomatis dan elegan.
- Fitur **Filter Cerdas** (Semua, < 150rb, 150rb - 300rb, > 300rb) untuk mempermudah mencari buket berdasarkan *budget* saku pengguna.
- Sistem **Server-Side Rendering (SSR)** untuk mempercepat muatan halaman, SEO yang kuat di mesin pencari Google, dan menyingkirkan jeda tunggu *Loading Spinner*.

### 2. 📝 Konfirmasi Pesanan WhatsApp
- Modal Pesenan Cerdas tanpa *cart* yang ribet; pesanan langsung menjembatani pengguna ke obrolan WhatsApp terformat rapi.
- Input alamat pengiriman secara manual.
- **Live Preview Kartu Ucapan:** Pelanggan bisa melihat seperti apa tulisan tangan *(Dancing Script)* surat ucapannya secara seketika sebelum lanjut membayarnya.

### 3. 🛡️ Portal Admin Dashboard Anti-Bobol
- Diamankan secara mutlak menggunakan **Supabase Auth**.
- **Terproteksi Cloudflare Turnstile (Captcha):** Pengadang serangan Brute-Force Bot sehingga tidak ada sistem *hacker* robot otomatis yang bisa memaksa masuk menengadah kata sandi rahasia.

### 4. 📊 Pengelola Konten Tingkat Atas (Enterprise Level)
Akses *Admin Dashboard* (Rute: `/admin`) memungkinkan Pemilik Toko untuk mengendalikan 100% etalase tanpa menyentuh kode sama sekali:
- **Produk**: Tambah, Edit, Hapus Buket Bunga. Gambar otomatis terkompresi secara ajaib (*WebP*) untuk meminimalisir beban memori server.
- **Promo Berjalan**: Umumkan penawaran toko / spanduk diskon raksasa.
- **Kategori Bunga**: Atur laci rak penempatan barang-barang.
- **Pengaturan Bisnis**: Atur tautan Sosial Media, Nomor WhatsApp, hingga Jam Operasional secara real-time.

### 5. 📉 Import/Export Excel (.xlsx) Berkekuatan Nuklir
- Merupakan inovasi mutakhir. Anda dapat men-*download* seluruh Katalog toko ke komputer dalam file `.xlsx`.
- Modifikasi angka harga, stok, secara masal lewat *Excel*.
- Unggah file `.xlsx` tersebut via menu Import dan ribuan *"Produk Baru"* langsung muncul ke situs dalam 1 detik.
- Mengandung **Auto-Kalkulator:** Apabila kolom Excel Harga Final dibiarkan kosong, sistem secara mandiri menghitung Harga Final berdasarkan tebakan Harga Asli (`original_price`) dikurangi Persentase Diskon (`discount_percent`).

---

## 🛠️ Tech Stack & Ekosistem
- **Framework Frontend:** [Next.js 16](https://nextjs.org/) (Mengaplikasikan ketangguhan *App Router*).
- **Styling UI:** [Tailwind CSS v4](https://tailwindcss.com/) & Inter Fonts.
- **Database Backend:** [Supabase](https://supabase.com/) (Menangani PostgreSQL & User Auth).
- **Animasi:** [Framer Motion](https://www.framer.com/motion/)
- **Ikon & Spreadsheet Parser:** [Lucide-React](https://lucide.dev/) & [SheetJS (xlsx)](https://sheetjs.com/)

---

## 💻 Panduan Instalasi Lokal

Ingin menjalankan kembali proyek ini secara luring *(offline)* di komputer Anda? Ikuti langkah ini:

1. Modifikasi Repositori Proyek
   ```bash
   git clone https://github.com/falconafk31/tharabouqet.git
   cd tharabouqet
   ```

2. Instalasi Semesta Pustaka Pihak Ketiga
   ```bash
   npm install
   ```

3. Modifikasi Lingkungan *Secret Keys* Anda
   Siapkan file bernama `.env.local` di pondasi utama dan tempelkan isian berikut (*Ganti nilainya sesuai Dashboard Anda sendiri*):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[ID-PROJECT].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=[SITE-KEY-CLOUDFLARE]
   ```

4. Jalankan Lini Terminal Server Lokal
   ```bash
   npm run dev
   ```
   Lalu buka [http://localhost:3000](http://localhost:3000) di peramban langganan Anda.

---

> Diciptakan dengan kehati-hatian tingkat tinggi untuk menghadirkan kecepatan kilat dengan visual magis. 💎
