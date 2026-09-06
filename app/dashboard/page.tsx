'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const APPS = [
  { id: 'slot-booking', name: 'BookMySlot', description: 'Book one of the VISTAS Amenities now!', url: 'https://campusslotbooking.vercel.app', short: 'BMS' },
  { id: 'skiptray', name: 'SkipTray', description: 'In-House pre-ordering app for the ground floor canteen', url: 'https://vistas-skiptray.vercel.app', short: 'ST' },
  { id: 'app2', name: 'Placeholder App 2', description: 'Placeholder description for the second app module.', url: '#', short: 'P2' },
  { id: 'app3', name: 'Placeholder App 3', description: 'Placeholder description for the third app module.', url: '#', short: 'P3' },
];

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/');
          return;
        }
        if (mounted) setLoading(false);
      } catch (err) {
        router.replace('/');
      }
    };

    checkSession();

    // Listen for sign-outs in the same tab or token expiration
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] p-6 text-slate-900 font-sans">
      <header className="h-16 border-2 border-black bg-white flex items-center justify-between px-6 shrink-0 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4f46e5] border-2 border-black rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-black rotate-45"></div>
          </div>
          <span className="font-black text-xl tracking-tight uppercase">III Nexus</span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-lg hover:bg-zinc-800 active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
        >
          Sign Out
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
        <h2 className="text-sm font-black uppercase mb-4 border-b-2 border-black pb-2 tracking-widest">
          Available Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {APPS.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer no-underline text-inherit"
            >
              <div className="w-16 h-16 bg-slate-100 border-2 border-black rounded-xl mb-6 flex items-center justify-center group-hover:bg-[#4f46e5] group-hover:text-white transition-colors">
                <span className="font-black text-2xl">{app.short}</span>
              </div>
              <h3 className="text-xl font-black uppercase leading-tight mb-2 tracking-tight group-hover:underline">
                {app.name}
              </h3>
              <p className="text-sm font-medium text-slate-600 mb-4 leading-snug">
                {app.description}
              </p>
              <div className="mt-auto pt-4 flex items-center text-xs font-bold text-slate-500 uppercase">
                Launch App <span className="ml-1">→</span>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t-2 border-black pt-6 pb-2 flex flex-col md:flex-row items-center justify-between text-xs font-bold text-slate-500 uppercase gap-4 w-full max-w-6xl mx-auto shrink-0">
        <div>&copy; {new Date().getFullYear()} III Nexus. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-black hover:underline transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-black hover:underline transition-colors">Terms of Service</a>
          <a href="/legal" className="hover:text-black hover:underline transition-colors">Legal</a>
        </div>
      </footer>
    </div>
  );
}
