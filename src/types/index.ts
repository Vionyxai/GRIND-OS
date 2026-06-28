export interface Pillar {
  id: string;
  name: 'Health & Body' | 'Money & Business' | 'Relationships' | 'Mental / Spiritual' | 'Skills & Learning';
  color: string;
}

export interface Routine {
  id: string;
  pillarId: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  isActive: boolean;
  createdAt: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  completedRoutineIds: string[];
  xpEarned: number;
  momentumScore: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  level: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  streakFrozen: boolean;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface WeekSummary {
  weekStartDate: string;
  completionRate: number;
  totalXP: number;
  pillarBreakdown: { pillarId: string; completedCount: number; totalCount: number }[];
  momentumPeak: number;
}

export type TabName = 'today' | 'pillars' | 'stats' | 'levelup' | 'settings';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  howToEarn: string;
}

export interface Quote {
  text: string;
  author: string;
}
