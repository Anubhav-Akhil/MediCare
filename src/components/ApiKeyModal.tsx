'use client';

import { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, Sparkles, AlertCircle, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { getCustomApiKey, setCustomApiKey } from '@/lib/ai-service';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [model, setModel] = useState('llama-3.3-70b-versatile');

  useEffect(() => {
    if (isOpen) {
      const existing = getCustomApiKey() || '';
      setApiKey(existing);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomApiKey(apiKey);
    setTestResult({
      success: true,
      message: apiKey.trim() ? 'Custom API key saved successfully!' : 'Default system Groq API Key restored.',
    });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Respond with exactly: "MediCare AI Engine Connected and Operational"',
          customApiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult({
          success: true,
          message: `Connection successful! Engine: ${data.model || 'Groq Llama 3.3 70B'}. Response: "${data.content?.trim()}"`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Connection failed. Please verify your API key.',
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: 'Network error communicating with AI endpoint.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="hud-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hud-modal-content max-w-xl mx-4 p-6 sm:p-8 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                MediAI Engine Settings
                <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Groq Ultra-Fast
                </span>
              </h2>
              <p className="text-xs text-purple-300/70">
                Configure your LLM provider for live clinical diagnostics and copilot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-5">
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/25 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-200/90 leading-relaxed">
              <strong className="text-white">Active System Key Connected:</strong> Your MediCare workspace is pre-connected to Groq Cloud with high-throughput GPT-OSS 120B & 20B models. You can also override it below with your own custom key anytime.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2">
              Groq Cloud API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="gsk_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="hud-input pl-10 pr-24 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setApiKey('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.7rem] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-purple-200"
              >
                Clear
              </button>
            </div>
            <p className="text-[0.7rem] text-slate-400 mt-1.5">
              Keys are securely processed on your local machine and server environment.
            </p>
          </div>

          {/* Model selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setModel('openai/gpt-oss-120b')}
              className={`p-3 rounded-xl border text-left transition-all ${
                model === 'openai/gpt-oss-120b'
                  ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-900/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="text-xs font-bold text-white">GPT-OSS 120B (Groq)</p>
              <p className="text-[0.65rem] text-purple-300/70 mt-0.5">High clinical reasoning & accuracy</p>
            </button>
            <button
              type="button"
              onClick={() => setModel('openai/gpt-oss-20b')}
              className={`p-3 rounded-xl border text-left transition-all ${
                model === 'openai/gpt-oss-20b'
                  ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-900/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="text-xs font-bold text-white">GPT-OSS 20B Instant</p>
              <p className="text-[0.65rem] text-purple-300/70 mt-0.5">Ultra-low latency sub-second triage</p>
            </button>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-fade-in ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing API...' : 'Test Connection'}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-purple-300 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                handleSave();
                setTimeout(() => onClose(), 600);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
