import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface PhaseData {
  id: string;
  n: number;
  title: string;
  total: number;
  complete: number;
  pct: number;
}

interface LearningStats {
  tasks_completed: number;
  tasks_total: number;
  projects_completed: number;
  projects_total: number;
  total_completed: number;
  total_items: number;
  overall_pct: number;
  hours_done: number;
  total_hours: number;
  hours_per_day: number;
  current_phase_id: string;
  current_phase_title: string;
  started_at: string;
  streak: number;
  best_streak: number;
  phases: PhaseData[];
}

const PHASE_SHORT: Record<string, string> = {
  'Foundations': 'Foundations',
  'Core ML & Deep Learning': 'Core ML',
  'Generative AI, LLMs & Prompt Engineering': 'Gen AI & LLMs',
  'Advanced: RAG, Agents & Orchestration': 'RAG & Agents',
  'Production, MLOps & Business Integration': 'Production',
  'Specialization & Frontiers': 'Specialization',
};

const GREEN = '#06D6A0';
const YELLOW = '#FFD166';
const BLUE = '#4CC9F0';
const CARD = '#13131A';
const TILE = '#0A0A0F';
const BORDER = '#1E1E2E';
const MUTED = '#6C757D';
const WHITE = '#F8F9FA';

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      fontWeight: 700,
      color: MUTED,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: '10px',
    }}>
      {text}
    </div>
  );
}

function Bar({ pct, color = GREEN, height = 6 }: { pct: number; color?: string; height?: number }) {
  return (
    <div style={{ height, backgroundColor: BORDER, borderRadius: 4, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${Math.min(pct, 100)}%`,
        backgroundColor: color,
        borderRadius: 4,
        transition: 'width 0.5s ease',
      }} />
    </div>
  );
}

export function LearningProgress({ session }: { session: Session | null }) {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase || !session) return;
    setLoading(true);
    supabase
      .from('connector_stats')
      .select('stats')
      .eq('app_id', 'learningai')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        setStats((data?.stats as LearningStats) ?? null);
        setLoading(false);
      });
  }, [session]);

  const wrapStyle: React.CSSProperties = { padding: '20px 16px 8px', fontFamily: 'Inter, sans-serif' };

  if (!supabase || !session) {
    return (
      <div style={wrapStyle}>
        <SectionLabel text="LearningAI Progress" />
        <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📚</div>
          <div style={{ color: WHITE, fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Not signed in</div>
          <div style={{ color: MUTED, fontSize: '12px' }}>Sign into GRIND OS to see your LearningAI progress here.</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={wrapStyle}>
        <SectionLabel text="LearningAI Progress" />
        <div style={{ color: MUTED, fontSize: '13px', paddingTop: '8px' }}>Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={wrapStyle}>
        <SectionLabel text="LearningAI Progress" />
        <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔗</div>
          <div style={{ color: WHITE, fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>LearningAI not connected yet</div>
          <div style={{ color: MUTED, fontSize: '12px' }}>
            Open LearningAI and sign in with the same email — your progress will appear here automatically.
          </div>
        </div>
      </div>
    );
  }

  const hoursLeft = Math.round(stats.total_hours - stats.hours_done);
  const etaDays = stats.hours_per_day > 0 ? Math.ceil(hoursLeft / stats.hours_per_day) : null;
  const etaDate = etaDays ? new Date(Date.now() + etaDays * 86_400_000) : null;
  const etaStr = etaDate
    ? etaDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  return (
    <div style={wrapStyle} className="space-y-4">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <SectionLabel text="LearningAI Progress" />
        <div style={{
          backgroundColor: `${GREEN}18`,
          border: `1px solid ${GREEN}50`,
          borderRadius: '20px',
          padding: '2px 10px',
          fontSize: '10px',
          color: GREEN,
          fontWeight: 600,
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          marginBottom: '10px',
        }}>
          {stats.current_phase_title}
        </div>
      </div>

      {/* Overall progress card */}
      <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
          <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '64px', color: WHITE, lineHeight: 1 }}>
            {stats.overall_pct}%
          </span>
          <span style={{ color: MUTED, fontSize: '13px' }}>
            {stats.total_completed} / {stats.total_items} items
          </span>
        </div>
        <Bar pct={stats.overall_pct} color={GREEN} height={8} />
        <div style={{ marginTop: '6px', fontSize: '11px', color: MUTED }}>overall curriculum complete</div>
      </div>

      {/* 4-tile stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {[
          { label: 'Tasks', value: `${stats.tasks_completed}/${stats.tasks_total}` },
          { label: 'Projects', value: `${stats.projects_completed}/${stats.projects_total}` },
          { label: 'Hours Done', value: `${Math.round(stats.hours_done)}h` },
          { label: 'Streak', value: `${stats.streak}d` },
        ].map(({ label, value }) => (
          <div key={label} style={{ backgroundColor: TILE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '10px', color: MUTED, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {label}
            </div>
            <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '30px', color: WHITE, lineHeight: 1 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Phase grid */}
      <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px' }}>
        <SectionLabel text="Phases" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {(stats.phases ?? []).map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: TILE,
                border: `1px solid ${p.pct === 100 ? GREEN + '40' : BORDER}`,
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <div style={{ fontSize: '10px', color: MUTED, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                Phase {p.n}
              </div>
              <div style={{
                fontSize: '11px',
                color: p.pct === 100 ? GREEN : WHITE,
                fontWeight: 600,
                marginBottom: '8px',
                lineHeight: 1.3,
                minHeight: '28px',
              }}>
                {PHASE_SHORT[p.title] ?? p.title}
              </div>
              <Bar pct={p.pct} color={p.pct === 100 ? GREEN : BLUE} height={4} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10px', color: MUTED }}>
                <span>{p.complete}/{p.total}</span>
                <span style={{ color: p.pct === 100 ? GREEN : MUTED, fontWeight: p.pct === 100 ? 700 : 400 }}>
                  {p.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ETA card */}
      <div style={{ backgroundColor: CARD, border: `1px solid ${YELLOW}30`, borderRadius: '12px', padding: '16px' }}>
        <SectionLabel text="Estimated Finish" />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '44px', color: YELLOW, lineHeight: 1 }}>
            {etaStr}
          </span>
          {etaDays != null && (
            <span style={{ color: MUTED, fontSize: '13px' }}>~{etaDays} days</span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: MUTED }}>
          {etaDays != null
            ? `${hoursLeft}h remaining · at ${stats.hours_per_day}h/day`
            : 'Set your hours/day in LearningAI to see your ETA'}
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: '11px', color: MUTED, textAlign: 'center', paddingTop: '4px', paddingBottom: '12px' }}>
        Started {stats.started_at} · Best streak {stats.best_streak}d
      </div>
    </div>
  );
}
