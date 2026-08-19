'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Activity,
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
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        showToast('Login successful! Redirecting...', 'success');
        router.push(redirectPath);
        router.refresh();
      } else {
        // If user doesn't exist in DB, maybe they need to seed or register
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
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
    <div className="w-full max-w-md">
      {/* Glass Login Card */}
      <div className="glass-card-static p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-purple-200/50 backdrop-blur-xl">
        {/* Background glow circle */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br from-purple-600/20 to-fuchsia-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-gradient-to-tr from-fuchsia-600/15 to-purple-500/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-600/30 mb-4 transform hover:scale-105 transition-transform duration-300">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-purple-600/70 font-medium mt-1">
            Sign in to access your clinical dashboard
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm flex items-start gap-3 animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
              {errorMessage.includes('Invalid') && (
                <p className="mt-1 text-rose-600/80">
                  Tip: Click one of the quick demo accounts below to auto-seed and log in.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@medicare.com"
                className="pro-input pl-10 w-full text-sm font-medium bg-white/70 focus:bg-white"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast('Please contact your clinic administrator to reset your password.', 'info')}
                className="text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pro-input pl-10 pr-10 w-full text-sm font-medium bg-white/70 focus:bg-white"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-purple-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 accent-purple-600"
              />
              <span className="text-xs font-medium text-slate-600">Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 cursor-pointer text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-purple-100/60 relative z-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-purple-500/80 mb-3 flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />
            Quick Demo Login (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickFill('doctor@medicare.com', 'password123')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-purple-200/80 bg-purple-50/60 hover:bg-purple-100/70 text-purple-900 text-xs font-semibold transition-all hover:border-purple-300 shadow-xs active:scale-95"
            >
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Doctor Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@medicare.com', 'password123')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-purple-200/80 bg-purple-50/60 hover:bg-purple-100/70 text-purple-900 text-xs font-semibold transition-all hover:border-purple-300 shadow-xs active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5 text-fuchsia-600" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Register footer link */}
        <div className="mt-6 text-center text-xs text-slate-500 relative z-10">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-purple-600 hover:text-purple-700 font-bold hover:underline"
          >
            Create practitioner account
          </Link>
        </div>
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-6 mt-6 text-slate-400 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          HIPAA Ready
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-purple-500" />
          JWT Session Security
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12 relative">
      {/* Background decoration */}
      <div className="page-bg-decor" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
