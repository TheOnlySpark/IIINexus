'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';

const SignUpModal = dynamic(() => import('@/components/SignUpModal'), { ssr: false });

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    // Allow both legacy JWT (eyJ) and new Supabase publishable keys (sb_publishable_)
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!anonKey.startsWith('eyJ') && !anonKey.startsWith('sb_publishable_')) {
      setError('Configuration Error: Your Supabase Anon Key is invalid. It must start with "eyJ" or "sb_publishable_".');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Failed to fetch')) {
          setError('Network unreachable. Please check your internet connection.');
        } else if (authError.message.toLowerCase().includes('email not confirmed')) {
          setError('Please verify your email address before logging in. Check your inbox for the confirmation link.');
        } else {
          setError(authError.message);
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Network unreachable. Please check your internet connection.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="mb-8">
          <div className="w-12 h-12 bg-[#4f46e5] border-2 border-black rounded-xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-5 h-5 border-2 border-black rotate-45"></div>
          </div>
          <h1 className="text-4xl font-black uppercase leading-none mb-2 tracking-tight">III Nexus</h1>
          <p className="text-slate-500 font-medium text-sm">Please sign in to access your workspace applications.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border-2 border-black text-red-600 p-4 rounded-xl text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="email">
              Member Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
              placeholder="member@iiinexus.org"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#4f46e5] text-white border-2 border-black rounded-xl py-4 font-black uppercase tracking-widest hover:bg-[#4338ca] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:translate-x-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-black/10 flex flex-col items-center gap-3">
          <p className="text-sm font-bold text-slate-500">Don't have an account?</p>
          <button 
            onClick={() => setIsSignUpOpen(true)}
            className="w-full bg-white text-black border-2 border-black rounded-xl py-3 font-black uppercase tracking-widest hover:bg-slate-50 active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
      
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      
      {/* Footer */}
      <footer className="mt-12 flex flex-col items-center justify-center text-xs font-bold text-slate-500 uppercase gap-3">
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-black hover:underline transition-colors">Privacy Policy</a>
          <span>&bull;</span>
          <a href="/terms" className="hover:text-black hover:underline transition-colors">Terms of Service</a>
          <span>&bull;</span>
          <a href="/legal" className="hover:text-black hover:underline transition-colors">Legal</a>
        </div>
        <div>&copy; {new Date().getFullYear()} III Nexus. All rights reserved.</div>
      </footer>
    </main>
  );
}
