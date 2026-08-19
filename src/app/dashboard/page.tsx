'use client';

import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import {
  getDashboardStats,
  getPatients,
  getAppointments,
} from '@/lib/storage';
import type { DashboardStats, Patient, Appointment } from '@/types';

const statConfig = [
  { key: 'totalPatients', label: 'Total Patients', icon: Users, gradient: 'from-purple-600 to-violet-400', trend: '+12% this month' },
  { key: 'todayAppointments', label: "Today's Visits", icon: CalendarCheck, gradient: 'from-fuchsia-500 to-pink-400', trend: '' },
  { key: 'pendingAppointments', label: 'Pending', icon: Clock, gradient: 'from-violet-500 to-purple-400', trend: 'Awaiting visit' },
  { key: 'totalRecords', label: 'Medical Records', icon: FileText, gradient: 'from-pink-500 to-rose-400', trend: '' },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(getDashboardStats());
      const patients = getPatients();
      setRecentPatients(
        patients
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );
      const today = new Date().toISOString().split('T')[0];
      const appointments = getAppointments();
      setUpcomingAppointments(
        appointments
          .filter((a) => a.date >= today && a.status === 'Scheduled')
          .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
          .slice(0, 5)
      );
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Background decoration */}
      <div className="page-bg-decor" />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-md">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-sm text-purple-400/70 font-medium">Welcome back! Here&apos;s your overview.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statConfig.map((s, i) => {
          const Icon = s.icon;
          const value = stats[s.key];
          return (
            <div
              key={s.key}
              className={`glass-card p-5 animate-fade-up delay-${i + 1} relative overflow-hidden`}
              style={{ opacity: 0 }}
            >
              {/* Decorative gradient blur */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 blur-xl`} />
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-xs font-semibold text-purple-400/60 uppercase tracking-wider mb-2">
                    {s.label}
                  </p>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    {value}
                  </p>
                  {s.trend && (
                    <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {s.trend}
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Patients */}
        <div className="glass-card-static overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100/40">
            <h3 className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Recent Patients
            </h3>
            <Link
              href="/patients"
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <table className="pro-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Blood</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar-circle avatar-purple" style={{ width: 34, height: 34, borderRadius: 10, fontSize: '0.7rem' }}>
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-slate-600">{patient.age}</td>
                  <td>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="text-sm text-slate-500">{patient.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-card-static overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100/40">
            <h3 className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-fuchsia-600" />
              Upcoming Appointments
            </h3>
            <Link
              href="/appointments"
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-purple-200">
              <CalendarCheck className="w-12 h-12 mb-3" />
              <p className="text-sm text-slate-400">No upcoming appointments</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-50/50">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-purple-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[44px] bg-purple-50/60 rounded-xl p-2">
                      <p className="text-[0.6rem] font-bold text-purple-600 uppercase leading-none mb-0.5">
                        {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-lg font-extrabold text-slate-800 leading-none">
                        {new Date(appt.date + 'T00:00:00').getDate()}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{appt.patientName}</p>
                      <p className="text-xs text-slate-400">
                        {appt.doctor} • <span className="text-purple-600 font-medium">{appt.department}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400">{appt.time}</span>
                    <StatusBadge status={appt.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card-static p-6">
        <h3 className="text-sm font-bold text-slate-700 tracking-tight mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fuchsia-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/patients', icon: Users, label: 'Add New Patient', desc: 'Register a patient', gradient: 'from-purple-600 to-violet-400' },
            { href: '/appointments', icon: CalendarCheck, label: 'Schedule Appointment', desc: 'Book a new visit', gradient: 'from-fuchsia-500 to-pink-400' },
            { href: '/records', icon: FileText, label: 'Add Medical Record', desc: 'Log clinical data', gradient: 'from-pink-500 to-rose-400' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 p-4 rounded-xl border border-purple-100/60 hover:border-purple-300/60 hover:bg-purple-50/30 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{action.label}</p>
                  <p className="text-xs text-slate-400">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
