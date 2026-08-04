'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="glass-card glass-card-hover p-5 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${gradient} opacity-10 blur-xl`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs font-medium flex items-center gap-1 ${
                trendUp ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              <span>{trendUp ? '↑' : '↓'}</span>
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
