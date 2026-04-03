import { supabase } from '@/lib/supabase'
import PromoSlider from '@/components/PromoSlider'
import ProductSection from '@/components/ProductSection'
import TestimonialSlider from '@/components/TestimonialSlider' 
import { Promo, Product, Testimonial, Category } from '@/types'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('store_settings').select('key, value');
  const settings: Record<string, string> = {};
  data?.forEach(s => settings[s.key] = s.value);

  const title = settings.seo_title || 'Tharabouqet | Fresh Minimalist Florist & Gifts';
  const desc = settings.seo_description || 'Pesan buket bunga segar, kado wisuda, dan hampers eksklusif dengan desain minimalis modern.';

  return {
    title: title,
    description: desc,
    keywords: ['florist jakarta', 'buket bunga', 'kado wisuda', 'bunga fresh', 'tharabouqet', 'toko bunga'],
    openGraph: {
      title: title,
      description: desc,
      url: 'https://tharabouqet.vercel.app', 
      siteName: 'Tharabouqet',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg', // Pastikan file ini ada di public folder nantinya atau gunakan URL dinamis
          width: 1200,
          height: 630,
        }
      ]
    },
  }
}

export const revalidate = 3600 // Cache untuk 1 jam (ISR) agar tidak boros kuota Supabase

export default async function Home() {
  // Gunakan Promise.all untuk menjalankan query ke database secara bersamaan (Parallel Fetching)
  const [
    { data: promos },
    { data: products },
    { data: categories },
    { data: testimonials }
  ] = await Promise.all([
    supabase.from('promos').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  ]);

  const HeroSection = () => (
    <div className="bg-white py-16 border-b border-gray-50 text-center px-4">
      <div className="max-w-4xl mx-auto">
        <span className="text-rose-500 font-medium tracking-widest text-sm uppercase">Fresh From Garden</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
          Minimalist Bouquet <br/> Crafted for Every Moment
        </h1>
        <p className="mt-6 text-gray-500 text-lg max-w-2xl mx-auto">
          Kami merangkai bunga segar dengan gaya modern minimalis. Tanpa pengawet, dipetik pagi hari, dan dikirim dengan penuh cinta.
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <PromoSlider promos={(promos as Promo[]) || []} />
      
      <HeroSection />

      {/* Pass dynamic categories here */}
      <ProductSection 
        products={(products as Product[]) || []} 
        categories={(categories as Category[]) || []} 
      />

      {/* Testimonials Slider Section */}
      <section id="testimonials" className="py-24 bg-rose-50 border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">Happy Customers</h2>
          <TestimonialSlider testimonials={(testimonials as Testimonial[]) || []} />
        </div>
      </section>
    </main>
  )
}