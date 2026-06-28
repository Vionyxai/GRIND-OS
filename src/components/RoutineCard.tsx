import { Check } from 'lucide-react';
import { Routine } from '../types';
import { XP_VALUES } from '../utils/xp';

interface RoutineCardProps {
  routine: Routine;
  pillarColor: string;
  isCompleted: boolean;
  onToggle: () => void;
}

const DIFFICULTY_COLORS: Record<Routine['difficulty'], string> = {
  easy: '#06D6A0',
  medium: '#FFD166',
  hard: '#E63946',
};

const DIFFICULTY_LABELS: Record<Routine['difficulty'], string> = {
  easy: 'EASY',
  medium: 'MED',
  hard: 'HARD',
};

export function RoutineCard({ routine, pillarColor, isCompleted, onToggle }: RoutineCardProps) {
  const xp = XP_VALUES[routine.difficulty];
  const diffColor = DIFFICULTY_COLORS[routine.difficulty];

  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-lg overflow-hidden flex items-stretch"
      style={{
        backgroundColor: '#13131A',
        border: `1px solid ${isCompleted ? pillarColor + '40' : '#1E1E2E'}`,
        minHeight: '60px',
        transition: 'border-color 0.2s, opacity 0.2s',
        opacity: isCompleted ? 0.75 : 1,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Left color stripe */}
      <div
        style={{
          width: '4px',
          flexShrink: 0,
          backgroundColor: pillarColor,
          opacity: isCompleted ? 0.5 : 1,
        }}
      />

      {/* Content */}
      <div className="flex items-center flex-1 px-3 py-3 gap-3">
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: isCompleted ? '#6C757D' : '#F8F9FA',
              textDecoration: isCompleted ? 'line-through' : 'none',
              marginBottom: routine.description ? '2px' : 0,
              lineHeight: '1.3',
            }}
          >
            {routine.title}
          </p>
          {routine.description && !isCompleted && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#6C757D',
                lineHeight: '1.3',
              }}
            >
              {routine.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                color: isCompleted ? '#6C757D' : diffColor,
                letterSpacing: '0.06em',
              }}
            >
              {DIFFICULTY_LABELS[routine.difficulty]}
            </span>
            <span style={{ color: '#1E1E2E', fontSize: '10px' }}>·</span>
            <span
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '13px',
                color: isCompleted ? '#6C757D' : '#FFD166',
                letterSpacing: '0.04em',
              }}
            >
              +{xp} XP
            </span>
          </div>
        </div>

        {/* Checkmark */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: `2px solid ${isCompleted ? pillarColor : '#1E1E2E'}`,
            backgroundColor: isCompleted ? pillarColor : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          {isCompleted && <Check size={16} strokeWidth={3} color="#0A0A0F" />}
        </div>
      </div>
    </button>
  );
}
