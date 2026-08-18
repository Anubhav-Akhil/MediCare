'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Menu,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding ? 'nav-glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-[72px]">
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
                Launch Edition
              </span>
            </div>
          </Link>

          {isLanding ? (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
              {landingNavItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.8rem] font-medium tracking-tight transition-colors ${
                    scrolled
                      ? index === 0
                        ? 'text-[#7d34be] underline underline-offset-4 decoration-[#d5aef1] hover:text-[#7d34be]'
                        : 'text-[#9b79bb] hover:text-[#7d34be]'
                      : index === 0
                        ? 'text-white underline underline-offset-4 decoration-white/50 hover:text-white'
                        : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : (
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
          )}

          <div className="flex items-center gap-3">
            {isLanding ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 hover:bg-[#4c1d95] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Launch Dashboard
                </Link>
                <button
                  className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/70 bg-white/80 text-[#5d238d] shadow-sm backdrop-blur-sm transition hover:bg-white"
                  onClick={() => setMobileOpen((open) => !open)}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-2 btn-primary text-sm py-2 px-5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Open Dashboard
                </Link>
                <button
                  className="md:hidden btn-ghost-sm p-2"
                  onClick={() => setMobileOpen((open) => !open)}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5 text-slate-600" />
                  ) : (
                    <Menu className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && isLanding ? (
        <div className="border-t border-purple-200/50 bg-white/88 backdrop-blur-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              {landingNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-[#6b2aa3] hover:bg-[#f7efff]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-[#5b21b6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 hover:bg-[#4c1d95]"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      ) : null}

      {mobileOpen && !isLanding ? (
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
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="btn-primary block text-center mt-2"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
