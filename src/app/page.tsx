'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  CalendarCheck,
  FileText,
  ShieldCheck,
  HeartPulse,
  ChevronDown,
  Activity,
  UserCheck,
  Building2,
  Stethoscope,
  ClipboardList,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

import styles from './page.module.css';

const sectionIds = [
  'hero',
  'workspace',
  'operations',
  'workflow',
  'roles',
  'continuity',
  'security',
];

export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageShell}>
      {/* ── Fixed Compact Pagination Dots ───────────────────── */}
      <div className={styles.paginationDots} aria-label="Page navigation dots">
        {sectionIds.map((id, index) => (
          <button
            key={id}
            type="button"
            className={styles.dotButton}
            onClick={() => scrollToSection(id)}
            aria-label={`Scroll to ${id}`}
          >
            <span
              className={`${styles.paginationDot} ${
                activeSectionIndex === index ? styles.paginationDotActive : ''
              }`}
            />
          </button>
        ))}
      </div>

      {/* ── Section 1: Hero (Full-Screen 100vh Video Background) ───────────────── */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBackdrop}>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/landing-space-bg.png"
            src="/back_mvp.mp4"
            onCanPlay={() => setVideoLoaded(true)}
            onCanPlayThrough={() => setVideoLoaded(true)}
            onLoadedData={() => setVideoLoaded(true)}
            onPlaying={() => setVideoLoaded(true)}
            className={`${styles.heroVideo} ${videoLoaded ? styles.heroVideoReady : ''}`}
          />
          <div className={styles.heroShade} />
          <div className={styles.heroVignette} />
          <div className={styles.heroGlow} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.copyBlock}>
            {/* Eyebrow Badge */}
            <div className={styles.copyBadge}>
              <Sparkles size={14} className="text-purple-300 animate-pulse" />
              <span>Clinical Continuity &amp; Care Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className={styles.headline}>
              Patient context that persists across every visit and handoff
            </h1>

            {/* Subtitle */}
            <p className={styles.subcopy}>
              A focused clinic workspace for patients, appointments, consultations, prescriptions, billing, and follow-up. Context that stays useful. Built for the everyday.
            </p>

            {/* CTA Row */}
            <div className={styles.ctaRow}>
              <Link href="/register" className={styles.primaryCta}>
                <span className={styles.ctaIcon}>
                  <Sparkles size={16} />
                </span>
                Get Started
              </Link>
              <Link href="/login" className={styles.secondaryCta}>
                Sign In
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Explore scroll pill */}
          <button
            type="button"
            onClick={() => scrollToSection('workspace')}
            className={styles.heroExplorePill}
            aria-label="Scroll to Workspace section"
          >
            <div className={styles.exploreMouseIcon}>
              <div className={styles.exploreMouseWheel} />
            </div>
            <span className={styles.exploreText}>Explore Workspace</span>
            <ChevronDown size={14} className={styles.exploreChevron} />
          </button>
        </div>
      </section>

      {/* ── Section 2: Live Clinic Workspace Simulation ─────── */}
      <section id="workspace" className="relative z-10 py-20 bg-[#0c001a] border-t border-purple-500/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Live Clinic Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              One focused workspace for the whole team
            </h2>
          </div>

          <div className="w-full rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl shadow-purple-950/60 text-left">
            {/* Top Workspace Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 p-0.5 shadow-md flex items-center justify-center">
                  <Image src="/logo.svg" alt="Logo" width={24} height={24} className="rounded-lg" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wide block">
                    MediCare
                  </span>
                  <span className="text-[0.68rem] text-purple-300/80 font-medium block">
                    Clinic workspace · medicare.workspace/today
                  </span>
                </div>
              </div>

              {/* Subnav Tabs */}
              <div className="hidden sm:flex items-center gap-1.5 bg-purple-950/60 border border-purple-500/20 rounded-full p-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-bold shadow-xs">
                  Today
                </span>
                <span className="px-3 py-1 text-purple-200/70 hover:text-white cursor-pointer">
                  Patients
                </span>
                <span className="px-3 py-1 text-purple-200/70 hover:text-white cursor-pointer">
                  Appointments
                </span>
                <span className="px-3 py-1 text-purple-200/70 hover:text-white cursor-pointer">
                  Queue
                </span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <div className="w-6 h-6 rounded-full bg-purple-500/80 text-white text-[0.65rem] font-black flex items-center justify-center">
                  AS
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white leading-none">Anika Sharma</p>
                  <p className="text-[0.62rem] text-purple-300/70 leading-none">Clinic owner</p>
                </div>
              </div>
            </div>

            {/* Greeting & Date */}
            <div className="py-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-purple-300/80">Tuesday, 14 August</p>
                <h3 className="text-xl font-bold text-white mt-0.5">Good morning, Anika.</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                All systems ready
              </div>
            </div>

            {/* 4 Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-3">
                <p className="text-2xl sm:text-3xl font-black text-white">14</p>
                <p className="text-xs font-semibold text-purple-300/80 mt-1">Appointments</p>
              </div>
              <div className="rounded-2xl bg-amber-900/20 border border-amber-500/20 p-3">
                <p className="text-2xl sm:text-3xl font-black text-amber-300">03</p>
                <p className="text-xs font-semibold text-amber-200/80 mt-1">Waiting</p>
              </div>
              <div className="rounded-2xl bg-emerald-900/20 border border-emerald-500/20 p-3">
                <p className="text-2xl sm:text-3xl font-black text-emerald-300">08</p>
                <p className="text-xs font-semibold text-emerald-200/80 mt-1">Completed</p>
              </div>
              <div className="rounded-2xl bg-fuchsia-900/30 border border-fuchsia-500/20 p-3">
                <p className="text-2xl sm:text-3xl font-black text-fuchsia-300">04</p>
                <p className="text-xs font-semibold text-fuchsia-200/80 mt-1">Follow-ups</p>
              </div>
            </div>

            {/* Split Preview Grid: Next Patient & Today's Queue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-purple-500/20">
              {/* Next Patient Card */}
              <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Next patient
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[0.68rem] font-bold">
                    Ready now
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/50 border border-purple-400/40 text-white font-bold flex items-center justify-center text-sm">
                    03
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Rahul Sharma</h4>
                    <p className="text-xs text-purple-200/70">Follow-up consultation</p>
                    <div className="flex items-center gap-2 mt-2 text-[0.7rem] text-purple-300/80">
                      <span>Last visit: 04 Aug 2026</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-semibold">History Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Queue Card */}
              <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Today&apos;s queue
                  </span>
                  <span className="text-[0.68rem] text-purple-300/70">
                    Appointments + walk-ins
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-purple-950/50 border border-purple-500/20">
                    <span className="font-bold text-white">03 Rahul Sharma</span>
                    <span className="text-purple-300 text-[0.7rem]">Follow-up consultation</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-white/90">04 Meera Nair</span>
                    <span className="text-purple-300/80 text-[0.7rem]">Routine check</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-white/90">05 Arjun Kapoor</span>
                    <span className="text-purple-300/80 text-[0.7rem]">New visit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metric Ribbon ───────────────────────────────────── */}
      <section className="relative z-10 border-y border-purple-500/20 bg-[#120026]/90 backdrop-blur-xl py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-purple-300/80 mb-6">
            One system for every clinic handoff
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 text-center">
            <div className="border-r border-purple-500/20 pb-2 lg:pb-0">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">01</p>
              <p className="text-xs sm:text-sm font-semibold text-purple-200/80 mt-1">
                One connected workspace
              </p>
            </div>
            <div className="lg:border-r border-purple-500/20 pb-2 lg:pb-0">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-300">06</p>
              <p className="text-xs sm:text-sm font-semibold text-purple-200/80 mt-1">
                Care steps in one flow
              </p>
            </div>
            <div className="border-r border-purple-500/20 pt-2 lg:pt-0">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-fuchsia-300">24/7</p>
              <p className="text-xs sm:text-sm font-semibold text-purple-200/80 mt-1">
                Patient context available
              </p>
            </div>
            <div className="pt-2 lg:pt-0">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-pink-300">100%</p>
              <p className="text-xs sm:text-sm font-semibold text-purple-200/80 mt-1">
                Role-aware by design
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Connected care operations ────────────── */}
      <section id="operations" className={styles.fullSection}>
        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Connected care operations</div>
            <h2 className={styles.sectionTitle}>
              Built for clinics that want proof, not promises.
            </h2>
            <p className={styles.sectionDescription}>
              MediCare keeps the day measurable and visible: fewer disconnected screens, clearer ownership, and patient context that arrives before the next decision.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Continuity</h3>
              <p className="text-sm text-purple-200/70 mt-1">Keep each visit connected</p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-600/30 text-fuchsia-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Visibility</h3>
              <p className="text-sm text-purple-200/70 mt-1">See the clinic day clearly</p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-pink-600/30 text-pink-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Control</h3>
              <p className="text-sm text-purple-200/70 mt-1">Give each role the right view</p>
            </div>
          </div>

          {/* Patient Continuity Showcase Card */}
          <div className="rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                    Patient continuity
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    Context ready
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Rahul Sharma · <span className="text-purple-300 font-mono text-lg">PT-2026-041</span>
                </h3>
              </div>

              <div className="flex items-center gap-6 text-xs sm:text-sm">
                <div>
                  <p className="text-purple-300/70">Last visit</p>
                  <p className="font-bold text-white">04 Aug 2026</p>
                </div>
                <div>
                  <p className="text-purple-300/70">Current plan</p>
                  <p className="font-bold text-white">Review in 10 days</p>
                </div>
                <div>
                  <p className="text-purple-300/70">Next action</p>
                  <p className="font-bold text-emerald-300">Follow-up today</p>
                </div>
              </div>
            </div>

            {/* Care Timeline */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Care timeline
                </h4>
                <span className="text-xs text-purple-300/80 font-medium">4 connected steps</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-purple-300">Step 1</p>
                    <p className="text-sm font-bold text-white">Registered</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-purple-300">Step 2</p>
                    <p className="text-sm font-bold text-white">Checked in</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center gap-3 shadow-lg shadow-purple-950/40">
                  <div className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 animate-pulse">
                    3
                  </div>
                  <div>
                    <p className="text-xs text-purple-200 font-semibold">Active</p>
                    <p className="text-sm font-bold text-white">Consulted</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-purple-400/40 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="text-xs text-purple-300/60">Upcoming</p>
                    <p className="text-sm font-bold text-white/80">Follow-up</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: How it works ─────────────────────────── */}
      <section id="workflow" className={styles.fullSection}>
        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>How it works</div>
            <h2 className={styles.sectionTitle}>
              Add the patient. Keep the context. Move care forward.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-purple-400/80 block mb-4">01</span>
                <h3 className="text-xl font-bold text-white">Register</h3>
                <p className="text-sm text-purple-200/70 mt-2 leading-relaxed">
                  Find or create the patient record without duplicate work.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center gap-2 text-xs font-bold text-purple-300">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Patient Profile</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-fuchsia-400/80 block mb-4">02</span>
                <h3 className="text-xl font-bold text-white">Check in</h3>
                <p className="text-sm text-purple-200/70 mt-2 leading-relaxed">
                  Move appointments and walk-ins into one visible queue.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center gap-2 text-xs font-bold text-fuchsia-300">
                <CalendarCheck className="w-4 h-4 text-fuchsia-400" />
                <span>Live Queue Sync</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-pink-400/80 block mb-4">03</span>
                <h3 className="text-xl font-bold text-white">Consult</h3>
                <p className="text-sm text-purple-200/70 mt-2 leading-relaxed">
                  Bring history, notes, and the next action into one view.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center gap-2 text-xs font-bold text-pink-300">
                <Stethoscope className="w-4 h-4 text-pink-400" />
                <span>Clinical Notes</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-purple-300/80 block mb-4">04</span>
                <h3 className="text-xl font-bold text-white">Close</h3>
                <p className="text-sm text-purple-200/70 mt-2 leading-relaxed">
                  Finish with a prescription, bill, and follow-up plan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center gap-2 text-xs font-bold text-purple-200">
                <FileText className="w-4 h-4 text-purple-300" />
                <span>Summary &amp; Rx</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: One platform, every role ─────────────── */}
      <section id="roles" className={styles.fullSection}>
        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>One platform, every role</div>
            <h2 className={styles.sectionTitle}>
              A clinic workspace that adapts to your team.
            </h2>
            <p className={styles.sectionDescription}>
              Each role gets the context it needs, while the patient journey remains connected underneath.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Doctor Workspace */}
            <div className="rounded-3xl bg-slate-950/70 border border-purple-500/30 p-7 backdrop-blur-2xl flex flex-col justify-between hover:border-purple-400/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-purple-300 flex items-center justify-center mb-5">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Doctor workspace</h3>
                <p className="text-sm text-purple-200/70 mt-3 leading-relaxed">
                  History, visit context, consultation notes, and follow-ups stay close to the patient.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-500/20">
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2 text-sm font-bold text-purple-300 hover:text-white transition-colors"
                >
                  Open consultations
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Front Desk Flow */}
            <div className="rounded-3xl bg-slate-950/70 border border-purple-500/30 p-7 backdrop-blur-2xl flex flex-col justify-between hover:border-purple-400/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/30 border border-fuchsia-400/30 text-fuchsia-300 flex items-center justify-center mb-5">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Front desk flow</h3>
                <p className="text-sm text-purple-200/70 mt-3 leading-relaxed">
                  Appointments, walk-ins, registration, and the live queue move together without handoff gaps.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-500/20">
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2 text-sm font-bold text-fuchsia-300 hover:text-white transition-colors"
                >
                  Open appointments
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Clinic Oversight */}
            <div className="rounded-3xl bg-slate-950/70 border border-purple-500/30 p-7 backdrop-blur-2xl flex flex-col justify-between hover:border-purple-400/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-600/30 border border-pink-400/30 text-pink-300 flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Clinic oversight</h3>
                <p className="text-sm text-purple-200/70 mt-3 leading-relaxed">
                  Owners get a clear pulse of today without pulling the team away from patient care.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-500/20">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-bold text-pink-300 hover:text-white transition-colors"
                >
                  Open dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Care continuity ──────────────────────── */}
      <section id="continuity" className={styles.fullSection}>
        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Care continuity</div>
            <h2 className={styles.sectionTitle}>
              A clearer signal from every clinic day.
            </h2>
            <p className={styles.sectionDescription}>
              A single operational view makes it easier to spot the queue, finish follow-ups, and keep each patient journey moving.
            </p>
          </div>

          {/* Operational Pulse Card */}
          <div className="rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-2xl p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-purple-900/30 border border-purple-500/20">
                <p className="text-4xl font-black text-white">14</p>
                <p className="text-xs font-semibold text-purple-200/80 mt-2">Visits today</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-900/20 border border-emerald-500/20">
                <p className="text-4xl font-black text-emerald-300">08</p>
                <p className="text-xs font-semibold text-emerald-200/80 mt-2">Completed</p>
              </div>
              <div className="p-4 rounded-2xl bg-fuchsia-900/30 border border-fuchsia-500/20">
                <p className="text-4xl font-black text-fuchsia-300">04</p>
                <p className="text-xs font-semibold text-fuchsia-200/80 mt-2">Follow-ups</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/20 flex flex-col justify-center items-center">
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  On track
                </div>
                <p className="text-xs font-semibold text-purple-300/80 mt-1">Clinic rhythm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Built for responsible care ────────────── */}
      <section id="security" className={styles.fullSection}>
        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Built for responsible care</div>
            <h2 className={styles.sectionTitle}>
              Control and clarity belong in the foundation.
            </h2>
            <p className={styles.sectionDescription}>
              MediCare is structured around clinic-scoped records, clear roles, and deliberate access boundaries so privacy is considered in every workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-7 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Role-aware</h3>
              <p className="text-sm text-purple-200/70 mt-2 leading-relaxed">
                Give doctors, front desk staff, and owners the context their role requires.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-7 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-600/30 text-fuchsia-300 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Clinic-scoped</h3>
              <p className="text-sm text-purple-200/70 mt-2 leading-relaxed">
                Keep each workspace and its patient records clearly bounded.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-7 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-pink-600/30 text-pink-300 flex items-center justify-center mb-4">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Auditable flow</h3>
              <p className="text-sm text-purple-200/70 mt-2 leading-relaxed">
                Make handoffs and next actions visible instead of relying on memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Explore the product ─────────────────── */}
      <section className="relative z-10 py-20 border-t border-purple-500/20 bg-[#0f0022]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Explore the product
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything your clinic needs to begin.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard"
              className="group rounded-3xl bg-slate-950/60 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/50 hover:bg-purple-950/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    Start with today
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-sm text-purple-200/70 leading-relaxed">
                  See the complete clinic pulse and the next patient action.
                </p>
              </div>
            </Link>

            <Link
              href="/patients"
              className="group rounded-3xl bg-slate-950/60 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/50 hover:bg-purple-950/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                    Find every patient
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-fuchsia-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-sm text-purple-200/70 leading-relaxed">
                  Keep identity, history, and visit context easy to retrieve.
                </p>
              </div>
            </Link>

            <Link
              href="/appointments"
              className="group rounded-3xl bg-slate-950/60 border border-purple-500/20 p-6 backdrop-blur-xl hover:border-purple-400/50 hover:bg-purple-950/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                    Run the schedule
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-sm text-purple-200/70 leading-relaxed">
                  Connect appointments, walk-ins, and the live queue.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 8: CTA Banner ───────────────────────────── */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f0022] to-[#0c001a] text-center border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-purple-900/60 via-fuchsia-900/50 to-pink-900/60 border border-purple-400/30 backdrop-blur-2xl p-10 sm:p-14 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start your clinic workspace
          </h2>
          <p className="mt-4 text-base sm:text-lg text-purple-200/90 max-w-xl mx-auto">
            Give every patient journey the context it deserves.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-purple-950 font-bold text-sm shadow-xl shadow-purple-950/50 hover:bg-purple-50 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-xl font-bold text-sm hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-[#080012] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-purple-500/20">
            {/* Brand Column */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md">
                  <Image src="/logo.svg" alt="MediCare" width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-base font-black text-white block leading-none">MediCare</span>
                  <span className="text-[0.62rem] font-bold text-purple-400 uppercase tracking-widest leading-none">Clinic workspace</span>
                </div>
              </div>
              <p className="text-xs text-purple-300/70 max-w-sm leading-relaxed">
                A calm, connected operating workspace for independent clinics.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Product</p>
              <ul className="space-y-2 text-xs text-purple-200/70">
                <li><a href="#operations" className="hover:text-white transition-colors">Platform</a></li>
                <li><a href="#workflow" className="hover:text-white transition-colors">Workflow</a></li>
                <li><a href="#roles" className="hover:text-white transition-colors">Use cases</a></li>
              </ul>
            </div>

            {/* Use cases */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Use cases</p>
              <ul className="space-y-2 text-xs text-purple-200/70">
                <li><Link href="/appointments" className="hover:text-white transition-colors">Doctors</Link></li>
                <li><Link href="/patients" className="hover:text-white transition-colors">Front desk</Link></li>
              </ul>
            </div>

            {/* Company & Access */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Company</p>
              <ul className="space-y-2 text-xs text-purple-200/70 mb-4">
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>

              <p className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">Access</p>
              <ul className="space-y-1.5 text-xs text-purple-200/70">
                <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Get started</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-purple-300/60">
            <p>© {new Date().getFullYear()} MediCare. Clinic operations, simplified.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-purple-200 transition-colors">Login</Link>
              <Link href="/register" className="hover:text-purple-200 transition-colors">Register</Link>
              <Link href="/dashboard" className="hover:text-purple-200 transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
