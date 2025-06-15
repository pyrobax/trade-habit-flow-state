
import { GameState, Achievement, Trade } from '@/types/gameState';

export const checkAchievements = (gameState: GameState): Achievement[] => {
  const achievements = [...gameState.achievements];
  const trades = gameState.trades[gameState.activeProfile];
  const allTrades = Object.values(gameState.trades).flat();
  
  // Check streak achievements
  achievements.forEach(achievement => {
    if (achievement.type === 'streak') {
      const requiredStreak = achievement.criteria.streak;
      const wasUnlocked = achievement.isUnlocked;
      achievement.isUnlocked = gameState.currentStreak >= requiredStreak;
      
      // If streak is broken, reset all streak achievements
      if (gameState.currentStreak === 0) {
        achievement.isUnlocked = false;
      }
    }
  });
  
  // Check discipline achievements
  checkStrategistAchievement(achievements, allTrades);
  checkHighRollerAchievement(achievements, allTrades);
  checkRiskManagerAchievement(achievements, allTrades);
  checkComebackKingAchievement(achievements, gameState.currentStreak);
  checkSpecialistAchievement(achievements, allTrades);
  
  // Check meta achievement
  const otherAchievements = achievements.filter(a => a.id !== 'disciplinedTrader');
  const metaAchievement = achievements.find(a => a.id === 'disciplinedTrader');
  if (metaAchievement) {
    metaAchievement.isUnlocked = otherAchievements.every(a => a.isUnlocked);
  }
  
  return achievements;
};

const checkStrategistAchievement = (achievements: Achievement[], trades: Trade[]) => {
  const achievement = achievements.find(a => a.id === 'strategist');
  if (!achievement || achievement.isUnlocked) return;
  
  // Check for 5 trades with P&L >= 4.0R
  const highPnlTrades = trades.filter(t => t.pnlR >= 4.0);
  achievement.isUnlocked = highPnlTrades.length >= 5;
};

const checkHighRollerAchievement = (achievements: Achievement[], trades: Trade[]) => {
  const achievement = achievements.find(a => a.id === 'highRoller');
  if (!achievement || achievement.isUnlocked) return;
  
  const tradesByDate = trades.reduce((acc, trade) => {
    if (!acc[trade.date]) acc[trade.date] = 0;
    acc[trade.date] += trade.pnlR;
    return acc;
  }, {} as Record<string, number>);
  
  achievement.isUnlocked = Object.values(tradesByDate).some(pnl => pnl >= 10);
};

const checkRiskManagerAchievement = (achievements: Achievement[], trades: Trade[]) => {
  const achievement = achievements.find(a => a.id === 'riskManager');
  if (!achievement || achievement.isUnlocked) return;
  
  // Check for 12 trades with P&L >= 2.0R
  const highPnlTrades = trades.filter(t => t.pnlR >= 2.0);
  achievement.isUnlocked = highPnlTrades.length >= 12;
};

const checkComebackKingAchievement = (achievements: Achievement[], currentStreak: number) => {
  const achievement = achievements.find(a => a.id === 'comebackKing');
  if (!achievement || achievement.isUnlocked) return;
  
  // Unlock after reaching 20-day streak
  achievement.isUnlocked = currentStreak >= 20;
};

const checkSpecialistAchievement = (achievements: Achievement[], trades: Trade[]) => {
  const achievement = achievements.find(a => a.id === 'specialist');
  if (!achievement || achievement.isUnlocked) return;
  
  // Group by symbol and check for 10 consecutive perfect trades
  const symbolTrades = trades.reduce((acc, trade) => {
    if (!acc[trade.symbol]) acc[trade.symbol] = [];
    acc[trade.symbol].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);
  
  for (const [symbol, symbolTradeList] of Object.entries(symbolTrades)) {
    const sortedTrades = symbolTradeList.sort((a, b) => a.date.localeCompare(b.date));
    let consecutivePerfect = 0;
    
    for (const trade of sortedTrades) {
      if (trade.allRulesFollowed) {
        consecutivePerfect++;
        if (consecutivePerfect >= 10) {
          achievement.isUnlocked = true;
          return;
        }
      } else {
        consecutivePerfect = 0;
      }
    }
  }
};

const getWeeklyPnl = (trades: Trade[]): Record<string, number> => {
  return trades.reduce((acc, trade) => {
    const date = new Date(trade.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!acc[weekKey]) acc[weekKey] = 0;
    acc[weekKey] += trade.pnlR;
    return acc;
  }, {} as Record<string, number>);
};
