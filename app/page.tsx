'use client';
import Image from 'next/image';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SignUpForm from '@/components/SignUpForm';
import { LayoutGrid, BarChart3, Megaphone, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <main className="flex h-[100dvh] bg-white font-sans overflow-hidden">
      
      {/* Left Column - Visuals */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#f4f7fb] px-12 lg:px-20 pt-8 lg:pt-10 pb-12 lg:pb-20 relative h-full">

        {/* Soft decorative blur */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative z-10 flex flex-col items-start max-w-lg">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <div className="w-5 h-5 border-2 border-white rotate-45 rounded-sm"></div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight text-slate-900">
            Your Hub,<br/>
            <span className="text-indigo-600">All in One Place</span>
          </h1>
          
          <p className="text-slate-500 font-medium text-base mt-4 max-w-sm">
            Access your modules, track analytics, and manage settings quickly and easily. Make the most of your workspace!
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center h-12">
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 leading-none mb-1">Modules</h3>
                <p className="text-xs font-medium text-slate-500 leading-none">Quick access</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center h-12">
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 leading-none mb-1">Updates</h3>
                <p className="text-xs font-medium text-slate-500 leading-none">Keep up with updates</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Megaphone className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center h-12">
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 leading-none mb-1">Notifications</h3>
                <p className="text-xs font-medium text-slate-500 leading-none">Stay informed</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center h-12">
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 leading-none mb-1">Amenities</h3>
                <p className="text-xs font-medium text-slate-500 leading-none">Access amenities</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 flex flex-col px-6 sm:px-12 lg:px-20 relative h-full overflow-y-auto">
        
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 text-xs font-medium text-slate-500 z-20">
          {isSignUpOpen ? (
            <>Already have an account? <button onClick={() => setIsSignUpOpen(false)} className="text-indigo-600 font-bold hover:underline">Log In</button></>
          ) : (
            <>Don't have an account? <button onClick={() => setIsSignUpOpen(true)} className="text-indigo-600 font-bold hover:underline">Sign Up</button></>
          )}
        </div>

        <div className="w-full max-w-sm mx-auto my-auto py-6 flex flex-col">
          {/* Mobile logo (hidden on desktop) */}
          <div className="md:hidden w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm mb-6">
            <div className="w-4 h-4 border-2 border-white rotate-45 rounded-[2px]"></div>
          </div>

          <AnimatePresence mode="wait">
            {isSignUpOpen ? (
              <SignUpForm key="signup" onSwitchToLogin={() => setIsSignUpOpen(false)} />
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              >
                <div className="mb-5">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">Welcome Back</h2>
                  <p className="text-slate-500 font-medium text-xs sm:text-sm">Sign in to access your workspace applications.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  {error && (
                    <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold border border-rose-100">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="email">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                      placeholder="member@student.university.edu"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="password">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full bg-[#4052ff] text-white rounded-lg sm:rounded-xl py-2.5 sm:py-3 font-bold tracking-wide hover:bg-[#3242db] active:scale-95 shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm sm:text-base"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                    {!loading && <ArrowRight className="w-4 h-4" strokeWidth={3} />}
                  </button>
                </form>

                {/* Footer */}
                <footer className="mt-8 flex justify-center gap-4 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <a href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                  <span>&bull;</span>
                  <a href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
