import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-[var(--color-bg-card)] rounded-2xl p-4 shadow-xl border border-[var(--color-bg-light)] card-shadow"
      >
        <button 
          onClick={() => setNeedRefresh(false)}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Chiudi"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-[var(--color-primary-blue)] w-10 h-10 rounded-xl flex items-center justify-center shrink-0 soft-shadow mt-0.5">
            <RefreshCw className="text-white" size={20} />
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="text-[14px] font-extrabold text-[var(--color-text-dark)] mb-1">
               Aggiornamento App
            </h3>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 font-bold mb-3 leading-snug">
               È disponibile una nuova versione di Klass. Ricarica per applicare i cambiamenti.
            </p>
            <button 
              onClick={() => {
                updateServiceWorker(true);
                // Fallback per iOS: Safari a volte non gestisce correttamente
                // il reload innescato dal SW, quindi lo forziamo manualmente.
                setTimeout(() => window.location.reload(), 400);
              }}
              className="py-2 px-4 bg-[var(--color-primary-blue)] text-white text-[12px] font-extrabold rounded-[0.7rem] active:scale-95 transition-transform soft-shadow"
            >
              Aggiorna Ora
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
