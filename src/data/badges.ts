import { BadgeDefinition } from '../types';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-fire',
    name: 'FIRST FIRE',
    description: 'Completed your first routine',
    icon: 'Flame',
    howToEarn: 'Complete any routine for the first time',
  },
  {
    id: 'stack-day',
    name: 'STACK DAY',
    description: 'Earned 100+ XP in a single day',
    icon: 'Zap',
    howToEarn: 'Earn 100 or more XP in one day',
  },
  {
    id: 'web-swinger',
    name: 'WEB SWINGER',
    description: '3-day streak achieved',
    icon: 'Star',
    howToEarn: 'Complete at least 1 routine 3 days in a row',
  },
  {
    id: 'locked-in',
    name: 'LOCKED IN',
    description: '7-day streak achieved',
    icon: 'Trophy',
    howToEarn: 'Complete at least 1 routine 7 days in a row',
  },
  {
    id: 'king-week',
    name: 'KING WEEK',
    description: '80%+ completion rate for a full week',
    icon: 'Trophy',
    howToEarn: 'Complete 80% or more of your active routines every day for a week',
  },
  {
    id: 'body-built',
    name: 'BODY BUILT',
    description: 'Completed every Health & Body routine 5 days in a row',
    icon: 'Zap',
    howToEarn: 'Complete all Health & Body routines for 5 consecutive days',
  },
  {
    id: 'comeback-kid',
    name: 'COMEBACK KID',
    description: 'Returned after 3+ missed days',
    icon: 'Flame',
    howToEarn: 'Come back and complete a routine after missing 3 or more days',
  },
  {
    id: 'big-brain',
    name: 'BIG BRAIN',
    description: 'Completed all Skills & Learning routines 7 days in a row',
    icon: 'Star',
    howToEarn: 'Complete all Skills & Learning routines for 7 consecutive days',
  },
  {
    id: 'momentum-god',
    name: 'MOMENTUM GOD',
    description: 'Hit 90+ momentum score',
    icon: 'Zap',
    howToEarn: 'Achieve a momentum score of 90 or higher in a single day',
  },
  {
    id: 'all-pillars',
    name: 'ALL PILLARS',
    description: 'Completed at least one routine in all 5 pillars in a single day',
    icon: 'Trophy',
    howToEarn: 'Complete at least one routine from every pillar on the same day',
  },
];
