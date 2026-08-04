'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Plus, Search, Trash2, FileText, Pill, Stethoscope,
  Calendar, Eye,
} from 'lucide-react';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import {
  getMedicalRecords, saveMedicalRecord, deleteMedicalRecord, getPatients,
} from '@/lib/storage';
import type { MedicalRecord, Patient } from '@/types';

const DOCTORS = ['Dr. Rajesh Kumar', 'Dr. Sunita Verma', 'Dr. Amit Mehta', 'Dr. Priya Deshmukh', 'Dr. Arjun Nair', 'Dr. Kavita Reddy'];

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadRecords = useCallback(() => {
    const data = getMedicalRecords();
    setRecords(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredRecords(records.filter((r) =>
      r.patientName.toLowerCase().includes(q) || r.diagnosis.toLowerCase().includes(q) || r.doctor.toLowerCase().includes(q)
    ));
  }, [search, records]);

  const handleDelete = (id: string) => {
    deleteMedicalRecord(id);
    loadRecords();
    setDeleteConfirmId(null);
    showToast('Medical record deleted');
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="stat-icon emerald" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="section-title">Medical Records</h1>
            <p className="text-sm text-slate-400 font-medium">{records.length} clinical record{records.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input type="text" placeholder="Search by patient, diagnosis, or doctor..."
            value={search} onChange={(e) => setSearch(e.target.value)} className="form-input pl-10" />
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="glass-card-static py-20 flex flex-col items-center">
          <FileText className="w-14 h-14 text-slate-200 mb-3" />
          <p className="text-sm text-slate-400 font-medium">
            {search ? 'No records match your search.' : 'No medical records yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecords.map((record) => (
            <div key={record.id} className="glass-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="stat-icon emerald" style={{ width: 40, height: 40, borderRadius: 12 }}>
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{record.patientName}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(record.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => setViewingRecord(record)} className="btn-ghost-sm" title="View"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteConfirmId(record.id)} className="btn-ghost-sm hover:!text-rose-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Stethoscope className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Diagnosis</p>
                    <p className="text-sm text-slate-700 font-semibold">{record.diagnosis}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Pill className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prescription</p>
                    <p className="text-sm text-slate-600 truncate-2">{record.prescription}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100/60">
                <p className="text-xs text-slate-400"><span className="font-semibold text-slate-500">{record.doctor}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Medical Record" size="lg">
        <RecordForm onSuccess={() => { setIsModalOpen(false); loadRecords(); }} />
      </Modal>

      {/* View Record Modal */}
      <Modal isOpen={!!viewingRecord} onClose={() => setViewingRecord(null)} title="Record Details" size="lg">
        {viewingRecord && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="stat-icon emerald" style={{ width: 44, height: 44, borderRadius: 14 }}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{viewingRecord.patientName}</h4>
                <p className="text-sm text-slate-400">{viewingRecord.doctor} · {new Date(viewingRecord.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1"><Stethoscope className="w-4 h-4 text-teal-500" /><p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Diagnosis</p></div>
                <p className="text-sm text-slate-700 pl-6">{viewingRecord.diagnosis}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1"><Pill className="w-4 h-4 text-blue-500" /><p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Prescription</p></div>
                <p className="text-sm text-slate-700 pl-6">{viewingRecord.prescription}</p>
              </div>
              {viewingRecord.notes && (
                <div>
                  <div className="flex items-center gap-2 mb-1"><FileText className="w-4 h-4 text-amber-500" /><p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Notes</p></div>
                  <p className="text-sm text-slate-600 pl-6">{viewingRecord.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Record" size="sm">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-rose-500" />
          </div>
          <p className="text-sm text-slate-500 mb-6">Are you sure? This cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteConfirmId(null)} className="btn-outline-primary px-6 py-2">Cancel</button>
            <button onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-6 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function RecordForm({ onSuccess }: { onSuccess: () => void }) {
  const { showToast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => { setPatients(getPatients()); }, []);

  const form = useForm({
    defaultValues: { patientId: '', diagnosis: '', prescription: '', doctor: DOCTORS[0], date: new Date().toISOString().split('T')[0], notes: '' },
    onSubmit: async ({ value }) => {
      const patient = patients.find((p) => p.id === value.patientId);
      saveMedicalRecord({ ...value, patientName: patient ? `${patient.firstName} ${patient.lastName}` : '' });
      showToast('Medical record added!');
      onSuccess();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <form.Field name="patientId" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
          children={(field) => (
            <div>
              <label className="form-label">Patient <span className="text-rose-400">*</span></label>
              <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`}>
                <option value="">Select a patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
              {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
            </div>
          )} />
        <form.Field name="doctor" children={(field) => (
          <div>
            <label className="form-label">Doctor</label>
            <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="form-input">
              {DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )} />
      </div>

      <form.Field name="date" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
        children={(field) => (
          <div>
            <label className="form-label">Date <span className="text-rose-400">*</span></label>
            <input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="form-input" />
          </div>
        )} />

      <form.Field name="diagnosis" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
        children={(field) => (
          <div>
            <label className="form-label">Diagnosis <span className="text-rose-400">*</span></label>
            <input type="text" placeholder="e.g. Mild Hypertension" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
              className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`} />
            {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
          </div>
        )} />

      <form.Field name="prescription" validators={{ onChange: ({ value }) => !value ? 'Required' : undefined }}
        children={(field) => (
          <div>
            <label className="form-label">Prescription <span className="text-rose-400">*</span></label>
            <textarea placeholder="Medication details, dosage..." value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
              className={`form-input ${field.state.meta.errors.length ? 'error' : ''}`} style={{ minHeight: 72, resize: 'vertical' }} />
            {field.state.meta.errors.length > 0 && <p className="form-error">{field.state.meta.errors[0]?.toString()}</p>}
          </div>
        )} />

      <form.Field name="notes" children={(field) => (
        <div>
          <label className="form-label">Additional Notes</label>
          <textarea placeholder="Clinical observations..." value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
            className="form-input" style={{ minHeight: 72, resize: 'vertical' }} />
        </div>
      )} />

      <div className="flex justify-end pt-2">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit} className="btn-primary min-w-[160px]">
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </button>
          )} />
      </div>
    </form>
  );
}
