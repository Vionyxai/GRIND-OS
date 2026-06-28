export function calculateMomentum(
  completedCount: number,
  totalActive: number,
  currentStreak: number,
  weeklyAvgCompletion: number
): number {
  const base = totalActive > 0 ? (completedCount / totalActive) * 60 : 0;
  const streakBonus = currentStreak > 0 ? Math.min(currentStreak, 14) * 2 : 0;
  const consistencyBonus = weeklyAvgCompletion > 0.7 ? 12 : 0;
  return Math.round(Math.min(100, base + streakBonus + consistencyBonus));
}

export function getMomentumColor(score: number): string {
  if (score >= 70) return '#06D6A0';
  if (score >= 40) return '#FFD166';
  return '#E63946';
}

export function getMomentumLabel(score: number): string {
  if (score >= 90) return 'UNSTOPPABLE';
  if (score >= 70) return 'LOCKED IN';
  if (score >= 50) return 'BUILDING';
  if (score >= 30) return 'WARMING UP';
  return 'JUST START';
}
