'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Megaphone, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AnnouncementType {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/');
          return;
        }

        const { data } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });

        if (mounted && data) {
          setAnnouncements(data);
        }

        if (mounted) setLoading(false);
      } catch (err) {
        console.error(err);
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [router]);

  // Sort the announcements based on state
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Announcements...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 sm:p-6 text-slate-900 font-sans">
      <header className="h-16 bg-white border border-slate-200 flex items-center justify-between px-6 shrink-0 rounded-2xl shadow-sm mb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
            <span className="font-black text-xl tracking-tight uppercase hidden sm:inline">Announcements</span>
            <span className="font-black text-xl tracking-tight uppercase sm:hidden">Updates</span>
          </div>
        </div>
        
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all cursor-pointer"
        >
          <option value="desc">Latest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-4">
        {announcements.length === 0 ? (
          <div className="p-8 border border-slate-200 border-dashed rounded-2xl text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">
            No announcements available.
          </div>
        ) : (
          sortedAnnouncements.map((ann) => (
            <div 
              key={ann.id} 
              className={`border rounded-2xl p-6 flex items-start gap-4 shadow-sm transition-all ${
                ann.is_active 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`mt-1 shrink-0 ${ann.is_active ? 'text-amber-600' : 'text-slate-400'}`}>
                {ann.is_active ? (
                  <AlertCircle className="w-6 h-6" strokeWidth={2.5} />
                ) : (
                  <Clock className="w-6 h-6" strokeWidth={2.5} />
                )}
              </div>
              <div className="flex-1">
                {ann.is_active && (
                  <div className="mb-2">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                      Pinned
                    </span>
                  </div>
                )}
                <p className={`font-bold text-base leading-relaxed whitespace-pre-wrap ${ann.is_active ? 'text-amber-900' : 'text-slate-700'}`}>
                  {ann.message}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <span>{new Date(ann.created_at).toLocaleDateString()}</span>
                  <span>&bull;</span>
                  <span>{new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
