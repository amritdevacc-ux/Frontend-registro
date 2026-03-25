import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PWAInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                             (window.navigator as any).standalone || 
                             document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      return;
    }

    // Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a bit before showing
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show a prompt after a delay if not standalone
    if (isIOSDevice && !isStandaloneMode) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember the user's choice for 7 days
    const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa-prompt-dismissed', expiry.toString());
  };

  useEffect(() => {
    const dismissedUntil = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedUntil && parseInt(dismissedUntil, 10) > new Date().getTime()) {
      setShowPrompt(false);
    } else if (dismissedUntil) {
      // Clean up expired item
      localStorage.removeItem('pwa-prompt-dismissed');
    }
  }, []);

  if (!showPrompt || isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 z-[100] bg-[var(--color-bg-card)] rounded-2xl p-4 shadow-xl border border-[var(--color-bg-light)] card-shadow"
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="bg-[var(--color-primary-blue)] w-10 h-10 rounded-xl flex items-center justify-center shrink-0 soft-shadow">
              <Download className="text-white" size={20} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-[14px] font-extrabold text-[var(--color-text-dark)] mb-1">
                Installa l'App
              </h3>
              
              {isIOS ? (
                <p className="text-[12px] text-gray-500 dark:text-gray-400 font-bold mb-1 leading-snug">
                  Per installare l'app, tocca l'icona <Share size={12} className="inline mx-0.5" /> e seleziona <br/><strong>Aggiungi alla schermata Home</strong>.
                </p>
              ) : (
                <>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 font-bold mb-3 leading-snug">
                    Installa Klass per un'esperienza nativa e accesso offline.
                  </p>
                  {deferredPrompt && (
                    <button 
                      onClick={handleInstallClick}
                      className="w-full py-2.5 px-4 bg-[var(--color-primary-blue)] text-white text-[13px] font-extrabold rounded-[1rem] active:scale-95 transition-transform soft-shadow"
                    >
                      Installa ora
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
