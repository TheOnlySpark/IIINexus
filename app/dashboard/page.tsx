'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, AlertCircle, ShieldAlert, Megaphone, Settings, Pin, PinOff } from 'lucide-react';
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
  const [pinnedAppIds, setPinnedAppIds] = useState<Set<string>>(new Set());
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

        // Fetch pinned apps for user
        const { data: pinsData } = await supabase
          .from('user_pins')
          .select('app_id')
          .eq('user_id', session.user.id);
          
        if (mounted && pinsData) {
          setPinnedAppIds(new Set(pinsData.map(pin => pin.app_id)));
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

  const togglePin = async (e: React.MouseEvent, appId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const isCurrentlyPinned = pinnedAppIds.has(appId);
    
    // Optimistic UI Update
    const newPins = new Set(pinnedAppIds);
    if (isCurrentlyPinned) {
      newPins.delete(appId);
    } else {
      newPins.add(appId);
    }
    setPinnedAppIds(newPins);

    if (isCurrentlyPinned) {
      await supabase
        .from('user_pins')
        .delete()
        .eq('user_id', session.user.id)
        .eq('app_id', appId);
    } else {
      await supabase
        .from('user_pins')
        .insert({ user_id: session.user.id, app_id: appId });
    }
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 transition-colors">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Workspace...
        </div>
      </div>
    );
  }

  const pinnedApps = apps.filter(app => pinnedAppIds.has(app.id));
  const unpinnedApps = apps.filter(app => !pinnedAppIds.has(app.id));

  const AppCard = ({ app, isPinned }: { app: AppType, isPinned: boolean }) => (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => handleAppClick(e, app)}
      className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md active:scale-95 transition-all cursor-pointer no-underline text-inherit relative overflow-hidden"
    >
      <button
        onClick={(e) => togglePin(e, app.id)}
        className="absolute top-4 right-4 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 focus:opacity-100"
        title={isPinned ? "Unpin" : "Pin to Favorites"}
      >
        {isPinned ? <PinOff className="w-5 h-5 text-indigo-500" /> : <Pin className="w-5 h-5" />}
      </button>
      
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        <span className="font-black text-2xl">{app.short_icon}</span>
      </div>
      <h3 className="text-xl font-black uppercase leading-tight mb-2 tracking-tight text-slate-900">
        {app.name}
      </h3>
      <p className="text-sm font-medium text-slate-500 mb-4 leading-snug">
        {app.description}
      </p>
      <div className="mt-auto pt-4 flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
        Launch App <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2.5} />
      </div>
    </a>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 sm:p-6 text-slate-900 font-sans transition-colors">
      
      {announcement && (
        <div className="w-full max-w-6xl mx-auto mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-amber-600" strokeWidth={2.5} />
          <div>
            <h3 className="font-black uppercase tracking-widest text-[10px] mb-1 text-amber-800/70">Global Announcement</h3>
            <p className="font-bold text-amber-900 text-sm">{announcement}</p>
          </div>
        </div>
      )}

      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 rounded-2xl shadow-md mb-8 max-w-6xl mx-auto w-full transition-colors border border-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 border-2 border-white rotate-45 rounded-[2px]"></div>
          </div>
          <span className="font-black text-xl tracking-tight uppercase">III Nexus</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/announcements"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          >
            <Megaphone className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Updates</span>
          </Link>
          <Link
            href="/settings"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" strokeWidth={2.5} />
          </Link>
          {profile?.role === 'admin' && (
            <Link 
              href="/admin"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="px-3 sm:px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col gap-10">
        
        {pinnedApps.length > 0 && (
          <section>
            <h2 className="text-[11px] font-black uppercase mb-6 border-b border-slate-200 pb-2 tracking-widest text-slate-500 flex items-center gap-2">
              <Pin className="w-4 h-4" /> Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pinnedApps.map(app => <AppCard key={app.id} app={app} isPinned={true} />)}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-[11px] font-black uppercase mb-6 border-b border-slate-200 pb-2 tracking-widest text-slate-500">
            {pinnedApps.length > 0 ? "All Modules" : "Available Modules"}
          </h2>
          
          {apps.length === 0 ? (
            <div className="p-8 border border-slate-200 border-dashed rounded-2xl text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">
              No active modules available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {unpinnedApps.map(app => <AppCard key={app.id} app={app} isPinned={false} />)}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest gap-4 w-full max-w-6xl mx-auto shrink-0">
        <div>&copy; {new Date().getFullYear()} III Nexus. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</a>
          <a href="/legal" className="hover:text-slate-700 transition-colors">Legal</a>
        </div>
      </footer>
    </div>
  );
}
