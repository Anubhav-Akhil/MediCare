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
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import {
  getDashboardStats,
  getPatients,
  getAppointments,
} from '@/lib/storage';
import type { DashboardStats, Patient, Appointment } from '@/types';

const statConfig = [
  { key: 'totalPatients', label: 'Total Patients', icon: Users, color: 'teal', trend: '+12% this month' },
  { key: 'todayAppointments', label: "Today's Visits", icon: CalendarCheck, color: 'blue', trend: '' },
  { key: 'pendingAppointments', label: 'Pending', icon: Clock, color: 'amber', trend: 'Awaiting visit' },
  { key: 'totalRecords', label: 'Medical Records', icon: FileText, color: 'emerald', trend: '' },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
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
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="stat-icon teal shadow-md" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-sm text-slate-400 font-medium">Welcome back! Here&apos;s your overview.</p>
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
              className={`glass-card p-5 animate-fade-up delay-${i + 1}`}
              style={{ opacity: 0 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
                <div className={`stat-icon ${s.color}`}>
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/70">
            <h3 className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Recent Patients
            </h3>
            <Link
              href="/patients"
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 transition-colors"
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
                      <div className="avatar-circle avatar-teal" style={{ width: 34, height: 34, borderRadius: 10, fontSize: '0.7rem' }}>
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
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/70">
            <h3 className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              Upcoming Appointments
            </h3>
            <Link
              href="/appointments"
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <CalendarCheck className="w-12 h-12 mb-3" />
              <p className="text-sm text-slate-400">No upcoming appointments</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[44px] bg-slate-50 rounded-xl p-2">
                      <p className="text-[0.6rem] font-bold text-teal-600 uppercase leading-none mb-0.5">
                        {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-lg font-extrabold text-slate-800 leading-none">
                        {new Date(appt.date + 'T00:00:00').getDate()}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{appt.patientName}</p>
                      <p className="text-xs text-slate-400">
                        {appt.doctor} • <span className="text-teal-600 font-medium">{appt.department}</span>
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
          <Zap className="w-4 h-4 text-amber-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/patients', icon: Users, label: 'Add New Patient', desc: 'Register a patient', gradient: 'from-teal-500 to-teal-400' },
            { href: '/appointments', icon: CalendarCheck, label: 'Schedule Appointment', desc: 'Book a new visit', gradient: 'from-blue-500 to-blue-400' },
            { href: '/records', icon: FileText, label: 'Add Medical Record', desc: 'Log clinical data', gradient: 'from-emerald-500 to-emerald-400' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-teal-200 hover:bg-teal-50/30 transition-all"
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

function Zap(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
}
