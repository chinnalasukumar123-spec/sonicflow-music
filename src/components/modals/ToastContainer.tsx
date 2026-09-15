import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-28 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#131C2E] border border-border/80 text-foreground shadow-2xl animate-fadeIn"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {(!t.type || t.type === 'info') && <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
            <p className="text-xs font-medium truncate">{t.message}</p>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
