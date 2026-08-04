'use client';

import Link from 'next/link';
import {
  Activity,
  Users,
  CalendarCheck,
  FileText,
  Shield,
  Zap,
  Heart,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Patient Management',
    desc: 'Comprehensive patient profiles with demographics, contact info, medical history, and blood group tracking.',
    color: 'from-teal-500 to-emerald-400',
  },
  {
    icon: CalendarCheck,
    title: 'Smart Scheduling',
    desc: 'Intuitive appointment scheduling with real-time status tracking, department filtering, and calendar views.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: FileText,
    title: 'Medical Records',
    desc: 'Secure digital records for diagnoses, prescriptions, and clinical notes — accessible when you need them.',
    color: 'from-indigo-500 to-purple-400',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data stays on your device with local-first architecture. No third-party servers, no compromises.',
    color: 'from-rose-500 to-pink-400',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built with Next.js and optimized for speed. Instant page transitions and zero loading spinners.',
    color: 'from-amber-500 to-yellow-400',
  },
  {
    icon: Heart,
    title: 'Built for Healthcare',
    desc: 'Designed by understanding real clinical workflows. Every feature serves a purpose in patient care.',
    color: 'from-teal-600 to-teal-400',
  },
];

const stats = [
  { value: '10k+', label: 'Patients Managed' },
  { value: '50k+', label: 'Appointments Booked' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9', label: 'User Rating', icon: Star },
];

const steps = [
  {
    num: '01',
    title: 'Register Patients',
    desc: 'Add patient details with comprehensive profiles including contact, demographics, and medical information.',
  },
  {
    num: '02',
    title: 'Schedule Appointments',
    desc: 'Book appointments with specific doctors and departments. Track status in real-time.',
  },
  {
    num: '03',
    title: 'Manage Records',
    desc: 'Log diagnoses, prescriptions, and clinical notes. Access complete patient history instantly.',
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ══════════ HERO ══════════ */}
      <section className="hero-gradient min-h-screen flex items-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm mb-8 animate-fade-up"
              style={{ opacity: 0 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">
                Modern Healthcare Management Platform
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 animate-fade-up delay-1"
              style={{ opacity: 0, color: '#0f172a' }}
            >
              Patient care,{' '}
              <span className="gradient-text">simplified.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-up delay-2"
              style={{ opacity: 0 }}
            >
              Streamline your practice with an elegant platform for managing
              patients, appointments, and medical records — all in one place.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-3"
              style={{ opacity: 0 }}
            >
              <Link
                href="/dashboard"
                className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="btn-outline-primary text-base px-8 py-3.5"
              >
                Explore Features
              </Link>
            </div>

            {/* Trust line */}
            <p
              className="mt-10 text-sm text-slate-400 font-medium animate-fade-up delay-4"
              style={{ opacity: 0 }}
            >
              Trusted by 200+ healthcare professionals
            </p>
          </div>

          {/* Hero Visual — Floating Glass Cards */}
          <div
            className="mt-16 max-w-4xl mx-auto relative animate-fade-up delay-5"
            style={{ opacity: 0 }}
          >
            <div className="glass-card-static p-6 sm:p-8">
              {/* Mock Dashboard Preview */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-slate-400 font-medium">
                  MediCare Dashboard
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Patients', value: '1,284', color: 'text-teal-600' },
                  { label: 'Appointments', value: '48', color: 'text-blue-600' },
                  { label: 'Completed', value: '156', color: 'text-emerald-600' },
                  { label: 'Records', value: '892', color: 'text-indigo-600' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/60 rounded-xl p-4 border border-white/40"
                  >
                    <p className="text-xs text-slate-400 font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-xl p-5 border border-white/40">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Recent Patients
                  </p>
                  {['Aarav Sharma', 'Priya Patel', 'Rohan Gupta'].map(
                    (name, i) => (
                      <div
                        key={name}
                        className="flex items-center gap-3 py-2"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                            i === 0
                              ? 'bg-gradient-to-br from-teal-500 to-teal-400'
                              : i === 1
                              ? 'bg-gradient-to-br from-blue-500 to-blue-400'
                              : 'bg-gradient-to-br from-indigo-500 to-indigo-400'
                          }`}
                        >
                          {name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Just registered
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="bg-white/60 rounded-xl p-5 border border-white/40">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Today&apos;s Schedule
                  </p>
                  {[
                    { time: '10:00 AM', name: 'Cardiology Check', status: 'Scheduled' },
                    { time: '11:30 AM', name: 'Dermatology Visit', status: 'Completed' },
                    { time: '02:00 PM', name: 'Prenatal Checkup', status: 'Scheduled' },
                  ].map((apt) => (
                    <div
                      key={apt.time}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-400 w-16">
                          {apt.time}
                        </span>
                        <span className="text-sm text-slate-700">
                          {apt.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-1">
                  {s.value}
                  {s.icon && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
                </p>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Zap className="w-3.5 h-3.5" />
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-4 mb-4">
              Everything you need to run your practice
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
              From patient registration to medical records, every tool is
              designed for speed, clarity, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`feature-card animate-fade-up delay-${i + 1}`}
                  style={{ opacity: 0, animationFillMode: 'forwards' }}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Activity className="w-3.5 h-3.5" />
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-4 mb-4">
              Three simple steps
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
              Get started in minutes with an intuitive workflow designed for
              healthcare teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="text-center relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200" />
                )}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-extrabold text-teal-600">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1), transparent 50%)',
            }}
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to modernize your practice?
          </h2>
          <p className="text-lg text-teal-100 mb-10 font-medium max-w-xl mx-auto">
            Join healthcare professionals who trust MediCare for efficient
            patient management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-white text-teal-700 font-bold rounded-xl text-base shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              Start Managing Patients
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-teal-200 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Free to use
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> No signup needed
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Fully offline
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                MediCare
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/patients" className="hover:text-white transition-colors">
                Patients
              </Link>
              <Link href="/appointments" className="hover:text-white transition-colors">
                Appointments
              </Link>
              <Link href="/records" className="hover:text-white transition-colors">
                Records
              </Link>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} MediCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
