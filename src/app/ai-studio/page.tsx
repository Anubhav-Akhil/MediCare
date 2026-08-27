'use client';

import { useState } from 'react';
import {
  Sparkles,
  Stethoscope,
  Pill,
  FileText,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCw,
  Zap,
  Activity,
  Layers,
  Cpu,
  ShieldCheck,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  generateDifferentialDiagnosis,
  checkDrugInteractions,
  formatSOAPNote,
  chatWithMediCopilot,
  type DiagnosisResult,
  type DrugInteractionResult,
  type SOAPNoteResult,
} from '@/lib/ai-service';

type ActiveTab = 'diagnose' | 'interactions' | 'soap' | 'copilot';

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('diagnose');
  const { showToast } = useToast();

  // 1. Diagnosis Tab State
  const [symptoms, setSymptoms] = useState('');
  const [patientAge, setPatientAge] = useState(45);
  const [patientGender, setPatientGender] = useState('Female');
  const [patientHistory, setPatientHistory] = useState('No prior cardiac history; mild hypertension.');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  // 2. Drug Interaction Tab State
  const [proposedDrugs, setProposedDrugs] = useState('Warfarin 5mg, Ibuprofen 400mg, Aspirin 81mg');
  const [existingMeds, setExistingMeds] = useState('Metformin 500mg, Atorvastatin 20mg');
  const [allergies, setAllergies] = useState('Penicillin');
  const [drugResult, setDrugResult] = useState<DrugInteractionResult | null>(null);
  const [drugLoading, setDrugLoading] = useState(false);

  // 3. SOAP Note Tab State
  const [rawNotes, setRawNotes] = useState(
    '62-year-old male presents with worsening shortness of breath and bilateral ankle edema over past 4 days. Orthopnea positive (2 pillows). BP 152/94, HR 88 regular, SpO2 93% on room air. Bibasilar fine crackles noted on lung auscultation. JVP elevated at 4cm above sternal angle.'
  );
  const [soapPatient, setSoapPatient] = useState('David Wilson');
  const [soapResult, setSoapResult] = useState<SOAPNoteResult | null>(null);
  const [soapLoading, setSoapLoading] = useState(false);

  // 4. Copilot Tab State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'Welcome to **MediAI Diagnostic Studio**. How can I assist you with clinical guidelines, pharmacokinetics, or differential evaluations today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Handlers
  const handleRunDiagnosis = async () => {
    if (!symptoms.trim()) {
      showToast('Please enter presenting symptoms.', 'info');
      return;
    }
    setDiagLoading(true);
    try {
      const res = await generateDifferentialDiagnosis(symptoms, {
        age: patientAge,
        gender: patientGender,
        history: patientHistory,
      });
      setDiagnosisResult(res);
      showToast('AI Differential Diagnosis generated successfully!', 'success');
    } catch {
      showToast('AI analysis failed. Please verify connection.', 'error');
    } finally {
      setDiagLoading(false);
    }
  };

  const handleRunDrugCheck = async () => {
    if (!proposedDrugs.trim()) {
      showToast('Please enter proposed drugs.', 'info');
      return;
    }
    setDrugLoading(true);
    try {
      const drugs = proposedDrugs.split(',').map((s) => s.trim()).filter(Boolean);
      const existing = existingMeds.split(',').map((s) => s.trim()).filter(Boolean);
      const allg = allergies.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await checkDrugInteractions(drugs, existing, allg);
      setDrugResult(res);
      showToast('Pharmacological interaction check completed.', 'success');
    } catch {
      showToast('Drug check failed.', 'error');
    } finally {
      setDrugLoading(false);
    }
  };

  const handleRunSOAP = async () => {
    if (!rawNotes.trim()) {
      showToast('Please provide clinical notes.', 'info');
      return;
    }
    setSoapLoading(true);
    try {
      const res = await formatSOAPNote(rawNotes, soapPatient);
      setSoapResult(res);
      showToast('SOAP note formatted successfully.', 'success');
    } catch {
      showToast('SOAP note generation failed.', 'error');
    } finally {
      setSoapLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: 'user' as const, content: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const reply = await chatWithMediCopilot([...chatMessages, userMsg]);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection timeout. Please check your API key settings.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-fuchsia-400 uppercase tracking-widest">
              Clinical Decision Support System
            </span>
            <span className="flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Zap className="w-2.5 h-2.5" /> Groq Engine Online
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            MediAI Clinical Studio
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-purple-500/20 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('diagnose')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'diagnose'
                ? 'hud-btn-active-orange'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Differential Diagnosis</span>
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'interactions'
                ? 'hud-btn-active-orange'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Drug Interactions</span>
          </button>
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'soap'
                ? 'hud-btn-active-orange'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SOAP Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'copilot'
                ? 'hud-btn-active-orange'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Copilot</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: DIFFERENTIAL DIAGNOSIS & SYMPTOMS ─────────────────────── */}
      {activeTab === 'diagnose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 hud-card p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-purple-400" />
                Patient Symptoms & Context
              </h2>
              <p className="text-xs text-purple-300/60 mt-0.5">
                Input clinical findings to generate AI-assisted differential diagnosis
              </p>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-semibold mb-1">
                Presenting Symptoms & Clinical Complaints *
              </label>
              <textarea
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="hud-input text-xs resize-none"
                placeholder="e.g. Sudden onset severe retrosternal chest pain radiating to left arm and jaw. Diaphoresis, nausea, mild dyspnea for 45 minutes."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-purple-200 text-xs font-semibold mb-1">Age</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="hud-input text-xs"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-xs font-semibold mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="hud-input text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-semibold mb-1">
                Relevant Past Medical History
              </label>
              <input
                type="text"
                value={patientHistory}
                onChange={(e) => setPatientHistory(e.target.value)}
                className="hud-input text-xs"
                placeholder="e.g. Type 2 Diabetes, Smoker (10 pack-years), Hyperlipidemia"
              />
            </div>

            <button
              onClick={handleRunDiagnosis}
              disabled={diagLoading || !symptoms.trim()}
              className="w-full hud-btn-active-orange py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${diagLoading ? 'animate-spin' : ''}`} />
              <span>{diagLoading ? 'Evaluating via Groq Llama 3.3...' : 'Generate Differential Diagnosis'}</span>
            </button>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7 hud-card p-6">
            {!diagnosisResult ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-purple-300/50">
                <Stethoscope className="w-12 h-12 mb-3 opacity-30 text-purple-400" />
                <p className="text-white font-bold text-sm">No Active Diagnosis Evaluation</p>
                <p className="text-xs text-purple-300/60 max-w-sm mt-1">
                  Enter presenting patient symptoms on the left to receive AI diagnostic probabilities, ICD-10 codes, and lab recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs animate-fade-in">
                {/* Primary Diagnosis Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 to-fuchsia-950/70 border border-purple-500/30 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[0.65rem] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Primary Suggested Diagnosis
                    </span>
                    <h3 className="text-lg font-black text-white">{diagnosisResult.primaryDiagnosis}</h3>
                    <p className="text-xs text-purple-300/80 mt-1 font-mono">ICD-10: {diagnosisResult.icdCode}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[0.68rem] font-bold px-3 py-1 rounded-full border block mb-1 ${
                        diagnosisResult.urgency === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : diagnosisResult.urgency === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {diagnosisResult.urgency} Urgency
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {diagnosisResult.confidence}% Confidence
                    </span>
                  </div>
                </div>

                {/* Differential Diagnoses */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Differential Diagnoses & Probabilities
                  </h4>
                  <div className="space-y-2">
                    {diagnosisResult.differentialDiagnoses.map((diff, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-white text-xs">{diff.condition}</p>
                          <p className="text-[0.68rem] text-purple-300/70">{diff.notes}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded-md border border-purple-500/30">
                          {diff.probability}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Lab Tests */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Recommended Diagnostic & Lab Tests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {diagnosisResult.recommendedTests.map((test, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {test}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Pharmacotherapy */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Suggested Treatment Formulary
                  </h4>
                  <div className="divide-y divide-purple-500/15 border border-purple-500/20 rounded-xl overflow-hidden bg-purple-950/30">
                    {diagnosisResult.suggestedMedications.map((med, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{med.drug}</p>
                          <p className="text-[0.68rem] text-purple-300/70">{med.frequency} • Duration: {med.duration}</p>
                        </div>
                        <span className="font-mono text-amber-300 font-bold text-xs">{med.dosage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Rationale */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 text-purple-200 leading-relaxed">
                  <strong className="text-white">Clinical Decision Support Rationale:</strong> {diagnosisResult.clinicalRationale}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: DRUG INTERACTIONS ────────────────────────────────────── */}
      {activeTab === 'interactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 hud-card p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-400" />
                Prescription Safety & Interaction Check
              </h2>
              <p className="text-xs text-purple-300/60 mt-0.5">
                Analyze drug-drug interactions, contraindications, and allergen cross-reactivity
              </p>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-semibold mb-1">
                Proposed / Prescribed Medications (comma-separated) *
              </label>
              <textarea
                rows={3}
                value={proposedDrugs}
                onChange={(e) => setProposedDrugs(e.target.value)}
                className="hud-input text-xs resize-none"
                placeholder="e.g. Warfarin 5mg, Ibuprofen 400mg, Ciprofloxacin 500mg"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-semibold mb-1">
                Patient&apos;s Current Medications
              </label>
              <input
                type="text"
                value={existingMeds}
                onChange={(e) => setExistingMeds(e.target.value)}
                className="hud-input text-xs"
                placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-semibold mb-1">
                Known Drug Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="hud-input text-xs"
                placeholder="e.g. Penicillin, Sulfa drugs, NSAIDs"
              />
            </div>

            <button
              onClick={handleRunDrugCheck}
              disabled={drugLoading || !proposedDrugs.trim()}
              className="w-full hud-btn-active-orange py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className={`w-4 h-4 ${drugLoading ? 'animate-spin' : ''}`} />
              <span>{drugLoading ? 'Checking Clinical Formulary...' : 'Run Pharmacological Safety Audit'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 hud-card p-6">
            {!drugResult ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-purple-300/50">
                <Pill className="w-12 h-12 mb-3 opacity-30 text-amber-400" />
                <p className="text-white font-bold text-sm">No Active Interaction Analysis</p>
                <p className="text-xs text-purple-300/60 max-w-sm mt-1">
                  Enter medications on the left to verify toxicity risk, cytochrome P450 conflicts, and clinical warnings.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs animate-fade-in">
                {/* Severity Banner */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    drugResult.severity === 'Severe' || drugResult.severity === 'Contraindicated'
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                      : drugResult.severity === 'Moderate'
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                      : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        Safety Evaluation: {drugResult.severity} Risk
                      </h3>
                      <p className="text-[0.68rem] opacity-80">
                        {drugResult.hasWarning ? 'Adverse drug interaction or warning detected.' : 'Formulary combinations are within safe parameters.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warnings list */}
                {drugResult.warnings.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Clinical Alerts & Warnings
                    </h4>
                    <div className="space-y-2">
                      {drugResult.warnings.map((w, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-purple-500/20 text-purple-200 leading-relaxed">
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interaction details */}
                {drugResult.interactions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Specific Drug-Drug Conflicts
                    </h4>
                    <div className="space-y-2">
                      {drugResult.interactions.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                          <div className="flex items-center justify-between text-white font-bold text-xs mb-1">
                            <span>{item.drugA} ⚡ {item.drugB}</span>
                          </div>
                          <p className="text-purple-300/80 text-[0.68rem]">{item.description}</p>
                          <p className="text-emerald-400 text-[0.68rem] font-semibold mt-1">
                            Recommendation: {item.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternatives */}
                {drugResult.suggestedAlternatives.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold text-white uppercase text-[0.68rem] mb-1">
                      Suggested Safe Alternatives
                    </h4>
                    <p className="text-purple-200 text-xs">
                      {drugResult.suggestedAlternatives.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: SOAP NOTE GENERATOR ──────────────────────────────────── */}
      {activeTab === 'soap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 hud-card p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-400" />
                AI Clinical SOAP Scribe
              </h2>
              <p className="text-xs text-purple-300/60 mt-0.5">
                Convert physician dictated notes into formal SOAP medical encounter records
              </p>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-semibold mb-1">Patient Name</label>
              <input
                type="text"
                value={soapPatient}
                onChange={(e) => setSoapPatient(e.target.value)}
                className="hud-input text-xs"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-semibold mb-1">
                Raw Clinical Observations & Dictation *
              </label>
              <textarea
                rows={8}
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                className="hud-input text-xs font-mono"
                placeholder="Type or paste doctor dictation..."
              />
            </div>

            <button
              onClick={handleRunSOAP}
              disabled={soapLoading || !rawNotes.trim()}
              className="w-full hud-btn-active-orange py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${soapLoading ? 'animate-spin' : ''}`} />
              <span>{soapLoading ? 'Structuring Encounter via Groq...' : 'Generate Structured SOAP Note'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 hud-card p-6">
            {!soapResult ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-purple-300/50">
                <FileText className="w-12 h-12 mb-3 opacity-30 text-pink-400" />
                <p className="text-white font-bold text-sm">No SOAP Note Generated</p>
                <p className="text-xs text-purple-300/60 max-w-sm mt-1">
                  Enter rough encounter observations on the left to structure them into Subjective, Objective, Assessment, and Plan sections.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <h3 className="font-extrabold text-white text-sm">
                    SOAP Clinical Note: {soapPatient}
                  </h3>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Standardized EHR Format
                  </span>
                </div>

                {/* S */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                  <span className="font-bold text-amber-400 uppercase text-[0.7rem] block mb-1">
                    [S] Subjective (History of Present Illness)
                  </span>
                  <p className="text-purple-100 leading-relaxed">{soapResult.subjective}</p>
                </div>

                {/* O */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                  <span className="font-bold text-indigo-400 uppercase text-[0.7rem] block mb-1">
                    [O] Objective (Vitals & Physical Exam)
                  </span>
                  <p className="text-purple-100 leading-relaxed">{soapResult.objective}</p>
                </div>

                {/* A */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                  <span className="font-bold text-fuchsia-400 uppercase text-[0.7rem] block mb-1">
                    [A] Assessment (Clinical Diagnostic Impression)
                  </span>
                  <p className="text-purple-100 leading-relaxed">{soapResult.assessment}</p>
                </div>

                {/* P */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                  <span className="font-bold text-emerald-400 uppercase text-[0.7rem] block mb-1">
                    [P] Plan (Therapeutics, Orders & Follow-up)
                  </span>
                  <p className="text-purple-100 leading-relaxed">{soapResult.plan}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: CLINICAL COPILOT CHAT ─────────────────────────────────── */}
      {activeTab === 'copilot' && (
        <div className="hud-card p-6 max-w-4xl mx-auto flex flex-col h-[650px]">
          <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-500 p-[2px]">
                <div className="w-full h-full bg-[#10092d] rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-fuchsia-400" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">MediCare AI Clinical Copilot (Groq Llama 3.3 70B)</h3>
                <p className="text-[0.7rem] text-purple-300/70">Sub-second evidence-based clinical decision support</p>
              </div>
            </div>
          </div>

          {/* Message history */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white'
                  }`}
                >
                  {msg.role === 'user' ? 'Dr' : <Sparkles className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                      : 'bg-white/5 border border-purple-500/20 text-purple-100'
                  }`}
                >
                  <div
                    className="prose prose-invert prose-xs max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '<br/><br/>')
                        .replace(/\n/g, '<br/>')
                        .replace(/•/g, '&bull;'),
                    }}
                  />
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex gap-3 text-xs">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white/5 border border-purple-500/20 text-purple-300 rounded-2xl p-3 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-fuchsia-400" />
                  <span>Groq AI is analyzing clinical literature...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="relative flex items-center pt-4 border-t border-purple-500/20"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. dosing for pediatric amoxicillin, ECG criteria for Wellens syndrome)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              className="hud-input pr-12 text-xs py-3"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="absolute right-2 w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
