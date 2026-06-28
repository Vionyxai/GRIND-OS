import { useState, useEffect, useCallback } from 'react';
import { Routine, Pillar, TabName } from './types';
import { BottomNav } from './components/BottomNav';
import { Today } from './pages/Today';
import { Pillars } from './pages/Pillars';
import { Stats } from './pages/Stats';
import { LevelUp } from './pages/LevelUp';
import { Settings } from './pages/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDailyLog } from './hooks/useDailyLog';
import { useGamification } from './hooks/useGamification';
import { KEYS } from './utils/storage';
import { DEFAULT_PILLARS } from './data/pillars';
import { DEFAULT_ROUTINES } from './data/defaultRoutines';
import { getTodayString } from './utils/dates';

const DEFAULT_PROFILE = {
  name: 'Grinder',
  level: 1,
  totalXP: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: '',
  streakFrozen: false,
  badges: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('today');
  const [pillars, setPillars] = useLocalStorage<Pillar[]>(KEYS.PILLARS, DEFAULT_PILLARS);
  const [routines, setRoutines] = useLocalStorage<Routine[]>(KEYS.ROUTINES, DEFAULT_ROUTINES);
  const { profile, setProfile, checkBadges, updateStreak } = useGamification();

  // Initialize on first launch
  useEffect(() => {
    const initialized = localStorage.getItem(KEYS.INITIALIZED);
    if (!initialized) {
      localStorage.setItem(KEYS.PILLARS, JSON.stringify(DEFAULT_PILLARS));
      localStorage.setItem(KEYS.ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(KEYS.LOGS, JSON.stringify([]));
      localStorage.setItem(KEYS.INITIALIZED, 'true');
    }
  }, []);

  // Migrate: add Leisure & Play pillar for existing users who don't have it
  useEffect(() => {
    setPillars((prev) => {
      if (prev.find((p) => p.id === 'leisure')) return prev;
      return [...prev, { id: 'leisure', name: 'Leisure & Play', color: '#FF9F1C' }];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get weekly avg completion for momentum calculation
  const getWeeklyAvgCompletion = useCallback(() => {
    try {
      const logs = JSON.parse(localStorage.getItem(KEYS.LOGS) ?? '[]') as Array<{
        date: string;
        completedRoutineIds: string[];
      }>;
      const activeCount = routines.filter((r) => r.isActive).length;
      if (activeCount === 0) return 0;

      const today = getTodayString();
      const last7: string[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today + 'T00:00:00');
        d.setDate(d.getDate() - i);
        last7.push(d.toISOString().slice(0, 10));
      }

      const totalCompleted = last7.reduce((sum, date) => {
        const log = logs.find((l) => l.date === date);
        return sum + (log?.completedRoutineIds.length ?? 0);
      }, 0);

      return totalCompleted / (activeCount * 7);
    } catch {
      return 0;
    }
  }, [routines]);

  const activeRoutines = routines.filter((r) => r.isActive);
  const weeklyAvg = getWeeklyAvgCompletion();

  const { todayLog, logs, completeRoutine, uncompleteRoutine, isCompleted } = useDailyLog(
    activeRoutines,
    profile.currentStreak,
    weeklyAvg
  );

  // Sync XP and badges when today's log changes
  useEffect(() => {
    // Update streak
    updateStreak(logs);
    // Check badges
    checkBadges(logs, routines);
  }, [todayLog.completedRoutineIds.length, logs, routines, updateStreak, checkBadges]);

  // Keep profile XP in sync with today's earned XP
  useEffect(() => {
    // Calculate total XP from all logs
    const totalXP = logs.reduce((sum, log) => sum + log.xpEarned, 0);
    setProfile((prev) => {
      if (prev.totalXP !== totalXP) {
        return { ...prev, totalXP };
      }
      return prev;
    });
  }, [logs, setProfile]);

  const handleToggleRoutine = useCallback(
    (routineId: string) => {
      if (isCompleted(routineId)) {
        uncompleteRoutine(routineId);
      } else {
        completeRoutine(routineId);
      }
    },
    [isCompleted, uncompleteRoutine, completeRoutine]
  );

  const handleAddRoutine = useCallback(
    (data: Omit<Routine, 'id' | 'createdAt'>) => {
      const newRoutine: Routine = {
        ...data,
        id: `routine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      setRoutines((prev) => [...prev, newRoutine]);
    },
    [setRoutines]
  );

  const handleEditRoutine = useCallback(
    (routineId: string, updates: Omit<Routine, 'id' | 'createdAt'>) => {
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === routineId
            ? { ...r, ...updates }
            : r
        )
      );
    },
    [setRoutines]
  );

  const handleDeleteRoutine = useCallback(
    (routineId: string) => {
      setRoutines((prev) => prev.filter((r) => r.id !== routineId));
    },
    [setRoutines]
  );

  const handleClearPillar = useCallback(
    (pillarId: string) => {
      setRoutines((prev) => prev.filter((r) => r.pillarId !== pillarId));
    },
    [setRoutines]
  );

  const handleDataReset = useCallback(() => {
    window.location.reload();
  }, []);

  const handleDataImport = useCallback(() => {
    window.location.reload();
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'today':
        return (
          <Today
            routines={routines}
            pillars={pillars}
            todayLog={todayLog}
            logs={logs}
            profile={profile}
            onToggleRoutine={handleToggleRoutine}
          />
        );
      case 'pillars':
        return (
          <Pillars
            pillars={pillars}
            routines={routines}
            logs={logs}
            completedIds={todayLog.completedRoutineIds}
            onToggleRoutine={handleToggleRoutine}
            onAddRoutine={handleAddRoutine}
            onEditRoutine={handleEditRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onClearPillar={handleClearPillar}
          />
        );
      case 'stats':
        return <Stats logs={logs} routines={routines} pillars={pillars} />;
      case 'levelup':
        return <LevelUp profile={profile} logs={logs} routines={routines} />;
      case 'settings':
        return <Settings onDataReset={handleDataReset} onDataImport={handleDataImport} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: '#0A0A0F', maxWidth: '640px', margin: '0 auto' }}
    >
      {/* Page content with bottom padding for nav */}
      <div
        style={{
          paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {renderPage()}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
