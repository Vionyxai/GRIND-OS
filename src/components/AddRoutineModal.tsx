import { useState, useEffect } from 'react';
import { X, ChevronRight, Info } from 'lucide-react';
import { Routine, ActivityType } from '../types';
import { DEFAULT_PILLARS } from '../data/pillars';
import {
  ADHD_SUGGESTIONS,
  SUGGESTION_CATEGORIES,
  type RoutineSuggestion,
} from '../data/suggestions';

interface AddRoutineModalProps {
  isOpen: boolean;
  initialPillarId?: string;
  editingRoutine?: Routine | null;
  onSave: (routine: Omit<Routine, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

type Difficulty = Routine['difficulty'];
type TimeOfDay = Routine['timeOfDay'];
type Tab = 'suggestions' | 'custom';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const TIMES: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night', 'anytime'];

function getTimeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

const PHYSICAL_ACTIVITY_TYPES: { id: ActivityType; label: string; color: string }[] = [
  { id: 'gym', label: 'Gym', color: '#06D6A0' },
  { id: 'outdoor', label: 'Outdoor / Hike', color: '#4CC9F0' },
  { id: 'sport', label: 'Sport', color: '#E63946' },
];

const DIFF_COLORS: Record<Difficulty, string> = {
  easy: '#06D6A0',
  medium: '#FFD166',
  hard: '#E63946',
};

const DIFF_XP: Record<Difficulty, number> = { easy: 10, medium: 25, hard: 50 };

function formatTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function SuggestionCard({
  suggestion,
  onUse,
}: {
  suggestion: RoutineSuggestion;
  onUse: (s: RoutineSuggestion) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const catColor =
    SUGGESTION_CATEGORIES.find((c) => c.label === suggestion.categoryLabel)?.color ?? '#4CC9F0';

  return (
    <div
      className="rounded-xl overflow-hidden mb-3"
      style={{ backgroundColor: '#0A0A0F', border: '1px solid #1E1E2E' }}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#F8F9FA',
              }}
            >
              {suggestion.title}
            </span>
          </div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#6C757D',
              lineHeight: '1.4',
              marginBottom: '8px',
            }}
          >
            {suggestion.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                color: DIFF_COLORS[suggestion.difficulty],
                letterSpacing: '0.06em',
              }}
            >
              {suggestion.difficulty.toUpperCase()} · +{DIFF_XP[suggestion.difficulty]} XP
            </span>
            {suggestion.suggestedTimeBlock && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  color: catColor,
                  fontWeight: 600,
                }}
              >
                {formatTime12(suggestion.suggestedTimeBlock.start)}–{formatTime12(suggestion.suggestedTimeBlock.end)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onUse(suggestion)}
            style={{
              backgroundColor: '#E63946',
              color: '#F8F9FA',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '8px',
              padding: '8px 14px',
              minHeight: '44px',
              minWidth: '60px',
              WebkitTapHighlightColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            } as React.CSSProperties}
          >
            USE
          </button>
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #1E1E2E',
              borderRadius: '8px',
              padding: '6px',
              minHeight: '32px',
              color: '#6C757D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent',
            } as React.CSSProperties}
          >
            <Info size={13} />
          </button>
        </div>
      </div>

      {/* Science explanation */}
      {expanded && (
        <div
          style={{
            borderTop: `1px solid ${catColor}30`,
            backgroundColor: `${catColor}08`,
            padding: '12px 16px',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              color: catColor,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            WHY IT WORKS FOR ADHD BRAINS
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#F8F9FA',
              lineHeight: '1.5',
              opacity: 0.85,
            }}
          >
            {suggestion.whyItWorks}
          </p>
        </div>
      )}
    </div>
  );
}

