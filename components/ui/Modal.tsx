import React, { useEffect } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
  hideClose?: boolean;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl'
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md', footer, hideClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          'relative w-full rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl shadow-black/60 glass fade-in',
          'animate-scaleIn',
          sizeMap[size]
        )}
      >
        {!hideClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-md p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {title && (
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-semibold gradient-text drop-shadow">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4 space-y-4 text-slate-200 text-sm">
          {children}
        </div>
        {footer && <div className="px-6 py-4 border-t border-slate-700/60 bg-slate-900/40 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
