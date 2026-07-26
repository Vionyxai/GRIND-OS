import { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { TimeCategory } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KEYS } from '../utils/storage';

const TOTAL_HOURS = 168;

const PRESET_COLORS = [
  '#E63946', '#FF9F1C', '#FFD166', '#06D6A0',
  '#4CC9F0', '#7209B7', '#F72585', '#4361EE',
];

const DEFAULT_CATEGORIES: TimeCategory[] = [
  { id: 'tc-sleep', label: 'Sleep', color: '#7209B7', hoursPerWeek: 49 },
  { id: 'tc-work', label: 'Work', color: '#4361EE', hoursPerWeek: 40 },
  { id: 'tc-exercise', label: 'Exercise', color: '#06D6A0', hoursPerWeek: 5 },
  { id: 'tc-meals', label: 'Meals & Prep', color: '#FF9F1C', hoursPerWeek: 7 },
];

export function TimeDesign() {
  const [categories, setCategories] = useLocalStorage<TimeCategory[]>(
    KEYS.TIME_CATEGORIES,
    DEFAULT_CATEGORIES
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  const totalAllocated = categories.reduce((sum, c) => sum + c.hoursPerWeek, 0);
  const unaccounted = TOTAL_HOURS - totalAllocated;
  const isOver = unaccounted < 0;

  const updateHours = (id: string, delta: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, hoursPerWeek: Math.max(0, Math.min(168, c.hoursPerWeek + delta)) } : c
      )
    );
  };

  const startEdit = (cat: TimeCategory) => {
    setEditingId(cat.id);
    setEditValue(String(cat.hoursPerWeek));
  };

  const commitEdit = (id: string) => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed)) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, hoursPerWeek: Math.max(0, Math.min(168, parsed)) } : c))
      );
    }
    setEditingId(null);
  };

  const updateLabel = (id: string, label: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setConfirmDeleteId(null);
  };

  const addCategory = () => {
    if (!newLabel.trim()) return;
    const newCat: TimeCategory = {
      id: `tc-${Date.now()}`,
      label: newLabel.trim(),
      color: newColor,
      hoursPerWeek: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    setNewLabel('');
    setNewColor(PRESET_COLORS[0]);
    setAddingNew(false);
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={18} color="#4CC9F0" />
          <h1
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '26px',
              color: '#F8F9FA',
              letterSpacing: '0.06em',
            }}
          >
            CREATING YOUR TIME
          </h1>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D' }}>
          168 hours every week. Where are yours going?
        </p>
      </div>

      {/* Allocation overview card */}
      <div className="px-4 pb-4">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        >
          {/* Segmented bar */}
          <div
            className="flex w-full rounded-full overflow-hidden mb-3"
            style={{ height: '14px', backgroundColor: '#1E1E2E' }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  width: `${Math.max(0, (cat.hoursPerWeek / TOTAL_HOURS) * 100)}%`,
                  backgroundColor: cat.color,
                  transition: 'width 0.3s ease',
                  minWidth: cat.hoursPerWeek > 0 ? '3px' : '0',
                }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-1">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: cat.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: '#6C757D',
                  }}
                >
                  {cat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid #1E1E2E' }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '34px',
                  color: '#F8F9FA',
                  letterSpacing: '0.04em',
                }}
              >
                {totalAllocated}
              </span>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: '#6C757D',
                  marginLeft: '6px',
                }}
              >
                / 168 hrs planned
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '22px',
                  color: isOver ? '#E63946' : unaccounted === 0 ? '#06D6A0' : unaccounted <= 20 ? '#FFD166' : '#6C757D',
                  letterSpacing: '0.04em',
                }}
              >
                {isOver ? `${Math.abs(unaccounted)}H OVER` : unaccounted === 0 ? 'FULL WEEK' : `${unaccounted}H FREE`}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D' }}>
                {isOver ? 'exceeds 168h' : unaccounted === 0 ? 'every hour accounted' : 'unplanned time'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div className="px-4 space-y-2 pb-4">
        {categories.map((cat) => {
          const pct = TOTAL_HOURS > 0 ? Math.round((cat.hoursPerWeek / TOTAL_HOURS) * 100) : 0;
          const hrsPerDay = (cat.hoursPerWeek / 7).toFixed(1);
          const minsPerDay = Math.round((cat.hoursPerWeek / 7) * 60);
          const isDeleting = confirmDeleteId === cat.id;
          const isEditingHours = editingId === cat.id;

          return (
            <div
              key={cat.id}
              className="rounded-xl px-3 py-3"
              style={{
                backgroundColor: '#13131A',
                border: `1px solid ${cat.color}25`,
              }}
            >
              {/* Top row: color dot + name + hours control */}
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: cat.color,
                    flexShrink: 0,
                  }}
                />

                {/* Editable label */}
                <input
                  value={cat.label}
                  onChange={(e) => updateLabel(cat.id, e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#F8F9FA',
                    minWidth: 0,
                  }}
                />

                {/* Hours control */}
                <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
                  <button
                    onClick={() => updateHours(cat.id, -1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#1E1E2E',
                      border: 'none',
                      color: '#F8F9FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      WebkitTapHighlightColor: 'transparent',
                    } as React.CSSProperties}
                  >
                    −
                  </button>

                  {isEditingHours ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => commitEdit(cat.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit(cat.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      style={{
                        width: '52px',
                        textAlign: 'center',
                        background: '#1E1E2E',
                        border: `1px solid ${cat.color}60`,
                        borderRadius: '6px',
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '20px',
                        color: cat.color,
                        letterSpacing: '0.04em',
                        padding: '2px 4px',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => startEdit(cat)}
                      style={{
                        width: '52px',
                        textAlign: 'center',
                        background: 'transparent',
                        border: 'none',
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '22px',
                        color: cat.color,
                        letterSpacing: '0.04em',
                        cursor: 'text',
                        padding: '0',
                      }}
                    >
                      {cat.hoursPerWeek}h
                    </button>
                  )}

                  <button
                    onClick={() => updateHours(cat.id, 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#1E1E2E',
                      border: 'none',
                      color: '#F8F9FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      WebkitTapHighlightColor: 'transparent',
                    } as React.CSSProperties}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Mini progress bar */}
              <div
                className="rounded-full overflow-hidden mt-2 mb-2"
                style={{ height: '3px', backgroundColor: '#1E1E2E', marginLeft: '18px' }}
              >
                <div
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    height: '100%',
                    backgroundColor: cat.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Sub row: stats + delete */}
              <div
                className="flex items-center justify-between"
                style={{ marginLeft: '18px' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      color: '#6C757D',
                    }}
                  >
                    {hrsPerDay}h/day
                  </span>
                  <span style={{ color: '#1E1E2E', fontSize: '10px' }}>·</span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      color: '#6C757D',
                    }}
                  >
                    {minsPerDay}min/day
                  </span>
                  <span style={{ color: '#1E1E2E', fontSize: '10px' }}>·</span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      color: cat.color,
                      fontWeight: 600,
                    }}
                  >
                    {pct}%
                  </span>
                </div>

                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        color: '#E63946',
                      }}
                    >
                      Remove?
                    </span>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        color: '#E63946',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        padding: '0',
                      }}
                    >
                      YES
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        color: '#6C757D',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        padding: '0',
                      }}
                    >
                      NO
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(cat.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6C757D',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      WebkitTapHighlightColor: 'transparent',
                    } as React.CSSProperties}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add category */}
      <div className="px-4 pb-8">
        {addingNew ? (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#13131A', border: '1px solid #4CC9F030' }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: '#4CC9F0',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              NEW CATEGORY
            </p>
            <input
              autoFocus
              placeholder="e.g. Family time, Commute, Side project..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCategory();
                if (e.key === 'Escape') setAddingNew(false);
              }}
              style={{
                width: '100%',
                background: '#1E1E2E',
                border: '1px solid #2E2E3E',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#F8F9FA',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                outline: 'none',
                marginBottom: '14px',
                boxSizing: 'border-box',
              } as React.CSSProperties}
            />
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: '#6C757D',
                letterSpacing: '0.06em',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              COLOR
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: newColor === c ? '2px solid #F8F9FA' : '2px solid transparent',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                  } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCategory}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#4CC9F0',
                  color: '#0A0A0F',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                ADD
              </button>
              <button
                onClick={() => {
                  setAddingNew(false);
                  setNewLabel('');
                }}
                style={{
                  padding: '11px 18px',
                  borderRadius: '8px',
                  border: '1px solid #1E1E2E',
                  backgroundColor: 'transparent',
                  color: '#6C757D',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingNew(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
            style={{
              backgroundColor: 'transparent',
              border: '1px dashed #1E1E2E',
              color: '#6C757D',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              WebkitTapHighlightColor: 'transparent',
            } as React.CSSProperties}
          >
            <Plus size={15} />
            ADD CATEGORY
          </button>
        )}
      </div>
    </div>
  );
}
