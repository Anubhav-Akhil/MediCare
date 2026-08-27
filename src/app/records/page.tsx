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
  Sparkles,
  Printer,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  getMedicalRecords,
  saveMedicalRecord,
  deleteMedicalRecord,
  getPatients,
} from '@/lib/storage';
import { formatSOAPNote, checkDrugInteractions, type SOAPNoteResult } from '@/lib/ai-service';
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [printableRx, setPrintableRx] = useState<MedicalRecord | null>(null);
  const [aiSoapLoading, setAiSoapLoading] = useState(false);
  const [aiSoapResult, setAiSoapResult] = useState<SOAPNoteResult | null>(null);
  const { showToast } = useToast();

  const loadRecords = useCallback(() => {
    const data = getMedicalRecords();
    setRecords(
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
    setPatients(getPatients());
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
    showToast('Medical record deleted', 'success');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAiSoapResult(null);
  };

  // TanStack Form Setup
  const form = useForm({
    defaultValues: {
      patientId: '',
      patientName: '',
      doctor: DOCTORS[0],
      diagnosis: '',
      prescription: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
    onSubmit: async ({ value }) => {
      let pName = value.patientName;
      if (!pName && value.patientId) {
        const found = patients.find((p) => p.id === value.patientId);
        if (found) pName = `${found.firstName} ${found.lastName}`;
      }

      saveMedicalRecord({
        ...value,
        patientName: pName || 'Walk-in Patient',
        patientId: value.patientId || 'temp_' + Date.now(),
      });
      showToast('Clinical medical record logged successfully', 'success');
      loadRecords();
      closeModal();
    },
  });

  // AI SOAP Note Generation
  const handleGenerateSOAP = async () => {
    const rawNotes = form.getFieldValue('notes');
    const pName = form.getFieldValue('patientName') || 'Patient';

    if (!rawNotes || rawNotes.trim().length < 5) {
      showToast('Please type some initial clinical notes/symptoms first.', 'info');
      return;
    }

    setAiSoapLoading(true);
    try {
      const soap = await formatSOAPNote(rawNotes, pName);
      setAiSoapResult(soap);
      // Auto-populate diagnosis and structured notes if empty
      if (!form.getFieldValue('diagnosis')) {
        form.setFieldValue('diagnosis', soap.assessment.slice(0, 100));
      }
      form.setFieldValue(
        'notes',
        `[SOAP NOTE]\nS: ${soap.subjective}\nO: ${soap.objective}\nA: ${soap.assessment}\nP: ${soap.plan}`
      );
      showToast('Clinical SOAP Note structured via Groq AI!', 'success');
    } catch {
      showToast('AI structuring failed. Continuing in manual mode.', 'error');
    } finally {
      setAiSoapLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER & ACTIONS ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-6 h-6 text-pink-400" />
            Medical Records & Digital Rx
          </h1>
          <p className="text-xs text-purple-300/70 mt-1">
            {records.length} clinical diagnostic notes, prescriptions, and verified EHR encounters
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              form.reset();
              setAiSoapResult(null);
              setIsModalOpen(true);
            }}
            className="hud-btn-active-orange px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Clinical Record</span>
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ──────────────────────────────────────────────────── */}
      <div className="hud-card p-4">
        <div className="relative max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
            <Search className="w-4 h-4 text-amber-400" />
          </div>
          <input
            type="text"
            placeholder="Search by patient, diagnosis (e.g. Hypertension), doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
            className="hud-input text-xs py-2.5 bg-[#0c0722] text-white placeholder:text-purple-300/50"
          />
        </div>
      </div>

      {/* ── RECORDS LIST ────────────────────────────────────────────────── */}
      {filteredRecords.length === 0 ? (
        <div className="hud-card p-12 text-center">
          <FileText className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
          <p className="text-white font-bold text-sm">No clinical records found</p>
          <p className="text-xs text-purple-300/60 mt-1">Log a new diagnosis or adjust your search filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className="hud-card hud-card-hover p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-700 flex items-center justify-center text-white shadow-md">
                      <Stethoscope className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">{r.patientName}</h3>
                      <p className="text-[0.65rem] text-purple-300/60">{r.doctor}</p>
                    </div>
                  </div>
                  <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-500/20">
                    {r.date}
                  </span>
                </div>

                {/* Diagnosis badge */}
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 mb-3">
                  <span className="text-[0.65rem] font-bold text-fuchsia-300 uppercase tracking-wider block mb-0.5">
                    Primary Diagnosis
                  </span>
                  <p className="text-xs font-semibold text-white truncate">{r.diagnosis}</p>
                </div>

                {/* Prescription preview */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-start gap-1.5 text-purple-200">
                    <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[0.72rem] line-clamp-2 text-slate-200 font-medium">
                      {r.prescription || 'Supportive clinical management.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between">
                <button
                  onClick={() => setPrintableRx(r)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[0.68rem] font-bold text-purple-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3 h-3 text-emerald-400" />
                  <span>Digital Rx</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingRecord(r)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
                    title="View Full Encounter"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(r.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600/30 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD RECORD MODAL WITH AI SOAP FORMATTER ─────────────────────── */}
      {isModalOpen && (
        <div className="hud-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="hud-modal-content max-w-2xl mx-4 p-6 sm:p-8 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-pink-600/30">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Log Medical Record & Diagnosis</h2>
                  <p className="text-[0.7rem] text-purple-300/70">Clinical Diagnostic Notes & Prescription Entry</p>
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-3">
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
                        placeholder="e.g. Ananya Sharma"
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="doctor"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Diagnosing Doctor *</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                      >
                        {DOCTORS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <form.Field
                  name="diagnosis"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Primary Diagnosis *</label>
                      <input
                        type="text"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                        placeholder="e.g. Type 2 Diabetes Mellitus, Stage 1 HTN"
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="date"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Encounter Date *</label>
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
              </div>

              <form.Field
                name="prescription"
                children={(field) => (
                  <div>
                    <label className="block text-purple-200 font-semibold mb-1">
                      Prescribed Medications & Dosage *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="hud-input text-xs resize-none"
                      placeholder="e.g. Metformin 500mg (1 tablet twice daily with meals), Telmisartan 40mg (1 tablet once daily in morning)"
                    />
                  </div>
                )}
              />

              <form.Field
                name="notes"
                children={(field) => (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-purple-200 font-semibold">
                        Clinical Observations & SOAP Notes
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateSOAP}
                        disabled={aiSoapLoading}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-[0.68rem] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm disabled:opacity-40"
                      >
                        <Sparkles className={`w-3 h-3 text-amber-300 ${aiSoapLoading ? 'animate-spin' : ''}`} />
                        <span>{aiSoapLoading ? 'Structuring SOAP...' : '✨ AI SOAP Note Formatter'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="hud-input text-xs font-mono"
                      placeholder="Type rough notes (e.g. 52yo reports 2-week history of polyuria and polydipsia. BP 138/86, Fasting Glucose 164 mg/dL...) and click ✨ AI SOAP Note Formatter"
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRINTABLE DIGITAL RX MODAL ──────────────────────────────────── */}
      {printableRx && (
        <div className="hud-modal-overlay" onClick={() => setPrintableRx(null)}>
          <div className="hud-modal-content max-w-2xl mx-4 p-6 sm:p-8 animate-scale-in text-slate-900 bg-white border border-purple-200">
            {/* Top Clinic Prescription Header */}
            <div className="flex items-start justify-between pb-4 border-b-2 border-purple-600 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-sm">
                    MC
                  </div>
                  <h2 className="text-xl font-black text-slate-900">MediCare Super-Specialty Clinic</h2>
                </div>
                <p className="text-xs text-slate-600">Department of Clinical Medicine & Triage • ISO 9001:2026 Certified</p>
                <p className="text-[0.68rem] text-slate-500">Marina Boulevard Medical Center • Contact: +91 832 245 8899</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-black text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">
                  Rx ID: MC-{printableRx.id.slice(-6).toUpperCase()}
                </span>
                <p className="text-xs text-slate-600 mt-1 font-semibold">{printableRx.date}</p>
              </div>
            </div>

            {/* Patient & Doctor Subheader */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-slate-800 mb-6">
              <div>
                <p className="text-[0.68rem] uppercase font-bold text-purple-600">Patient Name</p>
                <p className="text-sm font-extrabold text-slate-900">{printableRx.patientName}</p>
                <p className="text-[0.7rem] text-slate-500">Record ID: {printableRx.patientId}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase font-bold text-purple-600">Attending Physician</p>
                <p className="text-sm font-extrabold text-slate-900">{printableRx.doctor}</p>
                <p className="text-[0.7rem] text-slate-500">Reg. No: MCI-2026-8849</p>
              </div>
            </div>

            {/* Clinical Diagnosis */}
            <div className="mb-6">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">
                Clinical Diagnosis:
              </span>
              <p className="text-sm font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {printableRx.diagnosis}
              </p>
            </div>

            {/* Rx Medication Table */}
            <div className="mb-6">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-2">
                Rx Prescribed Medications:
              </span>
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {printableRx.prescription}
                </p>
              </div>
            </div>

            {/* Clinical Notes / Advice */}
            {printableRx.notes && (
              <div className="mb-6">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">
                  Doctor&apos;s Advice & Notes:
                </span>
                <p className="text-xs text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
                  {printableRx.notes}
                </p>
              </div>
            )}

            {/* Footer QR Code & Signature Stamp */}
            <div className="pt-6 border-t-2 border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center p-1">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold text-slate-800">EHR Verified Digital Stamp</p>
                  <p className="text-[0.6rem] text-slate-500">Scan to verify clinical authenticity</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-32 border-b border-slate-400 pb-1 font-serif italic text-sm text-purple-800 font-bold">
                  {printableRx.doctor}
                </div>
                <p className="text-[0.65rem] text-slate-500 uppercase mt-0.5">Authorized Signature</p>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setPrintableRx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Rx</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW RECORD DETAIL MODAL ────────────────────────────────────── */}
      {viewingRecord && (
        <div className="hud-modal-overlay" onClick={() => setViewingRecord(null)}>
          <div className="hud-modal-content max-w-xl mx-4 p-6 sm:p-8 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-5">
              <h2 className="text-base font-bold text-white tracking-tight">Clinical Encounter Details</h2>
              <button onClick={() => setViewingRecord(null)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-purple-950/40 border border-purple-500/20">
                <div>
                  <span className="text-[0.65rem] text-purple-300 uppercase">Patient</span>
                  <p className="text-sm font-bold text-white">{viewingRecord.patientName}</p>
                </div>
                <div>
                  <span className="text-[0.65rem] text-purple-300 uppercase">Doctor</span>
                  <p className="text-sm font-bold text-white">{viewingRecord.doctor}</p>
                </div>
              </div>

              <div>
                <span className="text-[0.68rem] text-purple-300 uppercase font-semibold block mb-1">Diagnosis</span>
                <p className="text-xs font-semibold text-fuchsia-300 p-2.5 rounded-lg bg-white/5 border border-purple-500/20">
                  {viewingRecord.diagnosis}
                </p>
              </div>

              <div>
                <span className="text-[0.68rem] text-purple-300 uppercase font-semibold block mb-1">Prescription</span>
                <p className="text-xs text-white p-2.5 rounded-lg bg-white/5 border border-purple-500/20 whitespace-pre-wrap">
                  {viewingRecord.prescription}
                </p>
              </div>

              {viewingRecord.notes && (
                <div>
                  <span className="text-[0.68rem] text-purple-300 uppercase font-semibold block mb-1">Clinical Notes</span>
                  <p className="text-xs text-slate-300 p-3 rounded-lg bg-white/5 border border-purple-500/20 whitespace-pre-wrap font-mono">
                    {viewingRecord.notes}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-purple-500/20 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const record = viewingRecord;
                    setViewingRecord(null);
                    setPrintableRx(record);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Open Printable Rx</span>
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
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Delete Medical Record?</h3>
            <p className="text-xs text-purple-300/70 mt-1 mb-5">
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
