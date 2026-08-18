'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Plus, Search, Edit3, Trash2, Clock, CalendarCheck,
  CheckCircle, XCircle, Filter,
} from 'lucide-react';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
import { useToast } from '@/components/Toast';
import {
  getAppointments, saveAppointment, updateAppointment,
  deleteAppointment, getPatients,
} from '@/lib/storage';
import type { Appointment, Patient } from '@/types';

const DEPARTMENTS = ['Cardiology', 'Dermatology', 'Orthopedics', 'Gynecology', 'Neurology', 'Pediatrics', 'General Medicine', 'ENT', 'Ophthalmology'];
const DOCTORS = ['Dr. Rajesh Kumar', 'Dr. Sunita Verma', 'Dr. Amit Mehta', 'Dr. Priya Deshmukh', 'Dr. Arjun Nair', 'Dr. Kavita Reddy'];
type StatusFilter = 'All' | 'Scheduled' | 'Completed' | 'Cancelled';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadAppointments = useCallback(() => {
    const data = getAppointments();
    setAppointments(data.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)));
  }, []);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredAppointments(
      appointments.filter((a) => {
        const matchSearch = a.patientName.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q) || a.department.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || a.status === statusFilter;
        return matchSearch && matchStatus;
      })
    );
  }, [search, statusFilter, appointments]);

  const handleStatusChange = (id: string, status: 'Completed' | 'Cancelled') => {
    updateAppointment(id, { status });
    loadAppointments();
    showToast(`Appointment marked as ${status}`);
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    loadAppointments();
    setDeleteConfirmId(null);
    showToast('Appointment deleted');
  };

  const closeModal = () => { setIsModalOpen(false); setEditingAppointment(null); };

  const statusCounts = {
    All: appointments.length,
    Scheduled: appointments.filter((a) => a.status === 'Scheduled').length,
    Completed: appointments.filter((a) => a.status === 'Completed').length,
    Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Background decoration */}
      <div className="page-bg-decor" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-400 flex items-center justify-center shadow-md">
            <CalendarCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="section-title">Appointments</h1>
            <p className="text-sm text-purple-400/70 font-medium">{appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-purple-100/60 shadow-sm">
          {(['All', 'Scheduled', 'Completed', 'Cancelled'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md'
                  : 'text-slate-500 hover:bg-purple-50'
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
          <input
            type="text" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="glass-card-static py-20 flex flex-col items-center">
            <CalendarCheck className="w-14 h-14 text-purple-200 mb-3" />
            <p className="text-sm text-slate-400 font-medium">No appointments found.</p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div key={appt.id} className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="min-w-[52px] text-center p-2 rounded-xl bg-purple-50/60 border border-purple-100/50">
                  <p className="text-[0.6rem] font-bold text-purple-600 uppercase leading-none mb-0.5">
                    {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                  <p className="text-xl font-extrabold text-slate-800 leading-none">
                    {new Date(appt.date + 'T00:00:00').getDate()}
                  </p>
                  <p className="text-[0.6rem] text-slate-400 font-medium mt-0.5">
                    {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h4 className="font-bold text-slate-800 text-sm">{appt.patientName}</h4>
                    <StatusBadge status={appt.status} />
                  </div>
                  <p className="text-sm text-slate-400">
                    {appt.doctor} · <span className="text-purple-600 font-medium">{appt.department}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{appt.time}</span>
                    {appt.notes && <><span>·</span><span className="truncate max-w-[220px]">{appt.notes}</span></>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {appt.status === 'Scheduled' && (
                  <>
                    <button onClick={() => handleStatusChange(appt.id, 'Completed')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                    <button onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </>
                )}
                <button onClick={() => { setEditingAppointment(appt); setIsModalOpen(true); }} className="btn-ghost-sm" title="Edit">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteConfirmId(appt.id)} className="btn-ghost-sm hover:!text-rose-500" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'} size="lg">
        <AppointmentForm appointment={editingAppointment} onSuccess={() => { closeModal(); loadAppointments(); }} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Appointment" size="sm">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-rose-500" />
          </div>
          <p className="text-sm text-slate-500 mb-6">Are you sure? This cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteConfirmId(null)} className="btn-outline-primary px-6 py-2">Cancel</button>
            <button onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-6 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AppointmentForm({ appointment, onSuccess }: { appointment: Appointment | null; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => { setPatients(getPatients()); }, []);

  const form = useForm({
    defaultValues: {
      patientId: appointment?.patientId ?? '',
      doctor: appointment?.doctor ?? DOCTORS[0],
      department: appointment?.department ?? DEPARTMENTS[0],
      date: appointment?.date ?? new Date().toISOString().split('T')[0],
      time: appointment?.time ?? '09:00',
      status: (appointment?.status ?? 'Scheduled') as 'Scheduled' | 'Completed' | 'Cancelled',
      notes: appointment?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      const patient = patients.find((p) => p.id === value.patientId);
      const patientName = patient ? `${patient.firstName} ${patient.lastName}` : appointment?.patientName ?? '';
      if (appointment) {
        updateAppointment(appointment.id, { ...value, patientName });
        showToast('Appointment updated!');
      } else {
        saveAppointment({ ...value, patientName });
        showToast('Appointment scheduled!');
      }
      onSuccess();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-5">
      <form.Field name="patientId" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
        children={(field) => (
          <div>
            <label className="form-label">Patient <span className="text-rose-400">*</span></label>
            <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
              className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}>
              <option value="">Select a patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.phone}</option>)}
            </select>
            {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
          </div>
        )} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field name="doctor" children={(field) => (
          <div>
            <label className="form-label">Doctor</label>
            <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="form-input">
              {DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )} />
        <form.Field name="department" children={(field) => (
          <div>
            <label className="form-label">Department</label>
            <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="form-input">
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field name="date" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
          children={(field) => (
            <div>
              <label className="form-label">Date <span className="text-rose-400">*</span></label>
              <input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="form-input" />
            </div>
          )} />
        <form.Field name="time" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
          children={(field) => (
            <div>
              <label className="form-label">Time <span className="text-rose-400">*</span></label>
              <input type="time" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="form-input" />
            </div>
          )} />
      </div>

      <form.Field name="notes" children={(field) => (
        <div>
          <label className="form-label">Notes</label>
          <textarea placeholder="Reason for visit..." value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
            className="form-input" style={{ minHeight: 72, resize: 'vertical' }} />
        </div>
      )} />

      <div className="flex justify-end pt-2">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit} className="btn-primary min-w-[160px]">
              {isSubmitting ? 'Saving...' : appointment ? 'Update Appointment' : 'Schedule Appointment'}
            </button>
          )} />
      </div>
    </form>
  );
}
