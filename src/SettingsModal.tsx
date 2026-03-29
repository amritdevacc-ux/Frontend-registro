import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Palette, X, Info, Heart, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (value: string) => void;
  onLogoutClick: () => void;
}

const THEMES = [
  { id: 'light', name: 'Chiaro', bg: '#F4F7FB', primary: '#3551E5' },
  { id: 'dark', name: 'Scuro', bg: '#0F172A', primary: '#5C78FF' },
  { id: 'midnight', name: 'Midnight', bg: '#11001c', primary: '#4f0147' },
  { id: 'dreamland', name: 'Dreamland', bg: '#bde0fe', primary: '#cdb4db' },
  { id: 'lemonade', name: 'Lemonade', bg: '#fff9f0', primary: '#ff006e' },
  { id: 'cozy', name: 'Cozy', bg: '#ffe8d6', primary: '#6b705c' },
  { id: 'violet', name: 'Violet', bg: '#f4f7fc', primary: '#7209b7' },
  { id: 'mono', name: 'Mono', bg: '#212529', primary: '#adb5bd' },
  { id: 'sunset', name: 'Sunset', bg: '#710000', primary: '#f4e409' },
  { id: 'elegance', name: 'Elegance', bg: '#000000', primary: '#fca311' },
];

export function SettingsModal({ isOpen, onClose, theme, setTheme, onLogoutClick }: SettingsModalProps) {
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
                className="w-8 h-8 rounded-full bg-[var(--color-bg-light)] text-[var(--color-text-gray)] flex items-center justify-center hover:opacity-80 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {/* Theme Selector */}
              <div className="bg-[var(--color-bg-light)] p-4 rounded-[1.5rem]">
                <div className="flex items-center gap-3 text-[var(--color-text-dark)] mb-4">
                  <Palette size={20} className="text-[var(--color-primary-blue)]" />
                  <span className="font-extrabold text-[15px]">Tema Applicazione</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`relative w-full aspect-square rounded-full flex items-center justify-center transition-all ${
                        theme === t.id 
                          ? 'ring-2 ring-offset-2 ring-offset-[var(--color-bg-light)] ring-[var(--color-primary-blue)] scale-110 z-10' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: t.bg, border: `2px solid ${t.primary}` }}
                      title={t.name}
                    >
                      {theme === t.id && (
                        <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                           <Check size={14} className="text-white opacity-80" strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-center text-[11px] font-bold text-[var(--color-text-gray)] mt-4 uppercase tracking-widest">
                  {THEMES.find(t => t.id === theme)?.name}
                </p>
              </div>

              {/* App Info */}
              <div className="bg-[var(--color-bg-light)] p-4 rounded-[1.5rem] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[var(--color-text-dark)]">
                  <Info size={20} className="text-[var(--color-text-gray)]" />
                  <span className="font-extrabold text-[15px]">Versione App</span>
                </div>
                <span className="text-[13px] font-bold text-[var(--color-text-gray)]">v{__APP_VERSION__}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onClose();
                  onLogoutClick();
                }}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-[1.5rem] flex items-center gap-3 transition-colors text-left border border-red-500/30"
              >
                <LogOut size={20} />
                <span className="font-extrabold text-[15px]">Esci dall'account</span>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center mt-6">
              <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-[var(--color-text-gray)] mb-4">
                Made with <Heart size={14} className="text-red-500 fill-red-500" /> 
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-[11px] font-bold text-[var(--color-text-gray)]">
                  App non ufficiale, non affiliata con Spaggiari Parma s.r.l.
                </p>
                <p className="text-[11px] font-bold text-[var(--color-text-gray)]">
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
