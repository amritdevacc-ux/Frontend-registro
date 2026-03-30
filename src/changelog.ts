import { Sparkles, Palette, Zap, Smartphone } from 'lucide-react';

export const APP_VERSION: string = __APP_VERSION__;

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export const CHANGELOG_TITLE = 'Personalizzazione';

export const CHANGELOG_FEATURES: Feature[] = [
  {
    id: 'new-themes',
    title: 'Nuovi temi!',
    description: 'Personalizza la tua esperienza con 10 nuove palette di colori.',
    icon: Palette,
    color: 'bg-blue-500'
  },
  {
    id: 'dynamic-ui',
    title: 'Interfaccia Coerente',
    description: "Popup, dialoghi e componenti di sistema ora riflettono istantaneamente i colori del tema selezionato.",
    icon: Sparkles,
    color: 'bg-amber-500'
  },
  {
    id: 'system-sync',
    title: 'Integrazione di Sistema',
    description: "Sincronizzazione automatica tra i colori dell'app e la barra del browser per una navigazione fluida.",
    icon: Smartphone,
    color: 'bg-emerald-500'
  },
  {
    id: 'performance',
    title: 'Ottimizzazioni Interne',
    description: 'Miglioramento della reattività generale e della velocità di transizione tra le diverse sezioni del registro.',
    icon: Zap,
    color: 'bg-indigo-500'
  }
];
