
import { GameState } from '@/types/gameState';

export const calculateStreak = (gameState: GameState): number => {
  const trades = gameState.trades[gameState.activeProfile];
  
  if (trades.length === 0) return 0;
  
  // Group trades by date
  const tradesByDate = trades.reduce((acc, trade) => {
    if (!acc[trade.date]) {
      acc[trade.date] = [];
    }
    acc[trade.date].push(trade);
    return acc;
  }, {} as Record<string, typeof trades>);
  
  // Get all trading dates in descending order (most recent first)
  const tradingDates = Object.keys(tradesByDate).sort().reverse();
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  // Check each day backwards from today
  for (const date of tradingDates) {
    const dayTrades = tradesByDate[date];
    
    // Check if all trades on this day were perfect
    const allPerfect = dayTrades.every(trade => trade.allRulesFollowed);
    
    if (allPerfect) {
      streak++;
    } else {
      // Imperfect day breaks the streak
      break;
    }
  }
  
  return streak;
};

export const getStreakTitle = (streak: number): string => {
  if (streak === 0) return "Start Your Journey";
  if (streak >= 21) return "Trading in the Zone";
  if (streak >= 19) return "On the Edge of Greatness";
  if (streak >= 17) return "Mastering the Craft";
  if (streak >= 15) return "Flow State";
  if (streak >= 13) return "Elite Performance";
  if (streak >= 11) return "Unstoppable Force";
  if (streak >= 9) return "Consistency is Key";
  if (streak >= 7) return "The Discipline is Real";
  if (streak >= 5) return "Habit is Forming";
  if (streak >= 3) return "On the Come up";
  if (streak >= 1) return "Let's Gooo!";
  return "Start Your Journey";
};
