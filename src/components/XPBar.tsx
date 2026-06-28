import { getLevelInfo } from '../utils/xp';

interface XPBarProps {
  totalXP: number;
  showLabel?: boolean;
}

export function XPBar({ totalXP, showLabel = true }: XPBarProps) {
  const info = getLevelInfo(totalXP);

  const xpInLevel = totalXP - (info.level > 1 ? getXPForLevel(info.level) : 0);
  const xpNeeded = info.nextLevelXP - getXPForLevel(info.level);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '18px',
              color: '#FFD166',
              letterSpacing: '0.06em',
            }}
          >
            LVL {info.level} · {info.title.toUpperCase()}
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#6C757D',
              fontWeight: 500,
            }}
          >
            {totalXP.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '8px', backgroundColor: '#1E1E2E' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.round(info.progress * 100)}%`,
            background: 'linear-gradient(90deg, #E63946, #FFD166)',
          }}
        />
      </div>

      {showLabel && info.level < 7 && (
        <div className="flex justify-between mt-1">
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D' }}>
            {xpInLevel} / {xpNeeded} XP
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D' }}>
            {xpNeeded - xpInLevel} to next level
          </span>
        </div>
      )}

      {info.level === 7 && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#FFD166', marginTop: '4px', textAlign: 'center' }}>
          MAX LEVEL REACHED
        </p>
      )}
    </div>
  );
}

function getXPForLevel(level: number): number {
  const map: Record<number, number> = {
    1: 0,
    2: 500,
    3: 1500,
    4: 3500,
    5: 7500,
    6: 15000,
    7: 30000,
  };
  return map[level] ?? 0;
}
