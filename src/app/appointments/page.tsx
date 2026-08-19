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
} from 'lucide-react';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadAppointments = useCallback(() => {
    const data = getAppointments();
    setAppointments(
      data.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    );
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
      return matchSearch && matchStatus;
    });
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

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

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
            <p className="text-sm text-purple-400/70 font-medium">
              Manage patient schedules and clinical visits
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingAppointment(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="glass-card-static p-4 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-purple-50/60 rounded-xl w-full sm:w-auto overflow-x-auto">
            {(['All', 'Scheduled', 'Completed', 'Cancelled'] as StatusFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`tab-btn flex-1 sm:flex-initial text-xs ${
                  statusFilter === tab ? 'active' : ''
                }`}
              >
                {tab}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[0.65rem] font-bold ${
                    statusFilter === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {statusCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search patient, doctor, dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pro-input pl-10 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="glass-card-static overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 text-purple-300">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-40 text-purple-500" />
            <p className="text-slate-600 font-semibold text-base mb-1">
              No appointments found
            </p>
            <p className="text-slate-400 text-xs">
              {search || statusFilter !== 'All'
                ? 'Try clearing filters'
                : 'Click "Book Appointment" to schedule a visit'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor & Dept</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar-circle avatar-pink">
                          {appt.patientName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">
                            {appt.patientName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="font-semibold text-slate-700 text-sm">{appt.doctor}</p>
                      <span className="text-xs text-purple-600 font-medium">
                        {appt.department}
                      </span>
                    </td>
                    <td>
                      <p className="font-semibold text-slate-800 text-sm">
                        {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {appt.time}
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>
                    <td>
                      <p className="text-xs text-slate-500 max-w-[180px] truncate">
                        {appt.notes || '—'}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        {appt.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appt.id, 'Completed')}
                              className="btn-ghost-sm text-emerald-600 hover:bg-emerald-50 text-xs font-semibold"
                              title="Mark as Completed"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                              className="btn-ghost-sm text-amber-600 hover:bg-amber-50 text-xs font-semibold"
                              title="Cancel Appointment"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setEditingAppointment(appt);
                            setIsModalOpen(true);
                          }}
                          className="btn-ghost-sm"
                          title="Edit Appointment"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(appt.id)}
                          className="btn-ghost-sm hover:bg-rose-50"
                          title="Delete Appointment"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
      >
        <AppointmentForm
          appointment={editingAppointment}
          onSuccess={() => {
            loadAppointments();
            closeModal();
          }}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Appointment"
      >
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-rose-500" />
          </div>
          <p className="text-sm text-slate-500 mb-6">Are you sure? This cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="btn-outline-primary px-6 py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-6 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AppointmentForm({
  appointment,
  onSuccess,
}: {
  appointment: Appointment | null;
  onSuccess: () => void;
}) {
  const { showToast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPatients(getPatients());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
      const patientName = patient
        ? `${patient.firstName} ${patient.lastName}`
        : appointment?.patientName ?? '';
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      <form.Field
        name="patientId"
        validators={{ onChange: ({ value }) => (!value ? 'Required' : undefined) }}
      >
        {(field) => (
          <div>
            <label className="form-label">
              Patient <span className="text-rose-400">*</span>
            </label>
            <select
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}
            >
              <option value="">Select a patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} — {p.phone}
                </option>
              ))}
            </select>
            {field.state.meta.errors.length > 0 && (
              <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field name="doctor">
          {(field) => (
            <div>
              <label className="form-label">Doctor</label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="form-input"
              >
                {DOCTORS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="department">
          {(field) => (
            <div>
              <label className="form-label">Department</label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="form-input"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field
          name="date"
          validators={{ onChange: ({ value }) => (!value ? 'Required' : undefined) }}
        >
          {(field) => (
            <div>
              <label className="form-label">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="form-input"
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="time"
          validators={{ onChange: ({ value }) => (!value ? 'Required' : undefined) }}
        >
          {(field) => (
            <div>
              <label className="form-label">
                Time <span className="text-rose-400">*</span>
              </label>
              <input
                type="time"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="form-input"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="notes">
        {(field) => (
          <div>
            <label className="form-label">Notes</label>
            <textarea
              placeholder="Reason for visit..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="form-input"
              style={{ minHeight: 72, resize: 'vertical' }}
            />
          </div>
        )}
      </form.Field>

      <div className="flex justify-end pt-2">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary min-w-[160px]"
            >
              {isSubmitting
                ? 'Saving...'
                : appointment
                ? 'Update Appointment'
                : 'Schedule Appointment'}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
