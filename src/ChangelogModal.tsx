import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Star } from 'lucide-react';
import { APP_VERSION, CHANGELOG_TITLE, CHANGELOG_FEATURES } from './changelog';

const STORAGE_KEY = 'cvv_last_version_seen';

export function ChangelogModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    if (lastSeen !== APP_VERSION) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, APP_VERSION);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-[var(--color-bg-card)] rounded-[2.5rem] card-shadow overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="relative pt-10 pb-6 px-8 text-center border-b border-[var(--color-bg-light)] shrink-0 overflow-hidden">
              {/* Decorative background blobs */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-accent-blue)] rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none dark:bg-purple-900/30"></div>
              
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 bg-[var(--color-bg-light)] text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] rounded-full transition-colors z-10"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              
              <div className="inline-flex items-center justify-center p-3 bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)] rounded-[1.2rem] mb-4">
                <Star size={28} strokeWidth={2.5} className="fill-[var(--color-primary-blue)]/20" />
              </div>
              <h2 className="text-[26px] font-extrabold text-[var(--color-text-dark)] leading-tight mb-2 tracking-tight">Novità di Klass</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-bg-light)] rounded-full text-[12px] font-extrabold text-[var(--color-text-gray)] uppercase tracking-widest">
                <span>Versione {APP_VERSION}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-text-gray)]/30"></span>
                <span>{CHANGELOG_TITLE}</span>
              </div>
            </div>

            {/* Scrollable Features List */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
              {CHANGELOG_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="flex items-start gap-4 p-4 rounded-[1.5rem] bg-[var(--color-bg-light)] transition-transform hover:scale-[1.02]"
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white shadow-sm ${feature.color}`}>
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-extrabold text-[var(--color-text-dark)] mb-1 leading-tight">{feature.title}</h3>
                      <p className="text-[13px] font-semibold text-[var(--color-text-gray)] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 bg-[var(--color-bg-card)] border-t border-[var(--color-bg-light)] shrink-0">
              <button
                onClick={handleClose}
                className="w-full py-4 bg-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)]/90 text-white font-extrabold text-[16px] rounded-[1.5rem] soft-shadow transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Accedi all'app
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
