import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Tharabouqet | Fresh Minimalist Florist",
  description: "Buket bunga segar dengan gaya minimalis modern untuk momen spesial Anda.",
};

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