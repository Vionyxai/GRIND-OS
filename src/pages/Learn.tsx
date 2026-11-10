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
  // ── FINANCE ─────────────────────────────────────────────────────────────
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
    id: 'compound-interest',
    tag: 'FINANCE',
    tagBg: '#4CC9F018',
    tagColor: '#4CC9F0',
    title: 'Compound Interest & Wealth',
    summary: 'The math behind why starting early beats earning more — and how to put it to work.',
    sections: [
      {
        heading: 'The Eighth Wonder of the World',
        body: 'Compound interest is growth on top of growth. When your returns generate their own returns, the curve accelerates over time — not linearly. Einstein (apocryphally) called it the eighth wonder of the world. The math is straightforward: $10,000 invested at 7% annual returns becomes $76,000 in 30 years without adding a single dollar. Increase the time to 40 years and it becomes $149,000. The extra 10 years nearly double the outcome — not because of extra contributions, but because of time.',
      },
      {
        heading: 'The Cost of Waiting',
        body: 'J.P. Morgan Asset Management\'s Guide to Retirement (updated annually) illustrates the cost of delay with a classic comparison: someone who invests $5,000/year from age 25 to 35 (10 years, then stops) ends up with more money at 65 than someone who invests $5,000/year from age 35 to 65 (30 years continuously) — assuming a 7% return. The early starter invested $50,000 total; the late starter invested $150,000. The difference is entirely compounding time. This is not an argument to stop after 10 years — it\'s a demonstration that the first decade is worth more than the following three.',
      },
      {
        heading: 'Fees Are Compound Interest in Reverse',
        body: 'The same math that grows wealth also destroys it. A 1% annual management fee sounds trivial. On $100,000 over 30 years at 7% gross return, the difference between a 0.05% expense ratio (Vanguard S&P 500 index fund) and a 1% actively managed fund is approximately $180,000 in final value — the fee costs more than the original investment. This was the core argument John Bogle made when founding Vanguard in 1975 and has been validated by decades of SPIVA performance data: net-of-fee returns of active managers consistently underperform the index they benchmark against.',
      },
      {
        heading: 'Inflation: The Silent Compounder Against You',
        body: 'Compound interest works for you in investments but against you in two ways: debt (covered in Personal Finance 101) and inflation. The Federal Reserve targets 2% annual inflation. At 2%, $100 today is worth $82 in 10 years, $67 in 20 years, and $55 in 30 years. This is why holding large amounts of cash long-term is a losing proposition — it compounds in reverse. The goal of investing isn\'t just to grow money; it\'s to grow it faster than inflation erodes it. Historically, the U.S. stock market has returned roughly 7% annually after inflation over long periods (Robert Shiller\'s data going back to the 1870s).',
      },
    ],
    sources: [
      {
        title: 'Guide to Retirement (2024)',
        author: 'J.P. Morgan Asset Management',
        url: 'https://am.jpmorgan.com/us/en/asset-management/adv/insights/retirement-insights/guide-to-retirement/',
      },
      {
        title: 'Online Data — U.S. Stock Market Returns Since 1871',
        author: 'Robert J. Shiller — Yale University',
        url: 'http://www.econ.yale.edu/~shiller/data.htm',
      },
      {
        title: 'SPIVA U.S. Scorecard (Year-End 2023)',
        author: 'S&P Dow Jones Indices',
        url: 'https://www.spglobal.com/spdji/en/research-insights/spiva/',
      },
    ],
  },
  // ── HEALTH ───────────────────────────────────────────────────────────────
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
    id: 'nutrition-fundamentals',
    tag: 'HEALTH',
    tagBg: '#06D6A018',
    tagColor: '#06D6A0',
    title: 'Nutrition Fundamentals',
    summary: 'What the research actually says about eating — stripped of fads and marketing.',
    sections: [
      {
        heading: 'Calories In, Calories Out — Mostly True, Never Enough',
        body: 'The first law of thermodynamics governs body weight: energy in minus energy out equals stored energy. No credible research disputes this. But "calories out" is not just exercise — it includes your basal metabolic rate (60–75% of total energy expenditure for sedentary people), the thermic effect of food (protein costs ~25% of its calories to digest; fat costs ~3%), and non-exercise activity thermogenesis (NEAT — fidgeting, walking, standing). Two people eating the same calories can have meaningfully different fat storage due to these variables, particularly protein intake and NEAT.',
      },
      {
        heading: 'Protein Is the Macronutrient That Matters Most',
        body: 'Of the three macronutrients (protein, carbohydrate, fat), protein has the most impact on body composition and satiety. A 2020 meta-analysis in the Journal of the Academy of Nutrition and Dietetics covering 185 randomized trials found higher protein intake consistently produced greater fat loss and lean mass retention compared to lower protein diets, even at matched calories. The current evidence-based recommendation for active adults is 0.7–1g of protein per pound of body weight (1.6–2.2g/kg) per day. High-protein diets also significantly reduce hunger — protein is the most satiating macronutrient by a wide margin.',
      },
      {
        heading: 'Ultra-Processed Food Is the Real Variable',
        body: 'The nutritional debate about carbs vs. fat has largely distracted from a more important variable: food processing. A 2019 randomized controlled trial by Kevin Hall at NIH — the first to directly compare ultra-processed vs. whole food diets in a controlled setting — found that people eating ultra-processed foods consumed 500 extra calories per day and gained weight, while those eating whole foods lost weight, despite both groups being offered food ad libitum. Ultra-processed foods are engineered for hyper-palatability: optimized combinations of salt, sugar, and fat that override normal satiety signals.',
      },
      {
        heading: 'What Actually Works Long Term',
        body: 'The best diet is one you can follow consistently. A 2020 umbrella review in JAMA Network Open comparing Mediterranean, DASH, MIND, vegetarian, and other diets found they all produced similar long-term outcomes when adherence was matched. The consistent winners across studies: high vegetable and fiber intake (reduces all-cause mortality), sufficient protein, minimizing ultra-processed food, and not drinking calories (liquid calories produce far less satiety than solid food calories, per research by Richard Mattes at Purdue).',
      },
    ],
    sources: [
      {
        title: 'Ultra-Processed Diets Cause Excess Calorie Intake and Weight Gain (2019)',
        author: 'Kevin Hall et al. — Cell Metabolism',
        url: 'https://www.cell.com/cell-metabolism/fulltext/S1550-4131(19)30248-7',
      },
      {
        title: 'Dietary Protein and Body Composition: A Meta-Analysis (2020)',
        author: 'Stokes et al. — Journal of the Academy of Nutrition and Dietetics',
      },
      {
        title: 'Comparative Effectiveness of Popular Diets (2020)',
        author: 'Ge et al. — JAMA Network Open',
      },
      {
        title: 'Liquid vs. Solid Food Satiety Research',
        author: 'Richard Mattes — Purdue University',
      },
    ],
  },
  {
    id: 'exercise-science',
    tag: 'HEALTH',
    tagBg: '#06D6A018',
    tagColor: '#06D6A0',
    title: 'The Science of Exercise',
    summary: 'What actually happens when you train — and the minimum effective dose that transforms health.',
    sections: [
      {
        heading: 'Exercise Is Medicine',
        body: 'The 2018 Physical Activity Guidelines for Americans, backed by a systematic review of over 700 studies, concluded that regular physical activity reduces the risk of all-cause mortality by 30%, heart disease by 35%, type 2 diabetes by 40%, depression and anxiety by 48%, and several cancers by 10–20%. No drug produces this breadth of benefit with this effect size. The mechanism is systemic: exercise triggers anti-inflammatory cytokines, improves insulin sensitivity, strengthens the cardiovascular system, stimulates neurogenesis in the hippocampus (memory and mood), and maintains mitochondrial density in muscle cells.',
      },
      {
        heading: 'Strength Training: The Overlooked Essential',
        body: 'Most public health messaging focuses on cardio, but resistance training has distinct and irreplaceable benefits. After age 30, adults lose 3–8% of muscle mass per decade without resistance training (sarcopenia), accelerating to 15% per decade after 60. A 2022 meta-analysis in the British Journal of Sports Medicine found resistance training independently reduces all-cause mortality by 15–17%, cardiovascular mortality by 19%, and cancer mortality by 14%. The minimum effective dose is 2 sessions per week targeting all major muscle groups. Progressive overload — gradually increasing weight, reps, or sets over time — is the core principle.',
      },
      {
        heading: 'Zone 2 Cardio: The Foundation',
        body: 'Zone 2 cardio is aerobic exercise at a conversational pace — roughly 60–70% of max heart rate, where you can speak in full sentences but are breathing noticeably. Dr. Iñigo San-Millán at the University of Colorado has published extensively on Zone 2 as the primary driver of mitochondrial development. Mitochondria are the energy-producing organelles in cells; more of them means better endurance, faster fat metabolism, and improved metabolic health. The recommended dose is 150–180 minutes per week. This is not about performance — it\'s the metabolic base that makes everything else work better.',
      },
      {
        heading: 'Recovery Is When Adaptation Happens',
        body: 'Exercise is the stimulus; recovery is the adaptation. Training creates microscopic muscle damage and stress signals. Sleep (especially deep sleep) triggers growth hormone release, protein synthesis, and repair. Inadequate recovery between sessions leads to overtraining syndrome — persistent fatigue, strength decline, mood disruption, and increased injury risk. Protein intake around training (0.4g/kg within 2 hours post-workout) accelerates muscle protein synthesis according to a 2017 meta-analysis by Schoenfeld and Aragon in the Journal of the International Society of Sports Nutrition. Consistency over months matters far more than any individual training session.',
      },
    ],
    sources: [
      {
        title: '2018 Physical Activity Guidelines for Americans',
        author: 'U.S. Department of Health and Human Services',
        url: 'https://health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf',
      },
      {
        title: 'Resistance Training and Mortality Risk (2022)',
        author: 'Momma et al. — British Journal of Sports Medicine',
      },
      {
        title: 'Zone 2 Training and Mitochondrial Function',
        author: 'Iñigo San-Millán & George Brooks — Frontiers in Physiology, 2018',
      },
      {
        title: 'Nutrient Timing Revisited (2017)',
        author: 'Schoenfeld & Aragon — Journal of the International Society of Sports Nutrition',
      },
    ],
  },
  {
    id: 'stress-cortisol',
    tag: 'HEALTH',
    tagBg: '#06D6A018',
    tagColor: '#06D6A0',
    title: 'Stress & Cortisol',
    summary: 'How chronic stress rewires your body and brain — and the evidence-backed ways to manage it.',
    sections: [
      {
        heading: 'Stress Is Not the Enemy',
        body: 'The stress response — often called "fight or flight" — is a precisely engineered survival system. When the brain perceives threat, the hypothalamic-pituitary-adrenal (HPA) axis releases cortisol and adrenaline, which sharpen focus, mobilize energy, and prepare the body for action. Psychologist Kelly McGonigal\'s 2013 TED Talk, drawing on research by Keller et al. in Health Psychology (2012), demonstrated that stress itself doesn\'t kill people — believing stress is harmful does. Participants who experienced high stress but did not view it as harmful had the lowest mortality of any group, lower even than low-stress individuals.',
      },
      {
        heading: 'When Acute Stress Becomes Chronic',
        body: 'The problem is not the stress response — it\'s a stress response that never turns off. Cortisol is meant to spike and fall. Chronically elevated cortisol (from ongoing work pressure, financial insecurity, relationship conflict, or poor sleep) suppresses the immune system, impairs memory and hippocampal function, raises blood pressure, disrupts blood sugar regulation, and increases abdominal fat storage. A 2012 study in the Proceedings of the National Academy of Sciences found that chronic stress in early life shortens telomeres — the protective caps on chromosomes — accelerating cellular aging measurably.',
      },
      {
        heading: 'Physiological Sigh: The Fastest Reset',
        body: 'Stanford neuroscientist Andrew Huberman has published research on the physiological sigh as the fastest way to downregulate the stress response in real time. The technique: a double inhale through the nose (inhale fully, then sniff in a little more), followed by a long exhale through the mouth. This deflates the small air sacs (alveoli) in the lungs that collapse during stress-induced shallow breathing, offloads CO2 more efficiently than a single breath, and directly activates the parasympathetic nervous system. Two to three cycles bring measurable reductions in heart rate and self-reported anxiety within 30–60 seconds.',
      },
      {
        heading: 'Exercise, Sleep, and Social Connection as Stress Modulators',
        body: 'The three most evidence-backed chronic stress reducers are exercise, sleep, and social connection. Exercise metabolizes cortisol and adrenaline — it completes the stress cycle, as Drs. Emily and Amelia Nagoski describe in Burnout (2019). Sleep is when cortisol is cleared and the HPA axis resets; sleep deprivation raises baseline cortisol. Social connection triggers oxytocin and serotonin, which directly counter the cortisol response. The UCLA Mind-Body Research Institute found that lonely individuals had 10–20% higher cortisol levels even at rest. These aren\'t soft lifestyle recommendations — they are the mechanisms by which the stress system resets.',
      },
    ],
    sources: [
      {
        title: 'Does the Perception that Stress Affects Health Matter? (2012)',
        author: 'Keller et al. — Health Psychology',
      },
      {
        title: 'Childhood Stress and Telomere Length (2012)',
        author: 'Puterman et al. — PNAS',
      },
      {
        title: 'Brief Structured Respiration Practices Enhance Mood and Reduce Physiological Arousal (2023)',
        author: 'Balban et al. — Cell Reports Medicine',
        url: 'https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(22)00474-8',
      },
      {
        title: 'Burnout: The Secret to Unlocking the Stress Cycle',
        author: 'Emily Nagoski & Amelia Nagoski — Ballantine Books, 2019',
      },
    ],
  },
  // ── MIND ─────────────────────────────────────────────────────────────────
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
  {
    id: 'how-habits-form',
    tag: 'MIND',
    tagBg: '#FFD16618',
    tagColor: '#FFD166',
    title: 'How Habits Actually Form',
    summary: 'The neuroscience behind automatic behavior — and how to wire new habits that stick.',
    sections: [
      {
        heading: 'The Habit Loop',
        body: 'MIT neuroscientist Ann Graybiel\'s lab identified the basic habit loop in the 1990s through rodent experiments later confirmed in humans: cue → routine → reward. When a behavior is repeated enough in the same context, the basal ganglia (a brain region involved in procedural learning) begins automating it, reducing the need for conscious prefrontal cortex involvement. This is why driving to work doesn\'t require deliberate thought after years of practice. The automation is a feature — it frees cognitive resources for other things. But it also means habits are remarkably hard to erase once wired; they\'re dormant, not deleted.',
      },
      {
        heading: 'The 21-Day Myth',
        body: 'The claim that habits take 21 days to form traces to plastic surgeon Maxwell Maltz\'s 1960 observation that phantom limb sensations took ~21 days to fade — a claim about surgical recovery, not habit formation. The first rigorous study on habit formation timelines, published in the European Journal of Social Psychology by Phillippa Lally et al. (2010), tracked 96 participants over 12 weeks. The average time to reach automaticity was 66 days. The range was 18 to 254 days depending on the person and the complexity of the behavior. Simple habits (drinking a glass of water with breakfast) automated faster; complex ones (running before lunch) took far longer.',
      },
      {
        heading: 'Implementation Intentions',
        body: 'The most evidence-backed technique for habit formation is implementation intentions — planning not just what you\'ll do but when, where, and how. Psychologist Peter Gollwitzer at NYU reviewed 94 studies in a 1999 Psychological Bulletin meta-analysis and found implementation intentions doubled or tripled goal achievement rates compared to simple motivation or intention. The format is: "When [situation X], I will do [behavior Y]." Example: "When I sit down at my desk each morning, I will open my workout app and log yesterday\'s workout before anything else." The specificity creates a mental link between the cue and the behavior.',
      },
      {
        heading: 'Identity-Based Habits',
        body: 'James Clear\'s framework in Atomic Habits (2018), drawing on research by identity theorists like William James and later work in self-perception theory, argues that the most durable behavior change comes from identity shift rather than outcome goals. "I want to run a 5K" is an outcome goal; "I am someone who exercises" is an identity statement. Each small action either confirms or contradicts that identity. Missing once doesn\'t matter — but the story you tell yourself about why you missed matters enormously. Framing a skipped workout as "I\'m not a runner" vs. "even committed runners skip days" produces radically different long-term adherence.',
      },
    ],
    sources: [
      {
        title: 'How Are Habits Formed: Modeling Habit Formation in the Real World (2010)',
        author: 'Phillippa Lally et al. — European Journal of Social Psychology',
      },
      {
        title: 'Implementation Intentions: Strong Effects of Simple Plans (1999)',
        author: 'Peter Gollwitzer — American Psychologist',
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear — Avery, 2018',
      },
      {
        title: 'The Basal Ganglia and Chunking of Action Repertoires',
        author: 'Ann Graybiel — Neurobiology of Learning and Memory, 1998',
      },
    ],
  },
  {
    id: 'mental-models',
    tag: 'MIND',
    tagBg: '#FFD16618',
    tagColor: '#FFD166',
    title: 'Mental Models for Clear Thinking',
    summary: 'The thinking frameworks used by the world\'s sharpest decision-makers.',
    sections: [
      {
        heading: 'What a Mental Model Is',
        body: 'A mental model is a simplified representation of how something works. Charlie Munger, vice chairman of Berkshire Hathaway and one of the most cited thinkers on decision-making, spent decades arguing that the key to good judgment is having a "latticework of mental models" from multiple disciplines — not being expert in one field, but understanding the core mechanics of many. He calls this "elementary, worldly wisdom." Physics gives you first-principles thinking. Economics gives you incentive analysis. Psychology gives you bias recognition. Biology gives you evolution and adaptation. Each model is a lens that reveals what others miss.',
      },
      {
        heading: 'First Principles Thinking',
        body: 'Aristotle defined first principles as the foundational propositions from which everything else is derived. First principles thinking means stripping a problem down to its verified fundamental truths and reasoning up from there, rather than reasoning by analogy (doing what others do). Elon Musk famously applied this to battery costs: instead of accepting the market price as fixed, he broke down the raw materials (cobalt, nickel, lithium, manganese, steel) and found the commodity cost was a fraction of the market price — opening the question of whether batteries could be manufactured far more cheaply. Reasoning from first principles is slower and harder, but it produces genuinely novel solutions.',
      },
      {
        heading: 'Inversion',
        body: 'Inversion is thinking backwards: instead of asking "how do I achieve success?", ask "what guarantees failure?" and avoid those things. Munger attributes this approach to mathematician Carl Jacobi ("invert, always invert"). The practical power is that it\'s often far easier to identify what destroys something than what creates it. Want to build a great company? Invert: what kills companies? Poor hiring, running out of cash, losing customer trust, moving too slowly in a changing market. Eliminating failure modes is often more tractable than directly engineering success. Medical checklists and aviation pre-flight checks are institutional applications of this principle.',
      },
      {
        heading: 'Second-Order Thinking',
        body: 'First-order thinking is "what happens if I do X?" Second-order thinking is "what happens next? And then what?" Howard Marks, founder of Oaktree Capital and author of The Most Important Thing (2011), identifies second-order thinking as the defining trait of superior investors. Most market participants think first-order — they buy obvious good companies and are surprised when the stock doesn\'t rise (the good news was already priced in). Second-order: "Company A will do well. Everyone knows this. Therefore the stock is already overpriced." In everyday life: offering food at a party is first-order. Second-order: will people take more than they want because of social pressure? Do you have enough for everyone?',
      },
    ],
    sources: [
      {
        title: 'Poor Charlie\'s Almanack',
        author: 'Charlie Munger — Donning Company, 2005',
      },
      {
        title: 'The Most Important Thing: Uncommon Sense for the Thoughtful Investor',
        author: 'Howard Marks — Columbia University Press, 2011',
      },
      {
        title: 'The Great Mental Models Vol. 1',
        author: 'Shane Parrish & Rhiannon Beaubien — Latticework Publishing, 2019',
      },
    ],
  },
  {
    id: 'emotional-intelligence',
    tag: 'MIND',
    tagBg: '#FFD16618',
    tagColor: '#FFD166',
    title: 'Emotional Intelligence',
    summary: 'The science of understanding and managing emotions — your own and others\'.',
    sections: [
      {
        heading: 'What EQ Actually Is',
        body: 'Emotional intelligence was formalized as a construct by psychologists Peter Salovey and John Mayer in a 1990 paper, then popularized by Daniel Goleman\'s 1995 book. The original Salovey-Mayer model defines four abilities: perceiving emotions accurately in faces, voices, and images; using emotions to facilitate thought; understanding how emotions transition and blend; and managing emotions in yourself and others. Goleman\'s more practical framework adds self-awareness, self-regulation, motivation, empathy, and social skills. The core finding from workplace research is that EQ predicts professional success — especially in leadership roles — better than IQ beyond a threshold cognitive ability.',
      },
      {
        heading: 'The 90-Second Rule',
        body: 'Harvard neuroscientist Jill Bolte Taylor, in My Stroke of Insight (2008), describes the physiological arc of an emotion: the initial chemical cascade triggered by an event peaks and clears the bloodstream within 90 seconds. What extends an emotion past 90 seconds is the story you tell yourself — the thoughts that re-trigger the same chemical response. This has practical implications: if you can pause for 90 seconds during a strong emotional reaction (anger, anxiety, embarrassment) rather than immediately reacting, the initial intensity clears and you can respond from a more regulated state.',
      },
      {
        heading: 'Labeling Emotions Reduces Their Intensity',
        body: 'UCLA neuroscientist Matthew Lieberman\'s lab published a 2007 study in Psychological Science showing that putting feelings into words — "affect labeling" — reduces activity in the amygdala (the brain\'s threat-response center) and increases activity in the prefrontal cortex (rational processing). Simply saying "I feel angry" or writing about an upsetting experience produces measurable neurological calming, not just self-report. This is the neuroscience behind journaling, therapy, and "naming it to tame it" — a phrase popularized by Dan Siegel in Mindsight (2010).',
      },
      {
        heading: 'Empathy: Cognitive vs. Affective',
        body: 'Empathy has two distinct forms. Affective empathy is feeling what another person feels — the emotional resonance that connects people but can lead to burnout in caregiving professions (compassion fatigue). Cognitive empathy is understanding what another person is experiencing without necessarily feeling it — taking their perspective accurately. Research by Jamil Zaki at Stanford (The War for Kindness, 2019) shows cognitive empathy can be deliberately practiced and improved; it\'s a skill, not a fixed trait. The most effective leaders and negotiators typically exhibit high cognitive empathy: they understand others\' emotional states accurately without being destabilized by them.',
      },
    ],
    sources: [
      {
        title: 'Emotional Intelligence (1990)',
        author: 'Peter Salovey & John Mayer — Imagination, Cognition and Personality',
      },
      {
        title: 'Putting Feelings into Words (2007)',
        author: 'Matthew Lieberman et al. — Psychological Science',
      },
      {
        title: 'My Stroke of Insight',
        author: 'Jill Bolte Taylor — Viking, 2008',
      },
      {
        title: 'The War for Kindness: Building Empathy in a Fractured World',
        author: 'Jamil Zaki — Crown, 2019',
      },
    ],
  },
  {
    id: 'science-of-motivation',
    tag: 'MIND',
    tagBg: '#FFD16618',
    tagColor: '#FFD166',
    title: 'The Science of Motivation',
    summary: 'Why motivation is unreliable — and what actually drives sustained action.',
    sections: [
      {
        heading: 'Intrinsic vs. Extrinsic Motivation',
        body: 'Self-Determination Theory (SDT), developed by Edward Deci and Richard Ryan at the University of Rochester over four decades of research, distinguishes intrinsic motivation (doing something for its inherent interest or satisfaction) from extrinsic motivation (doing something for external rewards or to avoid punishment). Their 1999 meta-analysis in Journal of Personality and Social Psychology, covering 128 studies, found that tangible external rewards consistently undermine intrinsic motivation — the "overjustification effect." Once you start paying someone for something they loved doing for free, they lose interest in doing it without payment. The implication: linking enjoyable activities to external reward can backfire.',
      },
      {
        heading: 'The Dopamine Misconception',
        body: 'Dopamine is widely described as the "pleasure chemical," but neuroscientist Kent Berridge at the University of Michigan has spent decades demonstrating that dopamine drives wanting, not liking. His research separates "wanting" (anticipation, craving, motivation to pursue) from "liking" (the actual pleasure of a reward). Dopamine surges in anticipation of a reward, not necessarily during it. This explains why achieving goals often feels anticlimactic — the dopamine spike happens during the chase. It also explains addictive behavior: addictive substances spike dopamine (wanting) far above the actual pleasure they deliver, creating compulsive pursuit of diminishing satisfaction.',
      },
      {
        heading: 'Why Motivation Follows Action, Not the Reverse',
        body: 'The common assumption is that motivation precedes action — you feel motivated, then you act. Research on behavioral activation (a clinical technique for depression developed by Neil Jacobson and colleagues in the 1990s) inverts this: action precedes motivation. Doing a small behavior — even when you don\'t feel like it — generates momentum and intrinsic reward that produces motivation for more behavior. The clinical implication: waiting to "feel motivated" is the wrong model. The practical implication: starting is the entire trick. The smallest possible action (put on running shoes, open the document, pick up the instrument) is the lever.',
      },
      {
        heading: 'The Role of Autonomy, Mastery, and Purpose',
        body: 'Daniel Pink\'s Drive (2009), synthesizing decades of SDT and organizational psychology research, identifies three factors that sustain motivation for cognitive work: autonomy (control over how you work), mastery (the sense of getting better at something that matters), and purpose (connecting your work to something larger than yourself). These three factors consistently outperform financial incentives for creative and complex tasks in research settings. Csikszentmihalyi\'s flow state — peak intrinsic motivation — occurs when challenge slightly exceeds current skill level, requiring full engagement without overwhelming difficulty.',
      },
    ],
    sources: [
      {
        title: 'A Meta-Analytic Review of Experiments Examining the Effects of Extrinsic Rewards on Intrinsic Motivation (1999)',
        author: 'Deci, Koestner & Ryan — Psychological Bulletin',
      },
      {
        title: 'Separating Wanting from Liking in Reward',
        author: 'Kent Berridge — Physiology & Behavior, 2004',
      },
      {
        title: 'Drive: The Surprising Truth About What Motivates Us',
        author: 'Daniel Pink — Riverhead Books, 2009',
      },
      {
        title: 'Flow: The Psychology of Optimal Experience',
        author: 'Mihaly Csikszentmihalyi — Harper & Row, 1990',
      },
    ],
  },
  // ── SKILLS ───────────────────────────────────────────────────────────────
  {
    id: 'how-to-learn-faster',
    tag: 'SKILLS',
    tagBg: '#F7258518',
    tagColor: '#F72585',
    title: 'How to Learn Faster',
    summary: 'The evidence-backed techniques that work — and why the popular ones often don\'t.',
    sections: [
      {
        heading: 'Desirable Difficulties',
        body: 'Robert Bjork at UCLA coined the term "desirable difficulties" to describe learning conditions that feel harder in the moment but produce stronger long-term retention. The classic example: re-reading notes feels productive (fluent, easy, familiar) but produces minimal retention. Testing yourself on material — even before you feel ready — forces retrieval, which is the actual mechanism of memory consolidation. A 2008 Science paper by Roediger and Karpicke showed that students who took practice tests retained 50% more after a week than those who re-read the material, despite the test group feeling less prepared during the study session.',
      },
      {
        heading: 'Spaced Repetition',
        body: 'Hermann Ebbinghaus\'s 1885 "forgetting curve" showed that memory decays exponentially after learning — most of a lecture is forgotten within 24 hours without review. Spaced repetition counteracts this by scheduling review sessions at increasing intervals as retention strengthens. A 2007 meta-analysis of 254 studies by Cepeda et al. in Psychological Bulletin found that distributing practice over time produced retention improvements 2–3 times larger than massed practice ("cramming") at all tested intervals. Flashcard apps like Anki implement spaced repetition algorithmically. It\'s the highest-ROI study technique with the most evidence behind it.',
      },
      {
        heading: 'Interleaving',
        body: 'Interleaving — mixing different types of problems or subjects within a study session rather than blocking them — feels harder and produces worse performance during practice, but significantly better retention and transfer. A 2010 study in Psychological Science by Rohrer and Taylor found interleaved math practice produced 76% accuracy on a delayed test vs. 38% for blocked practice. The mechanism: interleaving forces the brain to continuously retrieve and apply the right strategy for each problem type, which builds stronger and more flexible mental representations than repeating the same type repeatedly.',
      },
      {
        heading: 'The Feynman Technique',
        body: 'Richard Feynman, Nobel laureate in physics, described his learning method: take a concept you want to understand, explain it out loud in simple language as if teaching it to a 12-year-old, identify every point where you get stuck or vague, go back to the source material to fill that gap, then repeat. The key insight is that vague language masks incomplete understanding. Saying "it\'s like a force" or "it basically works by..." signals a gap. Forcing simple, precise language reveals exactly what you don\'t know. This aligns with cognitive research on elaborative interrogation — explaining why things work rather than just what they are strengthens encoding and identifies gaps.',
      },
    ],
    sources: [
      {
        title: 'The Power of Testing Memory (2006)',
        author: 'Roediger & Karpicke — Psychological Science',
      },
      {
        title: 'Distributed Practice in Verbal Recall Tasks: A Review and Quantitative Synthesis (2007)',
        author: 'Cepeda et al. — Psychological Bulletin',
      },
      {
        title: 'The Shuffling of Mathematics Problems Improves Learning (2010)',
        author: 'Rohrer & Taylor — Instructional Science',
      },
      {
        title: 'Make It Stick: The Science of Successful Learning',
        author: 'Peter Brown, Henry Roediger, Mark McDaniel — Belknap Press, 2014',
      },
    ],
  },
  {
    id: 'reading-retention',
    tag: 'SKILLS',
    tagBg: '#F7258518',
    tagColor: '#F72585',
    title: 'Reading & Retention',
    summary: 'How to read with intent — and actually remember and use what you read.',
    sections: [
      {
        heading: 'The Illusion of Knowing',
        body: 'Most people read passively — eyes moving across the page, comfortable sense of comprehension, almost nothing retained a week later. This is the "fluency illusion": familiarity with words feels like understanding. Psychologist Frank Keil at Yale calls this the "illusion of explanatory depth" — when asked to explain something they just read in detail, most people quickly discover their understanding was superficial. Passive reading is the least effective form of information processing. The evidence is clear: reading alone produces far lower retention than reading combined with any form of active processing.',
      },
      {
        heading: 'The SQ3R Method and Active Reading',
        body: 'Survey-Question-Read-Recite-Review (SQ3R), developed by Francis Robinson at Ohio State in 1941, remains one of the most studied reading comprehension techniques. Survey: skim headings, images, and summaries first to build a mental framework. Question: turn each heading into a question before reading. Read: read actively to answer your questions. Recite: close the book and explain the section from memory. Review: revisit key points across the whole reading. Multiple studies across educational research show SQ3R and similar active reading strategies improve comprehension and retention by 30–50% compared to linear passive reading.',
      },
      {
        heading: 'The Notemaking Distinction',
        body: 'Note-taking (transcribing what you read) vs. notemaking (generating your own questions, connections, and implications) produce fundamentally different outcomes. Pam Mueller and Daniel Oppenheimer\'s 2014 Psychological Science study showed laptop note-takers retained more verbatim content short-term but performed worse on conceptual questions than longhand note-takers — because longhand forces paraphrasing, which is active processing. The deeper principle: the act of transforming information into your own words, examples, or questions is the encoding event. Highlighting and copying are storage operations that never become encoding.',
      },
      {
        heading: 'Build a Second Brain',
        body: 'Tiago Forte\'s BASB system (Building a Second Brain, 2022) formalizes an evidence-consistent approach: capture only what resonates or surprises you (not everything), organize by what you\'re working on (projects, areas, resources, archive — PARA), distill into progressive summaries (highlight key phrases, then the highlights\' highlights), and express by using the material in writing or conversation. The core principle aligns with cognitive science: the goal isn\'t a database of everything you\'ve read — it\'s a system that surfaces relevant material when you need it and forces regular expression of ideas, which is where actual learning happens.',
      },
    ],
    sources: [
      {
        title: 'The Pen Is Mightier Than the Keyboard (2014)',
        author: 'Mueller & Oppenheimer — Psychological Science',
      },
      {
        title: 'Effective Study: A Guide to Knowing and Using What You Know (1941)',
        author: 'Francis Robinson — Harper',
      },
      {
        title: 'Building a Second Brain',
        author: 'Tiago Forte — Atria Books, 2022',
      },
      {
        title: 'The Illusion of Explanatory Depth',
        author: 'Rozenblit & Keil — Cognitive Science, 2002',
      },
    ],
  },
  // ── WORK ─────────────────────────────────────────────────────────────────
  {
    id: 'negotiation',
    tag: 'WORK',
    tagBg: '#FF9F1C18',
    tagColor: '#FF9F1C',
    title: 'How to Negotiate Anything',
    summary: 'The principles behind every successful negotiation — from salary to major purchases.',
    sections: [
      {
        heading: 'Negotiation Is Not a Fight',
        body: 'The dominant framework in negotiation research, developed at Harvard\'s Program on Negotiation and published in Getting to Yes (Fisher, Ury & Patton, 1981), separates positions from interests. A position is what someone says they want ("I want $80,000"); an interest is why they want it ("I need to cover rent and feel valued for my work"). Negotiating positions creates a zero-sum tug-of-war. Negotiating interests opens creative solutions. Classic example: two people fighting over an orange. Positional: split it in half. Interest-based: one wants the juice, the other wants the peel for baking. Full orange available to each. This reframe alone resolves the majority of negotiation conflicts.',
      },
      {
        heading: 'BATNA: Your Actual Source of Power',
        body: 'Your Best Alternative to a Negotiated Agreement (BATNA) is what happens if you walk away. Fisher and Ury\'s central argument is that negotiating power does not come from aggression or rhetoric — it comes from BATNA strength. If your alternative is weak, you can be pressured. If your alternative is strong, you can walk at any time. This is why preparing before salary negotiations (having other offers, knowing market rates) fundamentally changes the conversation. It\'s also why you should always understand the other party\'s BATNA — if their alternative to a deal with you is terrible, they need the deal more than they\'re letting on.',
      },
      {
        heading: 'Tactical Empathy: The FBI Approach',
        body: 'Former FBI hostage negotiator Chris Voss, in Never Split the Difference (2016), argues against compromise as a negotiating strategy (hence the title). His field-tested methods center on tactical empathy — not agreeing with the other person, but demonstrating that you understand their feelings and world accurately enough that they feel genuinely heard. Key techniques: mirroring (repeating the last 1–3 words of what someone said to invite elaboration), labeling emotions ("It sounds like you\'re frustrated with the timeline"), and calibrated questions starting with "how" or "what" that invite the other side to solve the problem with you.',
      },
      {
        heading: 'Anchoring and the First Number',
        body: 'The anchoring effect (documented by Kahneman and Tversky) is powerful in negotiations: the first number introduced heavily biases the final outcome, regardless of how arbitrary it seems. Research by Adam Galinsky at Columbia Business School shows that the party who makes the first offer in a salary negotiation significantly influences the final outcome. Making a specific anchor (e.g., $87,500 rather than $88,000) signals that the number was calculated, not invented, which makes it more resistant to counteroffer. Extreme anchors work if justifiable; unjustifiable extreme anchors damage the relationship and credibility.',
      },
    ],
    sources: [
      {
        title: 'Getting to Yes: Negotiating Agreement Without Giving In',
        author: 'Roger Fisher, William Ury & Bruce Patton — Penguin, 1981',
      },
      {
        title: 'Never Split the Difference',
        author: 'Chris Voss & Tahl Raz — Harper Business, 2016',
      },
      {
        title: 'Anchoring and First Offers in Negotiation',
        author: 'Adam Galinsky & Thomas Mussweiler — Journal of Personality and Social Psychology, 2001',
      },
    ],
  },
  {
    id: 'ai-and-your-career',
    tag: 'WORK',
    tagBg: '#FF9F1C18',
    tagColor: '#FF9F1C',
    title: 'AI & Your Career',
    summary: 'What the evidence says about which jobs AI changes — and how to position yourself.',
    sections: [
      {
        heading: 'What AI Is Actually Doing to Work',
        body: 'The most cited academic framework for technology\'s impact on jobs is the task-based model by economists Daron Acemoglu and David Autor. Their research distinguishes between routine tasks (predictable, rule-based, automatable) and non-routine tasks (judgment, creativity, novel problem-solving, human interaction). Historical automation eliminated routine physical tasks (assembly lines); current AI is eliminating routine cognitive tasks (data entry, basic research synthesis, standard document drafting, tier-1 customer support, code with clear specifications). Non-routine cognitive tasks — complex judgment, persuasion, novel problem-solving, strategic synthesis — are expanding.',
      },
      {
        heading: 'The Augmentation Opportunity',
        body: 'The empirical evidence so far shows AI augmenting skilled workers more than replacing them. A 2023 MIT study by Noy and Zhang on ChatGPT and professional writing found it increased productivity of less-skilled writers by 40% and compressed the performance gap between high and low performers. A BCG study on GPT-4 for consultant tasks found AI assistance boosted performance on feasible tasks by 40%+ while causing underperformance on tasks outside AI\'s reliable capabilities (consultants who trusted AI on those tasks did worse). The pattern: AI is a leverage multiplier for people who know the domain well enough to verify and direct the output.',
      },
      {
        heading: 'Skills That Compound in an AI World',
        body: 'The skills most robust to AI automation share a common trait: they require understanding that is hard to verify from outputs alone. Clear communication (writing and speaking with precision and persuasion) matters more as AI produces more content, because distinguishing signal from noise becomes the scarce skill. Judgment under uncertainty — making good decisions with incomplete information — is inherently human and high-value. Domain expertise (knowing a field deeply enough to know when AI is wrong) compounds in value as AI use spreads. And the meta-skill of learning fast — acquiring new domains quickly — allows continuous adaptation as the landscape shifts.',
      },
      {
        heading: 'How to Work With AI Effectively Right Now',
        body: 'The most practical advice from early adopter research: treat AI as a first draft machine, not an authority. AI excels at generating options, expanding a starting point, explaining concepts, restructuring prose, writing code from clear specifications, and summarizing large bodies of text. It fails reliably at tasks requiring current information, precise factual claims, complex multi-step logical chains, and anything where being wrong has high stakes and the error is hard to detect. The workflow that works: use AI to generate fast, verify and edit with expertise, never publish or act on AI output you haven\'t verified in your domain.',
      },
    ],
    sources: [
      {
        title: 'The Future of Work (task-based model)',
        author: 'Daron Acemoglu & David Autor — NBER Working Papers',
      },
      {
        title: 'Experimental Evidence on the Productivity Effects of Generative AI (2023)',
        author: 'Shakked Noy & Whitney Zhang — MIT / Science',
        url: 'https://www.science.org/doi/10.1126/science.adh2586',
      },
      {
        title: 'How People Can Create — and Destroy — Value with Generative AI (2023)',
        author: 'Fabrizio Dell\'Acqua et al. — Harvard Business School / BCG',
      },
    ],
  },
  {
    id: 'communication-persuasion',
    tag: 'WORK',
    tagBg: '#FF9F1C18',
    tagColor: '#FF9F1C',
    title: 'Communication & Persuasion',
    summary: 'The evidence-backed principles behind writing, speaking, and changing minds.',
    sections: [
      {
        heading: 'Clarity Is the Foundation',
        body: 'The single most important element in effective communication is not sophistication or vocabulary — it\'s clarity. Research by psychologist Frank Luntz (Words That Work, 2007) and writing researchers including Joseph Williams (Style: Lessons in Clarity and Grace) consistently finds that readers judge intelligence primarily through the clarity and organization of ideas, not the complexity of language. The Flesch-Kincaid readability formula, developed in the 1940s and validated across decades, correlates reading ease with comprehension and persuasion. The best communicators make complex things simple — a far harder skill than making simple things sound complex.',
      },
      {
        heading: 'The Cialdini Six',
        body: 'Robert Cialdini\'s Influence (1984), one of the most cited books in social psychology, documents six principles of persuasion validated across hundreds of studies: Reciprocity (we return favors), Commitment and Consistency (we act in line with prior commitments), Social Proof (we follow what others do), Authority (we follow credible experts), Liking (we say yes to people we like), and Scarcity (we value what\'s rare). His later work adds a seventh: Unity (shared identity). These are not tricks — they are the mechanisms by which all human influence operates. Understanding them makes you better at both using them ethically and recognizing when they\'re being used on you.',
      },
      {
        heading: 'Listening Is the Underrated Half',
        body: 'Most people prepare what they\'ll say next instead of listening. Research by William Isaacs at MIT on dialogue (Dialogue and the Art of Thinking Together, 1999) and by Carl Rogers on active listening shows that people who feel genuinely heard are dramatically more open to influence and change than people who feel steamrolled. The practical technique: paraphrase what someone said in your own words before responding. This signals that you understood them, often defuses defensiveness, and frequently reveals that you misunderstood something important — before the conversation broke down. Stephen Covey\'s principle — seek first to understand, then to be understood — is behaviorally validated.',
      },
      {
        heading: 'Writing That Actually Gets Read',
        body: 'The inverted pyramid: lead with the most important information, then supporting detail, then background. This is not just journalism — it\'s how people read in an attention economy. A study by Nielsen Norman Group tracking eye movements found that the average user reads in an F-pattern: first line across, partial second line, then scanning down the left side. Most of the content on most pages is never read. Implications: short sentences (avg. 15–20 words), front-loaded paragraphs, specific rather than vague language, and headers that communicate meaning rather than label topics. Never bury the point.',
      },
    ],
    sources: [
      {
        title: 'Influence: The Psychology of Persuasion',
        author: 'Robert Cialdini — Harper Business, 1984 (rev. 2007)',
      },
      {
        title: 'How Users Read on the Web',
        author: 'Jakob Nielsen — Nielsen Norman Group, 1997',
        url: 'https://www.nngroup.com/articles/how-users-read-on-the-web/',
      },
      {
        title: 'Style: Lessons in Clarity and Grace',
        author: 'Joseph Williams & Gregory Colomb',
      },
      {
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen Covey — Free Press, 1989',
      },
    ],
  },
  {
    id: 'entrepreneurship',
    tag: 'WORK',
    tagBg: '#FF9F1C18',
    tagColor: '#FF9F1C',
    title: 'Entrepreneurship: What\'s Actually True',
    summary: 'The research behind why startups succeed and fail — stripped of survivor bias.',
    sections: [
      {
        heading: 'The Real Failure Rate',
        body: 'The oft-cited "90% of startups fail" is not supported by clean data. The Bureau of Labor Statistics tracks business survival rates: about 20% of new businesses fail in year 1, 45% by year 5, and 65% by year 10. These are substantially better than the legend — but still sobering. The survivorship bias problem in business advice is severe: we learn primarily from success stories, which are unrepresentative. A business that failed quietly for the same reasons as a successful one teaches nothing because no one writes about it. The researchers who have tried to study failure systematically, including CB Insights post-mortems of failed startups, find the leading causes are no market need (42%), ran out of cash (29%), wrong team (23%), and got outcompeted (19%).',
      },
      {
        heading: 'The Lean Startup and Validated Learning',
        body: 'Eric Ries\'s Lean Startup (2011), synthesizing Toyota\'s production philosophy and Steve Blank\'s customer development work, introduced build-measure-learn as the core entrepreneurial loop. The key insight: most startup failures are not execution failures — they\'re assumption failures. Founders build products based on untested beliefs about what customers want. The minimum viable product (MVP) is the fastest way to test your most critical assumptions before building too much. Research by Will Oremus and others on early Amazon, Airbnb, and Dropbox shows their early products were deliberately minimal, specifically designed to test one assumption: will anyone want this at all?',
      },
      {
        heading: 'Product-Market Fit Is Not a Feeling',
        body: 'Marc Andreessen coined "product-market fit" in 2007: "being in a good market with a product that can satisfy that market." The challenge is that it\'s qualitative to describe but becomes quantitative when real. Sean Ellis\'s metric: at least 40% of users say they would be "very disappointed" if your product disappeared. Net Promoter Score above 50. Month-over-month retention that doesn\'t decline to zero. The empirical pattern from Sequoia Capital and others analyzing successful startups: before product-market fit, the goal is learning fast and spending slowly. After product-market fit, the goal is scaling fast. Companies that scale before PMF — a common mistake when well-funded — amplify a broken thing.',
      },
      {
        heading: 'The Team Is the Product',
        body: 'Google\'s Project Aristotle, a 2016 study of 180 teams over two years led by Abeer Dubey, found that the single strongest predictor of team performance was psychological safety — the belief that you can take risks and speak up without punishment or humiliation. Skills and experience mattered less. This aligns with decades of organizational psychology showing that team dynamics, communication patterns, and trust architecture predict outcomes more reliably than individual talent. For early-stage companies, Paul Graham of Y Combinator has argued for 20 years that co-founder relationships are the most important choice — above product, market, or timing — because all other problems can be solved with the right people.',
      },
    ],
    sources: [
      {
        title: 'Business Employment Dynamics',
        author: 'Bureau of Labor Statistics',
        url: 'https://www.bls.gov/bdm/entrepreneurship/entrepreneurship.htm',
      },
      {
        title: 'The Top 20 Reasons Startups Fail',
        author: 'CB Insights',
        url: 'https://www.cbinsights.com/research/startup-failure-reasons-top/',
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries — Crown Business, 2011',
      },
      {
        title: 'Google\'s Project Aristotle (2016)',
        author: 'Abeer Dubey — Google re:Work',
        url: 'https://rework.withgoogle.com/print/guides/5721312655835136/',
      },
    ],
  },
  // ── SCIENCE ───────────────────────────────────────────────────────────────
  {
    id: 'critical-thinking',
    tag: 'SCIENCE',
    tagBg: '#A78BFA18',
    tagColor: '#A78BFA',
    title: 'Critical Thinking in the Information Age',
    summary: 'How to evaluate sources, spot manipulation, and form accurate beliefs.',
    sections: [
      {
        heading: 'The Problem Is Not Stupidity',
        body: 'Research on misinformation consistently finds that intelligence does not protect against false beliefs — in some cases, it makes things worse. The "smart idiot" effect, documented by sociologist Gordon Pennycook at the University of Regina, shows that people with higher cognitive ability are more skilled at rationalizing beliefs they arrived at through motivated reasoning. The real defense is epistemic humility — holding beliefs proportional to evidence — combined with specific analytical habits. The Stanford History Education Group\'s "civic online reasoning" studies found that most adults (and 96% of professional historians when tested on digital media) struggled to evaluate online source credibility accurately.',
      },
      {
        heading: 'Evaluating Sources: The SIFT Method',
        body: 'Media literacy researcher Mike Caulfield developed SIFT as a practical four-step method: Stop (pause before sharing or believing; check your emotional reaction), Investigate the source (before reading the content, find out who is behind it), Find better coverage (look for independent reporting on the same claim), and Trace claims to the original source (most misinformation distorts real research; find the primary source). Studies at the University of Washington testing SIFT against standard critical thinking instruction found SIFT-trained students significantly outperformed controls at identifying unreliable sources in time-pressured conditions similar to real browsing.',
      },
      {
        heading: 'Statistical Literacy',
        body: 'Most misinformation in science journalism comes not from fabrication but from misrepresentation of statistics. Key concepts: relative vs. absolute risk (a treatment that "reduces risk by 50%" sounds dramatic; if baseline risk was 2%, the absolute reduction is 1%); correlation vs. causation (the classic ice cream/drowning correlation); p-values vs. effect sizes (a statistically significant result with p<0.05 can represent a trivially small effect in a large study); and base rates (90% accurate test + 1% disease prevalence = 50% false positives, the base rate fallacy). Gerd Gigerenzen at the Max Planck Institute has spent decades documenting how even doctors misinterpret the statistics on which they base treatment decisions.',
      },
      {
        heading: 'Steelmanning vs. Strawmanning',
        body: 'A straw man argument misrepresents an opponent\'s position to make it easier to attack. Steelmanning — the inverse — means articulating the strongest possible version of a position you disagree with before critiquing it. Philosopher Daniel Dennett formalized this as the first of his "intuition pumps" for good thinking: before criticizing, state the other position so clearly that the person who holds it would say "yes, that\'s exactly what I believe." This is not about being fair to opponents — it\'s about not wasting time refuting positions no one actually holds. It\'s also the best way to find where your own position is weak, before an opponent does.',
      },
    ],
    sources: [
      {
        title: 'Bullshit Detection Among the Cognitive Elite',
        author: 'Gordon Pennycook — Cognition, 2019',
      },
      {
        title: 'Evaluating Information: The Cornerstone of Civic Online Reasoning',
        author: 'Stanford History Education Group (2016)',
        url: 'https://sheg.stanford.edu/civic-online-reasoning',
      },
      {
        title: 'Calculated Risks: How to Know When Numbers Deceive You',
        author: 'Gerd Gigerenzen — Simon & Schuster, 2002',
      },
      {
        title: 'Intuition Pumps and Other Tools for Thinking',
        author: 'Daniel Dennett — Norton, 2013',
      },
    ],
  },
  {
    id: 'network-effects-social',
    tag: 'SCIENCE',
    tagBg: '#A78BFA18',
    tagColor: '#A78BFA',
    title: 'Building a Network That Matters',
    summary: 'The sociology of relationships — how connections compound into opportunities.',
    sections: [
      {
        heading: 'Weak Ties Are the Real Opportunity',
        body: 'Mark Granovetter\'s 1973 paper "The Strength of Weak Ties" in the American Journal of Sociology is one of the most cited papers in social science. His central finding: most people find jobs, opportunities, and new information through weak ties (acquaintances, former colleagues, friends-of-friends) rather than strong ties (close friends and family). The reason: strong ties are dense clusters who know the same people and information you do. Weak ties bridge different social clusters, providing access to genuinely different information and opportunities. A 2022 large-scale study of 20 million LinkedIn users by Rajiv Garg et al. replicated Granovetter\'s finding at massive scale.',
      },
      {
        heading: 'Dunbar\'s Number and Social Bandwidth',
        body: 'Robin Dunbar at Oxford proposed in 1992 that human neocortex size constrains social group capacity to roughly 150 stable relationships — "Dunbar\'s number." The structure has layers: 5 intimate confidants, 15 close friends, 50 active network, 150 meaningful relationships. These numbers are surprisingly consistent across hunter-gatherer societies, military unit sizes, and corporate organizational structures. The implication: relationships above 150 are maintained at the cost of relationships below 150. Network building is not about adding contacts indefinitely — it\'s about curating which relationships you actively maintain, since bandwidth is finite.',
      },
      {
        heading: 'Give First',
        body: 'Adam Grant\'s Give and Take (2013), drawing on research across professions, identifies three relationship styles: givers (help without immediate expectation of return), takers (extract value), and matchers (reciprocate proportionally). Counterintuitively, givers are both the most and least successful people in his data — the difference is strategy. Unfocused givers burn out; strategic givers — who help others but protect their own time and energy — rise to the top of networks because they build genuine goodwill at scale. The practical principle: look for ways to add value to your network before asking for anything. Generosity compounds.',
      },
      {
        heading: 'The Long Game',
        body: 'The research on relationship building consistently shows that the highest-value connections come from long, low-pressure accumulation rather than transactional networking events. Psychologist Robert Cialdini\'s research on liking (Influence, 1984) finds familiarity and genuine shared interest are the foundations of durable relationships. Investor and writer Naval Ravikant articulates the principle well: "play long-term games with long-term people." The compounding logic applies to relationships as directly as to money: a relationship maintained for 10 years provides qualitatively different value than ten one-year relationships, because trust and mutual knowledge are not transferable.',
      },
    ],
    sources: [
      {
        title: 'The Strength of Weak Ties (1973)',
        author: 'Mark Granovetter — American Journal of Sociology',
      },
      {
        title: 'Neocortex Size as a Constraint on Group Size in Primates (1992)',
        author: 'Robin Dunbar — Journal of Human Evolution',
      },
      {
        title: 'Give and Take: Why Helping Others Drives Our Success',
        author: 'Adam Grant — Viking, 2013',
      },
      {
        title: 'Causal Effects of Weak Ties (2022)',
        author: 'Rajiv Garg et al. — Science',
        url: 'https://www.science.org/doi/10.1126/science.abl4476',
      },
    ],
  },
  {
    id: 'time-management',
    tag: 'SCIENCE',
    tagBg: '#A78BFA18',
    tagColor: '#A78BFA',
    title: 'Time Management That Works',
    summary: 'The evidence on attention, deep work, and designing your day for what actually matters.',
    sections: [
      {
        heading: 'The Attention Economy',
        body: 'Your attention is the product that advertising platforms sell. A 2023 study by RescueTime found knowledge workers average 2h 48m of focused work per day despite 8-hour workdays — the rest is fragmented by context switches, notifications, and meetings. Microsoft\'s Human Factors Lab published research in 2021 showing that back-to-back video meetings cause sustained elevation of cortisol and prefrontal cortex fatigue compared to meetings with breaks in between. The fundamental scarcity is not time — it\'s sustained, uninterrupted attention. Almost every evidence-backed productivity framework addresses this first.',
      },
      {
        heading: 'Deep Work vs. Shallow Work',
        body: 'Cal Newport\'s Deep Work (2016), drawing on research by Florida State psychologist K. Anders Ericsson on deliberate practice, distinguishes between deep work (cognitively demanding, distraction-free, creates new value) and shallow work (administrative, communicative, low cognitive load, easily replicated). Ericsson\'s research on expert performance shows that elite performers in virtually every knowledge domain — chess, music, programming, writing — perform at most 4–5 hours of genuine deep work per day; more produces diminishing returns and eventual performance decline. The implication: 4 hours of genuine focus beats 8 hours of interrupted pseudo-work.',
      },
      {
        heading: 'Time Blocking and Energy Management',
        body: 'Google engineer and author Jake Knapp (Sprint, 2016) popularized time blocking: pre-scheduling blocks of focused time on your calendar before reactive tasks fill the day. Research by productivity researcher Laura Vanderkam shows that people who plan their weeks in advance consistently accomplish more and report higher satisfaction than those who plan reactively. Tony Schwartz and Jim Loehr\'s The Power of Full Engagement (2003) reframes the problem entirely: the scarce resource is not time (everyone has 24 hours) but energy — physical, emotional, mental, and spiritual. Managing energy through strategic renewal (sleep, movement, brief breaks) is the lever that determines output per hour.',
      },
      {
        heading: 'The Two-Minute Rule and Clearing the Deck',
        body: 'David Allen\'s Getting Things Done (GTD, 2001) introduced the two-minute rule: if a task takes less than two minutes, do it immediately rather than scheduling it. The cognitive cost of holding an open loop — a task you haven\'t decided what to do with — is disproportionate to its actual size. Allen argues that most stress from work is not from the volume of tasks but from the unresolved commitments cluttering working memory. His capture-clarify-organize-reflect-engage system externalizes this cognitive load. Research on "open loops" in cognitive science (Zeigarnik effect, 1927) supports this: uncompleted tasks occupy more working memory than completed ones.',
      },
    ],
    sources: [
      {
        title: 'Deep Work: Rules for Focused Success in a Distracted World',
        author: 'Cal Newport — Grand Central Publishing, 2016',
      },
      {
        title: 'The Role of Deliberate Practice in the Acquisition of Expert Performance',
        author: 'K. Anders Ericsson et al. — Psychological Review, 1993',
      },
      {
        title: 'The Power of Full Engagement',
        author: 'Jim Loehr & Tony Schwartz — Free Press, 2003',
      },
      {
        title: 'Getting Things Done: The Art of Stress-Free Productivity',
        author: 'David Allen — Viking, 2001',
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
