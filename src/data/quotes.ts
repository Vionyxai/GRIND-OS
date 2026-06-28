import { Quote } from '../types';

const LARRY_JUNE: Quote[] = [
  { text: "Slow money is still money. Stay patient, stay consistent.", author: "Larry June" },
  { text: "Organic. No shortcuts. You built this from nothing.", author: "Larry June" },
  { text: "Take care of your body first. Everything else follows.", author: "Larry June" },
  { text: "Wake up early, move slow, think clear.", author: "Larry June" },
  { text: "You eat good when you work good. Period.", author: "Larry June" },
  { text: "Stay hydrated, stay focused. That's the blueprint.", author: "Larry June" },
  { text: "The lifestyle is the work. Don't separate them.", author: "Larry June" },
  { text: "Real wealth is time. Stack that before the money.", author: "Larry June" },
  { text: "Juicing, investments, and peace of mind. That's the goal.", author: "Larry June" },
  { text: "Don't be in a rush. The bag is already on its way.", author: "Larry June" },
  { text: "Whole foods, good people, and a clear mind. Win every time.", author: "Larry June" },
  { text: "Your health is your first business. Protect it.", author: "Larry June" },
  { text: "Less noise, more motion. Execute in silence.", author: "Larry June" },
  { text: "You don't need permission to prosper.", author: "Larry June" },
  { text: "Routine is the foundation of everything you're building.", author: "Larry June" },
  { text: "Forty acres and a mule couldn't stop what I got going.", author: "Larry June" },
  { text: "Peace of mind is the ultimate flex.", author: "Larry June" },
  { text: "Out here cooking up something organic. Watch.", author: "Larry June" },
];

const J_COLE: Quote[] = [
  { text: "There's beauty in the struggle, ugliness in the success.", author: "J. Cole" },
  { text: "You have to work in silence and let your success make the noise.", author: "J. Cole" },
  { text: "Dream big and dare to fail. Then get back up.", author: "J. Cole" },
  { text: "The only way to grow is to be willing to feel uncomfortable.", author: "J. Cole" },
  { text: "Nothing lasts forever but at least we got these memories.", author: "J. Cole" },
  { text: "Love yourself, girl. Or nobody will.", author: "J. Cole" },
  { text: "Real eyes realize real lies. Stay sharp.", author: "J. Cole" },
  { text: "I got a lot to prove. That feeling never leaves.", author: "J. Cole" },
  { text: "It's magic when you know your purpose.", author: "J. Cole" },
  { text: "Be the star you are. No one else is coming.", author: "J. Cole" },
  { text: "Patience and persistence. That's the only formula.", author: "J. Cole" },
  { text: "Everything happens for a reason. Trust the process.", author: "J. Cole" },
  { text: "Stop comparing yourself to others. You're on your own timeline.", author: "J. Cole" },
  { text: "The greatest gift is the ability to forget. Start fresh today.", author: "J. Cole" },
  { text: "Sacrificing now so I can live the life I imagined later.", author: "J. Cole" },
  { text: "The days of procrastination are over. One step. Now.", author: "J. Cole" },
  { text: "Somewhere deep in my mind I got a vision of a king.", author: "J. Cole" },
  { text: "Your setback is the setup for your comeback.", author: "J. Cole" },
];

const DRAKE: Quote[] = [
  { text: "Started from the bottom. Every day is still day one.", author: "Drake" },
  { text: "Wishing good things for the people who want to see me fail.", author: "Drake" },
  { text: "Patience is not sitting and waiting. It is foreseeing.", author: "Drake" },
  { text: "Count your blessings, not your problems.", author: "Drake" },
  { text: "Trigger fingers turn to Twitter fingers? Not here. Move in silence.", author: "Drake" },
  { text: "Sometimes it's the journey that teaches you a lot about your destination.", author: "Drake" },
  { text: "Know yourself. Know your worth. Then act accordingly.", author: "Drake" },
  { text: "I'm trying to do better than good enough.", author: "Drake" },
  { text: "Pain makes you stronger. Tears make you braver.", author: "Drake" },
  { text: "A goal is a dream with a deadline. Set it.", author: "Drake" },
  { text: "They used to ignore me. Now they can't avoid me.", author: "Drake" },
  { text: "I'm not confrontational but if someone challenges me I'm not going to back down.", author: "Drake" },
  { text: "Live for today, plan for tomorrow, and party tonight.", author: "Drake" },
  { text: "The moment I stop having fun with it, I'll be done with it.", author: "Drake" },
  { text: "You got to live your life and stop letting people living it for you.", author: "Drake" },
  { text: "Never let success get to your head and never let failure get to your heart.", author: "Drake" },
  { text: "Hate the feeling of letting people down. Use that fuel.", author: "Drake" },
  { text: "I was born ready. Every single morning.", author: "Drake" },
];

const SPIDER_MAN: Quote[] = [
  { text: "With great power comes great responsibility.", author: "Spider-Man" },
  { text: "No matter how many times I get knocked down, I always get back up.", author: "Spider-Man" },
  { text: "Anyone can wear the mask. But will you?", author: "Spider-Man" },
  { text: "My gift and my curse. I chose to make it my strength.", author: "Spider-Man" },
  { text: "It's not about the suit. It's about what you do in it.", author: "Spider-Man" },
  { text: "Being broke is temporary. Being broken is a choice.", author: "Spider-Man" },
  { text: "I believe there's a hero in all of us.", author: "Spider-Man" },
  { text: "When you help someone, you help everyone.", author: "Spider-Man" },
  { text: "The city needs me. But more than that — I need the city.", author: "Spider-Man" },
  { text: "Failure is not the opposite of success. It's part of it.", author: "Spider-Man" },
  { text: "Whatever life holds in store for me, I will never forget these words.", author: "Spider-Man" },
  { text: "I'm not the strongest. I'm not the fastest. But I never quit.", author: "Spider-Man" },
  { text: "Every morning you wake up, you get another shot. Take it.", author: "Spider-Man" },
  { text: "Ordinary people choose to do extraordinary things.", author: "Spider-Man" },
  { text: "The hardest thing about this job is knowing when to ask for help.", author: "Spider-Man" },
  { text: "Some days are better than others. Show up anyway.", author: "Spider-Man" },
  { text: "I can do this all day.", author: "Spider-Man" },
  { text: "You don't need powers to have strength.", author: "Spider-Man" },
];

export const QUOTES: Quote[] = [
  ...LARRY_JUNE,
  ...J_COLE,
  ...DRAKE,
  ...SPIDER_MAN,
];

export function getDailyQuote(dateString: string): Quote {
  // Simple deterministic hash from date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % QUOTES.length;
  return QUOTES[index];
}
