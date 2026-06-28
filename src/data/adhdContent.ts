export interface AdhdInsight {
  id: string;
  title: string;
  tagline: string;
  whatHappens: string;
  tips: string[];
  color: string;
}

export const ADHD_INSIGHTS: AdhdInsight[] = [
  {
    id: 'task-initiation',
    title: 'Task Initiation',
    tagline: 'Getting started is the ADHD boss fight',
    whatHappens:
      'ADHD brains have lower dopamine baseline. Without enough novelty or urgency, the prefrontal cortex struggles to fire the motor system into action. Low follow-through on routines is almost always a starting problem, not a motivation problem.',
    tips: [
      '2-minute rule: commit to just 2 minutes. Once started, momentum usually carries you forward.',
      'Body double: work alongside someone — another person\'s presence activates a different attentional system.',
      'Shrink the task: instead of "exercise," say "put on shoes." The smaller the entry point, the lower the dopamine cost to begin.',
    ],
    color: '#E63946',
  },
  {
    id: 'time-blindness',
    title: 'Time Blindness',
    tagline: 'ADHD brains experience now vs. not-now, not past vs. future',
    whatHappens:
      'The ADHD brain doesn\'t sense time passing normally — it\'s a dopamine-driven disruption in the brain\'s internal clock. Tasks with no immediate deadline feel like they don\'t exist yet. This is why routines with time blocks get skipped even when you genuinely planned to do them.',
    tips: [
      'Make time visible: use analog clocks or Time Timer apps — seeing time shrink is more concrete than digital numbers.',
      'Set 10-min arrival alarms: an alert 10 minutes before any transition gives the brain time to prepare.',
      'Estimate then double: ADHD people chronically underestimate duration. Build in buffer before you need it.',
    ],
    color: '#4CC9F0',
  },
  {
    id: 'emotional-regulation',
    title: 'Emotional Intensity',
    tagline: 'Feelings hit different with ADHD',
    whatHappens:
      'ADHD involves less top-down control from the prefrontal cortex over the emotional brain (limbic system). Emotions can feel 3x more intense and take longer to pass. RSD — Rejection Sensitive Dysphoria — is common and real. Skipping routines often has an emotional avoidance component, not just inertia.',
    tips: [
      'Name it to tame it: saying "I feel anxious" activates the prefrontal cortex and dampens the amygdala — proven in fMRI studies.',
      'Box breathing: 4 counts in, hold 4, out 4, hold 4 — activates the parasympathetic nervous system within 60 seconds.',
      'Write before acting: journaling gives the prefrontal cortex time to catch up to your emotional state.',
    ],
    color: '#F72585',
  },
  {
    id: 'working-memory',
    title: 'Working Memory',
    tagline: 'The mental whiteboard gets erased too fast',
    whatHappens:
      'ADHD significantly impairs working memory — the mental workspace for holding and manipulating information. An interruption or distraction effectively wipes the board. This is why good intentions disappear and routines get "forgotten" even minutes after deciding to do them.',
    tips: [
      'Externalize everything: write it down immediately. Don\'t trust the memory — it\'s not designed to hold it.',
      'Out-loud narration: saying tasks aloud creates an auditory trace that\'s easier to retrieve than a thought.',
      'One thing visible: put the next action physically in your path — phone on the shoes, journal on the pillow.',
    ],
    color: '#7209B7',
  },
  {
    id: 'morning-activation',
    title: 'Morning Activation',
    tagline: 'ADHD mornings need a launch sequence, not willpower',
    whatHappens:
      'Cortisol and dopamine ramp up slower in ADHD brains. The prefrontal cortex needs physical and sensory input to get online. Low completion on morning routines is largely neurological — your brain isn\'t ready to choose and execute yet. The fix is sequencing, not effort.',
    tips: [
      'Move first: 10+ minutes of aerobic activity doubles dopamine and norepinephrine — same neurotransmitters as ADHD medications.',
      'Bright light within 30 min: morning sun exposure anchors circadian rhythm and speeds cortisol rise.',
      'Non-negotiable anchor: one identical task done first every morning (same order, no decisions) trains the brain to boot faster.',
    ],
    color: '#FFD166',
  },
  {
    id: 'reward-circuit',
    title: 'Reward & Motivation',
    tagline: 'ADHD needs dopamine now, not in 3 weeks',
    whatHappens:
      'ADHD is fundamentally a dopamine regulation disorder. The brain\'s reward circuitry is less sensitive to future rewards — "I\'ll feel better in a month if I exercise" doesn\'t fire the dopamine system enough to override inertia. You need more immediate, concrete feedback to sustain any routine.',
    tips: [
      'Micro-rewards: celebrate every task completion, not just goals. Dopamine fires on completion, not just on winning.',
      'Make progress visible: streaks, progress bars, and XP create synthetic reward signals that keep the loop alive.',
      'Temptation bundle: pair the routine with something enjoyable — your favorite podcast only plays during your walk.',
    ],
    color: '#06D6A0',
  },
  {
    id: 'hyperfocus',
    title: 'Hyperfocus & Transitions',
    tagline: 'Locked in is great — until it isn\'t',
    whatHappens:
      'ADHD doesn\'t mean can\'t focus — it means inconsistent focus regulation. Hyperfocus happens when dopamine spikes on high-interest tasks. The problem: the brain struggles to exit hyperfocus, and the shift out feels almost physically uncomfortable. This is why routines get skipped not from laziness but from being stuck in something else.',
    tips: [
      'Set an exit alarm 15 min before you need to stop — it gives the brain time to ramp down.',
      'Parking lot: keep a notepad to dump hyperfocus ideas mid-session so your brain releases the urge to hold them.',
      'Sensory transition: a walk, a different room, or cold water signals the brain to reset between contexts.',
    ],
    color: '#FF9F1C',
  },
];

export function getInsightById(id: string): AdhdInsight | undefined {
  return ADHD_INSIGHTS.find((i) => i.id === id);
}

// Maps a routine's context to the most relevant insight category
export function mapRoutineToInsightId(
  pillarId: string,
  timeOfDay: string,
  completionRate: number
): string {
  if (completionRate < 0.2) return 'task-initiation';
  if (timeOfDay === 'morning') return 'morning-activation';
  if (pillarId === 'mental' || pillarId === 'relationships') return 'emotional-regulation';
  if (pillarId === 'skills') return 'working-memory';
  if (pillarId === 'health' || pillarId === 'leisure') return 'reward-circuit';
  if (completionRate < 0.35) return 'time-blindness';
  return 'reward-circuit';
}
