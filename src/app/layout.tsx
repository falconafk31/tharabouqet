import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

import { supabase } from "@/lib/supabase";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('store_settings').select('key, value');
  const settings: Record<string, string> = {};
  data?.forEach(s => settings[s.key] = s.value);

  return {
    title: settings.seo_title || "Tharabouqet | Fresh Minimalist Florist",
    description: settings.seo_description || "Buket bunga segar dengan gaya minimalis modern untuk momen spesial Anda.",
    keywords: settings.seo_keywords || "florist, bouquet, bunga segar, jakarta",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-slate-800`}>
      
        
        {/* MainLayout menangani kondisional Header/Footer */}
        <MainLayout>
            {children}
        </MainLayout>
      </body>
    </html>
  );
}