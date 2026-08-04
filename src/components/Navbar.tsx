'use client';

import { Bell, Search } from 'lucide-react';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 glass-card rounded-none border-x-0 border-t-0 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="input input-sm pl-9 pr-4 w-56 bg-slate-100 border-slate-200 focus:bg-white text-sm rounded-lg"
            />
          </div>

          {/* Notifications */}
          <button className="btn btn-ghost btn-sm btn-circle relative">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* Avatar */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="w-9 h-9 rounded-full gradient-teal flex items-center justify-center text-white font-semibold text-sm cursor-pointer shadow-md"
            >
              DA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
