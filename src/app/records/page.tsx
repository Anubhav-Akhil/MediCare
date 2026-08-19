'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Plus,
  Search,
  Trash2,
  FileText,
  Pill,
  Stethoscope,
  Calendar,
  Eye,
} from 'lucide-react';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import {
  getMedicalRecords,
  saveMedicalRecord,
  deleteMedicalRecord,
  getPatients,
} from '@/lib/storage';
import type { MedicalRecord, Patient } from '@/types';

const DOCTORS = [
  'Dr. Rajesh Kumar',
  'Dr. Sunita Verma',
  'Dr. Amit Mehta',
  'Dr. Priya Deshmukh',
  'Dr. Arjun Nair',
  'Dr. Kavita Reddy',
];

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadRecords = useCallback(() => {
    const data = getMedicalRecords();
    setRecords(
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRecords();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q)
    );
  }, [search, records]);

  const handleDelete = (id: string) => {
    deleteMedicalRecord(id);
    loadRecords();
    setDeleteConfirmId(null);
    showToast('Medical record deleted');
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Background decoration */}
      <div className="page-bg-decor" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center shadow-md">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="section-title">Medical Records</h1>
            <p className="text-sm text-purple-400/70 font-medium">
              Clinical diagnostic notes and patient prescriptions
            </p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {/* Search */}
      <div className="glass-card-static p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search by patient, diagnosis, or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pro-input pl-10 text-xs"
          />
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="glass-card-static text-center py-16 text-purple-300">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-purple-500" />
          <p className="text-slate-600 font-semibold text-base mb-1">
            No medical records found
          </p>
          <p className="text-slate-400 text-xs">
            {search ? 'Try adjusting your search terms' : 'Click "Add Record" to create your first clinical record'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="glass-card p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="avatar-circle avatar-pink" style={{ width: 34, height: 34, fontSize: '0.75rem' }}>
                      {record.patientName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight">
                        {record.patientName}
                      </p>
                      <p className="text-[0.65rem] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setViewingRecord(record)}
                      className="btn-ghost-sm"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-600" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(record.id)}
                      className="btn-ghost-sm hover:bg-rose-50"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100/40">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-purple-600 mb-0.5 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> Diagnosis
                    </p>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {record.diagnosis}
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50/40 rounded-xl border border-pink-100/40">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-pink-600 mb-0.5 flex items-center gap-1">
                      <Pill className="w-3 h-3" /> Prescription
                    </p>
                    <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                      {record.prescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-100/40 flex items-center justify-between">
                <span className="text-[0.65rem] font-semibold text-purple-600">
                  {record.doctor}
                </span>
                <button
                  onClick={() => setViewingRecord(record)}
                  className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Medical Record"
      >
        <RecordForm
          onSuccess={() => {
            loadRecords();
            setIsModalOpen(false);
          }}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingRecord}
        onClose={() => setViewingRecord(null)}
        title="Clinical Record Details"
      >
        {viewingRecord && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                  Patient
                </p>
                <p className="text-base font-bold text-slate-800">
                  {viewingRecord.patientName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                  Date
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {viewingRecord.date}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Attending Doctor
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {viewingRecord.doctor}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Diagnosis
              </p>
              <p className="text-sm font-semibold text-slate-800 p-3 bg-slate-50 rounded-xl">
                {viewingRecord.diagnosis}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Prescription & Dosage
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap p-3 bg-pink-50/40 rounded-xl border border-pink-100">
                {viewingRecord.prescription}
              </p>
            </div>

            {viewingRecord.notes && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Doctor Notes
                </p>
                <p className="text-xs text-slate-600 italic p-3 bg-slate-50 rounded-xl">
                  {viewingRecord.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingRecord(null)}
                className="btn-primary text-xs py-2 px-5"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Medical Record"
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

function RecordForm({ onSuccess }: { onSuccess: () => void }) {
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
      patientId: '',
      diagnosis: '',
      prescription: '',
      doctor: DOCTORS[0],
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
    onSubmit: async ({ value }) => {
      const patient = patients.find((p) => p.id === value.patientId);
      saveMedicalRecord({
        ...value,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
      });
      showToast('Medical record added!');
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
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
              )}
            </div>
          )}
        </form.Field>

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
      </div>

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
        name="diagnosis"
        validators={{ onChange: ({ value }) => (!value ? 'Required' : undefined) }}
      >
        {(field) => (
          <div>
            <label className="form-label">
              Diagnosis <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mild Hypertension"
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
        name="prescription"
        validators={{ onChange: ({ value }) => (!value ? 'Required' : undefined) }}
      >
        {(field) => (
          <div>
            <label className="form-label">
              Prescription <span className="text-rose-400">*</span>
            </label>
            <textarea
              placeholder="Medication details, dosage..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}
              style={{ minHeight: 72, resize: 'vertical' }}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="notes">
        {(field) => (
          <div>
            <label className="form-label">Additional Notes</label>
            <textarea
              placeholder="Clinical observations..."
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
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
