import { Routine, DailyLog } from '../types';

export const XP_VALUES: Record<Routine['difficulty'], number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export interface LevelDefinition {
  level: number;
  xpRequired: number;
  title: string;
}

export const LEVELS: LevelDefinition[] = [
  { level: 1, xpRequired: 0, title: 'Rookie' },
  { level: 2, xpRequired: 500, title: 'Grinder' },
  { level: 3, xpRequired: 1500, title: 'Consistent' },
  { level: 4, xpRequired: 3500, title: 'Locked In' },
  { level: 5, xpRequired: 7500, title: 'Elite' },
  { level: 6, xpRequired: 15000, title: 'Legend' },
  { level: 7, xpRequired: 30000, title: 'Untouchable' },
];

export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number; // 0-1
}

export function getLevelInfo(totalXP: number): LevelInfo {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[Math.min(i + 1, LEVELS.length - 1)];
      break;
    }
  }

  const isMaxLevel = currentLevel.level === LEVELS[LEVELS.length - 1].level;

  if (isMaxLevel) {
    return {
      level: currentLevel.level,
      title: currentLevel.title,
      currentXP: totalXP,
      nextLevelXP: currentLevel.xpRequired,
      progress: 1,
    };
  }

  const xpInCurrentLevel = totalXP - currentLevel.xpRequired;
  const xpNeededForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = Math.min(xpInCurrentLevel / xpNeededForNextLevel, 1);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXP: totalXP,
    nextLevelXP: nextLevel.xpRequired,
    progress,
  };
}

export function calculateXP(completedRoutines: Routine[]): number {
  return completedRoutines.reduce((total, routine) => {
    return total + (XP_VALUES[routine.difficulty] ?? 0);
  }, 0);
}

// Returns completion-rate-based difficulty after enough data points (min 5 historical logs)
// Rate >= 75% -> easy (you've mastered it), 35-75% -> medium, < 35% -> hard (reward the struggle)
export function getAdaptedDifficulty(
  routineId: string,
  createdAt: string,
  logs: DailyLog[],
  fallback: Routine['difficulty'],
  todayDate: string
): Routine['difficulty'] {
  const createdDate = createdAt.slice(0, 10);
  const historicalLogs = logs
    .filter((l) => l.date !== todayDate && l.date >= createdDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  if (historicalLogs.length < 5) return fallback;

  const completions = historicalLogs.filter((l) =>
    l.completedRoutineIds.includes(routineId)
  ).length;
  const rate = completions / historicalLogs.length;

  if (rate >= 0.75) return 'easy';
  if (rate >= 0.35) return 'medium';
  return 'hard';
}

// Compute a completion rate (0-1) for a routine over the last N historical logs
export function getRoutineCompletionRate(
  routineId: string,
  createdAt: string,
  logs: DailyLog[],
  todayDate: string,
  maxLogs = 30
): number | null {
  const createdDate = createdAt.slice(0, 10);
  const historicalLogs = logs
    .filter((l) => l.date !== todayDate && l.date >= createdDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-maxLogs);

  if (historicalLogs.length < 5) return null;

  const completions = historicalLogs.filter((l) =>
    l.completedRoutineIds.includes(routineId)
  ).length;
  return completions / historicalLogs.length;
}
