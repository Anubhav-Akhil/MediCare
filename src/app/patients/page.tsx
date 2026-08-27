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
  Sparkles,
  LayoutGrid,
  List,
  HeartPulse,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Stethoscope,
  X,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  getPatients,
  savePatient,
  updatePatient,
  deletePatient,
  getMedicalRecords,
  getAppointments,
} from '@/lib/storage';
import { generatePatientHealthSummary, type PatientAISummaryResult } from '@/lib/ai-service';
import type { Patient } from '@/types';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ITEMS_PER_PAGE = 8;

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  // AI Summary Modal state
  const [aiPatient, setAiPatient] = useState<Patient | null>(null);
  const [aiSummary, setAiSummary] = useState<PatientAISummaryResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

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
    return patients.filter((p) => {
      const matchesSearch =
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q);

      const matchesBlood = selectedBlood === 'All' || p.bloodGroup === selectedBlood;
      return matchesSearch && matchesBlood;
    });
  }, [search, selectedBlood, patients]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / ITEMS_PER_PAGE));
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
    showToast('Patient record deleted successfully', 'success');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  // Form handling with TanStack React Form
  const form = useForm({
    defaultValues: {
      firstName: editingPatient?.firstName || '',
      lastName: editingPatient?.lastName || '',
      age: editingPatient?.age || 30,
      gender: editingPatient?.gender || ('Male' as const),
      bloodGroup: editingPatient?.bloodGroup || 'O+',
      phone: editingPatient?.phone || '',
      email: editingPatient?.email || '',
      address: editingPatient?.address || '',
    },
    onSubmit: async ({ value }) => {
      if (editingPatient) {
        updatePatient(editingPatient.id, value);
        showToast('Patient record updated successfully', 'success');
      } else {
        savePatient(value);
        showToast('New patient registered successfully', 'success');
      }
      loadPatients();
      closeModal();
    },
  });

  // Re-sync form when editingPatient changes
  useEffect(() => {
    if (editingPatient) {
      form.setFieldValue('firstName', editingPatient.firstName);
      form.setFieldValue('lastName', editingPatient.lastName);
      form.setFieldValue('age', editingPatient.age);
      form.setFieldValue('gender', editingPatient.gender);
      form.setFieldValue('bloodGroup', editingPatient.bloodGroup);
      form.setFieldValue('phone', editingPatient.phone);
      form.setFieldValue('email', editingPatient.email);
      form.setFieldValue('address', editingPatient.address);
    } else {
      form.reset();
    }
  }, [editingPatient, form]);

  // Trigger AI Longitudinal Summary
  const handleOpenAiSummary = async (patient: Patient) => {
    setAiPatient(patient);
    setAiLoading(true);
    setAiSummary(null);

    const records = getMedicalRecords().filter((r) => r.patientId === patient.id);
    const appointments = getAppointments().filter((a) => a.patientId === patient.id);

    try {
      const summary = await generatePatientHealthSummary(patient, records, appointments);
      setAiSummary(summary);
    } catch {
      showToast('Could not generate AI summary. Using standard profile.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['First Name,Last Name,Age,Gender,Blood Group,Phone,Email,Address,Created At'];
    const rows = patients.map(
      (p) =>
        `"${p.firstName}","${p.lastName}",${p.age},"${p.gender}","${p.bloodGroup}","${p.phone}","${p.email}","${p.address}","${p.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medicare_patients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Patient roster exported to CSV', 'success');
  };

  // Demographic stats
  const elderlyCount = patients.filter((p) => p.age >= 60).length;
  const pediatricCount = patients.filter((p) => p.age < 18).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER & METRICS ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            Patient Directory & Clinical Triage
          </h1>
          <p className="text-xs text-purple-300/70 mt-1">
            {patients.length} registered patient profiles with AI longitudinal health records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-purple-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setEditingPatient(null);
              setIsModalOpen(true);
            }}
            className="hud-btn-active-orange px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* ── STATS CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="hud-card p-4">
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">Total Registered</p>
          <p className="text-2xl font-black text-white mt-1">{patients.length}</p>
        </div>
        <div className="hud-card p-4">
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">Pediatric (&lt;18y)</p>
          <p className="text-2xl font-black text-indigo-300 mt-1">{pediatricCount}</p>
        </div>
        <div className="hud-card p-4">
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">Geriatric (60y+)</p>
          <p className="text-2xl font-black text-fuchsia-300 mt-1">{elderlyCount}</p>
        </div>
        <div className="hud-card p-4">
          <p className="text-[0.68rem] text-purple-300/60 font-semibold uppercase tracking-wider">AI Health Index</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">94.2%</p>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ───────────────────────────────────── */}
      <div className="hud-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
            <Search className="w-4 h-4 text-amber-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, phone, email, or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ paddingLeft: '40px' }}
            className="hud-input text-xs py-2.5 bg-[#0c0722] text-white placeholder:text-purple-300/50"
          />
        </div>

        {/* Blood group filters & View mode */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-purple-500/20">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => {
                  setSelectedBlood(bg);
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-lg text-[0.65rem] font-bold transition-all cursor-pointer ${
                  selectedBlood === bg
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300/60 hover:text-white'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-purple-500/20 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PATIENT DIRECTORY LIST/GRID ─────────────────────────────────── */}
      {paginatedPatients.length === 0 ? (
        <div className="hud-card p-12 text-center">
          <Users className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
          <p className="text-white font-bold text-sm">No patients match your search criteria</p>
          <p className="text-xs text-purple-300/60 mt-1">Try resetting the blood group filter or search query</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="hud-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="hud-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age & Sex</th>
                  <th>Blood Group</th>
                  <th>Contact Information</th>
                  <th>AI Health Summary</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-xs font-black text-white shadow-md">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-[0.65rem] text-purple-300/60 truncate max-w-[140px]">
                            {p.address || 'General Ward'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-purple-200">
                      {p.age} years • <span className="text-slate-300">{p.gender}</span>
                    </td>
                    <td>
                      <span className="text-[0.68rem] font-bold px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-200 border border-purple-500/30">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs space-y-0.5">
                        <p className="text-purple-200 font-mono text-[0.72rem]">{p.phone}</p>
                        <p className="text-[0.65rem] text-slate-400 truncate max-w-[160px]">{p.email}</p>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenAiSummary(p)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-900/60 to-fuchsia-900/60 hover:from-purple-800 hover:to-fuchsia-800 border border-purple-500/30 text-[0.68rem] font-bold text-purple-100 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>AI Insights</span>
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Patient"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600/30 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedPatients.map((p) => (
            <div key={p.id} className="hud-card hud-card-hover p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-500 p-[1.5px] shadow-lg shadow-purple-900/40">
                    <div className="w-full h-full bg-[#120a2e] rounded-[14px] flex items-center justify-center text-white font-black text-sm">
                      {p.firstName[0]}{p.lastName[0]}
                    </div>
                  </div>
                  <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-200 border border-purple-500/30">
                    {p.bloodGroup}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  {p.firstName} {p.lastName}
                </h3>
                <p className="text-[0.7rem] text-purple-300/70 mt-0.5">
                  {p.age} y/o • {p.gender}
                </p>

                <div className="mt-3 pt-3 border-t border-purple-500/15 space-y-1 text-[0.7rem] text-purple-200/80">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-purple-400" />
                    <span className="font-mono">{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between">
                <button
                  onClick={() => handleOpenAiSummary(p)}
                  className="text-[0.68rem] font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>AI Profile</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-1 rounded-md text-purple-300 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(p.id)}
                    className="p-1 rounded-md text-rose-400 hover:text-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PAGINATION ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-purple-300/70 pt-2">
        <span>
          Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredPatients.length} total)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── ADD / EDIT PATIENT MODAL ─────────────────────────────────────── */}
      {isModalOpen && (
        <div className="hud-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="hud-modal-content max-w-xl mx-4 p-6 sm:p-8 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                {editingPatient ? 'Edit Patient Record' : 'Register New Patient'}
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
              <div className="grid grid-cols-2 gap-3">
                <form.Field
                  name="firstName"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                        placeholder="John"
                      />
                    </div>
                  )}
                />
                <form.Field
                  name="lastName"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                        placeholder="Doe"
                      />
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <form.Field
                  name="age"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Age *</label>
                      <input
                        type="number"
                        min="0"
                        max="125"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="hud-input text-xs"
                      />
                    </div>
                  )}
                />
                <form.Field
                  name="gender"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Gender *</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value as 'Male' | 'Female' | 'Other')}
                        className="hud-input text-xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                />
                <form.Field
                  name="bloodGroup"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Blood Group *</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <form.Field
                  name="phone"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  )}
                />
                <form.Field
                  name="email"
                  children={(field) => (
                    <div>
                      <label className="block text-purple-200 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="hud-input text-xs"
                        placeholder="patient@email.com"
                      />
                    </div>
                  )}
                />
              </div>

              <form.Field
                name="address"
                children={(field) => (
                  <div>
                    <label className="block text-purple-200 font-semibold mb-1">Address / Ward Location</label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="hud-input text-xs"
                      placeholder="124 Marina Bay, Goa / Room 302"
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
                  {editingPatient ? 'Save Changes' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── AI PATIENT HEALTH SUMMARY MODAL ─────────────────────────────── */}
      {aiPatient && (
        <div className="hud-modal-overlay" onClick={(e) => e.target === e.currentTarget && setAiPatient(null)}>
          <div className="hud-modal-content max-w-2xl mx-4 p-6 sm:p-8 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    MediAI Longitudinal Profile: {aiPatient.firstName} {aiPatient.lastName}
                  </h2>
                  <p className="text-[0.7rem] text-purple-300/70">
                    {aiPatient.age}y • {aiPatient.gender} • Blood Group: {aiPatient.bloodGroup}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiPatient(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-fuchsia-400 animate-spin" />
                <p className="text-xs text-purple-200">Analyzing historical vitals and clinical encounters via Groq AI...</p>
              </div>
            ) : aiSummary ? (
              <div className="space-y-4 text-xs">
                {/* Score & Risk Badge */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/25 flex items-center justify-between">
                    <div>
                      <span className="text-[0.68rem] text-purple-300 uppercase font-semibold">Health Score</span>
                      <p className="text-2xl font-black text-emerald-400">{aiSummary.healthScore} / 100</p>
                    </div>
                    <HeartPulse className="w-8 h-8 text-emerald-400/50" />
                  </div>
                  <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/25 flex items-center justify-between">
                    <div>
                      <span className="text-[0.68rem] text-purple-300 uppercase font-semibold">Clinical Risk Level</span>
                      <p className="text-lg font-black text-amber-400">{aiSummary.riskLevel}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-amber-400/50" />
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-bold text-white uppercase text-[0.7rem] mb-1">Executive Clinical Summary</h3>
                  <p className="text-purple-200/90 leading-relaxed">{aiSummary.summaryParagraph}</p>
                </div>

                {/* Key Insights */}
                <div>
                  <h3 className="font-bold text-white uppercase text-[0.7rem] mb-2">Key Diagnostic Findings</h3>
                  <ul className="space-y-1.5">
                    {aiSummary.keyInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-purple-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-bold text-white uppercase text-[0.7rem] mb-2">Clinical Care Recommendations</h3>
                  <ul className="space-y-1.5">
                    {aiSummary.clinicalRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-purple-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-100">
                  <strong>Next Scheduled Action:</strong> {aiSummary.nextSteps}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const patientId = aiPatient.id;
                      setAiPatient(null);
                      window.dispatchEvent(new CustomEvent('open-copilot', { detail: { patientId } }));
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Open Live AI Consultation for {aiPatient.firstName} →</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="hud-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="hud-modal-content max-w-sm mx-4 p-6 text-center animate-scale-in">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Delete Patient Record?</h3>
            <p className="text-xs text-purple-300/70 mt-1 mb-5">
              This will remove all associated profile data from your workspace.
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
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
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
