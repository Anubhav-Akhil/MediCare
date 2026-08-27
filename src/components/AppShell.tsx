'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  MoreVertical,
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Sparkles,
  Settings,
  RefreshCw,
  Star,
  FolderKanban,
  LogOut,
  Bell,
  Stethoscope,
  ChevronDown,
  Activity,
  Zap,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import ApiKeyModal from './ApiKeyModal';
import AICopilotDrawer from './AICopilotDrawer';
import { getPatients, getAppointments, getMedicalRecords } from '@/lib/storage';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotPatientId, setCopilotPatientId] = useState<string | undefined>(undefined);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [leftNavOpen, setLeftNavOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Custom event listener for opening copilot with a pre-selected patient from any view
  useEffect(() => {
    const handleOpenCopilot = (e: CustomEvent<{ patientId?: string }>) => {
      setCopilotPatientId(e.detail?.patientId);
      setIsCopilotOpen(true);
    };
    window.addEventListener('open-copilot', handleOpenCopilot as EventListener);
    return () => window.removeEventListener('open-copilot', handleOpenCopilot as EventListener);
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast('Syncing live clinical telemetry and queue...', 'info');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live telemetry synchronized', 'success');
      router.refresh();
    }, 600);
  };

  const getPageTitle = () => {
    if (pathname.includes('/patients')) return 'Patients: Clinical Directory';
    if (pathname.includes('/appointments')) return 'Appointments: Schedule & Queue';
    if (pathname.includes('/records')) return 'Records: Clinical Prescriptions';
    if (pathname.includes('/ai-studio')) return 'MediAI: Diagnostic Studio';
    return 'Dashboard: MediCare Intelligence';
  };

  // Compute initials
  const doctorName = user?.name || 'Dr. John Doe';
  const roleName = user?.role || 'Admin';
  const initials = doctorName
    .replace(/^Dr\.\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'JD';

  // Search Results preview
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { patients: [], appointments: [], records: [] };
    const q = searchQuery.toLowerCase();
    const patients = getPatients().filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.phone.includes(q)
    ).slice(0, 4);

    const appointments = getAppointments().filter(
      (a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
    ).slice(0, 3);

    const records = getMedicalRecords().filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q)
    ).slice(0, 3);

    return { patients, appointments, records };
  }, [searchQuery]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patients', label: 'Patients', icon: Users },
    { href: '/appointments', label: 'Appointments', icon: CalendarCheck },
    { href: '/records', label: 'Medical Records', icon: FileText },
    { href: '/ai-studio', label: 'AI Diagnostic Studio', icon: Sparkles, badge: 'Groq' },
  ];

  return (
    <div className="app-hud-root flex flex-col min-h-screen text-slate-100 selection:bg-purple-500 selection:text-white relative">
      {/* ── TOP HUD HEADER (Matching reference image) ─────────────────── */}
      <header className="sticky top-0 z-40 h-[76px] px-4 sm:px-8 flex items-center justify-between border-b border-purple-500/15 bg-[#070314]/85 backdrop-blur-2xl">
        {/* Left: 3-dots launcher & Search Pill */}
        <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-xl">
          <button
            onClick={() => setLeftNavOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Navigation Menu"
          >
            <div className="flex flex-col gap-1 items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            </div>
          </button>

          {/* Search Pill */}
          <div
            onClick={() => setIsGlobalSearchOpen(true)}
            className="hud-search-pill flex items-center gap-2.5 px-4 py-2 w-full max-w-[280px] sm:max-w-[340px] cursor-pointer group shadow-sm hover:border-purple-400/50"
          >
            <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-purple-200/70 flex-1 truncate">Search patients, records, AI triage...</span>
            <kbd className="hidden sm:inline-block text-[0.65rem] px-1.5 py-0.5 rounded bg-white/10 text-purple-300 border border-white/10 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Welcome Greeting & Action Badges */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Quick AI Trigger */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 to-fuchsia-900/60 border border-purple-500/30 hover:border-purple-400 text-xs font-bold text-purple-100 hover:text-white transition-all shadow-md shadow-purple-950/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>MediAI</span>
            <span className="text-[0.6rem] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live
            </span>
          </button>

          {/* Greeting text: Welcome, Doctor Name */}
          <div className="text-right pr-2">
            <p className="text-[0.68rem] text-purple-300 font-semibold leading-none mb-1">
              Welcome,
            </p>
            <p className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">
              {doctorName}
            </p>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE & RIGHT HUD RAIL ────────────────────────────── */}
      <div className="flex-1 flex relative">
        {/* Left Slide Navigation Menu (Expandable) */}
        {leftNavOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setLeftNavOpen(false)}
            />
            <aside className="fixed top-[76px] left-0 bottom-0 w-64 bg-[#0a051d]/95 backdrop-blur-2xl border-r border-purple-500/20 z-40 p-4 flex flex-col justify-between shadow-2xl animate-fade-in">
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">MediCare PMS</h3>
                    <p className="text-[0.65rem] text-purple-400 uppercase tracking-wider font-semibold">Clinical Workspace</p>
                  </div>
                </div>

                <nav className="space-y-1.5">
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setLeftNavOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600/40 to-fuchsia-600/20 border border-purple-500/40 text-white shadow-md'
                            : 'text-purple-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-purple-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[0.6rem] px-1.5 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-purple-500/20 space-y-2">
                <button
                  onClick={() => {
                    setLeftNavOpen(false);
                    setIsApiKeyModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>AI Engine Settings</span>
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Desktop Quick Nav Bar (Sub-header tabs for quick navigation) */}
        <div className="flex-1 flex flex-col min-w-0 pr-0 lg:pr-[100px]">
          {/* Sub Navigation Bar */}
          <div className="px-4 sm:px-8 py-3 border-b border-purple-500/10 bg-[#09041a]/60 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-purple-600/30 border border-purple-500/40 text-white shadow-sm shadow-purple-900/40'
                        : 'text-purple-300/70 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-purple-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[0.55rem] px-1 py-0.2 rounded bg-fuchsia-500/30 text-fuchsia-200 uppercase font-extrabold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0 text-xs text-purple-300/60 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow"></span>
                EHR Telemetry: <strong className="text-white">Active (99.9%)</strong>
              </span>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* ── RIGHT-SIDE HUD CONTROL RAIL (Exact Match to Reference Image) ─ */}
        <aside className="hud-right-rail hidden lg:flex flex-col items-center py-6 fixed right-0 top-[76px] bottom-0 w-[96px] z-30 justify-between select-none">
          {/* Top: Avatar with Orange Notification Badge */}
          <div className="flex flex-col items-center gap-2 relative">
            <div
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="relative cursor-pointer group"
              title={`${doctorName} (${roleName})`}
            >
              {/* Doctor Avatar with glow */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-fuchsia-600 p-[2px] shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#120a2e] rounded-full flex items-center justify-center overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-sm">
                    {initials}
                  </div>
                </div>
              </div>

              {/* Glowing Orange Notification Badge (Top-Right of avatar) */}
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#ff7a18] border-2 border-[#0a061a] shadow-md shadow-orange-500 flex items-center justify-center text-[0.55rem] font-black text-white">
                !
              </span>
            </div>

            {/* Name & Role text below avatar */}
            <div className="text-center px-1">
              <p className="text-[0.78rem] font-extrabold text-white tracking-tight leading-tight truncate max-w-[84px]">
                {doctorName}
              </p>
              <p className="text-[0.62rem] font-semibold text-purple-300/70 uppercase tracking-wider leading-none mt-0.5">
                {roleName}
              </p>
            </div>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-12 top-0 w-48 rounded-2xl bg-[#0f0927]/95 border border-purple-500/30 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-scale-in space-y-1">
                <div className="px-3 py-2 border-b border-purple-500/20">
                  <p className="text-xs font-bold text-white truncate">{doctorName}</p>
                  <p className="text-[0.65rem] text-purple-400">{user?.email || 'doctor@medicare.io'}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    setIsApiKeyModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-purple-200 hover:text-white hover:bg-white/10 transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Key & Settings</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Middle: Vertical Action Icon List */}
          <div className="flex flex-col items-center gap-4 my-auto">
            {/* 1. Active Orange Squircle Button (Dashboard / Analytics) */}
            <Link
              href="/dashboard"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                pathname === '/dashboard'
                  ? 'hud-btn-active-orange scale-105'
                  : 'hud-btn-icon'
              }`}
              title="Dashboard Analytics"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>

            {/* 2. Star Icon (Clinical Favorites / Triage) */}
            <Link
              href="/patients"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                pathname === '/patients'
                  ? 'hud-btn-active-orange scale-105'
                  : 'hud-btn-icon'
              }`}
              title="Patients & Triage"
            >
              <Users className="w-5 h-5" />
            </Link>

            {/* 3. Sync / Refresh Loop Icon */}
            <button
              onClick={handleRefresh}
              className="hud-btn-icon w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer"
              title="Sync Live Telemetry"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* 4. Search Icon (Global Deep Lookup) */}
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="hud-btn-icon w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer"
              title="Global Deep Search (⌘K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 5. Folder Icon (Medical Records & Prescriptions) */}
            <Link
              href="/records"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                pathname === '/records'
                  ? 'hud-btn-active-orange scale-105'
                  : 'hud-btn-icon'
              }`}
              title="Medical Records & Prescriptions"
            >
              <FolderKanban className="w-5 h-5" />
            </Link>

            {/* 6. AI Sparkles Icon (MediAI Copilot Assistant) */}
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700/60 to-fuchsia-600/60 border border-purple-400/40 text-white flex items-center justify-center hover:scale-110 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              title="Open MediAI Copilot"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </button>
          </div>

          {/* Bottom: Settings / Tools Cog Icon */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="hud-btn-icon w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer"
              title="MediAI & Engine Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </aside>
      </div>

      {/* ── GLOBAL SEARCH MODAL (Ctrl + K) ─────────────────────────────── */}
      {isGlobalSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsGlobalSearchOpen(false)}
        >
          <div className="w-full max-w-2xl bg-[#0c0722] border border-purple-500/30 rounded-2xl shadow-2xl p-6 relative z-50 animate-scale-in text-white">
            <div className="relative flex items-center pb-4 border-b border-purple-500/20">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <Search className="w-5 h-5 text-amber-400" />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Search patients, medical records, appointments, diagnoses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '48px', paddingRight: '40px' }}
                className="hud-input text-sm py-3.5 bg-[#09041a] border-purple-500/40 text-white placeholder:text-purple-300/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4">
              {/* Quick AI Search suggestion */}
              {searchQuery && (
                <div
                  onClick={() => {
                    setIsGlobalSearchOpen(false);
                    setIsCopilotOpen(true);
                  }}
                  className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-between hover:bg-purple-900/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-xs text-white">Ask MediAI Clinical Copilot about &quot;{searchQuery}&quot;</span>
                  </div>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded bg-purple-600 text-white font-bold">Ask AI →</span>
                </div>
              )}

              {/* Patients Results */}
              {searchResults.patients.length > 0 && (
                <div>
                  <p className="text-[0.68rem] font-bold text-purple-400 uppercase tracking-wider mb-2 px-1">
                    Patients ({searchResults.patients.length})
                  </p>
                  <div className="space-y-1.5">
                    {searchResults.patients.map((p) => (
                      <Link
                        key={p.id}
                        href="/patients"
                        onClick={() => setIsGlobalSearchOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                            {p.firstName[0]}{p.lastName[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{p.firstName} {p.lastName}</p>
                            <p className="text-[0.68rem] text-slate-400">{p.age}y • {p.gender} • {p.phone}</p>
                          </div>
                        </div>
                        <span className="text-[0.65rem] px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-200 border border-purple-500/30">
                          {p.bloodGroup}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments Results */}
              {searchResults.appointments.length > 0 && (
                <div>
                  <p className="text-[0.68rem] font-bold text-purple-400 uppercase tracking-wider mb-2 px-1">
                    Appointments ({searchResults.appointments.length})
                  </p>
                  <div className="space-y-1.5">
                    {searchResults.appointments.map((a) => (
                      <Link
                        key={a.id}
                        href="/appointments"
                        onClick={() => setIsGlobalSearchOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{a.patientName}</p>
                          <p className="text-[0.68rem] text-slate-400">{a.doctor} • {a.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-purple-300">{a.date} at {a.time}</p>
                          <span className="text-[0.65rem] font-medium text-emerald-400">{a.status}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Records Results */}
              {searchResults.records.length > 0 && (
                <div>
                  <p className="text-[0.68rem] font-bold text-purple-400 uppercase tracking-wider mb-2 px-1">
                    Medical Records ({searchResults.records.length})
                  </p>
                  <div className="space-y-1.5">
                    {searchResults.records.map((r) => (
                      <Link
                        key={r.id}
                        href="/records"
                        onClick={() => setIsGlobalSearchOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{r.patientName}</p>
                          <p className="text-[0.68rem] text-fuchsia-300 truncate max-w-sm">Diagnosis: {r.diagnosis}</p>
                        </div>
                        <span className="text-[0.65rem] text-slate-400">{r.date}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!searchQuery && (
                <div className="text-center py-8 text-purple-300/60 text-xs">
                  Type any name, disease, drug, or clinical query to search across your workspace.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* MediAI Copilot Slide-Over Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        initialPatientId={copilotPatientId}
        onClose={() => {
          setIsCopilotOpen(false);
          setCopilotPatientId(undefined);
        }}
      />
    </div>
  );
}
