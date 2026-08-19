'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPatients();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q)
    );
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
        <button
          onClick={() => {
            setEditingPatient(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card-static p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pro-input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card-static overflow-hidden">
        {paginatedPatients.length === 0 ? (
          <div className="text-center py-16 text-purple-300">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40 text-purple-500" />
            <p className="text-slate-600 font-semibold text-base mb-1">
              {search ? 'No patients match your search' : 'No patients registered yet'}
            </p>
            <p className="text-slate-400 text-xs">
              {search ? 'Try adjusting your search terms' : 'Click "Add Patient" to register your first patient'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age / Gender</th>
                  <th>Blood Group</th>
                  <th>Contact Info</th>
                  <th>Address</th>
                  <th>Registered</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar-circle avatar-purple">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <span className="text-[0.65rem] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                            ID: {patient.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm font-semibold text-slate-700">{patient.age} yrs</p>
                      <p className="text-xs text-slate-400">{patient.gender}</p>
                    </td>
                    <td>
                      <span className="badge-blood">{patient.bloodGroup}</span>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                          <Phone className="w-3 h-3 text-purple-400 shrink-0" />
                          {patient.phone}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-purple-400 shrink-0" />
                          {patient.email}
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="text-xs text-slate-500 flex items-center gap-1 max-w-[160px] truncate">
                        <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                        {patient.address || '—'}
                      </p>
                    </td>
                    <td>
                      <p className="text-xs text-slate-500">
                        {new Date(patient.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(patient)}
                          className="btn-ghost-sm"
                          title="Edit Patient"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(patient.id)}
                          className="btn-ghost-sm hover:bg-rose-50"
                          title="Delete Patient"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-purple-100/40 bg-purple-50/20">
            <p className="text-xs text-slate-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredPatients.length)} of{' '}
              {filteredPatients.length} patients
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-ghost-sm disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-purple-100/60'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-ghost-sm disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPatient ? 'Edit Patient Profile' : 'Register New Patient'}
      >
        <PatientForm
          patient={editingPatient}
          onSuccess={() => {
            loadPatients();
            closeModal();
            showToast(
              editingPatient ? 'Patient updated successfully' : 'Patient registered successfully'
            );
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this patient record? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="btn-ghost text-sm py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Patient Form Component ───────────────────────────────────────────────────

function PatientForm({
  patient,
  onSuccess,
}: {
  patient: Patient | null;
  onSuccess: () => void;
}) {
  const form = useForm({
    defaultValues: {
      firstName: patient?.firstName ?? '',
      lastName: patient?.lastName ?? '',
      age: patient?.age ?? ('' as unknown as number),
      gender: patient?.gender ?? 'Male',
      phone: patient?.phone ?? '',
      email: patient?.email ?? '',
      address: patient?.address ?? '',
      bloodGroup: patient?.bloodGroup ?? 'O+',
    },
    onSubmit: async ({ value }) => {
      if (patient) {
        updatePatient(patient.id, {
          ...value,
          age: Number(value.age),
        });
      } else {
        savePatient({
          ...value,
          age: Number(value.age),
        });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => (!value ? 'Required' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label className="form-label">
                First Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="lastName"
          validators={{
            onChange: ({ value }) => (!value ? 'Required' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label className="form-label">
                Last Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sharma"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => (!value || Number(value) <= 0 ? 'Required' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label className="form-label">
                Age <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="32"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="gender">
          {(field) => (
            <div>
              <label className="form-label">Gender</label>
              <select
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as 'Male' | 'Female' | 'Other')
                }
                className="form-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="bloodGroup">
          {(field) => (
            <div>
              <label className="form-label">Blood Group</label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="form-input"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => (!value ? 'Required' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label className="form-label">
                Phone <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Required';
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label className="form-label">
                Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                placeholder="patient@email.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="address">
        {(field) => (
          <div>
            <label className="form-label">Address</label>
            <textarea
              placeholder="Full address"
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
              className="btn-primary min-w-[140px]"
            >
              {isSubmitting ? 'Saving...' : patient ? 'Update Patient' : 'Add Patient'}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
