'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Activity,
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/records', label: 'Records', icon: FileText },
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
        scrolled || !isLanding
          ? 'nav-glass'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[1.1rem] font-bold tracking-tight text-slate-800 leading-tight">
                MediCare
              </span>
              <span className="text-[0.65rem] font-medium text-slate-400 tracking-wide uppercase leading-none">
                Health Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
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

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex btn-primary text-sm py-2 px-5"
            >
              Open Dashboard
            </Link>
            <button
              className="md:hidden btn-ghost-sm p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-slate-200/50 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
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
      )}
    </nav>
  );
}
