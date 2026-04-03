'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      setError("Verifikasi keamanan wajib dicentang.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Jika sukses, onAuthStateChange di parent component akan menangani redirect/state
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-rose-600" size={24} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500 text-sm">Masuk untuk mengelola produk dan promo.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="admin@thara.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-center pt-2">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} // dummy tes cloudflare jika null
              onSuccess={(token) => setCaptchaToken(token)}
              onError={() => setError("Gagal memuat Captcha. Pastikan izin koneksi atau site key benar.")}
              options={{ theme: 'light' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !captchaToken}
            className="w-full py-3 mt-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Login Securely'}
          </button>
        </form>
      </div>
    </div>
  );
}