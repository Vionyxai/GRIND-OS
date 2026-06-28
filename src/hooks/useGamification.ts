import { useCallback } from 'react';
import { UserProfile, Badge, DailyLog, Routine } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { KEYS } from '../utils/storage';
import { getTodayString, daysBetween, getPreviousDay } from '../utils/dates';
import { getLevelInfo } from '../utils/xp';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Grinder',
  level: 1,
  totalXP: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: '',
  streakFrozen: false,
  badges: [],
};

export function useGamification() {
  const [profile, setProfile] = useLocalStorage<UserProfile>(KEYS.PROFILE, DEFAULT_PROFILE);

  const addXP = useCallback(
    (amount: number) => {
      setProfile((prev) => {
        const newTotalXP = prev.totalXP + amount;
        const levelInfo = getLevelInfo(newTotalXP);
        return {
          ...prev,
          totalXP: newTotalXP,
          level: levelInfo.level,
        };
      });
    },
    [setProfile]
  );

  const updateStreak = useCallback(
    (logs: DailyLog[]) => {
      const today = getTodayString();
      const yesterday = getPreviousDay(today);

      // Find logs with at least 1 completion
      const activeDates = new Set(
        logs.filter((l) => l.completedRoutineIds.length > 0).map((l) => l.date)
      );

      const todayActive = activeDates.has(today);
      const yesterdayActive = activeDates.has(yesterday);

      setProfile((prev) => {
        let newStreak = prev.currentStreak;
        let streakFrozen = false;

        if (todayActive) {
          // If previous last active was today or yesterday, continue or start streak
          if (
            prev.lastActiveDate === today ||
            prev.lastActiveDate === yesterday
          ) {
            if (prev.lastActiveDate !== today) {
              newStreak = prev.currentStreak + 1;
            }
          } else if (prev.lastActiveDate === '') {
            // First ever active day
            newStreak = 1;
          } else {
            // Gap of 2+ days - ADHD safe: don't reset, just freeze
            const daysSinceLast = daysBetween(prev.lastActiveDate, today);
            if (daysSinceLast >= 2) {
              // Keep streak frozen, add 1 for today's return
              newStreak = prev.currentStreak;
              streakFrozen = false; // coming back now
            }
          }

          const bestStreak = Math.max(prev.bestStreak, newStreak);

          return {
            ...prev,
            currentStreak: newStreak,
            bestStreak,
            lastActiveDate: today,
            streakFrozen: false,
          };
        } else if (yesterdayActive && !todayActive) {
          // Yesterday was active, today hasn't started — streak is alive, not frozen
          return { ...prev, streakFrozen: false };
        } else if (prev.lastActiveDate && prev.lastActiveDate !== today && prev.lastActiveDate !== yesterday) {
          // Multiple days of inactivity
          streakFrozen = true;
          return { ...prev, streakFrozen };
        }

        return prev;
      });
    },
    [setProfile]
  );

  const checkBadges = useCallback(
    (logs: DailyLog[], routines: Routine[]) => {
      const today = getTodayString();
      const todayLog = logs.find((l) => l.date === today);
      if (!todayLog) return;

      const newBadges: Badge[] = [];

      const alreadyHas = (id: string) =>
        profile.badges.some((b) => b.id === id);

      // FIRST FIRE — first ever routine completion
      if (!alreadyHas('first-fire') && todayLog.completedRoutineIds.length > 0) {
        newBadges.push({
          id: 'first-fire',
          name: 'FIRST FIRE',
          description: 'Completed your first routine',
          earnedAt: today,
          icon: 'Flame',
        });
      }

      // STACK DAY — 100+ XP in a single day
      if (!alreadyHas('stack-day') && todayLog.xpEarned >= 100) {
        newBadges.push({
          id: 'stack-day',
          name: 'STACK DAY',
          description: 'Earned 100+ XP in a single day',
          earnedAt: today,
          icon: 'Zap',
        });
      }

      // WEB SWINGER — 3-day streak
      if (!alreadyHas('web-swinger') && profile.currentStreak >= 3) {
        newBadges.push({
          id: 'web-swinger',
          name: 'WEB SWINGER',
          description: '3-day streak achieved',
          earnedAt: today,
          icon: 'Star',
        });
      }

      // LOCKED IN — 7-day streak
      if (!alreadyHas('locked-in') && profile.currentStreak >= 7) {
        newBadges.push({
          id: 'locked-in',
          name: 'LOCKED IN',
          description: '7-day streak achieved',
          earnedAt: today,
          icon: 'Trophy',
        });
      }

      // MOMENTUM GOD — 90+ momentum
      if (!alreadyHas('momentum-god') && todayLog.momentumScore >= 90) {
        newBadges.push({
          id: 'momentum-god',
          name: 'MOMENTUM GOD',
          description: 'Hit 90+ momentum score',
          earnedAt: today,
          icon: 'Zap',
        });
      }

      // ALL PILLARS — one from each pillar in a single day
      const completedRoutines = routines.filter((r) =>
        todayLog.completedRoutineIds.includes(r.id)
      );
      const coveredPillars = new Set(completedRoutines.map((r) => r.pillarId));
      if (!alreadyHas('all-pillars') && coveredPillars.size >= 5) {
        newBadges.push({
          id: 'all-pillars',
          name: 'ALL PILLARS',
          description: 'Completed at least one routine in all 5 pillars in a single day',
          earnedAt: today,
          icon: 'Trophy',
        });
      }

      // COMEBACK KID — return after 3+ days missed
      if (!alreadyHas('comeback-kid') && profile.streakFrozen && todayLog.completedRoutineIds.length > 0) {
        newBadges.push({
          id: 'comeback-kid',
          name: 'COMEBACK KID',
          description: 'Returned after 3+ missed days',
          earnedAt: today,
          icon: 'Flame',
        });
      }

      // KING WEEK — 80%+ completion rate all 7 days
      if (!alreadyHas('king-week')) {
        const last7 = getLast7Logs(logs);
        const activeRoutinesCount = routines.filter((r) => r.isActive).length;
        if (
          last7.length === 7 &&
          activeRoutinesCount > 0 &&
          last7.every(
            (l) => l.completedRoutineIds.length / activeRoutinesCount >= 0.8
          )
        ) {
          newBadges.push({
            id: 'king-week',
            name: 'KING WEEK',
            description: '80%+ completion rate for a full week',
            earnedAt: today,
            icon: 'Trophy',
          });
        }
      }

      if (newBadges.length > 0) {
        setProfile((prev) => ({
          ...prev,
          badges: [...prev.badges, ...newBadges],
        }));
      }
    },
    [profile.badges, profile.currentStreak, profile.streakFrozen, setProfile]
  );

  return { profile, setProfile, addXP, checkBadges, updateStreak };
}

function getLast7Logs(logs: DailyLog[]): DailyLog[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    days.push(`${year}-${month}-${day}`);
  }
  return days.map((d) => logs.find((l) => l.date === d)).filter(Boolean) as DailyLog[];
}

