import { useState } from 'react';
import { Zap, Flame, Trophy, Star, Brain, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { UserProfile, DailyLog, Routine } from '../types';
import { getLevelInfo, LEVELS, getRoutineCompletionRate } from '../utils/xp';
import { getTodayString } from '../utils/dates';
import { XPBar } from '../components/XPBar';
import { BadgeGrid } from '../components/BadgeGrid';
import { ADHD_INSIGHTS, mapRoutineToInsightId, type AdhdInsight } from '../data/adhdContent';
import { READING_PIECES, type ReadingPiece, type UserPattern } from '../data/adhdReading';

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

function ReadingCard({ piece, pattern }: { piece: ReadingPiece; pattern: UserPattern }) {
  const [expanded, setExpanded] = useState(false);
  const { isRelevant, personalNote } = piece.checkRelevance(pattern);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#0A0A0F', border: `1px solid ${isRelevant ? piece.color + '40' : '#1E1E2E'}` }}
    >
      <button
        className="w-full flex items-start gap-3 px-4 py-3 text-left"
        onClick={() => setExpanded((e) => !e)}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: piece.color,
            flexShrink: 0,
            marginTop: '5px',
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '16px', color: piece.color, letterSpacing: '0.06em' }}>
              {piece.title.toUpperCase()}
            </p>
            {isRelevant && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: piece.color,
                  backgroundColor: piece.color + '20',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                RELEVANT TO YOU
              </span>
            )}
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', marginTop: '2px', lineHeight: '1.4' }}>
            {piece.teaser}
          </p>
        </div>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          {expanded ? <ChevronUp size={16} color="#6C757D" /> : <ChevronDown size={16} color="#6C757D" />}
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: `1px solid ${piece.color}20`, padding: '14px 16px 16px' }}>
          {isRelevant && personalNote && (
            <div
              className="rounded-lg px-3 py-2 mb-4"
              style={{ backgroundColor: piece.color + '12', border: `1px solid ${piece.color}30` }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, color: piece.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                YOUR PATTERN
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#F8F9FA', lineHeight: '1.5', opacity: 0.9 }}>
                {personalNote}
              </p>
            </div>
          )}

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, color: '#6C757D', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
            THE SCIENCE
          </p>
          <div className="space-y-3 mb-4">
            {piece.body.map((para, i) => (
              <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F8F9FA', lineHeight: '1.6', opacity: 0.85 }}>
                {para}
              </p>
            ))}
          </div>

          <div
            className="rounded-lg px-3 py-2"
            style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, color: '#FFD166', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              KEY TAKEAWAY
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#F8F9FA', lineHeight: '1.5', fontWeight: 500 }}>
              {piece.keyTakeaway}
            </p>
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

  // Build user pattern for reading relevance checks
  const avgRate =
    routineRates.length > 0
      ? routineRates.reduce((s, x) => s + x.rate, 0) / routineRates.length
      : 0;
  const morningRates = routineRates.filter((x) => x.routine.timeOfDay === 'morning');
  const eveningRates = routineRates.filter((x) => x.routine.timeOfDay === 'evening');
  const pillarRates: Record<string, number> = {};
  for (const x of routineRates) {
    if (pillarRates[x.routine.pillarId] === undefined) {
      const group = routineRates.filter((r) => r.routine.pillarId === x.routine.pillarId);
      pillarRates[x.routine.pillarId] = group.reduce((s, r) => s + r.rate, 0) / group.length;
    }
  }
  const userPattern: UserPattern = {
    overallRate: avgRate,
    morningRate: morningRates.length > 0 ? morningRates.reduce((s, x) => s + x.rate, 0) / morningRates.length : null,
    eveningRate: eveningRates.length > 0 ? eveningRates.reduce((s, x) => s + x.rate, 0) / eveningRates.length : null,
    pillarRates,
    daysActive,
  };

  // Sort reading pieces: relevant ones first
  const sortedReading = [...READING_PIECES].sort((a, b) => {
    const aRel = a.checkRelevance(userPattern).isRelevant ? 0 : 1;
    const bRel = b.checkRelevance(userPattern).isRelevant ? 0 : 1;
    return aRel - bRel;
  });
  const relevantCount = sortedReading.filter((p) => p.checkRelevance(userPattern).isRelevant).length;

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

      {/* Learn About Yourself */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} color="#FFD166" />
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
            LEARN ABOUT YOURSELF
          </p>
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D', marginBottom: '12px', lineHeight: '1.5' }}>
          {relevantCount > 0
            ? `${relevantCount} piece${relevantCount !== 1 ? 's' : ''} matched to your data — shown first.`
            : 'Research-backed reading on how your ADHD brain actually works.'}
        </p>

        <div className="space-y-2">
          {sortedReading.map((piece) => (
            <ReadingCard key={piece.id} piece={piece} pattern={userPattern} />
          ))}
        </div>
      </div>
    </div>
  );
}
