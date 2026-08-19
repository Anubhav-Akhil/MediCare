'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [clinicName, setClinicName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!clinicName.trim()) {
      setErrorMessage('Please enter your clinic name.');
      return;
    }

    if (!ownerName.trim()) {
      setErrorMessage('Please enter the clinic owner name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please provide a valid work email.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: ownerName.trim(),
        email: email.trim(),
        password,
        clinicName: clinicName.trim(),
        role: 'Admin',
        department: clinicName.trim() || 'Clinic Owner',
      });

      if (result.success) {
        showToast('Clinic workspace created! Welcome to MediCare.', 'success');
        router.push('/dashboard');
        router.refresh();
      } else {
        setErrorMessage(result.error || 'Failed to create clinic workspace.');
      }
    } catch {
      setErrorMessage('An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#0c001a] text-white flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative overflow-y-auto lg:overflow-hidden">
      {/* Top Right: Modern Back to Home Pill */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30">
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full bg-slate-950/80 hover:bg-purple-950/90 border border-purple-500/30 hover:border-purple-400/60 backdrop-blur-2xl text-xs font-semibold text-purple-200 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-purple-950/60"
        >
          {/* Subtle glowing hover aura */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 pointer-events-none" />

          {/* Animated disc with arrow */}
          <span className="relative w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:bg-gradient-to-tr group-hover:from-purple-600 group-hover:to-fuchsia-500 group-hover:text-white transition-all duration-300 shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
          </span>

          <span className="relative font-bold tracking-tight">Back to Home</span>
        </Link>
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-6">
        {/* Left Column: Branding & Workspace Mission */}
        <div className="lg:col-span-5 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl overflow-hidden bg-purple-600/30 border border-purple-400/30 p-1 shadow-lg group-hover:scale-105 transition-transform">
              <Image
                src="/logo.svg"
                alt="MediCare Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">
                MediCare
              </span>
              <span className="text-[0.62rem] font-bold text-purple-300 uppercase tracking-widest leading-none">
                Clinic workspace
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              A calmer clinic day
            </h1>
            <p className="text-sm sm:text-base font-bold text-purple-300 mt-1">
              The workbench for care that keeps moving.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed max-w-sm">
            MediCare brings the patient journey into one focused workspace — from the first check-in to the follow-up.
          </p>

          <div className="pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Tenant-isolated by design</span>
            </div>
          </div>

          {/* Value Points */}
          <div className="space-y-2 pt-2 text-xs text-purple-200/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero setup fees or complex server configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Integrated patient intake, scheduling &amp; records</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Role-based access for doctors, front desk &amp; owners</span>
            </div>
          </div>
        </div>

        {/* Right Column: Setup Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl shadow-purple-950/60">
            {/* Form Header */}
            <div className="mb-3.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/40 border border-purple-400/30 text-purple-300 text-[0.7rem] font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                First visit
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Set up your clinic
              </h2>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Create the workspace your team will use every day.
              </p>
            </div>

            {/* Helper Alert Banner */}
            <div className="mb-3.5 p-2.5 rounded-xl bg-purple-900/20 border border-purple-500/30 text-purple-200/90 text-[0.72rem] leading-relaxed flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1 shrink-0" />
              <span>
                Create the owner account first. If email confirmation is enabled, setup finishes after you confirm and sign in.
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Setup Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Clinic Name */}
                <div>
                  <label className="block text-[0.7rem] font-bold text-purple-200 uppercase tracking-wider mb-1">
                    Clinic name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="e.g. Apex Health"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-[0.7rem] font-bold text-purple-200 uppercase tracking-wider mb-1">
                    Owner name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Dr. Anika Sharma"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-[0.7rem] font-bold text-purple-200 uppercase tracking-wider mb-1">
                  Work email*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anika@apexhealth.com"
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[0.7rem] font-bold text-purple-200 uppercase tracking-wider">
                    Password*
                  </label>
                  <span className="text-[0.65rem] text-purple-300/70">
                    Use at least 8 characters
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-9 py-1.5 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Clinic Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer switch to login */}
            <div className="mt-3.5 pt-3 border-t border-purple-500/20 text-center text-[0.75rem] text-purple-300/70">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-purple-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
