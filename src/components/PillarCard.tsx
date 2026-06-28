import { useState, useRef } from 'react';
import { Plus, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { Pillar, Routine } from '../types';
import { RoutineCard } from './RoutineCard';

interface PillarCardProps {
  pillar: Pillar;
  routines: Routine[];
  completedIds: string[];
  adaptedDifficulties?: Record<string, Routine['difficulty']>;
  onToggleRoutine: (routineId: string) => void;
  onAddRoutine: (pillarId: string) => void;
  onEditRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
  onClearPillar: (pillarId: string) => void;
}

export function PillarCard({
  pillar,
  routines,
  completedIds,
  adaptedDifficulties,
  onToggleRoutine,
  onAddRoutine,
  onEditRoutine,
  onDeleteRoutine,
  onClearPillar,
}: PillarCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [longPressId, setLongPressId] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeRoutines = routines.filter((r) => r.pillarId === pillar.id && r.isActive);
  const completedCount = activeRoutines.filter((r) => completedIds.includes(r.id)).length;

  const completionPct = activeRoutines.length > 0
    ? Math.round((completedCount / activeRoutines.length) * 100)
    : 0;

  const handleTouchStart = (routineId: string) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressId(routineId);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleContextMenu = (e: React.MouseEvent, routineId: string) => {
    e.preventDefault();
    setLongPressId(routineId);
  };

  return (
    <div
      className="rounded-xl overflow-hidden mb-4"
      style={{
        backgroundColor: '#13131A',
        border: `1px solid ${clearConfirm ? '#E6394640' : '#1E1E2E'}`,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Header — split into expand area + clear button */}
      <div className="flex items-center gap-0">
        <button
          className="flex items-center gap-3 flex-1 px-4 py-3"
          onClick={() => setExpanded((e) => !e)}
          style={{ WebkitTapHighlightColor: 'transparent', minHeight: '52px' }}
        >
          {/* Color indicator */}
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: pillar.color,
              flexShrink: 0,
            }}
          />
          <div className="flex-1 text-left">
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#F8F9FA',
              }}
            >
              {pillar.name}
            </p>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#6C757D',
              }}
            >
              {completedCount}/{activeRoutines.length} done · {completionPct}%
            </p>
          </div>

          {/* Mini progress + chevron */}
          <div className="flex items-center gap-2">
            <div
              style={{
                width: '48px',
                height: '4px',
                backgroundColor: '#1E1E2E',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${completionPct}%`,
                  height: '100%',
                  backgroundColor: pillar.color,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            {expanded ? (
              <ChevronUp size={18} color="#6C757D" />
            ) : (
              <ChevronDown size={18} color="#6C757D" />
            )}
          </div>
        </button>

        {/* Clear all button — only when there are routines */}
        {activeRoutines.length > 0 && (
          <button
            onClick={() => setClearConfirm((v) => !v)}
            style={{
              padding: '12px 14px',
              minHeight: '52px',
              minWidth: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: clearConfirm ? '#E63946' : '#6C757D',
              borderLeft: '1px solid #1E1E2E',
              WebkitTapHighlightColor: 'transparent',
              transition: 'color 0.2s',
            }}
            aria-label="Clear all routines"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Inline clear confirm strip */}
      {clearConfirm && (
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ backgroundColor: '#E6394610', borderTop: '1px solid #E6394630' }}
        >
          <p
            className="flex-1"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#E63946',
              fontWeight: 600,
            }}
          >
            Delete all {activeRoutines.length} routine{activeRoutines.length !== 1 ? 's' : ''}?
          </p>
          <button
            onClick={() => setClearConfirm(false)}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6C757D',
              backgroundColor: '#1E1E2E',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              minHeight: '36px',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClearPillar(pillar.id);
              setClearConfirm(false);
            }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#F8F9FA',
              backgroundColor: '#E63946',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              minHeight: '36px',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            Delete All
          </button>
        </div>
      )}

      {/* Routines list */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {activeRoutines.length === 0 && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: '#6C757D',
                textAlign: 'center',
                padding: '16px 0',
              }}
            >
              No routines yet. Add one below.
            </p>
          )}

          {activeRoutines.map((routine) => (
            <div
              key={routine.id}
              onTouchStart={() => handleTouchStart(routine.id)}
              onTouchEnd={handleTouchEnd}
              onContextMenu={(e) => handleContextMenu(e, routine.id)}
              style={{ position: 'relative' }}
            >
              {longPressId === routine.id ? (
                <div
                  className="rounded-lg flex items-center gap-2 px-3 py-3"
                  style={{
                    backgroundColor: '#1E1E2E',
                    border: `1px solid ${pillar.color}`,
                    minHeight: '60px',
                  }}
                >
                  <p
                    className="flex-1 truncate"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#F8F9FA' }}
                  >
                    {routine.title}
                  </p>
                  <button
                    onClick={() => {
                      setLongPressId(null);
                      onEditRoutine(routine);
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: '#4CC9F040', color: '#4CC9F0', minHeight: '44px', minWidth: '44px' }}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => {
                      setLongPressId(null);
                      onDeleteRoutine(routine.id);
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: '#E6394640', color: '#E63946', minHeight: '44px', minWidth: '44px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => setLongPressId(null)}
                    className="px-3 py-2 rounded-lg"
                    style={{ backgroundColor: '#1E1E2E', color: '#6C757D', minHeight: '44px', minWidth: '44px' }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <RoutineCard
                  routine={routine}
                  pillarColor={pillar.color}
                  isCompleted={completedIds.includes(routine.id)}
                  onToggle={() => onToggleRoutine(routine.id)}
                  adaptedDifficulty={adaptedDifficulties?.[routine.id]}
                />
              )}
            </div>
          ))}

          {/* Add routine button */}
          <button
            onClick={() => onAddRoutine(pillar.id)}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-3"
            style={{
              backgroundColor: 'transparent',
              border: `1px dashed ${pillar.color}60`,
              color: pillar.color,
              minHeight: '44px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Plus size={16} />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Add Routine
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
