import { useCallback } from 'react';
import { DailyLog, Routine } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { KEYS } from '../utils/storage';
import { getTodayString } from '../utils/dates';
import { XP_VALUES, getAdaptedDifficulty } from '../utils/xp';
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

  const getLogForDate = useCallback(
    (date: string): DailyLog => logs.find((l) => l.date === date) ?? createEmptyLog(date),
    [logs]
  );

  const saveLogForDate = useCallback(
    (date: string, updated: DailyLog) => {
      setLogs((prev) => {
        const filtered = prev.filter((l) => l.date !== date);
        return [...filtered, updated];
      });
    },
    [setLogs]
  );

  // targetDate defaults to today so the UI's own calls are unaffected; the
  // LearningAI activity feed is the only caller that passes an explicit
  // (possibly past) date, to backfill a completion on the day it actually
  // happened rather than whatever day GRIND OS happens to be opened.
  const completeRoutine = useCallback(
    (routineId: string, targetDate: string = today) => {
      const log = getLogForDate(targetDate);
      if (log.completedRoutineIds.includes(routineId)) return;

      const routine = activeRoutines.find((r) => r.id === routineId);
      const adapted = routine
        ? getAdaptedDifficulty(routine.id, routine.createdAt, logs, routine.difficulty, targetDate)
        : 'easy';
      const xpGain = XP_VALUES[adapted];

      const newCompleted = [...log.completedRoutineIds, routineId];
      const newXP = log.xpEarned + xpGain;
      const momentum = calculateMomentum(
        newCompleted.length,
        activeRoutines.length,
        currentStreak,
        weeklyAvgCompletion
      );

      saveLogForDate(targetDate, {
        ...log,
        completedRoutineIds: newCompleted,
        xpEarned: newXP,
        momentumScore: momentum,
      });
    },
    [today, getLogForDate, activeRoutines, currentStreak, weeklyAvgCompletion, saveLogForDate, logs]
  );

  const uncompleteRoutine = useCallback(
    (routineId: string, targetDate: string = today) => {
      const log = getLogForDate(targetDate);
      if (!log.completedRoutineIds.includes(routineId)) return;

      const routine = activeRoutines.find((r) => r.id === routineId);
      const adapted = routine
        ? getAdaptedDifficulty(routine.id, routine.createdAt, logs, routine.difficulty, targetDate)
        : 'easy';
      const xpLoss = XP_VALUES[adapted];

      const newCompleted = log.completedRoutineIds.filter((id) => id !== routineId);
      const newXP = Math.max(0, log.xpEarned - xpLoss);
      const momentum = calculateMomentum(
        newCompleted.length,
        activeRoutines.length,
        currentStreak,
        weeklyAvgCompletion
      );

      saveLogForDate(targetDate, {
        ...log,
        completedRoutineIds: newCompleted,
        xpEarned: newXP,
        momentumScore: momentum,
      });
    },
    [today, getLogForDate, activeRoutines, currentStreak, weeklyAvgCompletion, saveLogForDate, logs]
  );

  const isCompleted = useCallback(
    (routineId: string) => todayLog.completedRoutineIds.includes(routineId),
    [todayLog.completedRoutineIds]
  );

  return { todayLog, logs, completeRoutine, uncompleteRoutine, isCompleted };
}
