import { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { TimeCategory } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KEYS } from '../utils/storage';

const WEEKDAY_TOTAL = 120; // 5d × 24h
const WEEKEND_TOTAL = 48;  // 2d × 24h
const WEEK_TOTAL = 168;

const PRESET_COLORS = [
  '#E63946', '#FF9F1C', '#FFD166', '#06D6A0',
  '#4CC9F0', '#7209B7', '#F72585', '#4361EE',
];

const DEFAULT_CATEGORIES: TimeCategory[] = [
  { id: 'tc-sleep',    label: 'Sleep',         color: '#7209B7', weekdayHoursPerDay: 7, weekendHoursPerDay: 8 },
  { id: 'tc-work',     label: '9-5 Work',      color: '#4361EE', weekdayHoursPerDay: 8, weekendHoursPerDay: 2 },
  { id: 'tc-exercise', label: 'Exercise',       color: '#06D6A0', weekdayHoursPerDay: 1, weekendHoursPerDay: 2 },
  { id: 'tc-meals',    label: 'Meals & Prep',  color: '#FF9F1C', weekdayHoursPerDay: 1, weekendHoursPerDay: 1 },
];

type ViewMode = 'weekday' | 'weekend';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrate(raw: any): TimeCategory {
  if (typeof raw.weekdayHoursPerDay === 'number') return raw as TimeCategory;
  const daily = Math.round((raw.hoursPerWeek ?? 0) / 7);
  return { id: raw.id, label: raw.label, color: raw.color, weekdayHoursPerDay: daily, weekendHoursPerDay: daily };
}

