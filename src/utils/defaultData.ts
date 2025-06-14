
import { GameState, ProfileConfig, Achievement } from '@/types/gameState';

const createDefaultProfile = (name: string): ProfileConfig => ({
  name,
  rules: [
    { id: '1', text: 'I confirmed my edge before entering', isActive: true },
    { id: '2', text: 'I predefined my risk before entering', isActive: true },
    { id: '3', text: 'I accepted the risk completely', isActive: true },
    { id: '4', text: 'I acted without hesitation when my edge appeared', isActive: true },
    { id: '5', text: 'I monitored my emotions during the trade', isActive: true }
  ],
  dataFields: {
    symbol: { label: 'Symbol', type: 'text', required: true },
    entryPrice: { label: 'Entry Price', type: 'number', required: true },
    exitPrice: { label: 'Exit Price', type: 'number', required: true },
    position: { label: 'Position', type: 'select', options: ['long', 'short'], required: true },
    riskAmount: { label: 'Risk Amount ($)', type: 'number', required: true },
    riskRewardRatio: { label: 'Risk:Reward Ratio', type: 'number', required: true },
    notes: { label: 'Notes', type: 'textarea', required: false }
  }
});

const defaultAchievements: Achievement[] = [
  // Streak Achievements (Resettable)
  { id: 'day1', name: 'First Step', description: "Let's Gooo!", type: 'streak', criteria: { streak: 1 }, isUnlocked: false },
  { id: 'day3', name: 'The Triple', description: 'On the Come up', type: 'streak', criteria: { streak: 3 }, isUnlocked: false },
  { id: 'day5', name: 'Five Day Follow-Through', description: 'Habit is Forming!', type: 'streak', criteria: { streak: 5 }, isUnlocked: false },
  { id: 'day7', name: 'Perfect Week', description: 'The Discipline is Real.', type: 'streak', criteria: { streak: 7 }, isUnlocked: false },
  { id: 'day9', name: 'The Near Ten', description: 'Consistency is Key!', type: 'streak', criteria: { streak: 9 }, isUnlocked: false },
  { id: 'day11', name: 'The Prime Mover', description: 'Unstoppable Force!', type: 'streak', criteria: { streak: 11 }, isUnlocked: false },
  { id: 'day13', name: 'Unlucky for Some', description: 'Elite Performance.', type: 'streak', criteria: { streak: 13 }, isUnlocked: false },
  { id: 'day15', name: 'The Halfway Mark', description: 'Flow State', type: 'streak', criteria: { streak: 15 }, isUnlocked: false },
  { id: 'day17', name: 'Seventeen Steps', description: 'Mastering the Craft.', type: 'streak', criteria: { streak: 17 }, isUnlocked: false },
  { id: 'day19', name: 'The Final Hurdle', description: 'On the Edge of Greatness.', type: 'streak', criteria: { streak: 19 }, isUnlocked: false },
  { id: 'day21', name: 'Trading in the Zone', description: 'You are the honored one.', type: 'streak', criteria: { streak: 21 }, isUnlocked: false },
  
  // Discipline Achievements (Permanent)
  { id: 'strategist', name: 'The Strategist', description: 'Finish a full Mon-Sun week with only perfect trading days', type: 'discipline', criteria: { perfectWeek: true }, isUnlocked: false },
  { id: 'highRoller', name: 'The High Roller', description: 'Achieve a single-day P/L of >= 10R', type: 'discipline', criteria: { singleDayPnl: 10 }, isUnlocked: false },
  { id: 'riskManager', name: 'The Risk Manager', description: 'Log 12 trades with an R:R of 2.0 or greater', type: 'discipline', criteria: { highRrTrades: 12 }, isUnlocked: false },
  { id: 'comebackKing', name: 'The Comeback King', description: 'Follow a negative P/L week with a positive P/L week', type: 'discipline', criteria: { comeback: true }, isUnlocked: false },
  { id: 'specialist', name: 'The Specialist', description: 'Log 10 consecutive perfect trades for the same symbol', type: 'discipline', criteria: { consecutivePerfectSymbol: 10 }, isUnlocked: false },
  
  // Meta Achievement (Permanent)
  { id: 'disciplinedTrader', name: 'The Disciplined Trader', description: 'Unlock all 16 other achievements', type: 'meta', criteria: { allOthersUnlocked: true }, isUnlocked: false }
];

export const getDefaultGameState = (): GameState => ({
  activeProfile: 'usa-indices',
  profiles: {
    'usa-indices': createDefaultProfile('USA Indices'),
    'aud-nzd-pairs': createDefaultProfile('AUD/NZD Pairs')
  },
  trades: {
    'usa-indices': [],
    'aud-nzd-pairs': []
  },
  currentStreak: 0,
  streakMilestones: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21],
  achievements: defaultAchievements,
  lastCalculatedDate: new Date().toISOString().split('T')[0]
});
