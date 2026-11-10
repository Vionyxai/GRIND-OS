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
  {
    id: 'sleep-science',
    tag: 'HEALTH',
    tagBg: '#06D6A018',
    tagColor: '#06D6A0',
    title: 'Sleep Science',
    summary: 'Why sleep is the highest-leverage health habit — and what actually happens when you skip it.',
    sections: [
      {
        heading: 'Sleep Is Not Downtime',
        body: 'During sleep, your brain is running active maintenance. The glymphatic system — a waste-clearance network that is nearly 10x more active during sleep than while awake — flushes out metabolic byproducts including amyloid-beta, a protein linked to Alzheimer\'s disease. This was confirmed by a landmark 2013 study in Science by Lulu Xie and colleagues at the University of Rochester. Memory consolidation also happens during sleep: the hippocampus replays experiences and transfers them to long-term cortical storage. Shortchanging sleep doesn\'t just make you tired — it impairs memory, decision-making, immune function, and metabolic health simultaneously.',
      },
      {
        heading: 'What Happens on 6 Hours or Less',
        body: 'The CDC classifies adults sleeping fewer than 7 hours per night as sleep-deprived. Research by Matthew Walker at UC Berkeley, published in his 2017 book Why We Sleep (citing decades of his and others\' peer-reviewed work), shows that after 17 hours without sleep, cognitive impairment equals a blood alcohol level of 0.05%. After 24 hours, it equals 0.10% — legally drunk in every U.S. state. A 2010 study in Sleep by Killgore et al. found 6 hours/night for two weeks produced the same cognitive deficits as total sleep deprivation, yet subjects rated themselves as "slightly sleepy" — they lost the ability to perceive their own impairment.',
      },
      {
        heading: 'The Stages That Matter Most',
        body: 'Sleep cycles through four stages roughly every 90 minutes: N1 (light), N2 (consolidated), N3 (deep/slow-wave), and REM. Deep sleep (N3) dominates the first half of the night and is critical for physical recovery, immune function, and clearing metabolic waste. REM sleep dominates the second half and is essential for emotional regulation and creative problem-solving. This is why cutting sleep from 8 to 6 hours doesn\'t remove 2 hours of "light" sleep — it disproportionately cuts REM, the stage that processes emotions and builds creative connections.',
      },
      {
        heading: 'Caffeine: The Sleep Debt Hider',
        body: 'Caffeine blocks adenosine receptors in the brain. Adenosine is a byproduct of neural activity that builds up throughout the day, creating sleep pressure. Caffeine doesn\'t eliminate adenosine — it blocks you from feeling it. When caffeine clears, the adenosine surge hits all at once (the "caffeine crash"). The half-life of caffeine is 5–7 hours, meaning a 2pm coffee still has half its dose circulating at 9pm. A 2023 study in JAMA Internal Medicine found 400mg caffeine (about 4 cups of coffee) consumed 6 hours before bed reduced sleep by more than an hour. Cutting caffeine after noon is one of the highest-ROI sleep interventions with zero cost.',
      },
      {
        heading: 'Temperature and Light Are the Controls',
        body: 'Your core body temperature needs to drop 1–2°F to initiate and maintain sleep — this is why a cool room (65–68°F / 18–20°C) consistently outperforms a warm one in sleep studies. Light exposure controls your circadian clock via melanopsin cells in the retina. Morning sunlight (even 10 minutes outside) anchors your body clock and raises daytime alertness. Blue light from screens delays melatonin release by up to 3 hours according to research by Charles Czeisler at Harvard. Dimming screens or using blue-light filters after 9pm is a simple, evidence-backed intervention.',
      },
      {
        heading: 'Consistency Beats Duration',
        body: 'Your circadian rhythm is a biological clock, not a suggestion. It runs on a 24-hour cycle tied to light exposure and social cues. Sleeping 8 hours but at inconsistent times — varying your bedtime by 2+ hours across the week — produces "social jet lag," a term coined by researcher Till Roenneberg. A 2012 study in Current Biology by Roenneberg et al. linked social jet lag to higher rates of obesity, metabolic syndrome, and mood disorders. Waking up at the same time every day (even weekends) is the single most effective anchor for sleep quality, more impactful than any supplement or device.',
      },
    ],
    sources: [
      {
        title: 'Sleep Drives Metabolite Clearance from the Adult Brain (2013)',
        author: 'Lulu Xie et al. — Science',
        url: 'https://www.science.org/doi/10.1126/science.1241224',
      },
      {
        title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
        author: 'Matthew Walker — Scribner, 2017',
      },
      {
        title: 'Sleep Deprivation and Perceived Exertion (2010)',
        author: 'Killgore et al. — Sleep',
      },
      {
        title: 'Caffeine Effects on Sleep Taken 0, 3, or 6 Hours Before Going to Bed',
        author: 'Drake et al. — Journal of Clinical Sleep Medicine, 2013',
      },
      {
        title: 'Exposure to Room Light Before Bedtime Suppresses Melatonin Onset',
        author: 'Gooley et al., Charles Czeisler lab — Journal of Clinical Endocrinology & Metabolism, 2011',
      },
      {
        title: 'Social Jetlag and Obesity',
        author: 'Till Roenneberg et al. — Current Biology, 2012',
      },
    ],
  },
  {
    id: 'cognitive-biases',
    tag: 'MIND',
    tagBg: '#FFD16618',
    tagColor: '#FFD166',
    title: 'Cognitive Biases',
    summary: 'The mental shortcuts that distort your thinking — and how to work around them.',
    sections: [
      {
        heading: 'Why Your Brain Takes Shortcuts',
        body: 'Daniel Kahneman, Nobel laureate and author of Thinking, Fast and Slow (2011), describes two modes of thought: System 1 (fast, automatic, pattern-matching) and System 2 (slow, deliberate, analytical). Most decisions happen in System 1 — it\'s efficient but prone to systematic errors. These errors are not random; they\'re predictable distortions called cognitive biases. The same biases show up across cultures and education levels because they\'re built into how the brain processes information, not signs of stupidity. Knowing them doesn\'t make you immune, but it creates a pause — a moment where System 2 can check System 1\'s work.',
      },
      {
        heading: 'Confirmation Bias',
        body: 'Confirmation bias is the tendency to search for, interpret, and remember information in a way that confirms what you already believe. It was formalized by Peter Wason in a 1960 study where participants consistently tested hypotheses in ways that could only confirm, never disprove, their existing theory. In practice: you notice news that confirms your political views, ignore evidence your business idea won\'t work, and remember the times your gut instinct was right while forgetting when it wasn\'t. The fix is actively seeking disconfirming evidence — asking "what would have to be true for me to be wrong?"',
      },
      {
        heading: 'Sunk Cost Fallacy',
        body: 'The sunk cost fallacy is continuing an investment because of resources already spent, rather than evaluating future prospects on their own merits. Kahneman and Tversky\'s 1979 Prospect Theory paper (one of the most cited papers in economics) showed that losses feel roughly twice as painful as equivalent gains feel pleasurable. This "loss aversion" drives people to hold losing stocks too long, stay in bad relationships, and finish mediocre movies because they already paid. The rational principle: sunk costs are gone regardless of your decision. The only question is what produces the best outcome from this point forward.',
      },
      {
        heading: 'Availability Heuristic',
        body: 'The availability heuristic is judging the likelihood of an event based on how easily an example comes to mind. Kahneman and Tversky identified this in a 1973 paper in Cognitive Psychology. Because plane crashes get massive media coverage, people dramatically overestimate the risk of flying relative to driving — statistically, flying is roughly 95 times safer per mile traveled (National Safety Council data). Fear of sharks, terrorism, and kidnapping by strangers follows the same pattern: vivid, memorable, and media-covered events feel common; quiet, statistical risks (heart disease, car accidents, falls) are systematically underweighted.',
      },
      {
        heading: 'The Dunning-Kruger Effect',
        body: 'In a 1999 study in the Journal of Personality and Social Psychology, David Dunning and Justin Kruger found that people with limited knowledge in a domain consistently overestimate their competence, while genuine experts tend to underestimate theirs. The mechanism: to know what you don\'t know, you need enough expertise to recognize the gaps. Beginners lack this metacognitive awareness. The practical implication is that the most confident voices in a room are often the least qualified, and genuine experts hedge. Treat extreme certainty, especially on complex topics, as a signal to probe harder.',
      },
      {
        heading: 'How to Think Around Biases',
        body: 'You can\'t remove biases, but you can design around them. Pre-mortem thinking (imagining your plan has failed and working backwards to explain why) counteracts overconfidence. Checklists and structured decision frameworks slow System 1 down and force System 2 engagement — this is why aviation and surgery checklists save lives. Seeking out people who actively disagree with you (not just devil\'s advocates playing a role) provides genuine disconfirming evidence. And writing out your reasoning before making a major decision forces articulation, which exposes gaps invisible to the feeling of confidence.',
      },
    ],
    sources: [
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman — Farrar, Straus and Giroux, 2011',
      },
      {
        title: 'Prospect Theory: An Analysis of Decision under Risk (1979)',
        author: 'Daniel Kahneman & Amos Tversky — Econometrica',
      },
      {
        title: 'Availability: A Heuristic for Judging Frequency and Probability (1973)',
        author: 'Tversky & Kahneman — Cognitive Psychology',
      },
      {
        title: 'On Being Incompetent and Unaware of It (1999)',
        author: 'David Dunning & Justin Kruger — Journal of Personality and Social Psychology',
      },
      {
        title: 'Wason Selection Task (1960)',
        author: 'Peter Wason — Quarterly Journal of Experimental Psychology',
      },
      {
        title: 'Injury Facts — Transportation (2023)',
        author: 'National Safety Council',
        url: 'https://injuryfacts.nsc.org/motor-vehicle/overview/introduction/',
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
