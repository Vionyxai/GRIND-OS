import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Section {
  heading: string;
  body: string;
  steps?: string[];
}

interface Article {
  id: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  title: string;
  summary: string;
  sections: Section[];
}

const ARTICLES: Article[] = [
  {
    id: 'grindos-setup',
    tag: 'SETUP',
    tagBg: '#E6394618',
    tagColor: '#E63946',
    title: 'Get the Most Out of GRIND OS',
    summary: 'Connect LearningAI, understand your pillars, and build real momentum.',
    sections: [
      {
        heading: 'What GRIND OS Is Built For',
        body: 'GRIND OS is ADHD-friendly, mobile-first, and built around one screen at a time. The goal is not perfect tracking — it\'s consistent daily action. Five minutes a day, every day, beats two hours once a week. The app is designed to remove friction, not add it.',
      },
      {
        heading: 'Your 6 Pillars',
        body: 'Every routine you create maps to one of six pillars: Health & Body, Money & Business, Relationships, Mental / Spiritual, Skills & Learning, and Leisure & Play. These are the domains that matter. Start with 1–2 routines per pillar — don\'t overload the Today screen. You can always add more once the habit is locked in.',
      },
      {
        heading: 'The Today Tab',
        body: 'The Today tab is your daily cockpit. Open it once a day, tap each routine as you complete it. Streak and XP update in real time. Missing a day resets your current streak, but your best streak is saved forever. Don\'t obsess over the streak — the point is showing up, not gaming the number.',
      },
      {
        heading: 'Connecting LearningAI',
        body: 'Once connected, every task you finish in LearningAI automatically checks off a GRIND OS routine — no manual logging required.',
        steps: [
          'Open LearningAI and sign in with the same email you use for GRIND OS.',
          'LearningAI registers itself in GRIND OS automatically in the background.',
          'In GRIND OS, go to Settings → Connected Apps and find LearningAI in the list.',
          'Under LearningAI, choose which routine it should auto-complete (e.g. a "Study Session" routine in the Skills pillar).',
          'Done. Every task completion in LearningAI now checks off that routine in GRIND OS and earns you XP.',
        ],
      },
      {
        heading: 'XP, Levels & Streaks',
        body: 'Completing routines earns XP. The Level Up tab tracks your rank, total XP, and badges. Your daily streak is the number of consecutive days with at least one completion. Weekly streaks build real momentum — but treat the streak as a signal, not a prison. If you miss a day, start again immediately.',
      },
      {
        heading: 'Weekly Review',
        body: 'Open the Stats tab every Sunday evening. It shows completion rates by pillar for the past 7 days. Use it to spot neglected pillars — not to judge yourself. If your Health pillar is at 20% and Skills is at 90%, you know where to shift focus next week. Adjust routines accordingly, then close the app and go live your life.',
      },
    ],
  },
];

const MUTED = '#6C757D';
const WHITE = '#F8F9FA';
const BORDER = '#1E1E2E';
const CARD = '#13131A';
const TILE = '#0A0A0F';

function ArticleCard({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            backgroundColor: article.tagBg,
            color: article.tagColor,
            fontSize: '10px',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.1em',
            padding: '3px 8px',
            borderRadius: '20px',
          }}>
            {article.tag}
          </div>
          <div style={{ color: MUTED }}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 600, color: WHITE, margin: 0, lineHeight: 1.3 }}>
          {article.title}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: MUTED, margin: 0, lineHeight: 1.5 }}>
          {article.summary}
        </p>
      </button>

      {/* Expanded body */}
      {open && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {article.sections.map((section) => (
            <div key={section.heading}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: MUTED,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
              }}>
                {section.heading}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: WHITE, margin: 0, lineHeight: 1.65 }}>
                {section.body}
              </p>
              {section.steps && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {section.steps.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        backgroundColor: TILE, borderRadius: '8px', padding: '10px 12px',
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: '#E6394618', border: '1px solid #E6394650',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 700, color: '#E63946', fontFamily: 'Inter, sans-serif',
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: WHITE, margin: 0, lineHeight: 1.5 }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Learn() {
  return (
    <div style={{ padding: '20px 16px 32px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <p style={{
        fontFamily: '"Bebas Neue", sans-serif',
        fontSize: '28px',
        color: WHITE,
        letterSpacing: '0.06em',
        margin: '0 0 4px',
      }}>
        LEARN
      </p>
      <p style={{ fontSize: '13px', color: MUTED, margin: '0 0 20px' }}>
        Build the knowledge that matters.
      </p>

      {/* Article cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Footer */}
      <p style={{ fontSize: '11px', color: BORDER, textAlign: 'center', marginTop: '32px' }}>
        More topics coming soon
      </p>
    </div>
  );
}
