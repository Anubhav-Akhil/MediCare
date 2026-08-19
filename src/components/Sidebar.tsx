'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/records', label: 'Medical Records', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`gradient-sidebar flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-[13px] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-950/30 ring-1 ring-white/10">
          <Image
            src="/logo.svg"
            alt="MediCare Logo"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        {!collapsed && (
          <div className="animate-fade-in flex flex-col gap-0.5">
            <h1 className="text-[1.1rem] font-black leading-none tracking-[-0.03em] bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
              MediCare
            </h1>
            <p className="text-purple-400/60 text-[0.55rem] font-bold tracking-[0.2em] uppercase leading-none">
              Clinic Workshop
            </p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-link w-full justify-center hover:!bg-white/10"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
