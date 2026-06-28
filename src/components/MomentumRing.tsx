import { getMomentumColor, getMomentumLabel } from '../utils/momentum';

interface MomentumRingProps {
  score: number;
  size?: number;
}

export function MomentumRing({ score, size = 120 }: MomentumRingProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getMomentumColor(score);
  const label = getMomentumLabel(score);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1E1E2E"
            strokeWidth={8}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
          />
        </svg>
        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: `${size * 0.28}px`,
              color: color,
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              color: '#6C757D',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginTop: '2px',
            }}
          >
            MOMEN.
          </span>
        </div>
      </div>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          color: color,
          letterSpacing: '0.1em',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginTop: '4px',
        }}
      >
        {label}
      </span>
    </div>
  );
}
