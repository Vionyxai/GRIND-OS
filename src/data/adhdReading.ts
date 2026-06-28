export interface UserPattern {
  overallRate: number;
  morningRate: number | null;
  eveningRate: number | null;
  pillarRates: Record<string, number>;
  daysActive: number;
}

export interface ReadingPiece {
  id: string;
  title: string;
  teaser: string;
  color: string;
  body: string[];
  keyTakeaway: string;
  checkRelevance: (pattern: UserPattern) => { isRelevant: boolean; personalNote: string };
}

export const READING_PIECES: ReadingPiece[] = [
  {
    id: 'dopamine',
    title: 'Your Dopamine System Is Wired Differently',
    teaser: "ADHD isn't a deficit of attention — it's a deficit of dopamine regulation that makes attention inconsistent.",
    color: '#E63946',
    body: [
      "The ADHD brain has a significantly different dopamine transport system. Dopamine is the neurotransmitter responsible for motivation, reward anticipation, and follow-through. In the ADHD brain, dopamine is either produced in lower quantities or cleared from synapses faster than in neurotypical brains — meaning the \"reward signal\" that tells you something matters fades quicker.",
      "This explains why ADHD isn't about being unable to focus — it's about being unable to focus on things the brain doesn't find immediately stimulating. When something is novel, urgent, interesting, or carries a personal challenge, dopamine spikes and focus becomes laser-sharp. But for routine tasks that lack those hooks, the dopamine signal simply doesn't sustain.",
      "Medication works by blocking dopamine reuptake transporters, keeping dopamine in the synaptic cleft longer. But you can also manipulate dopamine naturally: novel environments, physical exercise (releases dopamine within 5 minutes), music, body-doubling, and artificial urgency (timers, public commitments) can all create the spark the ADHD brain needs to engage.",
    ],
    keyTakeaway: "You're not lazy — your brain genuinely needs more stimulation to generate the dopamine required for motivation. Build that stimulation in deliberately.",
    checkRelevance: (p) => {
      if (p.overallRate < 0.55 && p.daysActive >= 5) {
        return {
          isRelevant: true,
          personalNote: `Your ${Math.round(p.overallRate * 100)}% overall completion rate suggests your dopamine system is working against routine consistency. This is the foundational piece to understand.`,
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'morning-activation',
    title: 'Why ADHD Mornings Are Hard',
    teaser: "Waking up is not just about willpower — the ADHD brain has a measurably slower cortisol and norepinephrine ramp-up in the morning.",
    color: '#FFD166',
    body: [
      "Research published in the Journal of Attention Disorders found that adults with ADHD have a blunted cortisol awakening response — the normal morning spike of cortisol that activates the prefrontal cortex (PFC) is flatter and delayed. This means the brain's executive CPU comes online hours later than in neurotypical people.",
      "This isn't about being a night owl by preference. The ADHD nervous system needs additional activation stimulation to shift from sleep mode to operational mode. The common strategies that work for neurotypical people — setting an alarm, leaving a to-do list — don't work because the PFC isn't yet online to process them.",
      "What actually works for ADHD mornings: immediate sensory stimulation (cold water, bright light, loud music), removing decisions (same breakfast, pre-laid clothes), body movement within 15 minutes of waking, and delaying high-cognitive-demand tasks until 90-120 minutes after waking. Exercise is particularly powerful — it triggers norepinephrine release that mimics the cortisol ramp-up the brain is missing.",
    ],
    keyTakeaway: "Your morning is the hardest transition of the day by neurobiology. Design it around stimulation and zero-decision defaults, not discipline.",
    checkRelevance: (p) => {
      if (p.morningRate !== null && p.morningRate < 0.5) {
        return {
          isRelevant: true,
          personalNote: `Your morning routine completion is at ${Math.round(p.morningRate * 100)}%. Research strongly suggests this is a neurobiological morning-activation issue, not a motivation issue.`,
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'time-blindness',
    title: "Time Blindness: Living in Now vs. Not-Now",
    teaser: "For ADHD brains, time doesn't exist on a continuous spectrum — there is only 'now' and 'not now.'",
    color: '#4CC9F0',
    body: [
      "Dr. Russell Barkley's research on ADHD and time perception found that ADHD fundamentally impairs the brain's ability to use time as a reference for behavior. Neurotypical people have a continuous mental timeline that connects past experience, present action, and future consequences. ADHD brains have a much weaker connection to non-present time.",
      "This manifests as chronic lateness, difficulty estimating how long tasks take, sudden deadline awareness, losing track of hours while absorbed, and inability to 'feel' future consequences as motivating. You intellectually know a deadline is coming — but you can't feel its proximity the way others do. This is why reminders help only briefly: once the reminder is gone, the event goes back to 'not now.'",
      "Effective workarounds externalize time: visible clocks everywhere, time-block schedules rather than to-do lists, alarms set 20 minutes before events, the Pomodoro technique to make time tangible in chunks, and linking future events to present feelings. The goal is making time visible, audible, and felt — because the internal time sense isn't reliable.",
    ],
    keyTakeaway: "You can't fix time blindness with willpower. Externalize time with tools that make it visible and felt, not just known.",
    checkRelevance: (p) => {
      if (p.overallRate < 0.65 && p.daysActive >= 14) {
        return {
          isRelevant: true,
          personalNote: "Inconsistency across 14+ tracked days often traces back to time blindness — good days and missed days correlate with how visible and urgent tasks felt, not how motivated you were.",
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'rsd',
    title: 'RSD: Why Rejection Feels Catastrophic',
    teaser: "Rejection Sensitive Dysphoria (RSD) is an ADHD hallmark — emotional pain from perceived rejection that is neurologically more intense than in most people.",
    color: '#F72585',
    body: [
      "Dr. William Dodson coined the term Rejection Sensitive Dysphoria (RSD) to describe the extreme emotional pain that occurs in people with ADHD when they experience — or even anticipate — criticism, rejection, or failure. Unlike typical disappointment, RSD responses are sudden, intense, and can feel catastrophic even when the objective situation doesn't warrant it.",
      "The amygdala (the brain's emotional alarm center) is less regulated by the prefrontal cortex in ADHD. An email with a neutral tone gets read as criticism. A friend not responding becomes evidence of rejection. This isn't oversensitivity — it's a neurological pattern where emotional signals don't get filtered the same way.",
      "RSD often drives ADHD behavior more than people realize: procrastination (avoiding starting things where you might fail), perfectionism (if it's perfect you can't be criticized), and avoiding new challenges all have RSD at their root. When you notice a strong emotional spike, naming it — 'this is RSD' — activates the PFC and creates just enough distance to question whether the signal is proportionate.",
    ],
    keyTakeaway: "RSD makes emotional feedback 10x louder. Learning to name it when it happens is the first step to not being driven by it.",
    checkRelevance: (p) => {
      const mentalRate = p.pillarRates['mental'];
      const relRate = p.pillarRates['relationships'];
      const relevant =
        (mentalRate !== undefined && mentalRate < 0.5) ||
        (relRate !== undefined && relRate < 0.5);
      if (relevant) {
        return {
          isRelevant: true,
          personalNote: "Difficulty with mental/spiritual or relationships routines often connects to RSD — emotional dysregulation can make social and self-care tasks feel loaded with stakes.",
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'executive-function',
    title: 'Executive Function: The CEO Who Called In Sick',
    teaser: "Executive functions are the brain's management systems — ADHD impairs them all, which is why self-management feels so much harder than it looks.",
    color: '#7209B7',
    body: [
      "Executive functions (EF) are a set of cognitive processes managed by the prefrontal cortex: working memory (holding information in mind while acting), cognitive flexibility (switching tasks), inhibitory control, planning, prioritizing, and emotional regulation. ADHD isn't one thing going wrong — it's all of these systems having reduced reliability.",
      "Researcher Thomas Brown's key insight is that ADHD isn't about whether these functions exist — it's about consistency. The ADHD brain can demonstrate excellent executive function some of the time (especially under stimulation or pressure). This makes ADHD invisible to others ('but you did it fine last Tuesday') and confusing to the person with ADHD who knows they're capable but can't reliably access it.",
      "External structures compensate for inconsistent internal EF: checklists replace working memory, routines eliminate planning demands, timers compensate for weak inhibition, accountability compensates for motivation, and body-doubling (working alongside someone else) activates social engagement circuits that boost PFC activation. The goal is building scaffolding the unreliable CEO can lean on.",
    ],
    keyTakeaway: "You're not underperforming because you don't try. You're working with a management system that fires inconsistently. External structure is the fix, not more willpower.",
    checkRelevance: (p) => {
      if (p.overallRate < 0.5 && p.daysActive >= 7) {
        return {
          isRelevant: true,
          personalNote: `An overall completion rate of ${Math.round(p.overallRate * 100)}% across multiple active days points strongly to executive function inconsistency — the core ADHD challenge.`,
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'habit-formation',
    title: "The Consistency Paradox: Why Habits Take Longer",
    teaser: "The popular '21 days to a habit' rule doesn't apply to ADHD brains — habit formation takes longer and requires different mechanics.",
    color: '#06D6A0',
    body: [
      "Habits form through repetition that gradually shifts behavior from the prefrontal cortex (conscious effort) to the basal ganglia (automatic). This works because repeated activation of the same neural pathway makes it progressively easier to fire. The problem with ADHD: the repetition needed is inconsistent, and missed days break the accumulating path.",
      "Research by Phillippa Lally at University College London found that habit automaticity takes 18-254 days, with high individual variability. For ADHD brains, the lower end of that range is almost impossible to hit because inconsistency is inherent to the disorder. The good news: missing one day has minimal impact on final automaticity. Missing two or more in a row, however, significantly disrupts the pathway.",
      "ADHD-compatible habit stacking: anchor new habits to already-automatic behaviors (after coffee, not at 7am), keep the entry point as small as possible (two-minute version), use implementation intentions ('when X happens, I will do Y'), and accept that you may need 60-90 days for something a neurotypical person habits in 30. The compounding is the same — it just has a longer runway.",
    ],
    keyTakeaway: "Miss one day — it's fine. Miss two in a row — fire every alarm. Your habit clock runs slower, and that's measurable fact, not personal failure.",
    checkRelevance: (p) => {
      if (p.daysActive >= 7 && p.overallRate < 0.7) {
        return {
          isRelevant: true,
          personalNote: "You're in the habit-building phase — this is the science behind why it feels hard even when you're trying. Your data shows the effort, even when completion isn't perfect.",
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'hyperfocus',
    title: 'Hyperfocus: The Superpower With a Catch',
    teaser: "Hyperfocus is real, documented, and double-edged — it's proof that ADHD attention is dysregulated, not absent.",
    color: '#FF9F1C',
    body: [
      "Hyperfocus is the paradox that makes ADHD hard to diagnose: the same person who can't sustain attention on a meeting can lose 6 hours in a video game. Dr. Ned Hallowell describes it as 'like having a race car engine with bicycle brakes' — when interest locks attention in, it locks hard. The dopamine spike from engaging material essentially suppresses all competing signals.",
      "Hyperfocus isn't the opposite of ADHD — it's a symptom of the same underlying mechanism. The ADHD brain can't modulate attention consistently: it either can't engage or can't disengage. Studies show hyperfocus is most likely with activities that have immediate feedback, high interest, clear challenge/skill balance, or social connection — all massive dopamine triggers.",
      "The catch: hyperfocus is not volitional. You can't choose to hyperfocus on your tax return. And when it occurs, the transition out is extremely difficult and emotionally costly. Strategies: use hyperfocus states deliberately for deep work, set external transition alarms, and build buffer time between hyperfocus sessions and social/operational commitments.",
    ],
    keyTakeaway: "Hyperfocus is evidence that your attention capacity exists — but it's driven by interest, not intention. Design your work to invite the interest.",
    checkRelevance: (p) => {
      const skillsRate = p.pillarRates['skills'];
      if (skillsRate !== undefined && skillsRate > 0.7) {
        return {
          isRelevant: true,
          personalNote: "Your strong completion in Skills & Learning suggests hyperfocus is working in your favor there. Understanding the mechanism helps you channel it deliberately in other areas.",
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'exercise',
    title: 'Exercise as Medicine for ADHD',
    teaser: "Exercise is the closest thing to a natural stimulant — the effects on dopamine, norepinephrine, and BDNF are documented and significant.",
    color: '#06D6A0',
    body: [
      "John Ratey's book Spark summarizes decades of research showing that aerobic exercise produces dopamine, norepinephrine, and serotonin — the same neurotransmitters targeted by ADHD medications. A 2012 study in the Journal of Attention Disorders found that 20 minutes of moderate-intensity exercise improved cognitive performance in children with ADHD as much as a dose of Ritalin.",
      "Exercise also triggers the release of Brain-Derived Neurotrophic Factor (BDNF), which Ratey calls 'Miracle-Gro for the brain.' BDNF promotes growth of new neurons and synaptic connections in the prefrontal cortex — literally building more executive function capacity over time. Sustained exercise habits compound into measurable improvements in focus and working memory over 8-12 weeks.",
      "Timing matters: morning exercise within 90 minutes of waking has the strongest impact on ADHD symptoms for the day ahead, likely because it front-loads the neurochemical state needed for executive function. Even a 20-minute walk has measurable effects. High-intensity interval training produces larger acute dopamine spikes than steady-state cardio, making it particularly effective for ADHD activation.",
    ],
    keyTakeaway: "Exercise isn't just health — for ADHD it's neurochemical medicine. Even a 20-minute walk this morning changes your focus window today.",
    checkRelevance: (p) => {
      const healthRate = p.pillarRates['health'];
      const leisureRate = p.pillarRates['leisure'];
      const relevant =
        (healthRate !== undefined && healthRate < 0.5) ||
        (leisureRate !== undefined && leisureRate < 0.5);
      if (relevant) {
        return {
          isRelevant: true,
          personalNote: "Your health/leisure completion suggests physical activity isn't locked in yet. Given the direct neurological benefits for ADHD, this is the highest ROI routine to build first.",
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'sleep',
    title: 'ADHD and Sleep: The Vicious Circle',
    teaser: "ADHD disrupts sleep in measurable ways, and poor sleep worsens every ADHD symptom — creating a cycle most people don't know they're in.",
    color: '#7209B7',
    body: [
      "Research consistently shows that 75% of adults with ADHD have significant sleep problems — not just insomnia, but delayed sleep phase syndrome (DSPS), where the circadian rhythm is shifted later. The ADHD brain's dopamine and norepinephrine dysregulation affects the timing systems that signal 'time to sleep.' This is why the ADHD mind often 'wakes up' mentally around 10pm — not night owl preference, but biology.",
      "The vicious circle: poor sleep reduces prefrontal cortex activity, which worsens executive function, attention, and emotional regulation — all already impaired by ADHD. A 2013 study in Sleep Medicine found that sleep-deprived ADHD adults showed significantly worse symptom profiles than well-rested ones. Many people who believe their ADHD is getting worse are experiencing chronic partial sleep deprivation compounding their baseline.",
      "Sleep hygiene for ADHD requires different interventions than for neurotypical people. Blue light blocking 2 hours before sleep, melatonin (0.5-1mg, not the 5-10mg doses sold commercially), a strict wind-down routine, and white noise or body temperature lowering (cold shower, open window) have the most evidence. The ADHD brain needs a stronger sleep cue because its regulatory systems are quieter.",
    ],
    keyTakeaway: "If your symptoms feel worse than usual, check your sleep first. Every 90-minute deficit shows up as executive function degradation the next day.",
    checkRelevance: (p) => {
      if (p.eveningRate !== null && p.eveningRate < 0.45) {
        return {
          isRelevant: true,
          personalNote: `Your evening routine completion is at ${Math.round(p.eveningRate * 100)}%. Evening routines are the hardest for ADHD — and they have the biggest downstream impact on the next morning.`,
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
  {
    id: 'self-compassion',
    title: 'The Self-Compassion Gap: ADHD and Shame',
    teaser: "Adults with ADHD have typically received 10,000+ more corrective messages than neurotypical peers by age 10. The shame residue is real and measurable.",
    color: '#4CC9F0',
    body: [
      "Dr. Edward Hallowell estimates that by age 10, a child with ADHD has received 20,000 more negative feedback messages than their neurotypical peers — 'try harder,' 'pay attention,' 'you're capable but not trying.' Repeated thousands of times, these messages become an internal narrative that's extremely hard to dislodge. Most adults with ADHD carry significant shame about their performance.",
      "Shame activates threat circuitry in the brain (amygdala, hypothalamus) which directly suppresses prefrontal cortex function. This means shame actively makes ADHD worse. The self-criticism loop — feeling bad about incomplete routines → increased shame → reduced PFC activity → worse performance → more shame — is a documented neurological spiral, not a personality trait.",
      "Dr. Kristin Neff's self-compassion research shows that treating yourself as you'd treat a struggling friend produces better long-term performance outcomes than self-criticism. This is counterintuitive: most people believe harsh self-judgment is the motivational path. The data says the opposite — self-compassion reduces threat circuitry activation and frees up PFC resources for actual problem-solving.",
    ],
    keyTakeaway: "Beating yourself up for missed routines isn't motivation — it's neuro-braking. Noticing what didn't work and adjusting without shame is a higher-performance strategy.",
    checkRelevance: (p) => {
      if (p.overallRate < 0.5 && p.daysActive >= 10) {
        return {
          isRelevant: true,
          personalNote: "Still building consistency after 10+ active days is normal for ADHD — but it's also where the shame spiral can set in. This piece is written for exactly where you are.",
        };
      }
      return { isRelevant: false, personalNote: '' };
    },
  },
];
