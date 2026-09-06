'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface AppType {
  id: string;
  name: string;
  description: string;
  url: string;
  short_icon: string;
}

interface ProfileType {
  role: string;
  course: string;
  year: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<AppType[]>([]);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/');
          return;
        }

        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, course, year')
          .eq('id', session.user.id)
          .single();
          
        if (mounted && profileData) {
          setProfile(profileData);
        }

        // Fetch active apps
        const { data: appsData } = await supabase
          .from('apps')
          .select('id, name, description, url, short_icon')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (mounted && appsData) {
          setApps(appsData);
        }

        // Fetch active announcements
        const { data: announcementData } = await supabase
          .from('announcements')
          .select('message')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (mounted && announcementData && announcementData.length > 0) {
          setAnnouncement(announcementData[0].message);
        }

        if (mounted) setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace('/');
      }
    };

    fetchData();

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

  const handleAppClick = async (e: React.MouseEvent<HTMLAnchorElement>, app: AppType) => {
    if (!profile) return;
    
    // Fire and forget analytics tracking
    supabase.from('app_clicks').insert({
      app_id: app.id,
      course: profile.course,
      year: profile.year,
    }).then(({ error }) => {
      if (error) console.error("Error logging click:", error);
    });
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
      
      {announcement && (
        <div className="w-full max-w-6xl mx-auto mb-6 bg-[#facc15] border-4 border-black rounded-xl p-4 flex items-start gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" strokeWidth={3} />
          <div>
            <h3 className="font-black uppercase tracking-widest text-xs mb-1 text-black/70">Global Announcement</h3>
            <p className="font-bold">{announcement}</p>
          </div>
        </div>
      )}

      <header className="h-16 border-4 border-black bg-white flex items-center justify-between px-6 shrink-0 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4f46e5] border-2 border-black rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-black rotate-45"></div>
          </div>
          <span className="font-black text-xl tracking-tight uppercase">III Nexus</span>
        </div>
        <div className="flex items-center gap-4">
          {profile?.role === 'admin' && (
            <Link 
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-[#eab308] text-black text-xs font-black uppercase tracking-wider rounded-lg hover:bg-[#facc15] active:translate-y-1 active:translate-x-1 active:shadow-none transition-transform border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <ShieldAlert className="w-4 h-4" />
              Admin
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-lg hover:bg-zinc-800 active:translate-y-1 active:translate-x-1 active:shadow-none transition-transform border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
        <h2 className="text-sm font-black uppercase mb-4 border-b-4 border-black pb-2 tracking-widest">
          Available Modules
        </h2>
        
        {apps.length === 0 ? (
          <div className="p-8 border-4 border-black border-dashed rounded-2xl text-center text-slate-500 font-bold uppercase tracking-widest bg-white/50">
            No active modules available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apps.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleAppClick(e, app)}
                className="group bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-transform cursor-pointer no-underline text-inherit"
              >
                <div className="w-16 h-16 bg-slate-100 border-4 border-black rounded-xl mb-6 flex items-center justify-center group-hover:bg-[#4f46e5] group-hover:text-white transition-colors">
                  <span className="font-black text-2xl">{app.short_icon}</span>
                </div>
                <h3 className="text-xl font-black uppercase leading-tight mb-2 tracking-tight group-hover:underline">
                  {app.name}
                </h3>
                <p className="text-sm font-medium text-slate-600 mb-4 leading-snug">
                  {app.description}
                </p>
                <div className="mt-auto pt-4 flex items-center text-xs font-black text-slate-500 uppercase group-hover:text-[#4f46e5] transition-colors">
                  Launch App <ArrowRight className="w-4 h-4 ml-1" strokeWidth={3} />
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t-4 border-black pt-6 pb-2 flex flex-col md:flex-row items-center justify-between text-xs font-black text-slate-500 uppercase gap-4 w-full max-w-6xl mx-auto shrink-0">
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
