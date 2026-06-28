import { Zap, Flame, Trophy, Star } from 'lucide-react';
import { UserProfile, DailyLog } from '../types';
import { getLevelInfo, LEVELS } from '../utils/xp';
import { XPBar } from '../components/XPBar';
import { BadgeGrid } from '../components/BadgeGrid';

interface LevelUpProps {
  profile: UserProfile;
  logs: DailyLog[];
}

export function LevelUp({ profile, logs }: LevelUpProps) {
  const levelInfo = getLevelInfo(profile.totalXP);
  const totalRoutinesCompleted = logs.reduce((sum, l) => sum + l.completedRoutineIds.length, 0);
  const daysActive = logs.filter((l) => l.completedRoutineIds.length > 0).length;
  const nextLevel = LEVELS.find((l) => l.level === levelInfo.level + 1);

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
    </div>
  );
}
