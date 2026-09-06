import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    course: '',
    year: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.name,
            reg_no: formData.regNo,
            course: formData.course,
            year: formData.year,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">Create Account</h2>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">Join III Nexus and access your workspace.</p>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-emerald-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">Check Your Email</h3>
          <p className="text-slate-500 font-medium text-sm">
            We've sent a confirmation link to <br/><span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 mt-3 inline-block rounded-lg shadow-sm">{formData.email}</span>
            <br/><br/>Please verify your email to complete registration.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="mt-4 w-full bg-[#4052ff] text-white rounded-xl py-2.5 sm:py-3 font-bold tracking-wide hover:bg-[#3242db] active:scale-95 shadow-md transition-all text-sm sm:text-base"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="name">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="regNo">
                Reg Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="regNo"
                name="regNo"
                type="text"
                value={formData.regNo}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                placeholder="23BCE1234"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="email">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
              placeholder="member@student.university.edu"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="course">
                Course <span className="text-rose-500">*</span>
              </label>
              <input
                id="course"
                name="course"
                type="text"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                placeholder="B.Tech CSE"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="year">
                Year <span className="text-rose-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 shadow-sm text-sm"
              >
                <option value="" disabled>Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="password">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500" htmlFor="confirmPassword">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors font-medium text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              className="w-4 h-4 border-slate-300 rounded text-indigo-600 focus:ring-indigo-600 cursor-pointer shadow-sm"
            />
            <label htmlFor="terms" className="text-xs font-medium text-slate-500 leading-tight">
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-indigo-600 underline decoration-slate-300 underline-offset-2 transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-indigo-600 underline decoration-slate-300 underline-offset-2 transition-colors">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="mt-1 w-full bg-[#4052ff] text-white rounded-lg sm:rounded-xl py-2.5 sm:py-3 font-bold tracking-wide hover:bg-[#3242db] active:scale-95 shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm sm:text-base"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
            {!loading && <ArrowRight className="w-4 h-4" strokeWidth={3} />}
          </button>
        </form>
      )}
    </motion.div>
  );
}
