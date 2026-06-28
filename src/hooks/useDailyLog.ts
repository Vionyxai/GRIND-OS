import { useCallback } from 'react';
import { DailyLog, Routine } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { KEYS } from '../utils/storage';
import { getTodayString } from '../utils/dates';
import { XP_VALUES } from '../utils/xp';
import { calculateMomentum } from '../utils/momentum';

function createEmptyLog(date: string): DailyLog {
  return {
    id: `log-${date}`,
    date,
    completedRoutineIds: [],
    xpEarned: 0,
    momentumScore: 0,
  };
}

export function useDailyLog(
  activeRoutines: Routine[],
  currentStreak: number,
  weeklyAvgCompletion: number
) {
  const today = getTodayString();
  const [logs, setLogs] = useLocalStorage<DailyLog[]>(KEYS.LOGS, []);

  const todayLog: DailyLog = logs.find((l) => l.date === today) ?? createEmptyLog(today);

  const saveTodayLog = useCallback(
    (updated: DailyLog) => {
      setLogs((prev) => {
        const filtered = prev.filter((l) => l.date !== today);
        return [...filtered, updated];
      });
    },
    [setLogs, today]
  );

  const completeRoutine = useCallback(
    (routineId: string) => {
      if (todayLog.completedRoutineIds.includes(routineId)) return;

      const routine = activeRoutines.find((r) => r.id === routineId);
      const xpGain = routine ? XP_VALUES[routine.difficulty] : 0;

      const newCompleted = [...todayLog.completedRoutineIds, routineId];
      const newXP = todayLog.xpEarned + xpGain;
      const momentum = calculateMomentum(
        newCompleted.length,
        activeRoutines.length,
        currentStreak,
        weeklyAvgCompletion
      );

      saveTodayLog({
        ...todayLog,
        completedRoutineIds: newCompleted,
        xpEarned: newXP,
        momentumScore: momentum,
      });
    },
    [todayLog, activeRoutines, currentStreak, weeklyAvgCompletion, saveTodayLog]
  );

  const uncompleteRoutine = useCallback(
    (routineId: string) => {
      if (!todayLog.completedRoutineIds.includes(routineId)) return;

      const routine = activeRoutines.find((r) => r.id === routineId);
      const xpLoss = routine ? XP_VALUES[routine.difficulty] : 0;

      const newCompleted = todayLog.completedRoutineIds.filter((id) => id !== routineId);
      const newXP = Math.max(0, todayLog.xpEarned - xpLoss);
      const momentum = calculateMomentum(
        newCompleted.length,
        activeRoutines.length,
        currentStreak,
        weeklyAvgCompletion
      );

      saveTodayLog({
        ...todayLog,
        completedRoutineIds: newCompleted,
        xpEarned: newXP,
        momentumScore: momentum,
      });
    },
    [todayLog, activeRoutines, currentStreak, weeklyAvgCompletion, saveTodayLog]
  );

  const isCompleted = useCallback(
    (routineId: string) => todayLog.completedRoutineIds.includes(routineId),
    [todayLog.completedRoutineIds]
  );

  return { todayLog, logs, completeRoutine, uncompleteRoutine, isCompleted };
}
