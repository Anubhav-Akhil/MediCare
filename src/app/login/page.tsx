'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Stethoscope,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ email: email.trim(), password });

      if (result.success) {
        showToast('Welcome back! Redirecting to workspace...', 'success');
        router.push(redirectPath);
        router.refresh();
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch {
      setErrorMessage('An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // First try to seed demo accounts in case database was fresh
      try {
        await fetch('/api/auth/seed', { method: 'POST' });
      } catch {
        // Ignore seed error
      }

      const result = await login({ email: demoEmail, password: demoPass });
      if (result.success) {
        showToast('Logged in as ' + demoEmail, 'success');
        router.push(redirectPath);
        router.refresh();
      } else {
        setErrorMessage(result.error || 'Failed to authenticate demo user.');
      }
    } catch {
      setErrorMessage('Unable to log in with demo credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#0c001a] text-white flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative overflow-y-auto lg:overflow-hidden py-16 sm:py-20 lg:py-0">
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
              <span>Full patient context ready before every visit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Live schedule, walk-in queue, and consultation notes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Secure role-based access for all clinical staff</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl shadow-purple-950/60">
            {/* Form Header */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/40 border border-purple-400/30 text-purple-300 text-[0.7rem] font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Welcome back
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Sign in to MediCare
              </h2>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Pick up where your clinic day left off.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Work Email */}
              <div>
                <label className="block text-[0.7rem] font-bold text-purple-200 uppercase tracking-wider mb-1">
                  Work email*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@medicare.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
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
                  <span
                    onClick={() => {
                      setEmail('doctor@medicare.com');
                      setPassword('password123');
                    }}
                    className="text-[0.68rem] text-purple-300 hover:text-white cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
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
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign in to workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-4 pt-3.5 border-t border-purple-500/20">
              <p className="text-[0.65rem] uppercase font-bold text-purple-300/70 tracking-wider mb-2">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('doctor@medicare.com', 'password123')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-[0.7rem] font-semibold text-purple-200 hover:bg-purple-800/40 hover:text-white transition-all cursor-pointer"
                  disabled={isLoading}
                >
                  <Stethoscope className="w-3 h-3 text-purple-400" />
                  Doctor Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@medicare.com', 'password123')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-[0.7rem] font-semibold text-purple-200 hover:bg-purple-800/40 hover:text-white transition-all cursor-pointer"
                  disabled={isLoading}
                >
                  <KeyRound className="w-3 h-3 text-fuchsia-400" />
                  Admin Demo
                </button>
              </div>
            </div>

            {/* Footer switch to setup/register */}
            <div className="mt-4 pt-3 border-t border-purple-500/20 text-center text-[0.75rem] text-purple-300/70">
              Need a clinic workspace?{' '}
              <Link
                href="/register"
                className="font-bold text-purple-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                Start setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0c001a] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
