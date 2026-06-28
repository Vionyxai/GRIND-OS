import { useState } from 'react';
import { Zap, Flame, Trophy, Star, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { UserProfile, DailyLog, Routine } from '../types';
import { getLevelInfo, LEVELS, getRoutineCompletionRate } from '../utils/xp';
import { getTodayString } from '../utils/dates';
import { XPBar } from '../components/XPBar';
import { BadgeGrid } from '../components/BadgeGrid';
import { ADHD_INSIGHTS, mapRoutineToInsightId, type AdhdInsight } from '../data/adhdContent';

interface LevelUpProps {
  profile: UserProfile;
  logs: DailyLog[];
  routines: Routine[];
}

function InsightCard({ insight }: { insight: AdhdInsight }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#0A0A0F', border: `1px solid ${insight.color}30` }}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3"
        onClick={() => setExpanded((e) => !e)}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: insight.color,
            flexShrink: 0,
          }}
        />
        <div className="flex-1 text-left">
          <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '16px', color: insight.color, letterSpacing: '0.06em' }}>
            {insight.title.toUpperCase()}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', marginTop: '1px' }}>
            {insight.tagline}
          </p>
        </div>
        {expanded ? <ChevronUp size={16} color="#6C757D" /> : <ChevronDown size={16} color="#6C757D" />}
      </button>
      {expanded && (
        <div style={{ borderTop: `1px solid ${insight.color}20`, padding: '12px 16px 14px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F8F9FA', lineHeight: '1.5', marginBottom: '12px', opacity: 0.9 }}>
            {insight.whatHappens}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, color: insight.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
            WHAT TO TRY
          </p>
          <div className="space-y-2">
            {insight.tips.map((tip, i) => (
              <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#F8F9FA', lineHeight: '1.5', opacity: 0.8 }}>
                <span style={{ color: insight.color, fontWeight: 700 }}>{i + 1}.</span> {tip}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LevelUp({ profile, logs, routines }: LevelUpProps) {
  const today = getTodayString();
  const levelInfo = getLevelInfo(profile.totalXP);
  const totalRoutinesCompleted = logs.reduce((sum, l) => sum + l.completedRoutineIds.length, 0);
  const daysActive = logs.filter((l) => l.completedRoutineIds.length > 0).length;
  const nextLevel = LEVELS.find((l) => l.level === levelInfo.level + 1);

  // Compute per-routine completion rates for ADHD Intel
  const activeRoutines = routines.filter((r) => r.isActive);
  const routineRates = activeRoutines
    .map((r) => ({
      routine: r,
      rate: getRoutineCompletionRate(r.id, r.createdAt, logs, today),
    }))
    .filter((x) => x.rate !== null) as { routine: Routine; rate: number }[];

  const struggling = routineRates.filter((x) => x.rate < 0.4).sort((a, b) => a.rate - b.rate);
  const crushing = routineRates.filter((x) => x.rate >= 0.75);

  // Pick top 3 unique insight categories from struggling routines
  const seenInsightIds = new Set<string>();
  const topInsights: AdhdInsight[] = [];
  for (const { routine, rate } of struggling) {
    const id = mapRoutineToInsightId(routine.pillarId, routine.timeOfDay, rate);
    if (!seenInsightIds.has(id)) {
      seenInsightIds.add(id);
      const insight = ADHD_INSIGHTS.find((i) => i.id === id);
      if (insight) topInsights.push(insight);
    }
    if (topInsights.length >= 3) break;
  }
  // If no struggle data, show first 2 insights as general education
  const displayInsights = topInsights.length > 0 ? topInsights : ADHD_INSIGHTS.slice(0, 2);
  const hasPersonalizedData = daysActive >= 7 && topInsights.length > 0;

  return (
    <div className="px-4 py-4 space-y-5 overflow-x-hidden">
      {/* Hero section */}
      <div
        className="rounded-2xl p-5 text-center"
        style={{
          backgroundColor: '#13131A',
          border: '1px solid #1E1E2E',
          background: `linear-gradient(180deg, #13131A 0%, #0D0D18 100%)`,
          borderTop: `3px solid #E63946`,
        }}
      >
        <p
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '80px',
            color: '#E63946',
            lineHeight: 0.9,
            letterSpacing: '0.02em',
          }}
        >
          {levelInfo.level}
        </p>
        <p
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '26px',
            color: '#FFD166',
            letterSpacing: '0.15em',
            marginTop: '4px',
          }}
        >
          {levelInfo.title.toUpperCase()}
        </p>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#6C757D',
            marginTop: '4px',
          }}
        >
          {profile.totalXP.toLocaleString()} TOTAL XP
        </p>

        {/* XP Bar */}
        <div className="mt-5">
          <XPBar totalXP={profile.totalXP} showLabel={false} />
          {nextLevel && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: '#6C757D',
                marginTop: '6px',
              }}
            >
              {(nextLevel.xpRequired - profile.totalXP).toLocaleString()} XP to{' '}
              <span style={{ color: '#FFD166' }}>{nextLevel.title}</span>
            </p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame size={14} color="#E63946" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Best Streak
            </p>
          </div>
          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '32px',
              color: '#E63946',
              letterSpacing: '0.04em',
            }}
          >
            {profile.bestStreak}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D' }}>DAYS</p>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame size={14} color="#FFD166" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Current Streak
            </p>
          </div>
          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '32px',
              color: profile.streakFrozen ? '#FFD166' : '#F8F9FA',
              letterSpacing: '0.04em',
            }}
          >
            {profile.currentStreak}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: profile.streakFrozen ? '#FFD166' : '#6C757D' }}>
            {profile.streakFrozen ? 'FROZEN' : 'DAYS'}
          </p>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} color="#FFD166" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total XP
            </p>
          </div>
          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '28px',
              color: '#FFD166',
              letterSpacing: '0.04em',
            }}
          >
            {profile.totalXP.toLocaleString()}
          </p>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} color="#4CC9F0" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Reps Done
            </p>
          </div>
          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '28px',
              color: '#4CC9F0',
              letterSpacing: '0.04em',
            }}
          >
            {totalRoutinesCompleted}
          </p>
        </div>

        <div
          className="rounded-xl p-4 col-span-2"
          style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} color="#06D6A0" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Days Active
            </p>
          </div>
          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '32px',
              color: '#06D6A0',
              letterSpacing: '0.04em',
            }}
          >
            {daysActive}
          </p>
        </div>
      </div>

      {/* Level progression */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            color: '#6C757D',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          LEVEL ROAD
        </p>
        <div className="space-y-2">
          {LEVELS.map((level) => {
            const isCurrent = level.level === levelInfo.level;
            const isPast = level.level < levelInfo.level;
            return (
              <div
                key={level.level}
                className="flex items-center gap-3"
                style={{ opacity: isPast ? 0.45 : 1 }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? '#E63946' : isPast ? '#1E1E2E' : '#0A0A0F',
                    border: `2px solid ${isCurrent ? '#E63946' : isPast ? '#1E1E2E' : '#1E1E2E'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: '13px',
                      color: isCurrent ? '#0A0A0F' : isPast ? '#6C757D' : '#6C757D',
                    }}
                  >
                    {level.level}
                  </span>
                </div>
                <div className="flex-1">
                  <span
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: '15px',
                      letterSpacing: '0.06em',
                      color: isCurrent ? '#FFD166' : '#6C757D',
                    }}
                  >
                    {level.title.toUpperCase()}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: '#6C757D',
                  }}
                >
                  {level.xpRequired.toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            color: '#6C757D',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          BADGES ({profile.badges.length}/{10})
        </p>
        <BadgeGrid earnedBadges={profile.badges} />
      </div>

      {/* ADHD Intel */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} color="#4CC9F0" />
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              color: '#6C757D',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            ADHD INTEL
          </p>
        </div>

        {hasPersonalizedData ? (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D', marginBottom: '12px', lineHeight: '1.5' }}>
            Based on your data — these are your active challenge areas right now.
          </p>
        ) : daysActive < 7 ? (
          <div
            className="rounded-xl px-4 py-3 mb-3"
            style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', lineHeight: '1.5' }}>
              Complete routines for 7+ days to unlock personalized insights based on your data.
              <span style={{ color: '#4CC9F0' }}> {Math.max(0, 7 - daysActive)} more active day{7 - daysActive !== 1 ? 's' : ''} to go.</span>
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D', marginBottom: '12px', lineHeight: '1.5' }}>
            General ADHD education — personalized insights unlock when routines show patterns.
          </p>
        )}

        {/* Strength zones */}
        {crushing.length > 0 && (
          <div
            className="rounded-xl px-4 py-3 mb-3"
            style={{ backgroundColor: '#06D6A015', border: '1px solid #06D6A030' }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, color: '#06D6A0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
              STRENGTH ZONES
            </p>
            {crushing.slice(0, 4).map(({ routine, rate }) => (
              <p key={routine.id} style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#F8F9FA', marginBottom: '2px' }}>
                <span style={{ color: '#06D6A0', fontWeight: 700 }}>{Math.round(rate * 100)}%</span> · {routine.title}
              </p>
            ))}
          </div>
        )}

        {/* Struggle insight cards */}
        <div className="space-y-2">
          {displayInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>

        {/* All insights link */}
        <div className="mt-3 space-y-2">
          {ADHD_INSIGHTS.filter((i) => !displayInsights.find((d) => d.id === i.id)).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}
