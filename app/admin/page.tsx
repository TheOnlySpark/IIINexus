'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ShieldAlert, LayoutGrid, Megaphone, BarChart3, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import Link from 'next/link';

interface AppType {
  id: string;
  name: string;
  description: string;
  url: string;
  short_icon: string;
  is_active: boolean;
}

interface AnnouncementType {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

interface AnalyticsType {
  app_name: string;
  clicks: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'apps' | 'announcements' | 'analytics'>('apps');
  
  // Data States
  const [apps, setApps] = useState<AppType[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsType[]>([]);
  
  // Form States
  const [newAnnouncement, setNewAnnouncement] = useState('');
  
  const [editingApp, setEditingApp] = useState<AppType | null>(null);
  const [newApp, setNewApp] = useState<Partial<AppType>>({ name: '', description: '', url: '', short_icon: '', is_active: true });

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (!profile || profile.role !== 'admin') {
          router.replace('/dashboard');
          return;
        }

        fetchData();
      } catch (err) {
        console.error(err);
        router.replace('/dashboard');
      }
    };

    const fetchData = async () => {
      // Fetch Apps
      const { data: appsData } = await supabase.from('apps').select('*').order('created_at', { ascending: true });
      if (mounted && appsData) setApps(appsData);

      // Fetch Announcements
      const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (mounted && annData) setAnnouncements(annData);

      // Fetch Analytics (aggregate clicks by app)
      const { data: clicksData } = await supabase.from('app_clicks').select('app_id, apps(name)');
      if (mounted && clicksData) {
        const agg: Record<string, number> = {};
        clicksData.forEach((click: any) => {
          const appName = click.apps?.name || 'Unknown App';
          agg[appName] = (agg[appName] || 0) + 1;
        });
        setAnalytics(Object.entries(agg).map(([app_name, clicks]) => ({ app_name, clicks })));
      }

      if (mounted) setLoading(false);
    };

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, [router]);

  const toggleAppActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('apps').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) {
      setApps(apps.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a));
    }
  };

  const saveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApp) {
      const { error } = await supabase.from('apps').update(editingApp).eq('id', editingApp.id);
      if (!error) {
        setApps(apps.map(a => a.id === editingApp.id ? editingApp : a));
        setEditingApp(null);
      }
    } else {
      const { data, error } = await supabase.from('apps').insert([newApp]).select();
      if (!error && data) {
        setApps([...apps, data[0]]);
        setNewApp({ name: '', description: '', url: '', short_icon: '', is_active: true });
      }
    }
  };

  const deleteApp = async (id: string) => {
    const { error } = await supabase.from('apps').delete().eq('id', id);
    if (!error) {
      setApps(apps.filter(a => a.id !== id));
    }
  };

  const postAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    
    // First, deactivate all other announcements
    await supabase.from('announcements').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { data, error } = await supabase.from('announcements').insert([{ message: newAnnouncement, is_active: true }]).select();
    if (!error && data) {
      setAnnouncements([data[0], ...announcements.map(a => ({ ...a, is_active: false }))]);
      setNewAnnouncement('');
    }
  };

  const toggleAnnouncement = async (id: string, currentStatus: boolean) => {
    // If activating, deactivate all others first
    if (!currentStatus) {
      await supabase.from('announcements').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    }
    const { error } = await supabase.from('announcements').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) {
      setAnnouncements(announcements.map(a => {
        if (a.id === id) return { ...a, is_active: !currentStatus };
        if (!currentStatus) return { ...a, is_active: false };
        return a;
      }));
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Authenticating Admin...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] p-6 text-slate-900 font-sans">
      <header className="h-16 border-4 border-black bg-[#eab308] flex items-center justify-between px-6 shrink-0 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-black" strokeWidth={2.5} />
          <span className="font-black text-xl tracking-tight uppercase">Nexus Admin</span>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-white text-black border-2 border-black text-xs font-bold uppercase rounded-lg hover:bg-slate-100 active:translate-y-1 active:translate-x-1 active:shadow-none transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Exit Admin
        </Link>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <nav className="w-full md:w-64 flex flex-col gap-4 shrink-0">
          <button 
            onClick={() => setActiveTab('apps')}
            className={`flex items-center gap-3 px-5 py-4 border-4 border-black rounded-xl font-black uppercase tracking-wider transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none ${activeTab === 'apps' ? 'bg-black text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <LayoutGrid className="w-5 h-5" />
            Modules
          </button>
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-3 px-5 py-4 border-4 border-black rounded-xl font-black uppercase tracking-wider transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none ${activeTab === 'announcements' ? 'bg-black text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <Megaphone className="w-5 h-5" />
            Banners
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-5 py-4 border-4 border-black rounded-xl font-black uppercase tracking-wider transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none ${activeTab === 'analytics' ? 'bg-black text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
          
          {/* APPS TAB */}
          {activeTab === 'apps' && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Module Manager</h2>
                <p className="text-slate-500 font-medium text-sm">Add, edit, or disable apps on the student dashboard.</p>
              </div>

              <form onSubmit={saveApp} className="bg-slate-50 border-4 border-black border-dashed rounded-xl p-6 flex flex-col gap-4">
                <h3 className="font-black uppercase tracking-widest text-sm">{editingApp ? 'Edit Module' : 'Add New Module'}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required placeholder="App Name" className="border-2 border-black rounded-lg p-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f46e5]" value={editingApp ? editingApp.name : newApp.name} onChange={(e) => editingApp ? setEditingApp({...editingApp, name: e.target.value}) : setNewApp({...newApp, name: e.target.value})} />
                  <input required placeholder="Short Icon (e.g. BMS)" maxLength={4} className="border-2 border-black rounded-lg p-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f46e5]" value={editingApp ? editingApp.short_icon : newApp.short_icon} onChange={(e) => editingApp ? setEditingApp({...editingApp, short_icon: e.target.value}) : setNewApp({...newApp, short_icon: e.target.value})} />
                </div>
                <input required placeholder="URL (e.g. https://campusslotbooking.vercel.app)" type="url" className="border-2 border-black rounded-lg p-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f46e5]" value={editingApp ? editingApp.url : newApp.url} onChange={(e) => editingApp ? setEditingApp({...editingApp, url: e.target.value}) : setNewApp({...newApp, url: e.target.value})} />
                <textarea required placeholder="Short Description" className="border-2 border-black rounded-lg p-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f46e5]" value={editingApp ? editingApp.description : newApp.description} onChange={(e) => editingApp ? setEditingApp({...editingApp, description: e.target.value}) : setNewApp({...newApp, description: e.target.value})} />
                
                <div className="flex gap-4">
                  <button type="submit" className="bg-[#4f46e5] text-white px-6 py-3 border-2 border-black rounded-xl font-black uppercase tracking-widest hover:bg-[#4338ca] active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
                    {editingApp ? 'Save Changes' : 'Publish App'}
                  </button>
                  {editingApp && (
                    <button type="button" onClick={() => setEditingApp(null)} className="bg-white text-black px-6 py-3 border-2 border-black rounded-xl font-black uppercase tracking-widest hover:bg-slate-100 active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="grid grid-cols-1 gap-4">
                {apps.map(app => (
                  <div key={app.id} className={`border-4 border-black rounded-xl p-4 flex items-center justify-between ${app.is_active ? 'bg-white' : 'bg-slate-100 opacity-70'}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-black text-white text-xs font-black px-2 py-1 rounded">{app.short_icon}</span>
                        <h4 className="font-black uppercase tracking-tight text-lg">{app.name}</h4>
                        {!app.is_active && <span className="bg-red-500 text-white text-xs font-black uppercase px-2 py-1 rounded tracking-widest">Hidden</span>}
                      </div>
                      <p className="text-sm font-medium text-slate-500 truncate max-w-xs sm:max-w-md">{app.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleAppActive(app.id, app.is_active)} className="p-2 border-2 border-black rounded-lg hover:bg-slate-100 transition-colors">
                        {app.is_active ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
                      </button>
                      <button onClick={() => setEditingApp(app)} className="p-2 border-2 border-black rounded-lg hover:bg-slate-100 transition-colors">
                        <Edit2 className="w-5 h-5 text-blue-600" />
                      </button>
                      <button onClick={() => deleteApp(app.id)} className="p-2 border-2 border-black rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === 'announcements' && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Global Banners</h2>
                <p className="text-slate-500 font-medium text-sm">Push urgent announcements to the top of everyone's dashboard.</p>
              </div>

              <form onSubmit={postAnnouncement} className="bg-[#facc15]/20 border-4 border-[#facc15] border-dashed rounded-xl p-6 flex flex-col gap-4">
                <h3 className="font-black uppercase tracking-widest text-sm text-[#ca8a04]">New Announcement</h3>
                <textarea required placeholder="Type your message here..." className="border-2 border-black rounded-lg p-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#facc15]" value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} />
                <button type="submit" className="bg-[#eab308] text-black px-6 py-3 border-2 border-black rounded-xl font-black uppercase tracking-widest hover:bg-[#ca8a04] active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform self-start">
                  Broadcast Banner
                </button>
              </form>

              <div className="flex flex-col gap-4">
                {announcements.map(ann => (
                  <div key={ann.id} className={`border-2 border-black rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${ann.is_active ? 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-50 opacity-60'}`}>
                    <div className="flex flex-col gap-1">
                      {ann.is_active && <span className="bg-[#facc15] text-black text-xs font-black uppercase tracking-widest px-2 py-1 rounded w-fit mb-1">Live Right Now</span>}
                      <p className="font-bold text-slate-800">{ann.message}</p>
                      <p className="text-xs font-medium text-slate-400">{new Date(ann.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleAnnouncement(ann.id, ann.is_active)} className="px-4 py-2 border-2 border-black rounded-lg font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors">
                        {ann.is_active ? 'Disable' : 'Set Active'}
                      </button>
                      <button onClick={() => deleteAnnouncement(ann.id)} className="p-2 border-2 border-black rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && <p className="text-slate-500 font-bold">No announcements yet.</p>}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Usage Analytics</h2>
                <p className="text-slate-500 font-medium text-sm">See which modules are driving the most engagement.</p>
              </div>

              {analytics.length === 0 ? (
                <div className="p-8 border-4 border-black border-dashed rounded-2xl text-center text-slate-500 font-bold uppercase tracking-widest bg-slate-50">
                  No clicks recorded yet.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {analytics.sort((a,b) => b.clicks - a.clicks).map((item, index) => (
                    <div key={index} className="border-4 border-black rounded-xl p-4 flex items-center justify-between bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                      {/* Fake progress bar background for visual flair */}
                      <div className="absolute top-0 left-0 bottom-0 bg-[#4f46e5]/10 z-0" style={{ width: `${Math.min(100, (item.clicks / analytics[0].clicks) * 100)}%` }}></div>
                      
                      <div className="relative z-10 flex items-center gap-4">
                        <span className="font-black text-2xl text-slate-300">#{index + 1}</span>
                        <h4 className="font-black uppercase tracking-tight text-xl">{item.app_name}</h4>
                      </div>
                      <div className="relative z-10 flex flex-col items-end">
                        <span className="font-black text-3xl">{item.clicks}</span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total Clicks</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
