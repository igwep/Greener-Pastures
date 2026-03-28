import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon, XIcon } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertCircleIcon,
  info: AlertCircleIcon,
};

const toastColors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-orange-50 text-orange-800 border-orange-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export function Toast({ toast, onClose }: ToastProps) {
  const Icon = toastIcons[toast.type];
  const colorClass = toastColors[toast.type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`${colorClass} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm mt-1 opacity-90">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 ml-4 hover:opacity-70 transition-opacity"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
