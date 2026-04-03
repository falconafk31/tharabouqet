import { supabase } from '@/lib/supabase';
import { Metadata, ResolvingMetadata } from 'next';
import ProductDetailClient from '@/components/ProductDetailClient';

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 1. Generate Metadata untuk SEO (Server Side)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
 
  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | Tharabouqet',
    }
  }

  return {
    title: `${product.name} | Tharabouqet`,
    description: product.description ? product.description.substring(0, 160) : `Detail produk ${product.name}`,
    openGraph: {
      title: product.name,
      description: `Dapatkan ${product.name} hanya Rp ${product.price.toLocaleString('id-ID')}. Pesan sekarang!`,
      images: [product.image_url], // Gambar produk akan muncul di preview WA/FB
    },
  }
}

// 2. Halaman Utama (Server Component)
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  
  // Ambil Data Produk (Sama seperti metadata, tapi dengan SSR)
  const productQuery = supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  const relatedQuery = supabase
    .from('products')
    .select('*')
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(4);

  const [productRes, relatedRes] = await Promise.all([productQuery, relatedQuery]);

  if (!productRes.data) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Produk tidak ditemukan</div>;
  }

  // Render Client Component dan kirim Object Penuh
  return <ProductDetailClient initialProduct={productRes.data as any} initialRelated={relatedRes.data as any} />;
}