export function TimeDesign() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawCats, setRawCats] = useLocalStorage<any[]>(KEYS.TIME_CATEGORIES, DEFAULT_CATEGORIES);
  const [viewMode, setViewMode] = useState<ViewMode>('weekday');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  const categories: TimeCategory[] = rawCats.map(migrate);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setCategories = (updater: (prev: TimeCategory[]) => TimeCategory[]) => {
    setRawCats(() => updater(categories));
  };

  const isWeekday = viewMode === 'weekday';
  const periodTotal = isWeekday ? WEEKDAY_TOTAL : WEEKEND_TOTAL;
  const periodDays = isWeekday ? 5 : 2;

  const getHours = (cat: TimeCategory) =>
    isWeekday ? cat.weekdayHoursPerDay : cat.weekendHoursPerDay;

  const totalAllocatedPeriod = categories.reduce(
    (sum, c) => sum + getHours(c) * periodDays, 0
  );
  const totalWeekHours = categories.reduce(
    (sum, c) => sum + c.weekdayHoursPerDay * 5 + c.weekendHoursPerDay * 2, 0
  );
  const freePeriod = periodTotal - totalAllocatedPeriod;
  const weekFree = WEEK_TOTAL - totalWeekHours;
  const periodOver = freePeriod < 0;

  const updateHours = (id: string, delta: number) => {
    const field = isWeekday ? 'weekdayHoursPerDay' : 'weekendHoursPerDay';
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: Math.max(0, Math.min(24, c[field] + delta)) } : c
      )
    );
  };

  const startEdit = (cat: TimeCategory) => {
    setEditingId(cat.id);
    setEditValue(String(getHours(cat)));
  };

  const commitEdit = (id: string) => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed)) {
      const field = isWeekday ? 'weekdayHoursPerDay' : 'weekendHoursPerDay';
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: Math.max(0, Math.min(24, parsed)) } : c))
      );
    }
    setEditingId(null);
  };

  const updateLabel = (id: string, label: string) =>
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));

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
      weekdayHoursPerDay: 0,
      weekendHoursPerDay: 0,
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

      {/* Weekday / Weekend toggle */}
      <div className="px-4 pb-4">
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: '1px solid #1E1E2E' }}
        >
          <button
            onClick={() => setViewMode('weekday')}
            style={{
              flex: 1,
              padding: '10px 0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              backgroundColor: isWeekday ? '#4361EE' : 'transparent',
              color: isWeekday ? '#F8F9FA' : '#6C757D',
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            } as React.CSSProperties}
          >
            WEEKDAYS
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 400,
                opacity: 0.75,
                marginTop: '2px',
              }}
            >
              MON – FRI · 120H
            </span>
          </button>
          <button
            onClick={() => setViewMode('weekend')}
            style={{
              flex: 1,
              padding: '10px 0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              backgroundColor: !isWeekday ? '#F72585' : 'transparent',
              color: !isWeekday ? '#F8F9FA' : '#6C757D',
              border: 'none',
              borderLeft: '1px solid #1E1E2E',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            } as React.CSSProperties}
          >
            WEEKEND
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 400,
                opacity: 0.75,
                marginTop: '2px',
              }}
            >
              SAT – SUN · 48H
            </span>
          </button>
        </div>
      </div>

      {/* Weekend note */}
      {!isWeekday && (
        <div className="px-4 mb-3">
          <div
            className="rounded-lg px-3 py-2"
            style={{ backgroundColor: '#F7258510', border: '1px solid #F7258525' }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: '#F72585',
                lineHeight: '1.4',
              }}
            >
              Hours are set per day and averaged across Sat + Sun — so half-day Saturday (4h) + full Sunday off (0h) = 2h/day here.
            </p>
          </div>
        </div>
      )}

      {/* Overview card */}
      <div className="px-4 pb-4">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        >
          {/* Segmented bar */}
          <div
            className="flex w-full rounded-full overflow-hidden mb-3"
            style={{ height: '12px', backgroundColor: '#1E1E2E' }}
          >
            {categories.map((cat) => {
              const hrs = getHours(cat) * periodDays;
              return (
                <div
                  key={cat.id}
                  style={{
                    width: `${Math.max(0, (hrs / periodTotal) * 100)}%`,
                    backgroundColor: cat.color,
                    transition: 'width 0.3s ease',
                    minWidth: hrs > 0 ? '3px' : '0',
                  }}
                />
              );
            })}
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
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D' }}
                >
                  {cat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Planned vs free */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid #1E1E2E' }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '30px',
                  color: '#F8F9FA',
                  letterSpacing: '0.04em',
                }}
              >
                {totalAllocatedPeriod}
              </span>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#6C757D',
                  marginLeft: '5px',
                }}
              >
                / {periodTotal}h {isWeekday ? 'weekday' : 'weekend'}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '20px',
                  letterSpacing: '0.04em',
                  color: periodOver
                    ? '#E63946'
                    : freePeriod === 0
                    ? '#06D6A0'
                    : freePeriod <= 12
                    ? '#FFD166'
                    : '#6C757D',
                }}
              >
                {periodOver
                  ? `${Math.abs(freePeriod)}H OVER`
                  : freePeriod === 0
                  ? 'FULL'
                  : `${freePeriod}H FREE`}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#6C757D' }}>
                {isWeekday ? 'Mon–Fri' : 'Sat–Sun'}
              </p>
            </div>
          </div>

          {/* Full week total */}
          <div
            className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: '1px solid #1E1E2E' }}
          >
            <span
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D' }}
            >
              Full week total (168h)
            </span>
            <span
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '16px',
                letterSpacing: '0.04em',
                color:
                  weekFree < 0
                    ? '#E63946'
                    : weekFree === 0
                    ? '#06D6A0'
                    : weekFree <= 20
                    ? '#FFD166'
                    : '#6C757D',
              }}
            >
              {totalWeekHours} / 168H
              {weekFree > 0 && (
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 400,
                    marginLeft: '5px',
                    color: '#6C757D',
                  }}
                >
                  ({weekFree}h free)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div className="px-4 space-y-2 pb-4">
        {categories.map((cat) => {
          const dayHrs = getHours(cat);
          const periodHrs = dayHrs * periodDays;
          const pct = Math.round((periodHrs / periodTotal) * 100);
          const weekHrs = cat.weekdayHoursPerDay * 5 + cat.weekendHoursPerDay * 2;
          const isDeleting = confirmDeleteId === cat.id;
          const isEditingThis = editingId === cat.id;

          return (
            <div
              key={cat.id}
              className="rounded-xl px-3 py-3"
              style={{
                backgroundColor: '#13131A',
                border: `1px solid ${cat.color}25`,
              }}
            >
              {/* Top row: dot + label + hour control */}
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

                  {isEditingThis ? (
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
                      {dayHrs}H
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D' }}
                  >
                    {dayHrs}h/day
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
                  <span style={{ color: '#1E1E2E', fontSize: '10px' }}>·</span>
                  <span
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D' }}
                  >
                    {weekHrs}h/wk
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
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: '#6C757D',
                marginBottom: '10px',
                lineHeight: '1.4',
              }}
            >
              Added with 0h on both weekday and weekend — set each tab separately.
            </p>
            <input
              autoFocus
              placeholder="e.g. AI Work, Family, Commute, Free time..."
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
