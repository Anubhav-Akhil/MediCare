'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import {
  getPatients,
  savePatient,
  updatePatient,
  deletePatient,
} from '@/lib/storage';
import type { Patient } from '@/types';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ITEMS_PER_PAGE = 8;

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const loadPatients = useCallback(() => {
    const data = getPatients();
    setPatients(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredPatients(
      patients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.email.toLowerCase().includes(q)
      )
    );
    setCurrentPage(1);
  }, [search, patients]);

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deletePatient(id);
    loadPatients();
    setDeleteConfirmId(null);
    showToast('Patient deleted successfully');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Background decoration */}
      <div className="page-bg-decor" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-400 flex items-center justify-center shadow-md">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="section-title">Patients</h1>
            <p className="text-sm text-purple-400/70 font-medium">
              {patients.length} registered patient{patients.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card-static overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age / Gender</th>
                <th>Contact</th>
                <th>Blood Group</th>
                <th>Registered</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Users className="w-12 h-12 text-purple-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-medium">
                      {search ? 'No patients match your search.' : 'No patients registered yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar-circle avatar-purple" style={{ width: 36, height: 36, borderRadius: 10, fontSize: '0.7rem' }}>
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-slate-700 font-semibold">{patient.age} yrs</p>
                      <p className="text-xs text-slate-400">{patient.gender}</p>
                    </td>
                    <td>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-purple-300" />
                        {patient.phone}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {patient.address.length > 28 ? patient.address.slice(0, 28) + '...' : patient.address}
                      </p>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                        {patient.bloodGroup}
                      </span>
                    </td>
                    <td className="text-sm text-slate-400">
                      {new Date(patient.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => handleEdit(patient)} className="btn-ghost-sm" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirmId(patient.id)} className="btn-ghost-sm hover:!text-rose-500" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-purple-100/40">
            <p className="text-xs text-slate-400 font-medium">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredPatients.length)} of {filteredPatients.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                className="btn-ghost-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md'
                      : 'text-slate-500 hover:bg-purple-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn-ghost-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPatient ? 'Edit Patient' : 'Add New Patient'} size="lg">
        <PatientForm patient={editingPatient} onSuccess={() => { closeModal(); loadPatients(); }} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Patient" size="sm">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-rose-500" />
          </div>
          <p className="text-sm text-slate-500 mb-6">Are you sure? This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteConfirmId(null)} className="btn-outline-primary px-6 py-2">Cancel</button>
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

// ── Patient Form ─────────────────────────────────────────────────────────────

function PatientForm({ patient, onSuccess }: { patient: Patient | null; onSuccess: () => void }) {
  const { showToast } = useToast();

  const form = useForm({
    defaultValues: {
      firstName: patient?.firstName ?? '',
      lastName: patient?.lastName ?? '',
      age: patient?.age ?? 0,
      gender: (patient?.gender ?? 'Male') as 'Male' | 'Female' | 'Other',
      phone: patient?.phone ?? '',
      email: patient?.email ?? '',
      address: patient?.address ?? '',
      bloodGroup: patient?.bloodGroup ?? 'O+',
    },
    onSubmit: async ({ value }) => {
      if (patient) {
        updatePatient(patient.id, value);
        showToast('Patient updated successfully!');
      } else {
        savePatient(value);
        showToast('Patient added successfully!');
      }
      onSuccess();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field name="firstName" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
          children={(field) => (
            <div>
              <label className="form-label">First Name <span className="text-rose-400">*</span></label>
              <input type="text" placeholder="e.g. Aarav" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`} />
              {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
            </div>
          )} />
        <form.Field name="lastName" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
          children={(field) => (
            <div>
              <label className="form-label">Last Name <span className="text-rose-400">*</span></label>
              <input type="text" placeholder="e.g. Sharma" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`} />
              {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
            </div>
          )} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <form.Field name="age" validators={{ onChange: ({ value }) => !value || value <= 0 ? 'Required' : undefined }}
          children={(field) => (
            <div>
              <label className="form-label">Age <span className="text-rose-400">*</span></label>
              <input type="number" placeholder="32" value={field.state.value || ''} onChange={(e) => field.handleChange(Number(e.target.value))} onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`} />
              {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
            </div>
          )} />
        <form.Field name="gender"
          children={(field) => (
            <div>
              <label className="form-label">Gender</label>
              <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value as 'Male' | 'Female' | 'Other')} className="form-input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )} />
        <form.Field name="bloodGroup"
          children={(field) => (
            <div>
              <label className="form-label">Blood Group</label>
              <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="form-input">
                {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          )} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field name="phone" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
          children={(field) => (
            <div>
              <label className="form-label">Phone <span className="text-rose-400">*</span></label>
              <input type="text" placeholder="+91 98765 43210" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`} />
              {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
            </div>
          )} />
        <form.Field name="email" validators={{ onChange: ({ value }) => { if (!value) return 'Required'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'; return undefined; } }}
          children={(field) => (
            <div>
              <label className="form-label">Email <span className="text-rose-400">*</span></label>
              <input type="email" placeholder="patient@email.com" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`} />
              {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
            </div>
          )} />
      </div>

      <form.Field name="address"
        children={(field) => (
          <div>
            <label className="form-label">Address</label>
            <textarea placeholder="Full address" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
              className="form-input" style={{ minHeight: 72, resize: 'vertical' }} />
          </div>
        )} />

      <div className="flex justify-end pt-2">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit} className="btn-primary min-w-[140px]">
              {isSubmitting ? 'Saving...' : patient ? 'Update Patient' : 'Add Patient'}
            </button>
          )} />
      </div>
    </form>
  );
}
