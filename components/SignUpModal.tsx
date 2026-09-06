'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            className="w-full max-w-lg bg-white border-4 border-black rounded-2xl p-6 sm:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto my-4 sm:my-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl transition-colors active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>

            <div className="mb-8 pr-12">
              <h2 className="text-3xl font-black uppercase leading-none tracking-tight mb-2">Join Nexus</h2>
              <p className="text-slate-500 font-medium text-sm">Create your account to get started.</p>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-400 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-3xl">📧</span>
                </div>
                <h3 className="text-2xl font-black uppercase">Check Your Email</h3>
                <p className="text-slate-600 font-medium">
                  We've sent a confirmation link to <br/><span className="font-bold text-black bg-slate-100 px-2 py-1 mt-2 inline-block border-2 border-black rounded-lg">{formData.email}</span>
                  <br/><br/>Please verify your email to complete registration.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full bg-[#4f46e5] text-white border-2 border-black rounded-xl py-3 font-black uppercase tracking-widest hover:bg-[#4338ca] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="bg-red-50 border-2 border-black text-red-600 p-4 rounded-xl text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="regNo">
                      Reg Number
                    </label>
                    <input
                      id="regNo"
                      name="regNo"
                      type="text"
                      value={formData.regNo}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
                      placeholder="23BCE1234"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
                    placeholder="member@student.university.edu"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="course">
                      Course
                    </label>
                    <input
                      id="course"
                      name="course"
                      type="text"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
                      placeholder="B.Tech CSE"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="year">
                      Year
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black"
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-tighter text-slate-900" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full border-2 border-black rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all font-medium text-black placeholder:text-slate-400"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    className="w-5 h-5 border-2 border-black rounded focus:ring-2 focus:ring-[#4f46e5] accent-[#4f46e5] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm font-medium text-slate-700">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-bold text-black underline hover:text-[#4f46e5]">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-black underline hover:text-[#4f46e5]">Privacy Policy</a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreedToTerms}
                  className="mt-4 w-full bg-[#facc15] text-black border-4 border-black rounded-xl py-4 font-black uppercase tracking-widest hover:bg-[#eab308] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:translate-x-0 disabled:active:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
