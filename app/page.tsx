'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SignUpModal from '@/components/SignUpModal';

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
    <main className="flex flex-col min-h-screen items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 flex flex-col relative shadow-xl">
        
        <div className="mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <div className="w-5 h-5 border-2 border-white rotate-45 rounded-sm"></div>
          </div>
          <h1 className="text-3xl font-black uppercase leading-none mb-2 tracking-tight text-slate-900">III Nexus</h1>
          <p className="text-slate-500 font-medium text-sm">Please sign in to access your workspace applications.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="email">
              Member Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="member@iiinexus.org"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold uppercase tracking-wider hover:bg-indigo-700 active:scale-95 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-slate-500">Don't have an account?</p>
          <button 
            onClick={() => setIsSignUpOpen(true)}
            className="w-full bg-white text-slate-700 border border-slate-200 rounded-xl py-3.5 font-bold uppercase tracking-wider hover:bg-slate-50 active:scale-95 shadow-sm hover:shadow-md transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
      
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      
      {/* Footer */}
      <footer className="mt-12 flex flex-col items-center justify-center text-[11px] font-bold text-slate-400 uppercase tracking-widest gap-3">
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
          <span>&bull;</span>
          <a href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</a>
          <span>&bull;</span>
          <a href="/legal" className="hover:text-slate-700 transition-colors">Legal</a>
        </div>
        <div>&copy; {new Date().getFullYear()} III Nexus. All rights reserved.</div>
      </footer>
    </main>
  );
}
