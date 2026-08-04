'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#f43f5e';
      case 'info': return '#3b82f6';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-fade-up flex items-center gap-3 px-4 py-3 min-w-[320px] bg-white rounded-xl shadow-lg"
            style={{ borderLeft: `3px solid ${getBorderColor(toast.type)}` }}
          >
            {getIcon(toast.type)}
            <span className="flex-1 text-sm font-medium text-slate-700">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-ghost-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
