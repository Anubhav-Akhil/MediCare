'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Stethoscope,
  Pill,
  FileText,
  AlertTriangle,
  RefreshCw,
  Zap,
  Users,
  Search,
  ChevronDown,
  History,
  CheckCircle2,
  Calendar,
  Activity,
  HeartPulse,
  Save,
  TrendingUp,
} from 'lucide-react';
import {
  chatWithMediCopilot,
  chatWithPatientContext,
  generateVisitSummary,
  type GeneratedVisitSummary,
} from '@/lib/ai-service';
import {
  getPatients,
  getMedicalRecords,
  getAppointments,
  getVisitHistory,
  saveVisitHistory,
} from '@/lib/storage';
import type { Patient, MedicalRecord, Appointment, PatientVisitHistory } from '@/types';
import { useToast } from '@/components/Toast';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatientId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const GENERAL_PROMPTS = [
  { icon: Stethoscope, label: 'Differential for acute chest pain' },
  { icon: Pill, label: 'Safe alternative to Penicillin' },
  { icon: AlertTriangle, label: 'Check Warfarin + NSAID conflict' },
  { icon: FileText, label: 'Generate SOAP note template' },
];

const PATIENT_PROMPTS = [
  { icon: TrendingUp, label: 'Assess patient progress vs past visits' },
  { icon: Pill, label: 'Check safety of proposed medications' },
  { icon: Activity, label: 'Formulate differential & recommended labs' },
  { icon: FileText, label: 'Generate consultation SOAP summary' },
];

