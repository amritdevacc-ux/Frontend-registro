import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LogIn, 
  LogOut, 
  Calculator, 
  BookOpen, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  GraduationCap,
  Calendar,
  Clock,
  UserX,
  Moon,
  Sun,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Grade, LoginResponse, SubjectAverage, Lesson, Absence, Period, AgendaEvent } from './types';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { ReloadPrompt } from './ReloadPrompt';
import { ChangelogModal } from './ChangelogModal';
import { SettingsModal } from './SettingsModal';
import { usePullToRefresh } from './usePullToRefresh';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Cache keys per localStorage
const CACHE_KEYS = {
  grades:  'cvv_cache_grades',
  lessons: 'cvv_cache_lessons',
  absences: 'cvv_cache_absences',
  periods:  'cvv_cache_periods',
  customGrades: 'cvv_custom_grades',
  agenda: 'cvv_cache_agenda',
} as const;

const STOP_WORDS = ['e', 'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'lo', 'la', 'i', 'gli', 'le'];
const getSubjectDisplayName = (name: string) => {
  if (name.length <= 40) return name;
  const acronym = name.split(/\s+/)
    .filter(w => !STOP_WORDS.includes(w.toLowerCase()) || w.length > 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
  return acronym || name;
};

function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch { return null; }
}

function saveCache(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const getTheme = (evt: AgendaEvent) => {
  const notesLower = evt.notes.toLowerCase();
  
  if (evt.evtCode === 'AGHW' || notesLower.includes('compit')) {
    return {
      bgUnder: 'bg-orange-200 dark:bg-orange-900/60',
      textUnder: 'text-orange-700 dark:text-orange-300',
      label: 'Compito',
      tagBg: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
    };
  }
  if (notesLower.includes('verifica') || notesLower.includes('scritta') || notesLower.includes('interrogazion')) {
    return {
      bgUnder: 'bg-red-200 dark:bg-red-900/60',
      textUnder: 'text-red-700 dark:text-red-300',
      label: 'Valutazione',
      tagBg: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    };
  }
  if (notesLower.includes('colloqui')) {
    return {
      bgUnder: 'bg-indigo-200 dark:bg-indigo-900/60',
      textUnder: 'text-indigo-700 dark:text-indigo-300',
      label: 'Colloquio',
      tagBg: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'
    };
  }
  return {
    bgUnder: 'bg-blue-200 dark:bg-blue-900/60',
    textUnder: 'text-blue-700 dark:text-blue-300',
    label: 'Annotazione',
    tagBg: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
  };
};

function AgendaCard({ evt }: { evt: AgendaEvent }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = getTheme(evt);
  
  const start = new Date(evt.evtDatetimeBegin);
  const end = new Date(evt.evtDatetimeEnd);
  
  const isFullDay = evt.isFullDay ?? (start.getHours() === 0 && start.getMinutes() === 0 && end.getHours() === 23 && end.getMinutes() === 59);
  const timeString = isFullDay ? 'Tutto il giorno' : `${start.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})}`;
  const isMultiDay = start.getDate() !== end.getDate() && !isFullDay;

  return (
    <div className="relative mb-6 cursor-pointer group w-full" onClick={() => setIsExpanded(!isExpanded)}>
      <div className={`bg-[var(--color-bg-card)] rounded-[2rem] p-6 relative z-10 border border-gray-100 dark:border-gray-800 transition-all duration-300 bg-white dark:bg-gray-800 ${isExpanded ? 'shadow-md -translate-y-1' : 'shadow-sm hover:shadow-md'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600">
              <UserX size={18} className="text-gray-400 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-[var(--color-text-dark)] leading-tight">{evt.authorName ? evt.authorName.split(' ').map(n=>n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ') : 'Docente'}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{evt.classDesc || 'Generale'}</p>
            </div>
          </div>
        </div>

        <h4 className="font-extrabold text-[18px] text-[var(--color-text-dark)] leading-tight mb-2">
          {evt.subjectDesc || 'Comunicazione Generale'}
        </h4>
        
        <p className={`text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 mb-5 relative ${isExpanded ? '' : 'line-clamp-3'}`}>
          {evt.notes}
        </p>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-[0.5rem] border text-[10px] font-extrabold uppercase tracking-widest ${theme.tagBg}`}>
            {theme.label}
          </span>
          <span className="px-2.5 py-1 rounded-[0.5rem] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-extrabold uppercase tracking-widest bg-gray-50 dark:bg-gray-800">
            {timeString}
          </span>
          {isMultiDay && (
            <span className="px-2.5 py-1 rounded-[0.5rem] border border-blue-200 dark:border-blue-800 text-blue-500 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30">
              Più giorni
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cid, setCid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse | null>(null);
  // Inizializza con i dati in cache per mostrarli subito (stale-while-revalidate)
  const [grades, setGrades] = useState<Grade[]>(() => loadCache<Grade[]>(CACHE_KEYS.grades) ?? []);
  const [customGrades, setCustomGrades] = useState<Grade[]>(() => loadCache<Grade[]>(CACHE_KEYS.customGrades) ?? []);
  const [lessons, setLessons] = useState<Lesson[]>(() => loadCache<Lesson[]>(CACHE_KEYS.lessons) ?? []);
  const [absences, setAbsences] = useState<Absence[]>(() => loadCache<Absence[]>(CACHE_KEYS.absences) ?? []);
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(() => loadCache<AgendaEvent[]>(CACHE_KEYS.agenda) ?? []);
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<Date>(new Date());
  const [agendaLoading, setAgendaLoading] = useState(false);
  const agendaScrollRef = React.useRef<HTMLDivElement>(null);

  const [periods, setPeriods] = useState<Period[]>(() => loadCache<Period[]>(CACHE_KEYS.periods) ?? []);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(() => {
    const cached = loadCache<Period[]>(CACHE_KEYS.periods);
    if (!cached || cached.length === 0) return null;
    const now = new Date();
    const current = cached.find((p) => now >= new Date(p.beginAt) && now <= new Date(p.endAt));
    return current ? current.periodPos : cached[cached.length - 1].periodPos;
  });
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [gradeModalSubject, setGradeModalSubject] = useState<string | null>(null);
  const [gradeModalValue, setGradeModalValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'grades' | 'agenda' | 'lessons' | 'absences'>('grades');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('cvv_credentials') !== null;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('cvv_dark');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    if (activeTab === 'agenda') {
      setTimeout(() => {
        if (agendaScrollRef.current) {
          const selectedBtn = agendaScrollRef.current.querySelector('[data-selected="true"]');
          if (selectedBtn) {
            selectedBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        }
      }, 100);
    }
  }, [activeTab]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cvv_dark', darkMode.toString());
  }, [darkMode]);


  const loadDemoData = () => {
    const demoUser: LoginResponse = {
      token: "demo-token",
      ident: "S1234567X",
      firstName: "Mario",
      lastName: "Rossi",
      release: "1.0",
      expire: "2099-01-01"
    };
    
    const demoPeriods: Period[] = [
      { periodPos: 1, periodDesc: "1° Quadrimestre", beginAt: "2023-09-15", endAt: "2024-01-31" },
      { periodPos: 2, periodDesc: "2° Quadrimestre", beginAt: "2024-02-01", endAt: "2024-06-10" }
    ];

    const demoGrades: Grade[] = [
      { subjectId: 1, subjectDesc: "Matematica", displayValue: "8", decimalValue: 8, evtDate: "2024-03-10T09:00:00Z", notesForFamily: "Ottimo lavoro", color: "green", componentDesc: "Scritto", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 1, subjectDesc: "Matematica", displayValue: "5½", decimalValue: 5.5, evtDate: "2024-02-15T10:00:00Z", notesForFamily: "Studiare di più", color: "red", componentDesc: "Orale", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 2, subjectDesc: "Italiano", displayValue: "7", decimalValue: 7, evtDate: "2024-03-05T11:00:00Z", notesForFamily: "", color: "green", componentDesc: "Scritto", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 2, subjectDesc: "Italiano", displayValue: "9", decimalValue: 9, evtDate: "2024-03-20T08:30:00Z", notesForFamily: "Eccellente", color: "green", componentDesc: "Orale", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 3, subjectDesc: "Inglese", displayValue: "6", decimalValue: 6, evtDate: "2024-03-12T12:00:00Z", notesForFamily: "", color: "green", componentDesc: "Scritto", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 4, subjectDesc: "Storia", displayValue: "7½", decimalValue: 7.5, evtDate: "2024-03-18T09:45:00Z", notesForFamily: "", color: "green", componentDesc: "Orale", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 6, subjectDesc: "SCIENZE MOTORIE E SPORTIVE", displayValue: "7.75", decimalValue: 7.75, evtDate: "2024-03-24T10:00:00Z", notesForFamily: "", color: "green", componentDesc: "Pratico", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 1, subjectDesc: "Matematica", displayValue: "6", decimalValue: 6, evtDate: "2023-11-10T09:00:00Z", notesForFamily: "", color: "green", componentDesc: "Scritto", periodPos: 1, periodDesc: "1° Quadrimestre" },
      { subjectId: 2, subjectDesc: "Italiano", displayValue: "8", decimalValue: 8, evtDate: "2023-12-05T11:00:00Z", notesForFamily: "", color: "green", componentDesc: "Scritto", periodPos: 1, periodDesc: "1° Quadrimestre" },
      { subjectId: 5, subjectDesc: "TECNOLOGIE E PROGETTAZIONE DI SISTEMI INFORMATICI E DI TELECOMUNICAZIONI", displayValue: "9", decimalValue: 9, evtDate: "2024-03-25T11:00:00Z", notesForFamily: "", color: "green", componentDesc: "Scritto", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 5, subjectDesc: "TECNOLOGIE E PROGETTAZIONE DI SISTEMI INFORMATICI E DI TELECOMUNICAZIONI", displayValue: "10", decimalValue: 10, evtDate: "2024-03-24T11:00:00Z", notesForFamily: "", color: "green", componentDesc: "Orale", periodPos: 2, periodDesc: "2° Quadrimestre" },
      { subjectId: 5, subjectDesc: "TECNOLOGIE E PROGETTAZIONE DI SISTEMI INFORMATICI E DI TELECOMUNICAZIONI", displayValue: "9.25", decimalValue: 9.25, evtDate: "2024-03-23T11:00:00Z", notesForFamily: "", color: "green", componentDesc: "Pratico", periodPos: 2, periodDesc: "2° Quadrimestre" },
    ];

    setUser(demoUser);
    setPeriods(demoPeriods);
    setSelectedPeriod(2);
    setGrades(demoGrades);
    setCustomGrades(loadCache<Grade[]>(CACHE_KEYS.customGrades) ?? []);
    localStorage.setItem('cvv_user', JSON.stringify(demoUser));
  };

  const handleLogout = () => {
    setUser(null);
    setGrades([]);
    setCustomGrades([]);
    setLessons([]);
    setAbsences([]);
    setAgendaEvents([]);
    setPeriods([]);
    setSelectedPeriod(null);
    localStorage.removeItem('cvv_user');
    localStorage.removeItem('cvv_credentials');
    // Pulisce anche la cache dati al logout, ma preserva i voti manuali
    Object.values(CACHE_KEYS).forEach((k) => {
      if (k !== CACHE_KEYS.customGrades) {
        localStorage.removeItem(k);
      }
    });
    setUsername('');
    setPassword('');
    setShowLogoutConfirm(false);
  };

  // Load user from local storage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('cvv_user');
      const savedCreds = localStorage.getItem('cvv_credentials');

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.expire) {
            const expireDate = new Date(parsedUser.expire);
            
            if (new Date() >= expireDate) {
              // Token scaduto
              if (savedCreds) {
                // Tentiamo auto-login
                const creds = JSON.parse(atob(savedCreds));
                const response = await fetch(`${API_BASE}/api/classeviva/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(creds),
                });
                
                if (!response.ok) throw new Error('Auto-login fallito');
                
                const data = await response.json();
                setUser(data);
                localStorage.setItem('cvv_user', JSON.stringify(data));
                setCustomGrades(loadCache<Grade[]>(CACHE_KEYS.customGrades) ?? []);
                await fetchAllData(data.ident, data.token);
                return; // Auto-login riuscito, usciamo
              } else {
                // Token scaduto e niente credenziali, forza logout silente
                throw new Error('Token scaduto senza credenziali');
              }
            }
          }
          
          // Token valido o manca la scadenza
          setUser(parsedUser);
          fetchAllData(parsedUser.ident, parsedUser.token);
        } catch (err) {
          console.error("Errore validazione/autologin:", err);
          handleLogout();
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRawError(null);

    try {
      const response = await fetch(`${API_BASE}/api/classeviva/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, cid }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRawError(data.raw);
        throw new Error(data.error || 'Login fallito. Controlla le credenziali.');
      }

      setUser(data);
      localStorage.setItem('cvv_user', JSON.stringify(data));
      if (rememberMe) {
        localStorage.setItem('cvv_credentials', btoa(JSON.stringify({ username, password, cid })));
      } else {
        localStorage.removeItem('cvv_credentials');
      }
      setCustomGrades(loadCache<Grade[]>(CACHE_KEYS.customGrades) ?? []);
      await fetchAllData(data.ident, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (studentId: string, token: string) => {
    setLoading(true);
    const cleanId = studentId.replace(/[^0-9]/g, '');
    
    try {
      const [gradesRes, lessonsRes, absencesRes, periodsRes] = await Promise.all([
        fetch(`${API_BASE}/api/classeviva/grades/${cleanId}`, { headers: { 'Z-Auth-Token': token } }),
        fetch(`${API_BASE}/api/classeviva/proxy/${cleanId}/lessons/today`, { headers: { 'Z-Auth-Token': token } }),
        fetch(`${API_BASE}/api/classeviva/proxy/${cleanId}/absences/details`, { headers: { 'Z-Auth-Token': token } }),
        fetch(`${API_BASE}/api/classeviva/proxy/${cleanId}/periods`, { headers: { 'Z-Auth-Token': token } })
      ]);

      const gradesData = await gradesRes.json();
      const lessonsData = await lessonsRes.json();
      const absencesData = await absencesRes.json();
      const periodsData = await periodsRes.json();

      if (gradesRes.ok) {
        const g = gradesData.grades || [];
        setGrades(g);
        saveCache(CACHE_KEYS.grades, g);
      }
      if (lessonsRes.ok) {
        // Le lezioni cambiano ogni giorno: non ha senso cachare a lungo
        const l = lessonsData.lessons || [];
        setLessons(l);
      }
      if (absencesRes.ok) {
        const a = absencesData.events || absencesData.absences || [];
        setAbsences(a);
        saveCache(CACHE_KEYS.absences, a);
      }
      if (periodsRes.ok) {
        const fetchedPeriods = periodsData.periods || [];
        setPeriods(fetchedPeriods);
        saveCache(CACHE_KEYS.periods, fetchedPeriods);
        const now = new Date();
        const currentPeriod = fetchedPeriods.find((p: Period) => {
          const start = new Date(p.beginAt);
          const end = new Date(p.endAt);
          return now >= start && now <= end;
        });
        if (currentPeriod) {
          setSelectedPeriod(currentPeriod.periodPos);
        } else if (fetchedPeriods.length > 0) {
          setSelectedPeriod(fetchedPeriods[fetchedPeriods.length - 1].periodPos);
        }
      }

    } catch (err: any) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgenda = async (date: Date) => {
    if (!user) return;
    setAgendaLoading(true);
    try {
      const start = new Date(date);
      start.setDate(start.getDate() - 7);
      const end = new Date(date);
      end.setDate(end.getDate() + 7);

      const fStart = `${start.getFullYear()}${(start.getMonth()+1).toString().padStart(2,'0')}${start.getDate().toString().padStart(2,'0')}`;
      const fEnd = `${end.getFullYear()}${(end.getMonth()+1).toString().padStart(2,'0')}${end.getDate().toString().padStart(2,'0')}`;

      const res = await fetch(`${API_BASE}/api/classeviva/proxy/${user.ident.replace(/[^0-9]/g, '')}/agenda/all/${fStart}/${fEnd}`, {
        headers: { 'Z-Auth-Token': user.token }
      });
      if (res.ok) {
        const data = await res.json();
        const evts = data.agenda || [];
        setAgendaEvents(evts);
        saveCache(CACHE_KEYS.agenda, evts);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setAgendaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'agenda') {
      fetchAgenda(selectedAgendaDate);
    }
  }, [activeTab, selectedAgendaDate]);

  // Memoizzato per usePullToRefresh
  const handleRefresh = useCallback(async () => {
    if (!user) return;
    await fetchAllData(user.ident, user.token);
  }, [user]);

  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: handleRefresh,
    disabled: !user || loading,
  });


  const subjectAverages = useMemo(() => {
    const subjects: { [key: string]: Grade[] } = {};
    
    const allGrades = [...grades, ...customGrades];
    const filteredGrades = selectedPeriod 
      ? allGrades.filter(g => g.periodPos === selectedPeriod)
      : allGrades;

    filteredGrades.forEach(grade => {
      if (!subjects[grade.subjectDesc]) {
        subjects[grade.subjectDesc] = [];
      }
      subjects[grade.subjectDesc].push(grade);
    });

    return Object.entries(subjects).map(([subject, grades]) => {
      const validGrades = grades.filter(g => g.decimalValue > 0);
      const sum = validGrades.reduce((acc, g) => acc + g.decimalValue, 0);
      const average = validGrades.length > 0 ? sum / validGrades.length : 0;
      
      return {
        subject,
        average,
        grades: grades.sort((a, b) => new Date(b.evtDate).getTime() - new Date(a.evtDate).getTime())
      };
    }).sort((a, b) => a.subject.localeCompare(b.subject));
  }, [grades, customGrades, selectedPeriod]);

  const totalAverage = useMemo(() => {
    const averages = subjectAverages.filter(s => s.average > 0).map(s => s.average);
    if (averages.length === 0) return 0;
    return averages.reduce((acc, val) => acc + val, 0) / averages.length;
  }, [subjectAverages]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-light)] font-inter flex items-center justify-center p-6 selection:bg-blue-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[var(--color-bg-card)] rounded-[2.5rem] card-shadow overflow-hidden"
          id="login-card"
        >
          <div className="p-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-[var(--color-primary-blue)] rounded-[1.5rem] flex items-center justify-center soft-shadow">
                <GraduationCap className="text-white w-10 h-10" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-[28px] font-extrabold text-center text-[var(--color-text-dark)] leading-tight mb-2 tracking-tight">Klass</h1>
            <p className="text-center text-gray-400 font-bold mb-10 text-[13px]">Accedi con le tue credenziali</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Codice Scuola (Opzionale)</label>
                <input
                  type="text"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  className="w-full px-5 py-4 bg-[var(--color-bg-light)] text-[15px] font-bold text-[var(--color-text-dark)] border-0 rounded-[1.5rem] focus:ring-4 focus:ring-[var(--color-accent-blue)] focus:outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
                  placeholder="es. CP12345"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Codice Utente / Email</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 bg-[var(--color-bg-light)] text-[15px] font-bold text-[var(--color-text-dark)] border-0 rounded-[1.5rem] focus:ring-4 focus:ring-[var(--color-accent-blue)] focus:outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
                  placeholder="es. S1234567X"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-[var(--color-bg-light)] text-[15px] font-bold text-[var(--color-text-dark)] border-0 rounded-[1.5rem] focus:ring-4 focus:ring-[var(--color-accent-blue)] focus:outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-col gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="font-semibold">{error}</span>
                  </div>
                  {rawError && (
                    <div className="text-[10px] font-mono bg-[var(--color-bg-card)]/50 p-2 rounded border border-red-100 dark:border-red-900/50 overflow-auto max-h-20">
                      {rawError}
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex items-center mt-2 mb-2 ml-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[var(--color-primary-blue)] bg-[var(--color-bg-light)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-accent-blue)]"
                />
                <label htmlFor="rememberMe" className="ml-2 text-[12px] font-bold text-gray-400 cursor-pointer select-none">
                  Ricordami (salva credenziali per accessi futuri)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[var(--color-primary-blue)] hover:bg-blue-700 text-white font-extrabold text-[16px] rounded-[1.5rem] soft-shadow transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} strokeWidth={2.5} />}
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-[var(--color-bg-light)]"></div>
                <span className="flex-shrink mx-4 text-gray-300 text-[10px] font-extrabold uppercase tracking-[0.2em]">Oppure</span>
                <div className="flex-grow border-t border-[var(--color-bg-light)]"></div>
              </div>

              <button
                type="button"
                onClick={loadDemoData}
                className="w-full py-4 bg-[var(--color-bg-light)] text-[var(--color-text-dark)] font-extrabold text-[15px] rounded-[1.5rem] hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Prova la Demo
              </button>
            </form>
          </div>
          <div className="bg-[var(--color-bg-light)] p-5 text-center">
            <p className="text-[11px] font-bold text-gray-400">Questa app non è affiliata a Spaggiari</p>
          </div>
        </motion.div>
        <PWAInstallPrompt />
        <ReloadPrompt />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] pb-28 relative font-inter selection:bg-blue-100">
      {/* Pull-to-refresh indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{
          transform: `translateY(${isRefreshing ? 56 : pullDistance - 8}px)`,
          opacity: isRefreshing ? 1 : Math.min(pullDistance / 72, 1),
          transition: pullDistance === 0 ? 'transform 0.3s ease, opacity 0.3s ease' : 'none',
        }}
      >
        <div className="w-10 h-10 bg-[var(--color-bg-card)] rounded-full card-shadow flex items-center justify-center">
          <Loader2
            size={18}
            className={`text-[var(--color-primary-blue)] ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${pullDistance * 3}deg)`,
            }}
          />
        </div>
      </div>
      {/* Header */}
      <header className="px-8 pt-16 pb-6 flex items-start justify-between">
        <div>
          <h2 className="text-[32px] font-extrabold text-[var(--color-text-dark)] leading-tight tracking-tight">Ciao {user.firstName},</h2>
          <p className="text-sm font-semibold text-gray-400 mt-1 tracking-wide">Ecco il tuo {activeTab === 'lessons' ? 'orario settimanale' : activeTab === 'grades' ? 'riepilogo' : activeTab === 'agenda' ? 'registro agenda' : 'registro presenze'}</p>
        </div>
        <div className="text-right flex items-center justify-end gap-3">
          <p className="text-[13px] font-bold text-[#3551E5] whitespace-nowrap">{new Date().toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Summary Stats */}
        <AnimatePresence mode="wait">
          {activeTab === 'grades' && (
            <motion.div 
              key="grades-stats"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              <div className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)] rounded-2xl flex items-center justify-center mb-3">
                  <Calculator size={18} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold text-[var(--color-text-dark)] leading-none mb-1">{totalAverage.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Media</span>
              </div>
              <div className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)] rounded-2xl flex items-center justify-center mb-3">
                  <Clock size={18} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold text-[var(--color-text-dark)] leading-none mb-1">{lessons.length}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lezioni</span>
              </div>
              <div className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)] rounded-2xl flex items-center justify-center mb-3">
                  <UserX size={18} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold text-[var(--color-text-dark)] leading-none mb-1">{absences.length}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Assenze</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'agenda' && (
            <motion.div 
              key="agenda-stats"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 mb-8"
            >
              <div className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)] rounded-2xl flex items-center justify-center mb-3">
                  <BookOpen size={18} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold text-[var(--color-text-dark)] leading-none mb-1">
                  {agendaEvents.filter(e => {
                    const compareDate = new Date(selectedAgendaDate);
                    compareDate.setHours(0,0,0,0);
                    const s = new Date(e.evtDatetimeBegin); s.setHours(0,0,0,0);
                    const en = new Date(e.evtDatetimeEnd); en.setHours(0,0,0,0);
                    return compareDate >= s && compareDate <= en;
                  }).length}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Eventi in questa data</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'lessons' && (
            <motion.div 
              key="lessons-stats"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 mb-8"
            >
              <div className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)] rounded-2xl flex items-center justify-center mb-3">
                  <Clock size={18} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold text-[var(--color-text-dark)] leading-none mb-1">{lessons.length}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lezioni di oggi</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'absences' && (
            <motion.div 
              key="absences-stats"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 mb-8"
            >
              <div className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)] rounded-2xl flex items-center justify-center mb-3">
                  <UserX size={18} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold text-[var(--color-text-dark)] leading-none mb-1">{absences.length}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Assenze totali</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'grades' && (
          <div className="space-y-6">
            {/* Period Selector */}
            {periods.length > 1 && (
              <div className="flex bg-[var(--color-bg-light)] p-1.5 rounded-[2rem] card-shadow mb-6">
                {periods.map((period) => (
                  <button
                    key={period.periodPos}
                    onClick={() => setSelectedPeriod(period.periodPos)}
                    className={`flex-1 py-3 px-4 rounded-[1.5rem] text-[11px] font-extrabold uppercase tracking-widest transition-all ${
                      selectedPeriod === period.periodPos
                        ? 'bg-[var(--color-primary-blue)] text-white soft-shadow'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {period.periodDesc}
                  </button>
                ))}
              </div>
            )}

            {!loading && subjectAverages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--color-bg-card)] p-6 rounded-[2.5rem] card-shadow flex flex-col items-center"
              >
                 <h3 className="text-[16px] font-extrabold text-[var(--color-text-dark)] mb-8">Andamento medie</h3>
                 <div className="flex items-end justify-center gap-4 h-32 w-full px-2 mt-4">
                    {subjectAverages.slice(0, 7).map(s => (
                       <div key={s.subject} className="flex flex-col items-center gap-3 flex-1 max-w-[40px]">
                          <div className="w-4 sm:w-6 rounded-full bg-[var(--color-bg-light)] h-28 relative flex items-end">
                             <div className="w-full rounded-full bg-[var(--color-primary-blue)] transition-all duration-1000 origin-bottom" style={{ height: `${(s.average / 10) * 100}%` }}></div>
                          </div>
                          <span className="text-[10px] font-extrabold text-[var(--color-text-dark)] origin-top text-center truncate w-full">{s.subject.substring(0,3)}</span>
                       </div>
                    ))}
                 </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-2">Materie</h3>
            </div>
            
            <div className="space-y-4">
              {loading && grades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <p className="font-bold text-sm">Caricamento...</p>
                </div>
              ) : subjectAverages.length === 0 ? (
                <div className="bg-[var(--color-bg-card)] p-8 rounded-[2rem] card-shadow text-center text-gray-400 font-bold">
                  Nessun voto registrato in questo periodo.
                </div>
              ) : subjectAverages.map((subject, idx) => {
                const validGrades = subject.grades.filter(g => g.decimalValue > 0);
                const n = validGrades.length;
                const sum = validGrades.reduce((acc, g) => acc + g.decimalValue, 0);
                const requiredFor6 = 6 * (n + 1) - sum;

                return (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedSubject(selectedSubject === subject.subject ? null : subject.subject)}
                  className="bg-[var(--color-bg-card)] rounded-[2rem] card-shadow overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-3 h-12 rounded-full shrink-0 ${subject.average >= 6 ? 'bg-[var(--color-primary-blue)]' : 'bg-red-400'}`} />
                      <div className="min-w-0">
                        <h4 className={`font-extrabold text-[16px] text-[var(--color-text-dark)] leading-tight mb-1 ${selectedSubject === subject.subject ? '' : 'line-clamp-3'}`} title={subject.subject}>
                          {selectedSubject === subject.subject ? subject.subject : getSubjectDisplayName(subject.subject)}
                        </h4>
                        <p className="text-[12px] font-bold text-gray-400">{subject.grades.length} voti registrati</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className={`text-[22px] font-extrabold block ${subject.average >= 6 ? 'text-[var(--color-text-dark)]' : 'text-red-500 dark:text-red-400'}`}>
                          {subject.average > 0 ? subject.average.toFixed(2) : '-'}
                        </span>
                        {subject.average > 0 && subject.average < 6 && (
                          <div className="text-[12px] font-extrabold text-red-400 mt-1.5 max-w-[130px] leading-tight">
                            {requiredFor6 <= 10 
                              ? `Serve ~${Math.max(1, requiredFor6).toFixed(1).replace('.0', '')} per il 6` 
                              : 'Più voti necessari per il 6'}
                          </div>
                        )}
                        {subject.average >= 6 && (
                          <div className="text-[12px] font-extrabold text-[#1abc9c] mt-1.5 max-w-[130px] leading-tight">
                            {requiredFor6 <= 10
                              ? `Non prendere meno di ${Math.max(1, requiredFor6).toFixed(1).replace('.0', '')}`
                              : 'Più voti necessari per il 6'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedSubject === subject.subject && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[var(--color-bg-light)] overflow-hidden"
                      >
                        <div className="p-5 space-y-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setGradeModalSubject(subject.subject);
                              setGradeModalValue('');
                            }}
                            className="w-full py-3 bg-[var(--color-bg-card)] text-[var(--color-primary-blue)] font-extrabold text-[13px] rounded-[1.5rem] card-shadow flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-blue-100 dark:border-blue-800"
                          >
                            <Plus size={16} strokeWidth={3} /> Aggiungi voto manuale
                          </button>
                          {subject.grades.map((grade, gIdx) => (
                            <div key={gIdx} className={`flex flex-col gap-3 p-4 rounded-[1.5rem] card-shadow relative ${grade.isCustom ? 'bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800' : 'bg-[var(--color-bg-card)]'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-extrabold text-[18px] ${
                                    grade.decimalValue >= 6 ? 'bg-[var(--color-accent-blue)] text-[var(--color-primary-blue)]' : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                  }`}>
                                    {grade.displayValue}
                                  </div>
                                  <div>
                                    <p className="text-[14px] font-extrabold text-[var(--color-text-dark)] mb-0.5">{grade.componentDesc || 'Voto'}</p>
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                                      <Calendar size={12} className="text-gray-300" />
                                      <span>{new Date(grade.evtDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                  </div>
                                </div>
                                {grade.isCustom && (
                                  <button
                                    onClick={(e) => {
                                      setCustomGrades(prev => {
                                        const next = prev.filter(g => g.customId !== grade.customId);
                                        saveCache(CACHE_KEYS.customGrades, next);
                                        return next;
                                      });
                                    }}
                                    className="flex items-center gap-1.5 p-2 px-3 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors shrink-0"
                                  >
                                    <Trash2 size={16} />
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider hidden sm:inline">Elimina</span>
                                  </button>
                                )}
                              </div>
                              {grade.notesForFamily && (
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-[1rem] text-[12px] font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                                  {grade.notesForFamily}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-2">Agenda</h3>
            <div className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest">{selectedAgendaDate.getFullYear()}</span>
                <span className="text-[18px] font-extrabold text-[var(--color-primary-blue)] tracking-tight capitalize">
                  {selectedAgendaDate.toLocaleString('it-IT', { month: 'long' })}
                </span>
              </div>
              <div 
                ref={agendaScrollRef} 
                className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pt-2 pb-4 snap-x smooth-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ paddingLeft: 'calc(50% - 24px)', paddingRight: 'calc(50% - 24px)' }}
              >
                {Array.from({length: 120}).map((_, i) => {
                   const d = new Date();
                   d.setDate(d.getDate() - 30 + i);
                   const isSelected = d.toDateString() === selectedAgendaDate.toDateString();
                   return (
                     <button
                       key={i}
                       data-selected={isSelected}
                       onClick={(e) => {
                         setSelectedAgendaDate(d);
                         e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                       }}
                       className={`relative flex-shrink-0 w-12 h-16 rounded-2xl flex flex-col items-center justify-center transition-all snap-center ${
                         isSelected ? 'text-[var(--color-primary-blue)] scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-105'
                       }`}
                     >
                       {isSelected && (
                         <motion.div 
                           layoutId="agenda-date-bubble"
                           className="absolute inset-0 bg-blue-50 dark:bg-blue-900/40 rounded-2xl border border-blue-100 dark:border-blue-800 soft-shadow"
                           transition={{ type: "spring", stiffness: 300, damping: 25 }}
                           style={{ zIndex: 0 }}
                         />
                       )}
                       <span className="relative z-10 text-[10px] font-bold uppercase mb-0.5">{d.toLocaleDateString('it-IT', { weekday: 'short' }).replace(/\./g, '')}</span>
                       <span className={`relative z-10 text-[18px] font-extrabold`}>{d.getDate()}</span>
                     </button>
                   );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {agendaLoading && agendaEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <p className="font-bold text-sm">Caricamento agenda...</p>
                </div>
              ) : agendaEvents.filter(e => {
                const edStart = new Date(e.evtDatetimeBegin);
                const edEnd = new Date(e.evtDatetimeEnd);
                const compareDate = new Date(selectedAgendaDate);
                compareDate.setHours(0,0,0,0);
                const s = new Date(edStart); s.setHours(0,0,0,0);
                const en = new Date(edEnd); en.setHours(0,0,0,0);
                return compareDate >= s && compareDate <= en;
              }).length === 0 ? (
                <div className="bg-[var(--color-bg-card)] p-8 rounded-[2rem] card-shadow text-center text-gray-400 font-bold">
                  Nessun evento in agenda per questa data.
                </div>
              ) : agendaEvents
                  .filter(e => {
                    const edStart = new Date(e.evtDatetimeBegin);
                    const edEnd = new Date(e.evtDatetimeEnd);
                    const compareDate = new Date(selectedAgendaDate);
                    compareDate.setHours(0,0,0,0);
                    const s = new Date(edStart); s.setHours(0,0,0,0);
                    const en = new Date(edEnd); en.setHours(0,0,0,0);
                    return compareDate >= s && compareDate <= en;
                  })
                  .map((evt, idx) => (
                    <motion.div
                      key={evt.evtId}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <AgendaCard evt={evt} />
                    </motion.div>
                  ))
              }
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-2">Lezioni di Oggi ({lessons.length})</h3>
            <div className="space-y-4">
              {lessons.length === 0 ? (
                <div className="bg-[var(--color-bg-card)] p-8 rounded-[2rem] card-shadow text-center text-gray-400">
                  Nessuna lezione registrata per oggi.
                </div>
              ) : lessons.map((lesson, idx) => (
                <motion.div
                  key={lesson.lessonId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex items-start relative overflow-hidden"
                >
                  <div className="flex gap-4 items-center w-full">
                    <div className="text-center w-14 shrink-0">
                       <p className="text-[15px] font-extrabold text-[var(--color-text-dark)] leading-none mb-1">08:00</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">AM</p>
                    </div>
                    <div className="w-[2px] h-10 bg-[var(--color-bg-light)] rounded-full shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-[15px] text-[var(--color-text-dark)] leading-tight mb-1 truncate">{lesson.subjectDesc}</h4>
                      <div className="text-[12px] font-bold text-gray-400 flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block shrink-0"></span> {lesson.lessonType || 'Standard'}
                      </div>
                      <div className="text-[12px] font-bold text-gray-400 mt-1 flex items-center gap-1.5 truncate">
                        <UserX size={12} className="shrink-0 text-gray-300" /> {lesson.teacherDesc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'absences' && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-2">Assenze e Ritardi ({absences.length})</h3>
            <div className="space-y-4">
              {absences.length === 0 ? (
                <div className="bg-[var(--color-bg-card)] p-8 rounded-[2rem] card-shadow text-center text-gray-400 font-bold">
                  Nessuna assenza registrata.
                </div>
              ) : absences.map((absence, idx) => (
                <motion.div
                  key={absence.evtId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[var(--color-bg-card)] p-5 rounded-[2rem] card-shadow flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-extrabold text-[15px] text-[var(--color-text-dark)] leading-tight mb-1 truncate">{absence.evtDesc}</h4>
                    <p className="text-[12px] font-bold text-gray-400 flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-300" />
                      {new Date(absence.evtDate).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                    absence.isJustified ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                  }`}>
                    {absence.isJustified ? 'Giustificata' : 'Da Giustificare'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg-card)] rounded-t-[2.5rem] px-8 pt-6 pb-8 flex justify-between items-center soft-shadow z-50">
        <button 
          onClick={() => setActiveTab('grades')}
          className="relative p-2 transition-transform active:scale-95"
        >
          <TrendingUp size={26} className={activeTab === 'grades' ? 'text-[var(--color-primary-blue)]' : 'text-gray-300'} strokeWidth={activeTab === 'grades' ? 2.5 : 2} />
          {activeTab === 'grades' && <motion.div layoutId="nav-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--color-primary-blue)] rounded-full"></motion.div>}
        </button>
        <button 
          onClick={() => setActiveTab('agenda')}
          className="relative p-2 transition-transform active:scale-95"
        >
          <BookOpen size={26} className={activeTab === 'agenda' ? 'text-[var(--color-primary-blue)]' : 'text-gray-300'} strokeWidth={activeTab === 'agenda' ? 2.5 : 2} />
          {activeTab === 'agenda' && <motion.div layoutId="nav-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--color-primary-blue)] rounded-full"></motion.div>}
        </button>
        <button 
          onClick={() => setActiveTab('lessons')}
          className="relative p-2 transition-transform active:scale-95"
        >
          <Calendar size={26} className={activeTab === 'lessons' ? 'text-[var(--color-primary-blue)]' : 'text-gray-300'} strokeWidth={activeTab === 'lessons' ? 2.5 : 2} />
          {activeTab === 'lessons' && <motion.div layoutId="nav-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--color-primary-blue)] rounded-full"></motion.div>}
        </button>
        <button 
          onClick={() => setActiveTab('absences')}
          className="relative p-2 transition-transform active:scale-95"
        >
          <UserX size={26} className={activeTab === 'absences' ? 'text-[var(--color-primary-blue)]' : 'text-gray-300'} strokeWidth={activeTab === 'absences' ? 2.5 : 2} />
          {activeTab === 'absences' && <motion.div layoutId="nav-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--color-primary-blue)] rounded-full"></motion.div>}
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className="relative p-2 text-gray-300 hover:text-[var(--color-text-dark)] transition-transform active:scale-95"
        >
          <Settings size={26} strokeWidth={2} />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-[var(--color-bg-card)] rounded-[2rem] p-6 shadow-2xl dark:border dark:border-gray-800"
            >
              <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-[1.2rem] flex items-center justify-center mb-4 mx-auto">
                <LogOut size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-[20px] font-extrabold text-center text-[var(--color-text-dark)] mb-2">
                Vuoi uscire?
              </h3>
              <p className="text-[14px] text-center text-gray-500 dark:text-gray-400 font-bold mb-6 leading-relaxed">
                Dovrai inserire nuovamente le tue credenziali per accedere ai tuoi dati.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3.5 bg-[var(--color-bg-light)] text-[var(--color-text-dark)] font-extrabold text-[15px] rounded-[1.2rem] hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-[0.98]"
                >
                  Annulla
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[15px] rounded-[1.2rem] transition-transform active:scale-[0.98] shadow-lg shadow-red-500/30"
                >
                  Esci
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Grade Modal */}
      <AnimatePresence>
        {gradeModalSubject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
               onClick={() => setGradeModalSubject(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[var(--color-bg-card)] rounded-[2rem] p-6 shadow-2xl dark:border dark:border-gray-800"
            >
              <h3 className="text-[18px] font-extrabold text-center text-[var(--color-text-dark)] mb-6">
                Aggiungi voto a {gradeModalSubject}
              </h3>
              <input
                type="number"
                step="0.25"
                value={gradeModalValue}
                onChange={(e) => setGradeModalValue(e.target.value.replace(',', '.'))}
                className="w-full px-5 py-4 mb-6 bg-[var(--color-bg-light)] text-[24px] text-center font-bold text-[var(--color-text-dark)] border-0 rounded-[1.5rem] focus:ring-4 focus:ring-[var(--color-accent-blue)] focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="es. 7.5"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setGradeModalSubject(null)}
                  className="flex-1 py-3.5 bg-[var(--color-bg-light)] text-[var(--color-text-dark)] font-extrabold text-[15px] rounded-[1.2rem] hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-[0.98]"
                >
                  Annulla
                </button>
                <button
                  onClick={() => {
                    const val = parseFloat(gradeModalValue);
                    if (isNaN(val) || val <= 0 || val > 10) {
                      alert("Inserisci un voto valido (es. compreso tra 1 e 10)");
                      return;
                    }
                    const period = periods.find(p => p.periodPos === selectedPeriod);
                    const subjectData = subjectAverages.find(s => s.subject === gradeModalSubject);
                    const newGrade: Grade = {
                      subjectId: subjectData?.grades[0]?.subjectId || 0,
                      subjectDesc: gradeModalSubject,
                      displayValue: val.toString(),
                      decimalValue: val,
                      evtDate: new Date().toISOString(),
                      notesForFamily: "Voto aggiunto manualmente",
                      color: val >= 6 ? "green" : "red",
                      componentDesc: "Voto manuale",
                      periodPos: selectedPeriod || 1,
                      periodDesc: period?.periodDesc || "Manuale",
                      isCustom: true,
                      customId: Math.random().toString(36).substring(7)
                    };
                    setCustomGrades(prev => {
                      const next = [...prev, newGrade];
                      saveCache(CACHE_KEYS.customGrades, next);
                      return next;
                    });
                    setGradeModalSubject(null);
                  }}
                  className="flex-1 py-3.5 bg-[var(--color-primary-blue)] hover:bg-blue-700 text-white font-extrabold text-[15px] rounded-[1.2rem] transition-transform active:scale-[0.98] shadow-lg shadow-blue-500/30"
                >
                  Aggiungi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onLogoutClick={() => setShowLogoutConfirm(true)} 
      />

      <ChangelogModal />
      <PWAInstallPrompt />
      <ReloadPrompt />
    </div>
  );
}
