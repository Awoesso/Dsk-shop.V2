import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#14532D] text-white rounded-2xl shadow-xl border border-[#166534] animate-in slide-in-from-bottom-3 duration-200 font-secondary"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 size={18} className="text-[#DCFCE7] flex-shrink-0" />}
              {isWarning && <AlertCircle size={18} className="text-amber-300 flex-shrink-0" />}
              {!isSuccess && !isWarning && <Info size={18} className="text-emerald-200 flex-shrink-0" />}
              <p className="text-xs font-semibold text-[#F0FDF4] truncate">{toast.message}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 font-primary">
              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    removeToast(toast.id);
                  }}
                  className="text-xs font-bold text-[#DCFCE7] hover:text-white underline underline-offset-2"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#DCFCE7]/70 hover:text-white transition-colors"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
