/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
    {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Mengizinkan gambar dari Unsplash
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Mengizinkan gambar dari semua subdomain Supabase
      },
    ],
  },
};

export default nextConfig;