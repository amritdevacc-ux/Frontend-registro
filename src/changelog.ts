import { Sparkles, Moon, Calculator, UserCheck, Settings } from 'lucide-react';

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
    version: __APP_VERSION__,
    date: '2026-03-27',
    title: 'Aggiornamento Primaverile',
    features: [
      {
        id: 'dark-mode',
        title: 'Tema Scuro Elegante',
        description: 'Accendi la notte con il nuovo tema scuro automatico o manuale, perfetto per le sessioni di studio serali.',
        icon: Moon,
        color: 'bg-indigo-500'
      },
      {
        id: 'grade-calculator',
        title: 'Calcolatore Sufficienza',
        description: 'Scopri subito che voto ti serve per arrivare al magico 6, mostrato automaticamente sotto ogni materia.',
        icon: Calculator,
        color: 'bg-emerald-500'
      },
      {
        id: 'grade-simulation',
        title: 'Simulatore Voti',
        description: 'Aggiungi voti ipotetici con il tasto "+ Aggiungi voto manuale" per vedere come cambia la tua media in tempo reale.',
        icon: Sparkles,
        color: 'bg-amber-500'
      },
      {
        id: 'auto-login',
        title: 'Accesso Automatico',
        description: 'Basta inserire la password ogni volta! Spunta "Ricordami" per accedere automaticamente ai tuoi dati.',
        icon: UserCheck,
        color: 'bg-blue-500'
      }
    ]
  }
];

export const LATEST_VERSION = changelog[0].version;
