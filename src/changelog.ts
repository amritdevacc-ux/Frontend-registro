import { Sparkles, Moon, Calculator, UserCheck, Settings, BookOpen, Clock } from 'lucide-react';

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
    title: 'Aggiornamento',
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
        description: 'Aggiungi voti ipotetici con il tasto \"+ Aggiungi voto manuale\" per vedere come cambia la tua media. I voti restano salvati anche dopo il logout.',
        icon: Sparkles,
        color: 'bg-amber-500'
      },
      {
        id: 'auto-login',
        title: 'Accesso Automatico',
        description: 'Basta inserire la password ogni volta! Spunta \"Ricordami\" per accedere automaticamente ai tuoi dati.',
        icon: UserCheck,
        color: 'bg-blue-500'
      },
      {
        id: 'agenda',
        title: 'Agenda Integrata',
        description: 'Consulta compiti, verifiche e annotazioni del registro con il nuovo tab Agenda e il selettore data animato.',
        icon: BookOpen,
        color: 'bg-purple-500'
      },
      {
        id: 'lessons',
        title: 'Lezioni di Oggi',
        description: 'Un tab dedicato alle lezioni del giorno con materia, tipo e docente, sempre a portata di tap.',
        icon: Clock,
        color: 'bg-orange-500'
      },
      {
        id: 'settings',
        title: 'Pagina Impostazioni',
        description: 'Accedi rapidamente al tema scuro, alle informazioni sull\'app e al logout dal nuovo menu Impostazioni.',
        icon: Settings,
        color: 'bg-gray-500'
      }
    ]
  }
];

export const LATEST_VERSION = changelog[0].version;
