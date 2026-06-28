import { Zap, Flame, AlertTriangle } from 'lucide-react';
import { Routine, DailyLog, UserProfile, Pillar } from '../types';
import { QuoteCard } from '../components/QuoteCard';
import { MomentumRing } from '../components/MomentumRing';
import { RoutineCard } from '../components/RoutineCard';
import { getDailyQuote } from '../data/quotes';
import { getTodayString, formatDisplayDate } from '../utils/dates';
import { getAdaptedDifficulty } from '../utils/xp';

interface TodayProps {
  routines: Routine[];
  pillars: Pillar[];
  todayLog: DailyLog;
  logs: DailyLog[];
  profile: UserProfile;
  onToggleRoutine: (routineId: string) => void;
}

const TIME_ORDER: Routine['timeOfDay'][] = ['morning', 'afternoon', 'evening', 'anytime'];
const TIME_LABELS: Record<Routine['timeOfDay'], string> = {
  morning: 'MORNING',
  afternoon: 'AFTERNOON',
  evening: 'EVENING',
  anytime: 'ANYTIME',
};

export function Today({ routines, pillars, todayLog, logs, profile, onToggleRoutine }: TodayProps) {
  const today = getTodayString();

  // Compute adaptive difficulties from completion history
  const adaptedDifficulties: Record<string, Routine['difficulty']> = {};
  routines.forEach((r) => {
    adaptedDifficulties[r.id] = getAdaptedDifficulty(r.id, r.createdAt, logs, r.difficulty, today);
  });
  const quote = getDailyQuote(today);
  const activeRoutines = routines.filter((r) => r.isActive);
  const completedCount = todayLog.completedRoutineIds.length;
  const totalCount = activeRoutines.length;
  const completionPct = totalCount > 0 ? completedCount / totalCount : 0;
  const victoryReached = completionPct >= 0.8 && completedCount > 0;

  const getPillarColor = (pillarId: string) => {
    return pillars.find((p) => p.id === pillarId)?.color ?? '#6C757D';
  };

  // Group routines by time of day
  const grouped: Record<Routine['timeOfDay'], Routine[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    anytime: [],
  };

  activeRoutines.forEach((r) => {
    grouped[r.timeOfDay].push(r);
  });

  // Within each group, sort by time block start (timed routines first, then untimed)
  const sortByTimeBlock = (list: Routine[]): Routine[] =>
    [...list].sort((a, b) => {
      if (a.timeBlock && b.timeBlock) return a.timeBlock.start.localeCompare(b.timeBlock.start);
      if (a.timeBlock) return -1;
      if (b.timeBlock) return 1;
      return 0;
    });

  // Count routines with deadlines due today or overdue (for urgent indicator)
  const today2 = getTodayString();
  const urgentCount = activeRoutines.filter(
    (r) => r.deadline && r.deadline <= today2 && !todayLog.completedRoutineIds.includes(r.id)
  ).length;

  const progressBarWidth = `${Math.round(completionPct * 100)}%`;

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Top section */}
      <div className="px-4 pt-4">
        <QuoteCard quote={quote} />

        {/* Date */}
        <p
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '28px',
            color: '#F8F9FA',
            letterSpacing: '0.06em',
            marginBottom: '16px',
          }}
        >
          {formatDisplayDate(today)}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <MomentumRing score={todayLog.momentumScore} size={108} />

          <div className="flex-1 flex flex-col gap-3">
            {/* XP today */}
            <div
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                XP Today
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap size={14} color="#FFD166" />
                <span
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '26px',
                    color: '#FFD166',
                    letterSpacing: '0.04em',
                  }}
                >
                  {todayLog.xpEarned}
                </span>
              </div>
            </div>

            {/* Streak */}
            <div
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                Streak
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {profile.streakFrozen ? (
                  <AlertTriangle size={14} color="#FFD166" />
                ) : (
                  <Flame size={14} color="#E63946" />
                )}
                <span
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '26px',
                    color: profile.streakFrozen ? '#FFD166' : '#E63946',
                    letterSpacing: '0.04em',
                  }}
                >
                  {profile.streakFrozen ? 'FROZEN' : `DAY ${profile.currentStreak}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Victory banner */}
        {victoryReached && (
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #06D6A020, #06D6A010)',
              border: '1px solid #06D6A040',
            }}
          >
            <Flame size={20} color="#06D6A0" />
            <div>
              <p
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '18px',
                  color: '#06D6A0',
                  letterSpacing: '0.05em',
                }}
              >
                YOU'RE ON FIRE TODAY
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#6C757D',
                }}
              >
                {completedCount}/{totalCount} routines complete
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky progress bar */}
      <div
        className="sticky top-0 z-10 px-4 py-3"
        style={{ backgroundColor: '#0A0A0F', borderBottom: '1px solid #1E1E2E' }}
      >
        <div className="flex justify-between items-center mb-1.5">
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#F8F9FA',
            }}
          >
            {completedCount} of {totalCount} complete
          </span>
          <span
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '16px',
              color: completionPct >= 0.8 ? '#06D6A0' : completionPct >= 0.5 ? '#FFD166' : '#E63946',
              letterSpacing: '0.04em',
            }}
          >
            {Math.round(completionPct * 100)}%
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: '6px', backgroundColor: '#1E1E2E' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: progressBarWidth,
              backgroundColor:
                completionPct >= 0.8
                  ? '#06D6A0'
                  : completionPct >= 0.5
                  ? '#FFD166'
                  : '#E63946',
            }}
          />
        </div>
      </div>

      {/* Routines grouped by time */}
      <div className="px-4 py-4 space-y-6">
        {/* Urgent deadlines banner */}
        {urgentCount > 0 && (
          <div
            className="rounded-xl px-4 py-3 mb-2 flex items-center gap-3"
            style={{ backgroundColor: '#E6394615', border: '1px solid #E6394640' }}
          >
            <AlertTriangle size={16} color="#E63946" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#E63946', fontWeight: 600 }}>
              {urgentCount} routine{urgentCount > 1 ? 's' : ''} due today
            </p>
          </div>
        )}

        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Flame size={40} color="#1E1E2E" />
            <div className="text-center">
              <p
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '22px',
                  color: '#6C757D',
                  letterSpacing: '0.05em',
                }}
              >
                DAY STARTS NOW
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#6C757D',
                  marginTop: '4px',
                }}
              >
                One rep is all it takes.
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#6C757D',
                  marginTop: '8px',
                }}
              >
                Go to Pillars to add your routines.
              </p>
            </div>
          </div>
        ) : (
          TIME_ORDER.map((time) => {
            const timeRoutines = sortByTimeBlock(grouped[time]);
            if (timeRoutines.length === 0) return null;

            return (
              <div key={time}>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#6C757D',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  {TIME_LABELS[time]}
                </p>
                <div className="space-y-2">
                  {timeRoutines.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      pillarColor={getPillarColor(routine.pillarId)}
                      isCompleted={todayLog.completedRoutineIds.includes(routine.id)}
                      onToggle={() => onToggleRoutine(routine.id)}
                      adaptedDifficulty={adaptedDifficulties[routine.id]}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