export default function AICopilotDrawer({ isOpen, onClose, initialPatientId }: AICopilotDrawerProps) {
  const { showToast } = useToast();

  // Patients & Context State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [patientVisits, setPatientVisits] = useState<PatientVisitHistory[]>([]);

  // UI Mode: 'chat' or 'history'
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // End Visit & Summary Modal State
  const [isEndVisitModalOpen, setIsEndVisitModalOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<GeneratedVisitSummary | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load all patients on mount or drawer open
  useEffect(() => {
    if (isOpen) {
      const allPatients = getPatients();
      setPatients(allPatients);

      if (initialPatientId) {
        const found = allPatients.find((p) => p.id === initialPatientId);
        if (found) {
          selectPatient(found);
        }
      }
    }
  }, [isOpen, initialPatientId]);

  // Load patient context when selectedPatient changes
  const refreshPatientData = useCallback((patient: Patient) => {
    const allRecords = getMedicalRecords().filter((r) => r.patientId === patient.id);
    const allAppts = getAppointments().filter((a) => a.patientId === patient.id);
    const allVisits = getVisitHistory(patient.id);

    setPatientRecords(allRecords);
    setPatientAppointments(allAppts);
    setPatientVisits(allVisits);
  }, []);

  const selectPatient = (patient: Patient | null) => {
    setSelectedPatient(patient);
    setIsPatientDropdownOpen(false);
    setActiveTab('chat');

    if (patient) {
      refreshPatientData(patient);
      const visits = getVisitHistory(patient.id);
      const records = getMedicalRecords().filter((r) => r.patientId === patient.id);

      setMessages([
        {
          id: 'patient-welcome',
          role: 'assistant',
          content: `Clinical dossier loaded for **${patient.firstName} ${patient.lastName}** (${patient.age}y ${patient.gender}, Blood: ${patient.bloodGroup}).\n\n• **Medical Records:** ${records.length} condition(s) on file\n• **Recorded Consultations:** ${visits.length} past AI visit(s)\n${visits.length > 0 ? `• **Latest Progress Assessment:** *${visits[0].progressNote}* (${visits[0].visitDate})` : '• **Status:** *Initial Consultation Session*'}\n\nHow can I assist with ${patient.firstName}'s evaluation, prescriptions, or progress assessment today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setPatientRecords([]);
      setPatientAppointments([]);
      setPatientVisits([]);
      setMessages([
        {
          id: 'general-welcome',
          role: 'assistant',
          content:
            "Hello Doctor! I am your **MediCare AI Clinical Copilot** powered by Groq Intelligence. Select a patient above to provide patient-specific clinical reasoning, or ask any general medical/pharmacological question below.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Reset or initialize messages when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      selectPatient(null);
    }
  }, [isOpen]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Filter patients for dropdown
  const filteredPatientsList = useMemo(() => {
    if (!patientSearchQuery.trim()) return patients;
    const q = patientSearchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.bloodGroup.toLowerCase().includes(q)
    );
  }, [patients, patientSearchQuery]);

  if (!isOpen) return null;

  // Send message
  const handleSendMessage = async (text?: string) => {
    const query = (text || inputValue).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      let reply = '';
      if (selectedPatient) {
        reply = await chatWithPatientContext(
          selectedPatient,
          patientRecords,
          patientAppointments,
          patientVisits,
          history
        );
      } else {
        reply = await chatWithMediCopilot(history);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm operating in emergency offline mode. For acute symptomatic evaluation, ensure standard 12-lead ECG, troponin, and vitals check. Please check your internet connection or API key settings.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Open End Visit Summary Modal
  const handleInitiateEndVisit = async () => {
    if (!selectedPatient) return;
    setIsEndVisitModalOpen(true);
    setIsSummarizing(true);

    try {
      const chatTranscript = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const summary = await generateVisitSummary(selectedPatient, chatTranscript, patientVisits);
      setGeneratedSummary(summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      showToast('Failed to auto-generate visit summary. You can still save manually.', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Confirm and Save Visit Summary to Storage
  const handleSaveVisitSummary = () => {
    if (!selectedPatient || !generatedSummary) return;

    const todayStr = new Date().toISOString().split('T')[0];
    saveVisitHistory({
      patientId: selectedPatient.id,
      visitDate: todayStr,
      aiSummary: generatedSummary.aiSummary,
      symptoms: generatedSummary.symptoms,
      diagnosis: generatedSummary.diagnosis,
      treatmentPlan: generatedSummary.treatmentPlan,
      doctorNotes: generatedSummary.doctorNotes,
      progressNote: generatedSummary.progressNote,
    });

    refreshPatientData(selectedPatient);
    setIsEndVisitModalOpen(false);
    setGeneratedSummary(null);
    showToast(`Visit summary saved to ${selectedPatient.firstName}'s longitudinal history!`, 'success');

    // Add a confirmation message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ **Consultation Concluded & Recorded:**\n\n• **Visit Summary:** ${generatedSummary.aiSummary}\n• **Progress Assessment:** *${generatedSummary.progressNote}*\n• **Diagnosis:** ${generatedSummary.diagnosis}\n• **Plan:** ${generatedSummary.treatmentPlan}\n\n*All future consultations for ${selectedPatient.firstName} will incorporate this visit.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const userMessagesCount = messages.filter((m) => m.role === 'user').length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={onClose}
      />

      {/* Full-Height Edge HUD Chatbot Drawer with z-[9999] */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] md:w-[560px] lg:w-[600px] bg-[#0c0722] border-l border-purple-500/30 shadow-[-24px_0_72px_rgba(0,0,0,0.95)] z-[9999] flex flex-col animate-scale-in text-slate-100 overflow-hidden">
        {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-b border-purple-500/20 flex items-center justify-between bg-purple-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 aspect-square rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-500 p-0.5 shadow-lg shadow-purple-600/30 shrink-0">
              <div className="w-full h-full bg-[#0d0725] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">MediAI Copilot</h2>
                <span className="flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold leading-none">
                  <Zap className="w-2.5 h-2.5" /> Groq Active
                </span>
              </div>
              <p className="text-[0.7rem] text-purple-300/70 mt-1">Patient-Context Clinical Reasoning & History</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 aspect-square rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── PATIENT SELECTOR SECTION ───────────────────────────────────── */}
        <div className="p-3.5 border-b border-purple-500/15 bg-black/30 relative shrink-0">
          {selectedPatient ? (
            /* Selected Patient Banner */
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-purple-950/60 border border-purple-500/30 p-2.5 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 aspect-square rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                    {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </p>
                      <span className="text-[0.62rem] px-1.5 py-0.2 rounded bg-purple-800/80 text-purple-200 border border-purple-400/30 font-mono shrink-0">
                        {selectedPatient.bloodGroup}
                      </span>
                    </div>
                    <p className="text-[0.65rem] text-purple-300/70 truncate">
                      {selectedPatient.age}y • {selectedPatient.gender} • {patientVisits.length} prior visit(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsPatientDropdownOpen((prev) => !prev)}
                    className="text-[0.65rem] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white font-medium flex items-center gap-1 transition-all cursor-pointer"
                    title="Switch Patient"
                  >
                    <span>Switch</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => selectPatient(null)}
                    className="p-1 rounded-lg bg-white/5 hover:bg-rose-600/30 text-slate-400 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Clear Patient (General Mode)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mode Tabs: Chat vs Longitudinal History */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1 bg-purple-950/40 p-0.5 rounded-lg border border-purple-500/20 text-[0.68rem]">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      activeTab === 'chat'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-purple-300/60 hover:text-white'
                    }`}
                  >
                    💬 Active Consultation
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'history'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-purple-300/60 hover:text-white'
                    }`}
                  >
                    <History className="w-3 h-3" />
                    <span>Visits Timeline ({patientVisits.length})</span>
                  </button>
                </div>

                {/* End Visit Trigger */}
                {userMessagesCount >= 1 && activeTab === 'chat' && (
                  <button
                    onClick={handleInitiateEndVisit}
                    className="text-[0.65rem] font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    <span>End Visit & Save</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Patient Selector Trigger (No patient selected) */
            <div>
              <button
                onClick={() => setIsPatientDropdownOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/50 border border-purple-500/25 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-900/60 flex items-center justify-center text-purple-300 group-hover:text-white">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-purple-200">
                      Select Patient Profile for AI Context
                    </p>
                    <p className="text-[0.65rem] text-purple-300/60">
                      Enables longitudinal EHR history & progress tracking
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Patient Search Dropdown Overlay */}
          {isPatientDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-[#10092c] border border-purple-500/30 rounded-2xl shadow-2xl z-50 p-3 max-h-80 flex flex-col animate-scale-in">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search by patient name, phone, or blood group..."
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                  style={{ paddingLeft: '34px' }}
                  className="hud-input text-xs py-2 bg-[#0a051d]"
                />
              </div>

              <div className="overflow-y-auto space-y-1 max-h-56 scrollbar-none">
                {filteredPatientsList.length === 0 ? (
                  <p className="text-center text-xs text-purple-300/60 py-4">No patients found</p>
                ) : (
                  filteredPatientsList.map((p) => {
                    const visits = getVisitHistory(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => selectPatient(p)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-purple-600/25 border border-white/5 hover:border-purple-500/30 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-xs font-black text-white">
                            {p.firstName[0]}{p.lastName[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {p.firstName} {p.lastName}
                            </p>
                            <p className="text-[0.65rem] text-purple-300/60">
                              {p.age}y • {p.gender} • Blood: {p.bloodGroup}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-500/20 font-semibold">
                            {visits.length} visit{visits.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-2 border-t border-purple-500/20 mt-2 flex items-center justify-between">
                <button
                  onClick={() => selectPatient(null)}
                  className="text-[0.68rem] text-purple-300 hover:text-white font-medium cursor-pointer"
                >
                  Clear (General Mode)
                </button>
                <button
                  onClick={() => setIsPatientDropdownOpen(false)}
                  className="text-[0.68rem] px-2.5 py-1 rounded-lg bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── TAB 1: CONSULTATION CHAT ───────────────────────────────────── */}
        {activeTab === 'chat' ? (
          <>
            {/* Quick Prompts Carousel */}
            <div className="px-4 py-2.5 border-b border-purple-500/15 bg-black/20 flex gap-2 overflow-x-auto scrollbar-none">
              {(selectedPatient ? PATIENT_PROMPTS : GENERAL_PROMPTS).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.label)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/25 text-[0.68rem] text-purple-200 hover:text-white transition-all cursor-pointer"
                  >
                    <Icon className="w-3 h-3 text-fuchsia-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Message Log */}
            <div ref={scrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-xs leading-relaxed animate-fade-in ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                        isUser
                          ? 'bg-purple-600 text-white'
                          : 'bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white'
                      }`}
                    >
                      {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div
                      className={`max-w-[84%] rounded-2xl p-3.5 ${
                        isUser
                          ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/30'
                          : 'bg-white/5 border border-purple-500/20 text-purple-100 backdrop-blur-md'
                      }`}
                    >
                      <div
                        className="prose prose-invert prose-xs max-w-none break-words"
                        dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n\n/g, '<br/><br/>')
                            .replace(/\n/g, '<br/>')
                            .replace(/•/g, '&bull;'),
                        }}
                      />
                      <div
                        className={`text-[0.6rem] mt-1.5 opacity-60 ${
                          isUser ? 'text-right text-purple-200' : 'text-left text-purple-300'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-3 text-xs animate-fade-in">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="bg-white/5 border border-purple-500/20 text-purple-300 rounded-2xl p-3 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-fuchsia-400" />
                    <span>
                      {selectedPatient
                        ? `Analyzing ${selectedPatient.firstName}'s longitudinal clinical data...`
                        : 'MediAI is processing clinical query...'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-purple-500/20 bg-purple-950/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder={
                    selectedPatient
                      ? `Ask about ${selectedPatient.firstName}'s symptoms, progress, or Rx...`
                      : 'Ask MediAI (e.g. differential for chest pain)...'
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={loading}
                  className="hud-input pr-12 text-xs py-3 bg-[#0a051d]"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  className="absolute right-2 w-8 h-8 aspect-square rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[0.62rem] text-slate-400 mt-2 px-1">
                <span>
                  {selectedPatient ? `Patient: ${selectedPatient.firstName} ${selectedPatient.lastName}` : 'General Clinical Mode'}
                </span>
                <span className="text-purple-400">Groq High-Throughput Engine</span>
              </div>
            </div>
          </>
        ) : (
          /* ── TAB 2: LONGITUDINAL VISIT HISTORY TIMELINE ─────────────────── */
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-fuchsia-400" />
                  EHR Consultation Timeline
                </h3>
                <p className="text-[0.68rem] text-purple-300/60 mt-0.5">
                  Chronological AI summaries tracking {selectedPatient?.firstName}&apos;s clinical progress
                </p>
              </div>
            </div>

            {patientVisits.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-purple-500/15">
                <HeartPulse className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
                <p className="text-xs font-bold text-white">No previous consultation visits recorded</p>
                <p className="text-[0.68rem] text-purple-300/60 mt-1 max-w-xs mx-auto">
                  Converse with MediAI in the Active Consultation tab, then click &quot;End Visit &amp; Save&quot; to log the first visit summary!
                </p>
              </div>
            ) : (
              <div className="relative border-l border-purple-500/25 ml-3 pl-4 space-y-4">
                {patientVisits.map((visit, idx) => (
                  <div key={visit.id || idx} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 border-2 border-[#0c0722] shadow-md shadow-purple-500/40" />

                    <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/20 hover:border-purple-400/40 transition-all space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.68rem] font-bold text-fuchsia-300 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          Visit Date: {visit.visitDate}
                        </span>
                        <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          {visit.progressNote || 'Baseline'}
                        </span>
                      </div>

                      <p className="text-xs text-white leading-relaxed font-medium">
                        {visit.aiSummary}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[0.68rem] pt-2 border-t border-purple-500/15">
                        <div>
                          <strong className="text-purple-300 block mb-0.5">Reported Symptoms:</strong>
                          <span className="text-slate-300">{visit.symptoms || 'General follow-up'}</span>
                        </div>
                        <div>
                          <strong className="text-purple-300 block mb-0.5">Clinical Diagnosis:</strong>
                          <span className="text-slate-300">{visit.diagnosis || 'Clinical evaluation'}</span>
                        </div>
                      </div>

                      {visit.treatmentPlan && (
                        <div className="text-[0.68rem] p-2 rounded-lg bg-black/30 border border-purple-500/15">
                          <strong className="text-amber-300 block mb-0.5">Treatment / Prescribed Plan:</strong>
                          <span className="text-purple-200">{visit.treatmentPlan}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MODAL: END VISIT & AI SUMMARY REVIEW ──────────────────────── */}
        {isEndVisitModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-[#0e0828] border border-purple-500/30 rounded-2xl shadow-2xl p-6 relative z-[10001] animate-scale-in text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Save className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Conclude Consultation &amp; Save Visit
                    </h3>
                    <p className="text-[0.68rem] text-purple-300/70">
                      Patient: {selectedPatient?.firstName} {selectedPatient?.lastName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEndVisitModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSummarizing ? (
                <div className="py-10 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-fuchsia-400 animate-spin" />
                  <p className="text-xs text-purple-200">
                    MediAI is synthesizing clinical conversation into longitudinal EHR summary...
                  </p>
                </div>
              ) : generatedSummary ? (
                <div className="space-y-3.5 text-xs">
                  {/* Progress Assessment Badge */}
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/25 flex items-center justify-between">
                    <div>
                      <span className="text-[0.62rem] text-purple-300 uppercase font-semibold">
                        Progress Assessment
                      </span>
                      <p className="text-sm font-black text-emerald-400">{generatedSummary.progressNote}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-emerald-400/50" />
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-[0.68rem] text-purple-300 uppercase font-semibold mb-1">
                      AI Executive Summary
                    </label>
                    <textarea
                      value={generatedSummary.aiSummary}
                      onChange={(e) =>
                        setGeneratedSummary({ ...generatedSummary, aiSummary: e.target.value })
                      }
                      rows={2}
                      className="hud-input text-xs w-full bg-[#0a051d]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.68rem] text-purple-300 uppercase font-semibold mb-1">
                        Reported Symptoms
                      </label>
                      <input
                        type="text"
                        value={generatedSummary.symptoms}
                        onChange={(e) =>
                          setGeneratedSummary({ ...generatedSummary, symptoms: e.target.value })
                        }
                        className="hud-input text-xs w-full bg-[#0a051d]"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] text-purple-300 uppercase font-semibold mb-1">
                        Clinical Diagnosis / Impression
                      </label>
                      <input
                        type="text"
                        value={generatedSummary.diagnosis}
                        onChange={(e) =>
                          setGeneratedSummary({ ...generatedSummary, diagnosis: e.target.value })
                        }
                        className="hud-input text-xs w-full bg-[#0a051d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.68rem] text-purple-300 uppercase font-semibold mb-1">
                      Treatment / Prescriptions Formulated
                    </label>
                    <input
                      type="text"
                      value={generatedSummary.treatmentPlan}
                      onChange={(e) =>
                        setGeneratedSummary({ ...generatedSummary, treatmentPlan: e.target.value })
                      }
                      className="hud-input text-xs w-full bg-[#0a051d]"
                    />
                  </div>

                  <div className="pt-3 border-t border-purple-500/20 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsEndVisitModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveVisitSummary}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Save to History</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