export function AddRoutineModal({
  isOpen,
  initialPillarId,
  editingRoutine,
  onSave,
  onClose,
}: AddRoutineModalProps) {
  const [tab, setTab] = useState<Tab>(editingRoutine ? 'custom' : 'suggestions');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('anytime');
  const [pillarId, setPillarId] = useState(initialPillarId ?? 'health');
  const [timeBlockEnabled, setTimeBlockEnabled] = useState(false);
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('09:30');
  const [deadlineEnabled, setDeadlineEnabled] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('gym');

  useEffect(() => {
    if (!isOpen) return;
    if (editingRoutine) {
      setTab('custom');
      setTitle(editingRoutine.title);
      setDescription(editingRoutine.description ?? '');
      setDifficulty(editingRoutine.difficulty);
      setTimeOfDay(editingRoutine.timeOfDay);
      setPillarId(editingRoutine.pillarId);
      setTimeBlockEnabled(!!editingRoutine.timeBlock);
      setTimeStart(editingRoutine.timeBlock?.start ?? '09:00');
      setTimeEnd(editingRoutine.timeBlock?.end ?? '09:30');
      setDeadlineEnabled(!!editingRoutine.deadline);
      setDeadline(editingRoutine.deadline ?? '');
      setActivityType(editingRoutine.activityType ?? 'gym');
    } else {
      setTab('suggestions');
      setSelectedCategory(null);
      setTitle('');
      setDescription('');
      setDifficulty('medium');
      setTimeOfDay('anytime');
      setPillarId(initialPillarId ?? 'health');
      setTimeBlockEnabled(false);
      setTimeStart('09:00');
      setTimeEnd('09:30');
      setDeadlineEnabled(false);
      setDeadline('');
      setActivityType('gym');
    }
  }, [editingRoutine, initialPillarId, isOpen]);

  if (!isOpen) return null;

  const applysuggestion = (s: RoutineSuggestion) => {
    setTitle(s.title);
    setDescription(s.description);
    setDifficulty(s.difficulty);
    setTimeOfDay(s.timeOfDay);
    setPillarId(s.pillarId);
    if (s.suggestedTimeBlock) {
      setTimeBlockEnabled(true);
      setTimeStart(s.suggestedTimeBlock.start);
      setTimeEnd(s.suggestedTimeBlock.end);
    }
    if (s.activityType) setActivityType(s.activityType);
    setTab('custom');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      pillarId,
      title: title.trim(),
      description: description.trim() || undefined,
      difficulty,
      timeOfDay,
      timeBlock: timeBlockEnabled ? { start: timeStart, end: timeEnd } : undefined,
      deadline: deadlineEnabled && deadline ? deadline : undefined,
      activityType: pillarId === 'health' ? activityType : undefined,
      isActive: true,
    });
    onClose();
  };

  // Which suggestions to show
  const visibleSuggestions = selectedCategory
    ? ADHD_SUGGESTIONS.filter((s) => s.categoryLabel === selectedCategory)
    : ADHD_SUGGESTIONS;

  const currentPillar = DEFAULT_PILLARS.find((p) => p.id === pillarId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      <div
        className="w-full rounded-t-2xl flex flex-col"
        style={{
          backgroundColor: '#13131A',
          border: '1px solid #1E1E2E',
          maxHeight: '92vh',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#1E1E2E' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-2 pb-3 flex-shrink-0">
          <h2
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '22px',
              color: '#F8F9FA',
              letterSpacing: '0.05em',
            }}
          >
            {editingRoutine ? 'EDIT ROUTINE' : 'ADD ROUTINE'}
          </h2>
          <button
            onClick={onClose}
            style={{ color: '#6C757D', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        {!editingRoutine && (
          <div className="flex px-4 gap-2 pb-3 flex-shrink-0">
            {(['suggestions', 'custom'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  backgroundColor: tab === t ? '#E63946' : '#1E1E2E',
                  color: tab === t ? '#F8F9FA' : '#6C757D',
                  border: 'none',
                  minHeight: '44px',
                  WebkitTapHighlightColor: 'transparent',
                  cursor: 'pointer',
                } as React.CSSProperties}
              >
                {t === 'suggestions' ? 'ADHD SUGGESTIONS' : 'CUSTOM'}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">

          {/* ── SUGGESTIONS TAB ──────────────────────────── */}
          {tab === 'suggestions' && (
            <div>
              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: selectedCategory === null ? '#E63946' : '#1E1E2E',
                    color: selectedCategory === null ? '#F8F9FA' : '#6C757D',
                    border: 'none',
                    minHeight: '36px',
                    WhiteSpace: 'nowrap',
                    WebkitTapHighlightColor: 'transparent',
                    cursor: 'pointer',
                  } as React.CSSProperties}
                >
                  All
                </button>
                {SUGGESTION_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
                    style={{
                      flexShrink: 0,
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: selectedCategory === cat.label ? cat.color + '25' : '#1E1E2E',
                      color: selectedCategory === cat.label ? cat.color : '#6C757D',
                      border: `1px solid ${selectedCategory === cat.label ? cat.color : 'transparent'}`,
                      minHeight: '36px',
                      whiteSpace: 'nowrap',
                      WebkitTapHighlightColor: 'transparent',
                      cursor: 'pointer',
                    } as React.CSSProperties}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  color: '#6C757D',
                  marginBottom: '12px',
                  lineHeight: '1.5',
                }}
              >
                Research-backed routines for neurodivergent brains. Tap{' '}
                <span style={{ color: '#4CC9F0' }}>Info</span> to see the science.
                Tap <span style={{ color: '#E63946' }}>Use</span> to customize it.
              </p>

              {visibleSuggestions.map((s) => (
                <SuggestionCard key={s.id} suggestion={s} onUse={applysuggestion} />
              ))}

              <button
                onClick={() => setTab('custom')}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-4 mt-2"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px dashed #1E1E2E',
                  color: '#6C757D',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  minHeight: '52px',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <ChevronRight size={15} />
                Build from scratch instead
              </button>
            </div>
          )}

          {/* ── CUSTOM TAB ───────────────────────────────── */}
          {tab === 'custom' && (
            <div className="space-y-4">
              {/* Pillar */}
              <div>
                <label style={labelStyle}>Pillar</label>
                <div className="flex gap-2 flex-wrap">
                  {DEFAULT_PILLARS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPillarId(p.id)}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor: pillarId === p.id ? p.color + '25' : '#1E1E2E',
                        color: pillarId === p.id ? p.color : '#6C757D',
                        border: `1px solid ${pillarId === p.id ? p.color : '#1E1E2E'}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        minHeight: '44px',
                        WebkitTapHighlightColor: 'transparent',
                        cursor: 'pointer',
                      } as React.CSSProperties}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={labelStyle}>Routine Name *</label>
                <input
                  type="text"
                  inputMode="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What is the routine?"
                  autoFocus={tab === 'custom'}
                  style={{
                    width: '100%',
                    backgroundColor: '#0A0A0F',
                    border: `1px solid ${currentPillar?.color ?? '#1E1E2E'}40`,
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '16px',
                    color: '#F8F9FA',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    caretColor: '#E63946',
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any context or notes..."
                  rows={2}
                  style={{
                    width: '100%',
                    backgroundColor: '#0A0A0F',
                    border: '1px solid #1E1E2E',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '16px',
                    color: '#F8F9FA',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    resize: 'none',
                    caretColor: '#E63946',
                  }}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label style={labelStyle}>Starting Difficulty</label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: '8px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: difficulty === d ? DIFF_COLORS[d] + '25' : '#1E1E2E',
                        color: difficulty === d ? DIFF_COLORS[d] : '#6C757D',
                        border: `1px solid ${difficulty === d ? DIFF_COLORS[d] : '#1E1E2E'}`,
                        minHeight: '48px',
                        WebkitTapHighlightColor: 'transparent',
                        cursor: 'pointer',
                      } as React.CSSProperties}
                    >
                      {d === 'easy' ? 'Easy +10' : d === 'medium' ? 'Med +25' : 'Hard +50'}
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', marginTop: '6px', lineHeight: '1.4' }}>
                  XP adapts automatically to your real completion rate after 5+ days of data.
                </p>
              </div>

              {/* Activity Type (health pillar only — physical activities) */}
              {pillarId === 'health' && (
                <div>
                  <label style={labelStyle}>Activity Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {PHYSICAL_ACTIVITY_TYPES.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setActivityType(a.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: activityType === a.id ? a.color + '25' : '#1E1E2E',
                          color: activityType === a.id ? a.color : '#6C757D',
                          border: `1px solid ${activityType === a.id ? a.color : '#1E1E2E'}`,
                          minHeight: '40px',
                          WebkitTapHighlightColor: 'transparent',
                          cursor: 'pointer',
                        } as React.CSSProperties}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Time of Day */}
              <div>
                <label style={labelStyle}>Time of Day</label>
                <div className="flex gap-2 flex-wrap">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeOfDay(t)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        backgroundColor: timeOfDay === t ? '#E6394625' : '#1E1E2E',
                        color: timeOfDay === t ? '#E63946' : '#6C757D',
                        border: `1px solid ${timeOfDay === t ? '#E63946' : '#1E1E2E'}`,
                        minHeight: '44px',
                        WebkitTapHighlightColor: 'transparent',
                        cursor: 'pointer',
                      } as React.CSSProperties}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Specific Time Block</label>
                  <button
                    onClick={() => {
                      const next = !timeBlockEnabled;
                      setTimeBlockEnabled(next);
                      if (next) {
                        setTimeOfDay(getTimeOfDayFromHour(parseInt(timeStart.split(':')[0])));
                      }
                    }}
                    style={{
                      width: '44px',
                      height: '26px',
                      borderRadius: '13px',
                      backgroundColor: timeBlockEnabled ? '#E63946' : '#1E1E2E',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      flexShrink: 0,
                    } as React.CSSProperties}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: timeBlockEnabled ? '21px' : '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#F8F9FA',
                        transition: 'left 0.2s',
                      }}
                    />
                  </button>
                </div>
                {timeBlockEnabled && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', marginBottom: '4px' }}>Start</p>
                      <input
                        type="time"
                        value={timeStart}
                        onChange={(e) => {
                          setTimeStart(e.target.value);
                          setTimeOfDay(getTimeOfDayFromHour(parseInt(e.target.value.split(':')[0])));
                        }}
                        style={{
                          width: '100%',
                          backgroundColor: '#0A0A0F',
                          border: '1px solid #1E1E2E',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '16px',
                          color: '#F8F9FA',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          minHeight: '44px',
                        }}
                      />
                    </div>
                    <span style={{ color: '#6C757D', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginTop: '20px' }}>to</span>
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', marginBottom: '4px' }}>End</p>
                      <input
                        type="time"
                        value={timeEnd}
                        onChange={(e) => setTimeEnd(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#0A0A0F',
                          border: '1px solid #1E1E2E',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '16px',
                          color: '#F8F9FA',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          minHeight: '44px',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Deadline</label>
                  <button
                    onClick={() => setDeadlineEnabled((v) => !v)}
                    style={{
                      width: '44px',
                      height: '26px',
                      borderRadius: '13px',
                      backgroundColor: deadlineEnabled ? '#E63946' : '#1E1E2E',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      flexShrink: 0,
                    } as React.CSSProperties}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: deadlineEnabled ? '21px' : '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#F8F9FA',
                        transition: 'left 0.2s',
                      }}
                    />
                  </button>
                </div>
                {deadlineEnabled && (
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      backgroundColor: '#0A0A0F',
                      border: '1px solid #1E1E2E',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '16px',
                      color: '#F8F9FA',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      minHeight: '44px',
                    }}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    backgroundColor: '#1E1E2E',
                    color: '#6C757D',
                    minHeight: '56px',
                    border: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    cursor: 'pointer',
                  } as React.CSSProperties}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!title.trim()}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 700,
                    backgroundColor: title.trim() ? '#E63946' : '#1E1E2E',
                    color: title.trim() ? '#F8F9FA' : '#6C757D',
                    minHeight: '56px',
                    border: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    cursor: title.trim() ? 'pointer' : 'default',
                    transition: 'background-color 0.2s',
                  } as React.CSSProperties}
                >
                  {editingRoutine ? 'Save Changes' : 'Add Routine'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  color: '#6C757D',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '8px',
};
