'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Clock,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Video,
  Sparkles,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Stethoscope,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  getAppointments,
  saveAppointment,
  updateAppointment,
  deleteAppointment,
  getPatients,
} from '@/lib/storage';
import type { Appointment, Patient } from '@/types';

const DEPARTMENTS = [
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Gynecology',
  'Neurology',
  'Pediatrics',
  'General Medicine',
  'ENT',
  'Ophthalmology',
];

const DOCTORS = [
  'Dr. Rajesh Kumar',
  'Dr. Sunita Verma',
  'Dr. Amit Mehta',
  'Dr. Priya Deshmukh',
  'Dr. Arjun Nair',
  'Dr. Kavita Reddy',
];

type StatusFilter = 'All' | 'Scheduled' | 'Completed' | 'Cancelled';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [telehealthAppt, setTelehealthAppt] = useState<Appointment | null>(null);
  const { showToast } = useToast();

  const loadAppointments = useCallback(() => {
    const data = getAppointments();
    setAppointments(
      data.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    );
    setPatients(getPatients());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAppointments();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadAppointments]);

  const filteredAppointments = useMemo(() => {
    const q = search.toLowerCase();
    return appointments.filter((a) => {
      const matchSearch =
        a.patientName.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchDept = selectedDept === 'All' || a.department === selectedDept;
      return matchSearch && matchStatus && matchDept;
    });
  }, [search, statusFilter, selectedDept, appointments]);

  const handleStatusChange = (id: string, status: 'Completed' | 'Cancelled') => {
    updateAppointment(id, { status });
    loadAppointments();
    showToast(`Appointment marked as ${status}`, 'success');
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    loadAppointments();
    setDeleteConfirmId(null);
    showToast('Appointment deleted', 'success');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  // TanStack Form Setup
  const form = useForm({
    defaultValues: {
      patientId: editingAppointment?.patientId || '',
      patientName: editingAppointment?.patientName || '',
      doctor: editingAppointment?.doctor || DOCTORS[0],
      department: editingAppointment?.department || DEPARTMENTS[0],
      date: editingAppointment?.date || new Date().toISOString().split('T')[0],
      time: editingAppointment?.time || '10:00 AM',
      status: editingAppointment?.status || ('Scheduled' as const),
      notes: editingAppointment?.notes || '',
    },
    onSubmit: async ({ value }) => {
      let pName = value.patientName;
      if (!pName && value.patientId) {
        const found = patients.find((p) => p.id === value.patientId);
        if (found) pName = `${found.firstName} ${found.lastName}`;
      }

      if (editingAppointment) {
        updateAppointment(editingAppointment.id, { ...value, patientName: pName });
        showToast('Appointment updated successfully', 'success');
      } else {
        saveAppointment({
          ...value,
          patientName: pName || 'Walk-in Patient',
          patientId: value.patientId || 'temp_' + Date.now(),
        });
        showToast('Appointment scheduled successfully', 'success');
      }
      loadAppointments();
      closeModal();
    },
  });

  // Re-sync form when editingAppointment changes
  useEffect(() => {
    if (editingAppointment) {
      form.setFieldValue('patientId', editingAppointment.patientId);
      form.setFieldValue('patientName', editingAppointment.patientName);
      form.setFieldValue('doctor', editingAppointment.doctor);
      form.setFieldValue('department', editingAppointment.department);
      form.setFieldValue('date', editingAppointment.date);
      form.setFieldValue('time', editingAppointment.time);
      form.setFieldValue('status', editingAppointment.status);
      form.setFieldValue('notes', editingAppointment.notes);
    } else {
      form.reset();
    }
  }, [editingAppointment, form]);

  const scheduledCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER & ACTIONS ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CalendarCheck className="w-6 h-6 text-fuchsia-400" />
            Appointments & Clinic Queue
          </h1>
          <p className="text-xs text-purple-300/70 mt-1">
            {scheduledCount} active consultations scheduled across {DEPARTMENTS.length} clinical specialties
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingAppointment(null);
              setIsModalOpen(true);
            }}
            className="hud-btn-active-orange px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* ── STATUS COUNTERS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('All')}
          className={`hud-card p-4 cursor-pointer transition-all ${
            statusFilter === 'All' ? 'border-purple-400 shadow-md shadow-purple-900/30' : ''
          }`}
        >
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">All Visits</p>
          <p className="text-2xl font-black text-white mt-1">{appointments.length}</p>
        </div>

        <div
          onClick={() => setStatusFilter('Scheduled')}
          className={`hud-card p-4 cursor-pointer transition-all ${
            statusFilter === 'Scheduled' ? 'border-purple-400 shadow-md shadow-purple-900/30' : ''
          }`}
        >
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">Scheduled</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{scheduledCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter('Completed')}
          className={`hud-card p-4 cursor-pointer transition-all ${
            statusFilter === 'Completed' ? 'border-purple-400 shadow-md shadow-purple-900/30' : ''
          }`}
        >
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{completedCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter('Cancelled')}
          className={`hud-card p-4 cursor-pointer transition-all ${
            statusFilter === 'Cancelled' ? 'border-purple-400 shadow-md shadow-purple-900/30' : ''
          }`}
        >
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">Cancelled</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{cancelledCount}</p>
        </div>
      </div>

      {/* ── SEARCH & DEPARTMENT FILTERS ─────────────────────────────────── */}
      <div className="hud-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
            <Search className="w-4 h-4 text-amber-400" />
          </div>
          <input
            type="text"
            placeholder="Search by patient, doctor, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
            className="hud-input text-xs py-2.5 bg-[#0c0722] text-white placeholder:text-purple-300/50"
          />
        </div>

        {/* Department Dropdown & Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="hud-input text-xs py-2 px-3 w-auto"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── APPOINTMENTS LIST / TIMELINE ─────────────────────────────────── */}
      {filteredAppointments.length === 0 ? (
        <div className="hud-card p-12 text-center">
          <CalendarCheck className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
          <p className="text-white font-bold text-sm">No appointments match your filters</p>
          <p className="text-xs text-purple-300/60 mt-1">Book a new consultation or adjust the search filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appt) => {
            const isScheduled = appt.status === 'Scheduled';
            const isCompleted = appt.status === 'Completed';

            return (
              <div
                key={appt.id}
                className="hud-card hud-card-hover p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Date Badge & Patient Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-500/25 flex flex-col items-center justify-center text-center shrink-0 shadow-md">
                    <span className="text-[0.6rem] font-bold text-purple-400 uppercase leading-none">
                      {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black text-white leading-none mt-0.5">
                      {new Date(appt.date + 'T00:00:00').getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-white tracking-tight">{appt.patientName}</h3>
                      <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/30">
                        {appt.department}
                      </span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-0.5 flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>{appt.doctor}</span>
                      <span className="text-purple-500">•</span>
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono text-white">{appt.time}</span>
                    </p>
                    {appt.notes && (
                      <p className="text-[0.7rem] text-slate-400 mt-1 italic">&quot;{appt.notes}&quot;</p>
                    )}
                  </div>
                </div>

                {/* Right: Actions & Status */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-purple-500/15">
                  {/* Telehealth Room Trigger */}
                  <button
                    onClick={() => setTelehealthAppt(appt)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Launch Telehealth Session"
                  >
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Virtual Room</span>
                  </button>

                  {/* Status Switchers */}
                  {isScheduled && (
                    <button
                      onClick={() => handleStatusChange(appt.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`text-[0.68rem] font-bold px-2.5 py-1 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : isScheduled
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {appt.status}
                  </span>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingAppointment(appt);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(appt.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600/30 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── BOOK / EDIT APPOINTMENT MODAL ───────────────────────────────── */}
      {isModalOpen && (
        <div className="hud-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="hud-modal-content max-w-xl mx-4 p-6 sm:p-8 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-fuchsia-400" />
                {editingAppointment ? 'Reschedule Appointment' : 'Book New Clinical Appointment'}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <form.Field
                  name="patientName"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Patient Name *</label>
                      <input
                        type="text"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                        placeholder="e.g. Ramesh Patel"
                      />
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <form.Field
                  name="department"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Department Specialty *</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />

                <form.Field
                  name="doctor"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Attending Physician *</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                      >
                        {DOCTORS.map((doc) => (
                          <option key={doc} value={doc}>{doc}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <form.Field
                  name="date"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="time"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Time Slot *</label>
                      <input
                        type="text"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                        placeholder="10:30 AM"
                      />
                    </div>
                  )}
                />
              </div>

              <form.Field
                name="notes"
                children={(field) => (
                  <div>
                    <label className="block text-purple-200 font-semibold mb-1">Reason for Visit / Clinical Notes</label>
                    <textarea
                      rows={3}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="hud-input text-xs resize-none"
                      placeholder="Follow-up consultation, ECG review, prescription refill..."
                    />
                  </div>
                )}
              />

              <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-transparent hover:bg-white/5 text-purple-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hud-btn-active-orange px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {editingAppointment ? 'Save Reschedule' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TELEHEALTH VIRTUAL CONSULTATION MODAL ───────────────────────── */}
      {telehealthAppt && (
        <div className="hud-modal-overlay" onClick={() => setTelehealthAppt(null)}>
          <div className="hud-modal-content max-w-lg mx-4 p-6 sm:p-8 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Telehealth Virtual Consultation Room
                  </h2>
                  <p className="text-[0.7rem] text-purple-300/70">
                    Encrypted High-Definition Clinical Video Channel
                  </p>
                </div>
              </div>
              <button onClick={() => setTelehealthAppt(null)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-300">Patient:</span>
                  <strong className="text-white">{telehealthAppt.patientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Doctor:</span>
                  <strong className="text-white">{telehealthAppt.doctor}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Scheduled Time:</span>
                  <strong className="text-amber-400">{telehealthAppt.date} at {telehealthAppt.time}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <p className="text-[0.68rem] text-purple-300 uppercase font-semibold">Secure Room ID</p>
                  <p className="text-xs font-mono font-bold text-white">MEDICARE-ROOM-{telehealthAppt.id.slice(-6).toUpperCase()}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://meet.google.com/new');
                    showToast('Google Meet invitation link copied to clipboard!', 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                >
                  Copy Invite Link
                </button>
              </div>

              <div className="pt-3 border-t border-purple-500/20 flex justify-end gap-3">
                <button
                  onClick={() => setTelehealthAppt(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    showToast('Launching Google Meet session...', 'info');
                    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
                    setTimeout(() => {
                      setTelehealthAppt(null);
                    }, 500);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Launch Video Call →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION ─────────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="hud-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="hud-modal-content max-w-sm mx-4 p-6 text-center animate-scale-in">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Cancel Appointment?</h3>
            <p className="text-xs text-purple-300/70 mt-1 mb-5">
              This will remove the appointment from the schedule.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                Keep
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
