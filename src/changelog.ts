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
        title: 'Finalmente il Tema Scuro',
        description: 'Si attiva da solo o lo decidi tu dalle impostazioni.',
        icon: Moon,
        color: 'bg-indigo-500'
      },
      {
        id: 'grade-calculator',
        title: 'Calcolatore della Sufficienza',
        description: 'Sotto ogni materia ora vedi subito che voto ti serve per arrivare al 6. Oppure il voto che devi prendere per tenere la materia sufficiente.',
        icon: Calculator,
        color: 'bg-emerald-500'
      },
      {
        id: 'grade-simulation',
        title: 'Voti manuali',
        description: 'Puoi aggiungere voti in maniera autonoma per vedere come cambierebbe la tua media.',
        icon: Sparkles,
        color: 'bg-amber-500'
      },
      {
        id: 'auto-login',
        title: 'Dimenticati della Password',
        description: 'Spunta "Ricordami" al login e Klass farà tutto il lavoro per te.',
        icon: UserCheck,
        color: 'bg-blue-500'
      },
      {
        id: 'agenda',
        title: 'Tutto in Agenda',
        description: 'Compiti, verifiche e note del registro sono tutti a portata di mano in un calendario semplice e pulito.',
        icon: BookOpen,
        color: 'bg-purple-500'
      },
      {
        id: 'lessons',
        title: 'Le Lezioni di Oggi',
        description: 'Controlla le lezioni di oggi.',
        icon: Clock,
        color: 'bg-orange-500'
      },
      {
        id: 'settings',
        title: 'Nuove Impostazioni',
        description: 'Disponibile una sezione dedicata per gestire il tema scuro, vedere la versione dell\'app o uscire dall\'account.',
        icon: Settings,
        color: 'bg-gray-500'
      }
    ]
  }
];

export const LATEST_VERSION = changelog[0].version;
