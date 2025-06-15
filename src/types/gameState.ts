
export interface Trade {
  id: string;
  date: string; // YYYY-MM-DD format
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  position: 'long' | 'short';
  riskAmount: number;
  pnlR: number;
  riskRewardRatio: number;
  rulesFollowed: string[]; // Array of rule IDs that were followed
  allRulesFollowed: boolean; // True if all rules were followed (perfect trade)
  notes?: string;
  reviewLink?: string;
}

export interface TradingRule {
  id: string;
  text: string;
  isActive: boolean;
}

export interface ProfileConfig {
  name: string;
  rules: TradingRule[];
  dataFields: {
    symbol: { label: string; type: string; required: boolean; };
    entryPrice: { label: string; type: string; required: boolean; };
    exitPrice: { label: string; type: string; required: boolean; };
    position: { label: string; type: string; options: string[]; required: boolean; };
    riskAmount: { label: string; type: string; required: boolean; };
    riskRewardRatio: { label: string; type: string; required: boolean; };
    notes: { label: string; type: string; required: boolean; };
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'discipline' | 'meta';
  criteria: any; // Specific criteria for unlocking
  isUnlocked: boolean;
}

export interface GameState {
  activeProfile: string;
  profiles: Record<string, ProfileConfig>;
  trades: Record<string, Trade[]>;
  currentStreak: number;
  streakMilestones: number[];
  achievements: Achievement[];
  lastCalculatedDate: string;
}
