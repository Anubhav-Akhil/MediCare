'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  Clock,
  FileText,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  Zap,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Bed,
  Layers,
  Globe2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getDashboardStats, getPatients, getAppointments, getMedicalRecords } from '@/lib/storage';
import type { DashboardStats, Patient, Appointment, MedicalRecord } from '@/types';
import AICopilotDrawer from '@/components/AICopilotDrawer';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | '1Y'>('7D');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Department Capacity interactive slider values (from reference image)
  const [icuCapacity, setIcuCapacity] = useState(82);
  const [otUtilization, setOtUtilization] = useState(64);
  const [bedOccupancy, setBedOccupancy] = useState(78);
  const [emergencyReadiness, setEmergencyReadiness] = useState(94);

  // Active Map Node tooltip
  const [activeMapNode, setActiveMapNode] = useState<string | null>('asia');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(getDashboardStats());
      const p = getPatients();
      setPatients(p);
      const today = new Date().toISOString().split('T')[0];
      const appts = getAppointments();
      setUpcomingAppointments(
        appts
          .filter((a) => a.date >= today && a.status === 'Scheduled')
          .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
          .slice(0, 5)
      );
      setRecords(getMedicalRecords().slice(0, 5));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Wave Chart Data points based on time range
  const chartDatasets = useMemo(() => {
    switch (timeRange) {
      case '24H':
        return {
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
          path1: 'M 0 140 C 60 120, 100 160, 160 90 C 220 30, 280 110, 360 60 C 440 20, 520 80, 600 40 L 600 200 L 0 200 Z',
          stroke1: 'M 0 140 C 60 120, 100 160, 160 90 C 220 30, 280 110, 360 60 C 440 20, 520 80, 600 40',
          path2: 'M 0 160 C 70 140, 120 180, 200 120 C 280 60, 340 140, 420 80 C 500 40, 540 100, 600 70 L 600 200 L 0 200 Z',
          stroke2: 'M 0 160 C 70 140, 120 180, 200 120 C 280 60, 340 140, 420 80 C 500 40, 540 100, 600 70',
          path3: 'M 0 175 C 80 160, 140 190, 220 140 C 300 90, 360 160, 440 110 C 520 70, 560 120, 600 95 L 600 200 L 0 200 Z',
          stroke3: 'M 0 175 C 80 160, 140 190, 220 140 C 300 90, 360 160, 440 110 C 520 70, 560 120, 600 95',
          totalVisits: '184 visits',
          trend: '+8.4% today',
        };
      case '30D':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          path1: 'M 0 150 C 80 80, 150 170, 250 50 C 350 20, 450 130, 600 30 L 600 200 L 0 200 Z',
          stroke1: 'M 0 150 C 80 80, 150 170, 250 50 C 350 20, 450 130, 600 30',
          path2: 'M 0 170 C 90 110, 180 180, 270 80 C 360 40, 460 150, 600 60 L 600 200 L 0 200 Z',
          stroke2: 'M 0 170 C 90 110, 180 180, 270 80 C 360 40, 460 150, 600 60',
          path3: 'M 0 185 C 100 130, 200 190, 290 110 C 380 70, 480 170, 600 90 L 600 200 L 0 200 Z',
          stroke3: 'M 0 185 C 100 130, 200 190, 290 110 C 380 70, 480 170, 600 90',
          totalVisits: '3,840 visits',
          trend: '+16.2% this month',
        };
      case '1Y':
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          path1: 'M 0 130 C 120 60, 220 160, 320 40 C 420 10, 500 90, 600 25 L 600 200 L 0 200 Z',
          stroke1: 'M 0 130 C 120 60, 220 160, 320 40 C 420 10, 500 90, 600 25',
          path2: 'M 0 155 C 130 90, 230 180, 330 70 C 430 30, 520 110, 600 50 L 600 200 L 0 200 Z',
          stroke2: 'M 0 155 C 130 90, 230 180, 330 70 C 430 30, 520 110, 600 50',
          path3: 'M 0 175 C 140 120, 240 190, 340 100 C 440 60, 530 130, 600 80 L 600 200 L 0 200 Z',
          stroke3: 'M 0 175 C 140 120, 240 190, 340 100 C 440 60, 530 130, 600 80',
          totalVisits: '46,200 visits',
          trend: '+24.5% year-over-year',
        };
      case '7D':
      default:
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          path1: 'M 0 130 C 70 80, 130 150, 200 60 C 270 20, 360 140, 440 40 C 510 10, 550 70, 600 30 L 600 200 L 0 200 Z',
          stroke1: 'M 0 130 C 70 80, 130 150, 200 60 C 270 20, 360 140, 440 40 C 510 10, 550 70, 600 30',
          path2: 'M 0 155 C 80 110, 140 175, 210 90 C 280 40, 380 160, 460 70 C 520 30, 560 90, 600 55 L 600 200 L 0 200 Z',
          stroke2: 'M 0 155 C 80 110, 140 175, 210 90 C 280 40, 380 160, 460 70 C 520 30, 560 90, 600 55',
          path3: 'M 0 170 C 90 135, 150 190, 220 120 C 290 70, 390 175, 470 100 C 530 60, 570 110, 600 85 L 600 200 L 0 200 Z',
          stroke3: 'M 0 170 C 90 135, 150 190, 220 120 C 290 70, 390 175, 470 100 C 530 60, 570 110, 600 85',
          totalVisits: '892 visits',
          trend: '+12.8% vs last week',
        };
    }
  }, [timeRange]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── PAGE HEADER: Project Name / Workspace Banner ───────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
              Live Clinical Telemetry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Dashboard: <span className="bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">MediCare Intelligence</span>
          </h1>
        </div>

        {/* Quick Actions & AI Status */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="hud-btn-active-orange px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>AI Clinical Copilot</span>
          </button>
          <Link
            href="/ai-studio"
            className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-xs font-bold text-purple-200 hover:text-white transition-all"
          >
            Diagnostic Lab →
          </Link>
        </div>
      </div>

      {/* ── 4-CARD MAIN HUD GRID (EXACT MATCH TO USER REFERENCE SCREENSHOT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── CARD 1 (Top-Left, 7 Cols): Glowing Spline Wave Flow Chart ── */}
        <div className="lg:col-span-7 hud-card hud-card-hover p-6 flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-fuchsia-400" />
                Patient Influx & Vitals Flow
              </h2>
              <p className="text-xs text-purple-300/60 font-medium mt-0.5">
                Real-time admissions, outpatient traffic, and telemetry waves
              </p>
            </div>

            {/* Time range selector pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-purple-500/20">
              {(['24H', '7D', '30D', '1Y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold transition-all cursor-pointer ${
                    timeRange === r
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-300/60 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Canvas Area with Legend */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-2">
            {/* SVG Glowing Wave Chart */}
            <div className="md:col-span-8 relative h-[180px] w-full">
              <svg
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Layer 1 Gradient: Neon Violet / Purple */}
                  <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
                    <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#070314" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Layer 2 Gradient: Indigo / Cyan */}
                  <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#070314" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Layer 3 Gradient: Sunset Amber / Peach */}
                  <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#070314" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Wave Fills */}
                <path d={chartDatasets.path1} fill="url(#waveGrad1)" className="transition-all duration-700" />
                <path d={chartDatasets.path2} fill="url(#waveGrad2)" className="transition-all duration-700" />
                <path d={chartDatasets.path3} fill="url(#waveGrad3)" className="transition-all duration-700" />

                {/* Stroke Lines */}
                <path d={chartDatasets.stroke1} fill="none" stroke="#c084fc" strokeWidth="2.5" className="transition-all duration-700" />
                <path d={chartDatasets.stroke2} fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 2" className="transition-all duration-700" />
                <path d={chartDatasets.stroke3} fill="none" stroke="#fb923c" strokeWidth="2" className="transition-all duration-700" />

                {/* Pulsating peak point */}
                <circle cx="440" cy="40" r="5" fill="#ffffff" stroke="#ff7a18" strokeWidth="3" className="animate-pulse" />
              </svg>

              {/* Time axis labels */}
              <div className="flex justify-between text-[0.62rem] text-purple-300/50 mt-2 px-1">
                {chartDatasets.labels.map((lbl, idx) => (
                  <span key={idx}>{lbl}</span>
                ))}
              </div>
            </div>

            {/* Right-side Legend Items (Matching Screenshot layout) */}
            <div className="md:col-span-4 space-y-3 pl-0 md:pl-2 border-t md:border-t-0 md:border-l border-purple-500/15 pt-3 md:pt-0">
              <div className="group cursor-pointer">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-1 rounded-full bg-purple-400" />
                    Inpatients
                  </span>
                  <span className="font-mono text-purple-200 text-[0.75rem] font-bold">342 pts</span>
                </div>
                <p className="text-[0.65rem] text-purple-300/60 mt-0.5 leading-tight">
                  Regular ward admissions with continuous telemetry.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-1 rounded-full bg-indigo-400" />
                    Outpatients
                  </span>
                  <span className="font-mono text-purple-200 text-[0.75rem] font-bold">1,280 pts</span>
                </div>
                <p className="text-[0.65rem] text-purple-300/60 mt-0.5 leading-tight">
                  Consultation appointments and diagnostic reviews.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-1 rounded-full bg-fuchsia-400" />
                    ICU & Trauma
                  </span>
                  <span className="font-mono text-purple-200 text-[0.75rem] font-bold">48 pts</span>
                </div>
                <p className="text-[0.65rem] text-purple-300/60 mt-0.5 leading-tight">
                  Critical care units with priority physician response.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-1 rounded-full bg-amber-400" />
                    AI Triage
                  </span>
                  <span className="font-mono text-amber-300 text-[0.75rem] font-bold">892 pts</span>
                </div>
                <p className="text-[0.65rem] text-purple-300/60 mt-0.5 leading-tight">
                  Pre-screened via automated symptom evaluator.
                </p>
              </div>
            </div>
          </div>

          {/* Footer metrics */}
          <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs">
            <span className="text-purple-300/70">
              Total Inflow: <strong className="text-white">{chartDatasets.totalVisits}</strong>
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {chartDatasets.trend}
            </span>
          </div>
        </div>

        {/* ── CARD 2 (Top-Right, 5 Cols): Department Sliders & Capacity ── */}
        <div className="lg:col-span-5 hud-card hud-card-hover p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <Bed className="w-4 h-4 text-amber-400" />
                Department Capacity & Resources
              </h2>
              <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                Live Sliders
              </span>
            </div>
            <p className="text-xs text-purple-300/60 mb-6">
              Adjust and monitor clinical ward workloads and bed occupancy
            </p>

            {/* Interactive Sliders (Exact Match to screenshot sliders) */}
            <div className="space-y-5">
              {/* Slider 1: ICU Capacity (Violet track) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white uppercase tracking-wider text-[0.7rem]">
                    ICU & Critical Care Units
                  </span>
                  <span className="font-mono font-bold text-purple-300 text-xs">{icuCapacity}%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={icuCapacity}
                    onChange={(e) => setIcuCapacity(Number(e.target.value))}
                    className="hud-slider"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${icuCapacity}%, rgba(255,255,255,0.1) ${icuCapacity}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Slider 2: Operation Theatres (Blue/Indigo track) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white uppercase tracking-wider text-[0.7rem]">
                    Operation Theatres (OT)
                  </span>
                  <span className="font-mono font-bold text-indigo-300 text-xs">{otUtilization}%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={otUtilization}
                    onChange={(e) => setOtUtilization(Number(e.target.value))}
                    className="hud-slider"
                    style={{
                      background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${otUtilization}%, rgba(255,255,255,0.1) ${otUtilization}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Slider 3: General Inpatient Beds (Peach track) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white uppercase tracking-wider text-[0.7rem]">
                    General Inpatient Beds
                  </span>
                  <span className="font-mono font-bold text-amber-300 text-xs">{bedOccupancy}%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bedOccupancy}
                    onChange={(e) => setBedOccupancy(Number(e.target.value))}
                    className="hud-slider"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${bedOccupancy}%, rgba(255,255,255,0.1) ${bedOccupancy}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Slider 4: Emergency Response Readiness (Amber track) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white uppercase tracking-wider text-[0.7rem]">
                    Emergency Response Readiness
                  </span>
                  <span className="font-mono font-bold text-emerald-300 text-xs">{emergencyReadiness}%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={emergencyReadiness}
                    onChange={(e) => setEmergencyReadiness(Number(e.target.value))}
                    className="hud-slider"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${emergencyReadiness}%, rgba(255,255,255,0.1) ${emergencyReadiness}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-500/15 flex items-center justify-between text-xs text-purple-300/70 mt-4">
            <span>Hospital Operational Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Capacity
            </span>
          </div>
        </div>

        {/* ── CARD 3 (Bottom-Left, 7 Cols): Epidemiological World Map & Radar ── */}
        <div className="lg:col-span-7 hud-card hud-card-hover p-6 flex flex-col justify-between overflow-hidden relative">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                Epidemiological & Clinic Network Map
              </h2>
              <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                Global Nodes
              </span>
            </div>
            <p className="text-xs text-purple-300/60 mb-3">
              Regional patient telemetry, clinic branches, and emergency triage hubs
            </p>
          </div>

          {/* Interactive World Map Canvas with Glowing Crosshairs (Matching screenshot) */}
          <div className="relative h-[220px] w-full bg-[#09051c]/70 rounded-2xl border border-purple-500/15 overflow-hidden flex items-center justify-center p-2">
            {/* World Map SVG Paths */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full opacity-60 transition-opacity hover:opacity-80"
            >
              {/* Simplified stylized world continent paths */}
              {/* North America */}
              <path
                d="M 120 100 Q 180 80 250 110 Q 300 160 260 220 Q 190 240 140 190 Z"
                fill="#2c1a66"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
              {/* South America */}
              <path
                d="M 280 250 Q 340 270 330 360 Q 290 430 260 380 Q 250 300 280 250 Z"
                fill="#2c1a66"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
              {/* Europe */}
              <path
                d="M 460 100 Q 550 90 560 160 Q 480 180 440 150 Z"
                fill="#3a2282"
                stroke="#8b5cf6"
                strokeWidth="1.5"
              />
              {/* Africa */}
              <path
                d="M 460 200 Q 560 200 560 300 Q 520 390 480 340 Q 440 260 460 200 Z"
                fill="#2c1a66"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
              {/* Asia */}
              <path
                d="M 570 90 Q 750 80 820 180 Q 760 280 620 220 Q 580 160 570 90 Z"
                fill="#442999"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
              {/* Australia */}
              <path
                d="M 760 320 Q 860 330 840 400 Q 770 410 760 320 Z"
                fill="#2c1a66"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
            </svg>

            {/* Glowing Radar Crosshair (Horizontal & Vertical Lines across entire map from screenshot) */}
            <div className="absolute inset-x-0 top-[55%] h-[1px] bg-purple-400/40 pointer-events-none" />
            <div className="absolute inset-y-0 left-[58%] w-[1px] bg-purple-400/40 pointer-events-none" />

            {/* Target Crosshair Beacon with glowing white lens flare */}
            <div className="absolute top-[55%] left-[58%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full border border-white/60 animate-ping" />
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_#ffffff]" />
            </div>

            {/* Clickable Coordinate Hubs */}
            <button
              onClick={() => setActiveMapNode('asia')}
              className="absolute top-[35%] left-[64%] w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-lg shadow-amber-500/50 hover:scale-125 transition-transform cursor-pointer"
              title="Regional Medical Hub (Active)"
            />
            <button
              onClick={() => setActiveMapNode('europe')}
              className="absolute top-[28%] left-[48%] w-3.5 h-3.5 rounded-full bg-purple-400 border border-white shadow-lg shadow-purple-500/50 hover:scale-125 transition-transform cursor-pointer"
              title="European Research Node"
            />
            <button
              onClick={() => setActiveMapNode('na')}
              className="absolute top-[32%] left-[22%] w-3.5 h-3.5 rounded-full bg-fuchsia-400 border border-white shadow-lg shadow-fuchsia-500/50 hover:scale-125 transition-transform cursor-pointer"
              title="Americas Telehealth Center"
            />

            {/* Node Info Overlay */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-purple-500/30 text-[0.68rem] text-purple-200">
              {activeMapNode === 'asia' && (
                <div>
                  <strong className="text-white">Central Medical Campus (Goa / Mumbai Hub)</strong>: 48 Doctors Online • 14 Emergencies Handled
                </div>
              )}
              {activeMapNode === 'europe' && (
                <div>
                  <strong className="text-white">European Clinical Network</strong>: 22 Clinics Connected • Telemetry Live
                </div>
              )}
              {activeMapNode === 'na' && (
                <div>
                  <strong className="text-white">North America Telehealth</strong>: 99.4% Uptime • Real-Time Cloud Sync
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs text-purple-300/70 mt-2">
            <span>Global Clinic Telemetry: <strong className="text-white">All 14 Regional Nodes Online</strong></span>
            <span className="text-purple-400 font-mono">LAT: 15.49°N | LNG: 73.82°E</span>
          </div>
        </div>

        {/* ── CARD 4 (Bottom-Right, 5 Cols): 75% Circular Gauge & Economical Details ── */}
        <div className="lg:col-span-5 hud-card hud-card-hover p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Operational & AI Health Index
              </h2>
              <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                98.4% Accuracy
              </span>
            </div>
            <p className="text-xs text-purple-300/60 mb-5">
              Comprehensive diagnostic precision and clinic efficiency metrics
            </p>

            {/* Circular Gauge and Metrics (Matching Screenshot 75% radial circle) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-2">
              {/* Radial Donut Gauge: 75% */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full relative flex items-center justify-center p-2 bg-gradient-to-tr from-purple-900/40 via-purple-600/30 to-fuchsia-600/40 shadow-xl shadow-purple-900/50">
                  {/* Glowing inner orb */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-700 flex flex-col items-center justify-center text-white shadow-inner p-3 text-center">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                      75%
                    </span>
                    <span className="text-[0.55rem] font-bold uppercase tracking-wider text-purple-200 leading-none mt-0.5">
                      Efficiency
                    </span>
                  </div>
                </div>
              </div>

              {/* Economical and Clinical Details */}
              <div className="sm:col-span-7 space-y-2.5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Economical & Clinical Details
                  </h3>
                  <p className="text-[0.68rem] text-purple-300/70 mt-1 leading-relaxed">
                    AI diagnostic pre-screening has optimized physician triage workflows by 42%, cutting average patient wait times.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-purple-500/10">
                    <span className="text-purple-300/70 text-[0.72rem]">Diagnostic Confidence:</span>
                    <strong className="text-emerald-400 font-mono">98.4%</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-500/10">
                    <span className="text-purple-300/70 text-[0.72rem]">Bed Turnover Time:</span>
                    <strong className="text-white font-mono">4.2 Days</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-500/10">
                    <span className="text-purple-300/70 text-[0.72rem]">Triage Throughput:</span>
                    <strong className="text-amber-300 font-mono">+35% MoM</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-500/15 flex items-center justify-between text-xs text-purple-300/70 mt-4">
            <span>Engine: <strong className="text-white">Groq Llama 3.3 70B</strong></span>
            <Link
              href="/ai-studio"
              className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
            >
              Open Studio →
            </Link>
          </div>
        </div>
      </div>

      {/* ── RECENT PATIENTS & UPCOMING APPOINTMENTS HUD TABLES ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients Table */}
        <div className="hud-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/15">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Recent Patient Admissions ({patients.length})
            </h3>
            <Link
              href="/patients"
              className="text-xs text-purple-400 hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              View Directory <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="hud-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Age / Sex</th>
                  <th>Blood</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 4).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs whitespace-nowrap">
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-[0.65rem] text-slate-400">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-purple-200">{p.age}y • {p.gender}</td>
                    <td>
                      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-200 border border-purple-500/30">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="text-xs text-slate-400 font-mono">{p.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments Table */}
        <div className="hud-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/15">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-fuchsia-400" />
              Scheduled Consultations ({appointments.length})
            </h3>
            <Link
              href="/appointments"
              className="text-xs text-purple-400 hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              View Schedule <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-purple-500/10">
            {appointments.length === 0 ? (
              <div className="py-8 text-center text-purple-300/50 text-xs">
                No consultations scheduled for today.
              </div>
            ) : (
              appointments.slice(0, 4).map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/20 flex flex-col items-center justify-center text-center">
                      <span className="text-[0.55rem] font-bold text-purple-400 uppercase">
                        {new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-sm font-black text-white leading-none">
                        {new Date(a.date + 'T00:00:00').getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{a.patientName}</p>
                      <p className="text-[0.68rem] text-purple-300/70">
                        {a.doctor} • <span className="text-amber-400">{a.department}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-purple-200 font-bold block">{a.time}</span>
                    <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {a.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}
