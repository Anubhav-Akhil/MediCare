'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Menu,
  Sparkles,
  Users,
  X,
  LogOut,
  ChevronDown,
  Shield,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const appNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/records', label: 'Records', icon: FileText },
];

const landingNavItems = [
  { href: '#operations', label: 'Operations' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#roles', label: 'Roles' },
  { href: '#continuity', label: 'Continuity' },
  { href: '#security', label: 'Security' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#operations');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const mobileOpenRef = useRef(mobileOpen);

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const lastScrollY = lastScrollYRef.current;
          const diff = currentScrollY - lastScrollY;

          setScrolled(currentScrollY > 15);

          // Smart Smooth Hide/Show Header on scroll direction with hysteresis
          if (mobileOpenRef.current || currentScrollY <= 15) {
            // Always show when mobile menu is open or near top
            setVisible(true);
          } else if (diff > 8 && currentScrollY > 80) {
            // Scrolling down firmly -> smoothly hide
            setVisible(false);
            setUserDropdownOpen(false);
          } else if (diff < -8) {
            // Scrolling up firmly -> smoothly reveal
            setVisible(true);
          }

          lastScrollYRef.current = currentScrollY;

          // Track active section on landing page
          if (pathname === '/') {
            const sectionIds = ['security', 'continuity', 'roles', 'workflow', 'operations'];
            const scrollPosition = currentScrollY + 140;

            for (const id of sectionIds) {
              const el = document.getElementById(id);
              if (el) {
                const top = el.offsetTop;
                if (scrollPosition >= top) {
                  setActiveSection(`#${id}`);
                  ticking = false;
                  return;
                }
              }
            }

            if (currentScrollY < 200) {
              setActiveSection('');
            }
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Handle smooth scroll and active state on landing nav click
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (pathname === '/') {
      e.preventDefault();
      setActiveSection(href);
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.replaceState(null, '', href);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLanding = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  // Get user initials for avatar
  const cleanName = user?.name?.replace(/^Dr\.\s*/i, '').trim();
  const initials = cleanName
    ? cleanName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.name
      ? user.name
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 nav-smart-header transform ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } ${
        isLanding
          ? scrolled
            ? 'nav-landing-glass'
            : 'bg-transparent border-b border-transparent'
          : 'nav-glass'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-[72px]">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className={`relative w-10 h-10 rounded-[13px] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-[1.06] group-hover:rotate-[-2deg] ${
                isLanding
                  ? 'shadow-lg shadow-purple-950/40 ring-1 ring-white/15'
                  : 'shadow-md shadow-purple-200/50 ring-1 ring-purple-200/50 group-hover:shadow-lg group-hover:ring-purple-300/60'
              }`}
            >
              <Image
                src="/logo.svg"
                alt="MediCare Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-[1.1rem] font-black tracking-[-0.03em] leading-none transition-colors duration-300 ${
                  isLanding
                    ? 'bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent'
                    : 'text-slate-900'
                }`}
              >
                Medi<span className={isLanding ? '' : 'text-purple-600'}>Care</span>
              </span>
              <span
                className={`text-[0.55rem] font-bold tracking-[0.2em] uppercase leading-none transition-colors duration-300 ${
                  isLanding ? 'text-purple-400/70' : 'text-purple-400'
                }`}
              >
                Clinic Workshop
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          {isLanding ? (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
              {landingNavItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-[0.8rem] font-medium tracking-tight transition-all duration-300 cursor-pointer relative py-1 ${
                      isActive
                        ? 'text-white font-bold underline underline-offset-4 decoration-purple-400 decoration-2'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : !isAuthPage ? (
            <div className="hidden md:flex items-center gap-1">
              {appNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}

          {/* Right Action buttons / User Menu */}
          <div className="flex items-center gap-3">
            {!isLoading && user ? (
              // Authenticated User Profile Menu
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full border transition-all duration-300 cursor-pointer ${
                    isLanding
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                      : 'border-purple-200/70 bg-purple-50/70 text-slate-800 hover:bg-purple-100/70 shadow-xs'
                  }`}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {initials}
                  </div>
                  <div className="text-left hidden sm:block max-w-[140px]">
                    <p className="text-xs font-bold leading-none tracking-tight truncate">
                      {user.name}
                    </p>
                    <p className="text-[0.65rem] opacity-75 font-medium leading-tight mt-0.5">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/95 backdrop-blur-xl border border-purple-200/70 shadow-xl py-2 z-50 animate-fade-in divide-y divide-purple-100/60">
                    <div className="px-4 py-3">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          <Shield className="w-3 h-3 text-purple-600" />
                          {user.role} • {user.department || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-600" />
                        Dashboard Overview
                      </Link>
                      <Link
                        href="/appointments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-fuchsia-600" />
                        My Appointments
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Unauthenticated state
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    isLanding
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow-md transition-all duration-300 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white hover:opacity-90 shadow-purple-900/30 hover:scale-[1.02]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile / 3 Horizontal Lines Menu Trigger */}
            <button
              type="button"
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
                isLanding
                  ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20 active:scale-95'
                  : 'border border-purple-200/70 bg-purple-50/70 text-purple-900 hover:bg-purple-100 active:scale-95 shadow-xs'
              }`}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-current" />
              ) : (
                <Menu className="w-5 h-5 text-current" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Landing Page) */}
      {mobileOpen && isLanding && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 md:hidden border-t border-purple-500/20 bg-[#0c001a]/95 backdrop-blur-2xl animate-fade-in shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                {landingNavItems.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        handleNavClick(e, item.href);
                        setMobileOpen(false);
                      }}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-900/50 text-white font-bold border border-purple-500/40 shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-purple-500/20 flex flex-col gap-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/40"
                  >
                    <Sparkles className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 text-white border border-white/20 px-5 py-2.5 text-sm font-bold hover:bg-white/20"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-900/40"
                    >
                      <Sparkles className="w-4 h-4" />
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Drawer (App Dashboard & Other Pages) */}
      {mobileOpen && !isLanding && !isAuthPage && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 md:hidden bg-white/95 backdrop-blur-2xl border-t border-purple-100 shadow-2xl animate-fade-in">
            <div className="px-4 py-4 space-y-2">
              {user && (
                <div className="p-3 mb-2 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-purple-600 font-semibold">{user.role} • {user.department || 'General'}</p>
                  </div>
                </div>
              )}

              {appNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-2 border-t border-purple-100">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 text-rose-600 font-bold text-sm py-2.5 px-4 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
