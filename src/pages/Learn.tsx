import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Section {
  heading: string;
  body: string;
  steps?: string[];
}

interface Source {
  title: string;
  author?: string;
  url?: string;
}

interface Article {
  id: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  title: string;
  summary: string;
  sections: Section[];
  sources?: Source[];
}

const ARTICLES: Article[] = [
  {
    id: 'personal-finance-101',
    tag: 'FINANCE',
    tagBg: '#4CC9F018',
    tagColor: '#4CC9F0',
    title: 'Personal Finance 101',
    summary: 'The fundamentals most people were never taught — budgeting, debt, saving, and building wealth.',
    sections: [
      {
        heading: 'Why Most People Stay Broke',
        body: 'It\'s not income — it\'s behavior. The Federal Reserve\'s 2022 Survey of Consumer Finances found the median American family has less than $8,000 in liquid savings. High earners go broke constantly. The core problem is spending without a plan. Personal finance is 80% behavior and 20% math. You don\'t need to be brilliant at numbers; you need a system you actually follow. The good news: the fundamentals are simple, and doing just a few things right puts you ahead of most people.',
      },
      {
        heading: 'Build an Emergency Fund First',
        body: 'Before investing or aggressively paying debt, you need 3–6 months of essential expenses in a high-yield savings account (HYSA). This is your financial shock absorber. Without it, one medical bill or job loss forces you onto a credit card at 20%+ interest, which wipes out months of progress. The CFPB and virtually every credentialed financial planner list this as step one. Keep it in a separate account so you don\'t accidentally spend it. Right now, HYSAs at online banks pay 4–5% APY — your emergency fund should at least keep up with inflation.',
      },
      {
        heading: 'The 50/30/20 Budget',
        body: 'Popularized by Senator Elizabeth Warren and her daughter in "All Your Worth" (2005) and backed by decades of household finance research: allocate 50% of after-tax income to needs (rent, food, utilities, minimum debt payments), 30% to wants (eating out, subscriptions, entertainment), and 20% to savings and extra debt payments. These aren\'t rigid rules — they\'re a diagnostic. If your needs exceed 60%, you either have an income problem or a lifestyle inflation problem. If you\'re saving less than 10%, that\'s the lever to pull first. Track one month of spending before adjusting anything.',
      },
      {
        heading: 'Debt: Avalanche vs. Snowball',
        body: 'Two proven strategies. The avalanche method pays minimum on all debts, then throws every extra dollar at the highest-interest debt first — this is mathematically optimal and costs you the least total interest. The snowball method pays off the smallest balance first, regardless of rate — research by Remi Trudel at Boston University (2012, Journal of Marketing Research) found this method keeps more people on track because small wins build momentum. If you\'re disciplined, do avalanche. If you\'ve quit before, do snowball. Either beats making only minimum payments, which can keep you in debt for decades.',
      },
      {
        heading: 'Invest in Index Funds, Not Individual Stocks',
        body: 'S&P Dow Jones\'s SPIVA report has tracked actively managed funds for 20+ years. As of 2023, over 92% of active U.S. large-cap fund managers underperformed the S&P 500 index over a 20-year period. John Bogle, who founded Vanguard and invented the index fund, spent decades proving that low-cost index funds beat most professionals over time. The reason: lower fees compound in your favor. A 1% fee difference on a $100,000 portfolio over 30 years costs you roughly $100,000 in lost growth. Use your employer\'s 401(k) match first (it\'s a 50–100% instant return), then a Roth IRA, then taxable accounts.',
      },
      {
        heading: 'The One Rule That Changes Everything',
        body: 'Pay yourself first. This means automatically transferring money to savings and investments the same day your paycheck arrives — before you can spend it. Research on automatic savings programs consistently shows they outperform willpower-based approaches. Set up automatic transfers in your bank or investment account. Even $50/month invested in a broad index fund from age 22 becomes roughly $200,000 by 65 at a 7% average annual return (a historically conservative estimate for diversified U.S. stock market returns). The habit matters more than the amount when you\'re starting out.',
      },
    ],
    sources: [
      {
        title: 'Survey of Consumer Finances (2022)',
        author: 'Federal Reserve',
        url: 'https://www.federalreserve.gov/publications/files/scf23.pdf',
      },
      {
        title: 'All Your Worth: The Ultimate Lifetime Money Plan',
        author: 'Elizabeth Warren & Amelia Warren Tyagi',
      },
      {
        title: 'Winning the Battle but Losing the War: The Psychology of Debt Management',
        author: 'Remi Trudel — Journal of Marketing Research, 2012',
      },
      {
        title: 'SPIVA U.S. Scorecard (Year-End 2023)',
        author: 'S&P Dow Jones Indices',
        url: 'https://www.spglobal.com/spdji/en/research-insights/spiva/',
      },
      {
        title: 'The Little Book of Common Sense Investing',
        author: 'John C. Bogle',
      },
      {
        title: 'Consumer Financial Protection Bureau — Building an Emergency Fund',
        author: 'CFPB',
        url: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',
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

          {/* Sources */}
          {article.sources && article.sources.length > 0 && (
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '12px', marginTop: '4px' }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                color: MUTED,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 6px',
              }}>
                Sources
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {article.sources.map((s, i) => (
                  <div key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: 1.4, color: MUTED }}>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4CC9F0', textDecoration: 'none' }}
                      >
                        {s.title}
                      </a>
                    ) : (
                      <span>{s.title}</span>
                    )}
                    {s.author && (
                      <span style={{ color: '#2A2A3A' }}> · {s.author}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
