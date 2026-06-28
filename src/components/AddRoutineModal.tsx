import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Routine } from '../types';
import { DEFAULT_PILLARS } from '../data/pillars';

interface AddRoutineModalProps {
  isOpen: boolean;
  initialPillarId?: string;
  editingRoutine?: Routine | null;
  onSave: (routine: Omit<Routine, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

type Difficulty = Routine['difficulty'];
type TimeOfDay = Routine['timeOfDay'];

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const TIMES: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'anytime'];

const DIFF_COLORS: Record<Difficulty, string> = {
  easy: '#06D6A0',
  medium: '#FFD166',
  hard: '#E63946',
};

export function AddRoutineModal({
  isOpen,
  initialPillarId,
  editingRoutine,
  onSave,
  onClose,
}: AddRoutineModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('anytime');
  const [pillarId, setPillarId] = useState(initialPillarId ?? 'health');

  useEffect(() => {
    if (editingRoutine) {
      setTitle(editingRoutine.title);
      setDescription(editingRoutine.description ?? '');
      setDifficulty(editingRoutine.difficulty);
      setTimeOfDay(editingRoutine.timeOfDay);
      setPillarId(editingRoutine.pillarId);
    } else {
      setTitle('');
      setDescription('');
      setDifficulty('medium');
      setTimeOfDay('anytime');
      setPillarId(initialPillarId ?? 'health');
    }
  }, [editingRoutine, initialPillarId, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      pillarId,
      title: title.trim(),
      description: description.trim() || undefined,
      difficulty,
      timeOfDay,
      isActive: true,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="w-full rounded-t-2xl"
        style={{
          backgroundColor: '#13131A',
          border: '1px solid #1E1E2E',
          maxHeight: '90vh',
          overflowY: 'auto',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#1E1E2E' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h2
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
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

        <div className="px-4 space-y-4">
          {/* Pillar selector */}
          <div>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6C757D',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Pillar
            </label>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_PILLARS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPillarId(p.id)}
                  className="px-3 py-2 rounded-lg"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: pillarId === p.id ? p.color + '30' : '#1E1E2E',
                    color: pillarId === p.id ? p.color : '#6C757D',
                    border: `1px solid ${pillarId === p.id ? p.color : '#1E1E2E'}`,
                    minHeight: '44px',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6C757D',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Title *
            </label>
            <input
              type="text"
              inputMode="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is the routine?"
              className="w-full rounded-lg px-4 py-3 outline-none"
              style={{
                backgroundColor: '#0A0A0F',
                border: '1px solid #1E1E2E',
                color: '#F8F9FA',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                caretColor: '#E63946',
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6C757D',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any context or details..."
              rows={2}
              className="w-full rounded-lg px-4 py-3 outline-none resize-none"
              style={{
                backgroundColor: '#0A0A0F',
                border: '1px solid #1E1E2E',
                color: '#F8F9FA',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                caretColor: '#E63946',
              }}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6C757D',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Difficulty
            </label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="flex-1 py-3 rounded-lg capitalize font-medium"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: difficulty === d ? DIFF_COLORS[d] + '30' : '#1E1E2E',
                    color: difficulty === d ? DIFF_COLORS[d] : '#6C757D',
                    border: `1px solid ${difficulty === d ? DIFF_COLORS[d] : '#1E1E2E'}`,
                    minHeight: '44px',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {d === 'easy' ? 'Easy +10' : d === 'medium' ? 'Med +25' : 'Hard +50'}
                </button>
              ))}
            </div>
          </div>

          {/* Time of day */}
          <div>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6C757D',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Time of Day
            </label>
            <div className="flex gap-2 flex-wrap">
              {TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeOfDay(t)}
                  className="px-4 py-3 rounded-lg capitalize"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: timeOfDay === t ? '#E6394630' : '#1E1E2E',
                    color: timeOfDay === t ? '#E63946' : '#6C757D',
                    border: `1px solid ${timeOfDay === t ? '#E63946' : '#1E1E2E'}`,
                    minHeight: '44px',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                backgroundColor: '#1E1E2E',
                color: '#6C757D',
                minHeight: '56px',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-4 rounded-xl"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 700,
                backgroundColor: title.trim() ? '#E63946' : '#1E1E2E',
                color: title.trim() ? '#F8F9FA' : '#6C757D',
                minHeight: '56px',
                WebkitTapHighlightColor: 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              {editingRoutine ? 'Save Changes' : 'Add Routine'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
