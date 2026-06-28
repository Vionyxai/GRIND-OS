import { Check, Clock, AlertTriangle } from 'lucide-react';
import { Routine } from '../types';
import { XP_VALUES } from '../utils/xp';
import { getTodayString, daysBetween } from '../utils/dates';

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

function formatTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function getDeadlineState(deadline: string): { label: string; color: string } | null {
  const today = getTodayString();
  const days = daysBetween(today, deadline);
  const isPast = deadline < today;

  if (isPast) return { label: 'OVERDUE', color: '#E63946' };
  if (days === 0) return { label: 'DUE TODAY', color: '#E63946' };
  if (days === 1) return { label: 'DUE TOMORROW', color: '#FFD166' };
  if (days <= 3) return { label: `DUE IN ${days}D`, color: '#FFD166' };
  if (days <= 7) return { label: `DUE IN ${days}D`, color: '#6C757D' };
  return null;
}

export function RoutineCard({ routine, pillarColor, isCompleted, onToggle }: RoutineCardProps) {
  const xp = XP_VALUES[routine.difficulty];
  const diffColor = DIFFICULTY_COLORS[routine.difficulty];
  const deadlineState = routine.deadline ? getDeadlineState(routine.deadline) : null;
  const hasTimeBlock = !!routine.timeBlock;

  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-lg overflow-hidden flex items-stretch"
      style={{
        backgroundColor: '#13131A',
        border: `1px solid ${isCompleted ? pillarColor + '40' : deadlineState?.color === '#E63946' ? '#E6394630' : '#1E1E2E'}`,
        minHeight: '60px',
        transition: 'border-color 0.2s, opacity 0.2s',
        opacity: isCompleted ? 0.7 : 1,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Left color stripe */}
      <div
        style={{
          width: '4px',
          flexShrink: 0,
          backgroundColor: pillarColor,
          opacity: isCompleted ? 0.4 : 1,
        }}
      />

      {/* Content */}
      <div className="flex items-center flex-1 px-3 py-3 gap-3">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: isCompleted ? '#6C757D' : '#F8F9FA',
              textDecoration: isCompleted ? 'line-through' : 'none',
              lineHeight: '1.3',
              marginBottom: '3px',
            }}
          >
            {routine.title}
          </p>

          {/* Description (hidden when complete) */}
          {routine.description && !isCompleted && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#6C757D',
                lineHeight: '1.3',
                marginBottom: '4px',
              }}
            >
              {routine.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Difficulty */}
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

            {/* XP */}
            <span
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: '13px',
                color: isCompleted ? '#6C757D' : '#FFD166',
                letterSpacing: '0.04em',
              }}
            >
              +{xp} XP
            </span>

            {/* Time block */}
            {hasTimeBlock && routine.timeBlock && (
              <>
                <span style={{ color: '#1E1E2E', fontSize: '10px' }}>·</span>
                <span
                  className="flex items-center gap-1"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: isCompleted ? '#6C757D' : '#4CC9F0',
                    fontWeight: 600,
                  }}
                >
                  <Clock size={9} />
                  {formatTime12(routine.timeBlock.start)}–{formatTime12(routine.timeBlock.end)}
                </span>
              </>
            )}

            {/* Deadline badge */}
            {deadlineState && !isCompleted && (
              <>
                <span style={{ color: '#1E1E2E', fontSize: '10px' }}>·</span>
                <span
                  className="flex items-center gap-1"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: deadlineState.color,
                    letterSpacing: '0.04em',
                  }}
                >
                  <AlertTriangle size={9} />
                  {deadlineState.label}
                </span>
              </>
            )}
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
