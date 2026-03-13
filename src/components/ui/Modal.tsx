import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm" />
        
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            className="bg-white rounded-card shadow-xl w-full max-w-md overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
            
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-ink">{title}</h2>
                <button
                onClick={onClose}
                className="p-2 text-ink-muted hover:text-ink hover:bg-gray-100 rounded-full transition-colors">
                
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">{children}</div>
              {footer &&
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                  {footer}
                </div>
            }
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}