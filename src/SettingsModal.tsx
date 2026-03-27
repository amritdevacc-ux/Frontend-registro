import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Moon, Sun, X, Info, Heart } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onLogoutClick: () => void;
}

export function SettingsModal({ isOpen, onClose, darkMode, setDarkMode, onLogoutClick }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[var(--color-bg-card)] rounded-[2rem] p-6 shadow-2xl dark:border dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-extrabold text-[var(--color-text-dark)]">
                Impostazioni
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--color-bg-light)] text-gray-500 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {/* Dark Mode Toggle */}
              <div className="bg-[var(--color-bg-light)] p-4 rounded-[1.5rem] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[var(--color-text-dark)]">
                  {darkMode ? <Moon size={20} className="text-blue-500" /> : <Sun size={20} className="text-orange-500" />}
                  <span className="font-extrabold text-[15px]">Tema Scuro</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    darkMode ? 'bg-[var(--color-primary-blue)]' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* App Info */}
              <div className="bg-[var(--color-bg-light)] p-4 rounded-[1.5rem] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[var(--color-text-dark)]">
                  <Info size={20} className="text-gray-400" />
                  <span className="font-extrabold text-[15px]">Versione App</span>
                </div>
                <span className="text-[13px] font-bold text-gray-400">v{__APP_VERSION__}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onClose();
                  onLogoutClick();
                }}
                className="w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-[1.5rem] flex items-center gap-3 transition-colors text-left border border-red-100 dark:border-red-500/30"
              >
                <LogOut size={20} />
                <span className="font-extrabold text-[15px]">Esci dall'account</span>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center mt-6">
              <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-gray-400 mb-4">
                Made with <Heart size={14} className="text-red-500 fill-red-500" /> 
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-[11px] font-bold text-gray-400">
                  App non ufficiale, non affiliata con Spaggiari Parma s.r.l.
                </p>
                <p className="text-[11px] font-bold text-gray-400">
                  © 2026 All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
