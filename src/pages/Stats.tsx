import { DailyLog, Routine, Pillar } from '../types';
import { getLast7Days, getLast14Days, getLast30Days, getShortDayLabel } from '../utils/dates';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from 'recharts';

interface StatsProps {
  logs: DailyLog[];
  routines: Routine[];
  pillars: Pillar[];
}

export function Stats({ logs, routines, pillars }: StatsProps) {
  const activeRoutines = routines.filter((r) => r.isActive);

  // Week bar data
  const last7 = getLast7Days();
  const weekData = last7.map((date) => {
    const log = logs.find((l) => l.date === date);
    const completed = log?.completedRoutineIds.length ?? 0;
    const total = activeRoutines.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { day: getShortDayLabel(date), pct, completed, total, date };
  });

  const bestDay = [...weekData].sort((a, b) => b.pct - a.pct)[0];

  // 14-day momentum trend
  const last14 = getLast14Days();
  const momentumData = last14.map((date) => {
    const log = logs.find((l) => l.date === date);
    return { day: getShortDayLabel(date), momentum: log?.momentumScore ?? 0, date };
  });

  // 30-day pillar breakdown
  const last30 = getLast30Days();
  const pillarStats = pillars.map((pillar) => {
    const pillarRoutines = activeRoutines.filter((r) => r.pillarId === pillar.id);
    let completed = 0;
    let total = 0;
    last30.forEach((date) => {
      const log = logs.find((l) => l.date === date);
      total += pillarRoutines.length;
      if (log) {
        completed += pillarRoutines.filter((r) => log.completedRoutineIds.includes(r.id)).length;
      }
    });
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { pillar, rate, completed, total };
  });

  // Best weeks
  const logsWithData = logs.filter((l) => l.completedRoutineIds.length > 0);
  const weekMap = new Map<string, DailyLog[]>();
  logsWithData.forEach((log) => {
    const date = new Date(log.date + 'T00:00:00');
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    const key = monday.toISOString().split('T')[0];
    const existing = weekMap.get(key) ?? [];
    weekMap.set(key, [...existing, log]);
  });

  const weekSummaries = Array.from(weekMap.entries())
    .map(([weekStart, weekLogs]) => {
      const totalCompleted = weekLogs.reduce((s, l) => s + l.completedRoutineIds.length, 0);
      const totalPossible = weekLogs.length * activeRoutines.length;
      const rate = totalPossible > 0 ? totalCompleted / totalPossible : 0;
      return { weekStart, rate, weekLogs };
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3);

  return (
    <div className="px-4 py-4 space-y-6 overflow-x-hidden">
      {/* Header */}
      <p
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '28px',
          color: '#F8F9FA',
          letterSpacing: '0.06em',
        }}
      >
        PERFORMANCE
      </p>

      {/* Week bar chart */}
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
            marginBottom: '16px',
          }}
        >
          THIS WEEK
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weekData} barSize={28}>
            <XAxis
              dataKey="day"
              tick={{ fill: '#6C757D', fontSize: 11, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.[0]) return null;
                const d = payload[0].payload as (typeof weekData)[0];
                return (
                  <div
                    style={{
                      backgroundColor: '#13131A',
                      border: '1px solid #1E1E2E',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                  >
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#F8F9FA' }}>
                      {d.completed}/{d.total} · {d.pct}%
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {weekData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.pct >= 80 ? '#06D6A0' : entry.pct >= 50 ? '#FFD166' : '#E63946'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {bestDay && bestDay.pct > 0 && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: '#6C757D',
              marginTop: '8px',
              textAlign: 'center',
            }}
          >
            Best day this week:{' '}
            <span style={{ color: '#F8F9FA', fontWeight: 600 }}>
              {bestDay.day} ({bestDay.pct}%)
            </span>
          </p>
        )}
      </div>

      {/* Momentum trend */}
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
            marginBottom: '16px',
          }}
        >
          14-DAY MOMENTUM
        </p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={momentumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#6C757D', fontSize: 10, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.[0]) return null;
                const d = payload[0].payload as (typeof momentumData)[0];
                return (
                  <div
                    style={{
                      backgroundColor: '#13131A',
                      border: '1px solid #1E1E2E',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                  >
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#4CC9F0' }}>
                      {d.momentum}
                    </p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="momentum"
              stroke="#4CC9F0"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#4CC9F0' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pillar breakdown */}
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
            marginBottom: '16px',
          }}
        >
          30-DAY PILLAR FOCUS
        </p>
        <div className="space-y-4">
          {pillarStats.map(({ pillar, rate }) => (
            <div key={pillar.id}>
              <div className="flex justify-between items-center mb-1">
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#F8F9FA',
                  }}
                >
                  {pillar.name}
                </span>
                <span
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: '15px',
                    color: pillar.color,
                    letterSpacing: '0.04em',
                  }}
                >
                  {rate}%
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  backgroundColor: '#1E1E2E',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${rate}%`,
                    height: '100%',
                    backgroundColor: pillar.color,
                    borderRadius: '3px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best weeks */}
      {weekSummaries.length > 0 && (
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
              marginBottom: '16px',
            }}
          >
            WHAT WORKED BEST
          </p>
          <div className="space-y-4">
            {weekSummaries.map(({ weekStart, rate, weekLogs }, idx) => {
              const allCompleted = new Set(weekLogs.flatMap((l) => l.completedRoutineIds));
              const topRoutines = routines.filter((r) => allCompleted.has(r.id)).slice(0, 4);
              return (
                <div
                  key={weekStart}
                  className="rounded-lg p-3"
                  style={{ backgroundColor: '#0A0A0F', border: '1px solid #1E1E2E' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      style={{
                        fontFamily: '"Bebas Neue", sans-serif',
                        fontSize: '13px',
                        color: '#E63946',
                        letterSpacing: '0.06em',
                      }}
                    >
                      #{idx + 1} WEEK OF {weekStart.slice(5)}
                    </p>
                    <p
                      style={{
                        fontFamily: '"Bebas Neue", sans-serif',
                        fontSize: '16px',
                        color: '#FFD166',
                      }}
                    >
                      {Math.round(rate * 100)}%
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      color: '#6C757D',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '6px',
                    }}
                  >
                    WHAT WORKED THAT WEEK
                  </p>
                  {topRoutines.map((r) => (
                    <p
                      key={r.id}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        color: '#F8F9FA',
                        marginBottom: '2px',
                      }}
                    >
                      · {r.title}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weekSummaries.length === 0 && logsWithData.length === 0 && (
        <div className="text-center py-8">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6C757D' }}>
            Complete routines to see your stats here.
          </p>
        </div>
      )}
    </div>
  );
}
