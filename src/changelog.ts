import { Sparkles, Calculator, UserCheck, Settings, BookOpen, Clock, Palette, Zap, Smartphone } from 'lucide-react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon
  color: string;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  title: string;
  features: Feature[];
}

export const changelog: ChangelogVersion[] = [
  {
    version: '0.6.0',
    date: '2026-03-29',
    title: 'Personalizzazione e Stile',
    features: [
      {
        id: 'new-themes',
        title: 'Varianti Cromatiche',
        description: 'Selezione tra 10 nuove palette (Midnight, Dreamland, Sunset e altre) per un\'esperienza d\'uso su misura.',
        icon: Palette,
        color: 'bg-[var(--color-primary-blue)]'
      },
      {
        id: 'dynamic-ui',
        title: 'Interfaccia Coerente',
        description: 'Popup, dialoghi e componenti di sistema ora riflettono istantaneamente i colori del tema selezionato.',
        icon: Sparkles,
        color: 'bg-amber-500'
      },
      {
        id: 'system-sync',
        title: 'Integrazione di Sistema',
        description: 'Sincronizzazione automatica tra i colori dell\'app e la barra del browser per una navigazione fluida.',
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
    ]
  },
  {
    version: '0.5.0',
    date: '2026-03-20',
    title: 'Funzioni Registro',
    features: [
      {
        id: 'grade-calculator',
        title: 'Calcolatore Sufficienza',
        description: 'Analisi immediata del voto necessario per raggiungere o mantenere la sufficienza in ogni materia.',
        icon: Calculator,
        color: 'bg-blue-500'
      },
      {
        id: 'agenda-smart',
        title: 'Agenda Ottimizzata',
        description: 'Visualizzazione rapida di compiti, verifiche e note in un formato calendario intuitivo.',
        icon: BookOpen,
        color: 'bg-purple-500'
      }
    ]
  }
];

export const LATEST_VERSION = changelog[0].version;
