'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, User, Lock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ProfileType {
  role: string;
  course: string;
  year: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Profile State
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/');
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, course, year')
          .eq('id', session.user.id)
          .single();
          
        if (mounted && profileData) {
          setProfile(profileData);
          setCourse(profileData.course || '');
          setYear(profileData.year || '');
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({ course, year })
      .eq('id', session.user.id);

    setSavingProfile(false);

    if (error) {
      setProfileMessage({ type: 'error', text: error.message });
    } else {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 transition-colors">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 sm:p-6 text-slate-900 font-sans transition-colors">
      <header className="h-16 bg-white border border-slate-200 flex items-center px-6 shrink-0 rounded-2xl shadow-sm mb-6 max-w-4xl mx-auto w-full transition-colors">
        <Link 
          href="/dashboard"
          className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 ml-2">
          <User className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
          <span className="font-black text-xl tracking-tight uppercase">Settings</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-6">
        
        {/* Profile Settings */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <User className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-black uppercase tracking-tight">Academic Profile</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 max-w-md">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Course
              </label>
              <input 
                type="text" 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. BCA, BBA, BTech"
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" 
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Year of Study
              </label>
              <select 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" 
              >
                <option value="" disabled>Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            {profileMessage && (
              <div className={`text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {profileMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {profileMessage.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={savingProfile}
              className="mt-2 w-fit flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] hover:bg-indigo-700 active:scale-95 shadow-sm transition-all disabled:opacity-70 disabled:active:scale-100"
            >
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile
            </button>
          </form>
        </section>

        {/* Security Settings */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <Lock className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-black uppercase tracking-tight">Security</h2>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-slate-900 font-bold mb-2">Password Management</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
              For security reasons, password changes must be initiated by an administrator. Please contact your system admin to request a password reset.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
