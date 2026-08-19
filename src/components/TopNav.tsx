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
  { href: '#about', label: 'About' },
  { href: '#designers', label: 'Designers' },
  { href: '#features', label: 'Features' },
  { href: '#news', label: 'News' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#about');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);

      // Track active section on landing page
      if (pathname === '/') {
        const sectionIds = ['news', 'features', 'designers', 'about'];
        const scrollPosition = window.scrollY + 140;

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(`#${id}`);
              return;
            }
          }
        }

        // Top of hero area
        if (window.scrollY < 200) {
          setActiveSection('');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

  // Get user initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding ? 'nav-glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-[72px]">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className={`w-9 h-9 rounded-[12px] overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 ${
                isLanding ? 'shadow-sm' : 'shadow-md group-hover:shadow-lg'
              }`}
            >
              <Image
                src="/logo.svg"
                alt="MediCare Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-[1.05rem] font-extrabold tracking-tight leading-tight ${
                  isLanding
                    ? scrolled ? 'text-[#6f2cab]' : 'text-white'
                    : 'text-slate-800'
                }`}
              >
                MediCare
              </span>
              <span
                className={`text-[0.62rem] font-semibold tracking-[0.24em] uppercase leading-none ${
                  isLanding
                    ? scrolled ? 'text-[#a066c6]' : 'text-white/70'
                    : 'text-purple-500'
                }`}
              >
                Practice Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isLanding ? (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
              {landingNavItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-[0.8rem] font-medium tracking-tight transition-all duration-200 cursor-pointer relative py-1 ${
                      scrolled
                        ? isActive
                          ? 'text-[#7d34be] font-bold underline underline-offset-4 decoration-[#d5aef1] decoration-2'
                          : 'text-[#9b79bb] hover:text-[#7d34be]'
                        : isActive
                          ? 'text-white font-bold underline underline-offset-4 decoration-white/70 decoration-2'
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
                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full border transition-all duration-200 cursor-pointer ${
                    isLanding && !scrolled
                      ? 'border-white/30 bg-white/15 text-white hover:bg-white/25'
                      : 'border-purple-200/70 bg-purple-50/70 text-slate-800 hover:bg-purple-100/70 shadow-xs'
                  }`}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {initials}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-none tracking-tight">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[0.65rem] opacity-75 font-medium leading-tight">
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
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isLanding && !scrolled
                      ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow-md transition-all ${
                    isLanding && !scrolled
                      ? 'bg-white text-purple-900 hover:bg-white/90 shadow-purple-950/20'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              className={`md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                isLanding && !scrolled
                  ? 'border border-white/40 bg-white/20 text-white hover:bg-white/30'
                  : 'btn-ghost-sm p-2 text-slate-700'
              }`}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Landing) */}
      {mobileOpen && isLanding ? (
        <div className="border-t border-purple-200/50 bg-white/95 backdrop-blur-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
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
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-purple-100/80 text-purple-900 font-bold'
                        : 'text-[#6b2aa3] hover:bg-[#f7efff]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 hover:bg-[#4c1d95]"
                >
                  <Sparkles className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-100 text-purple-800 px-5 py-2.5 text-sm font-bold hover:bg-purple-200"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 hover:bg-[#4c1d95]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile Drawer (App) */}
      {mobileOpen && !isLanding && !isAuthPage ? (
        <div className="md:hidden glass-strong border-t border-purple-200/30 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
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
                  className={`nav-link w-full ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 text-rose-600 font-bold text-sm py-2 px-4 rounded-xl hover:bg-rose-50 mt-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
