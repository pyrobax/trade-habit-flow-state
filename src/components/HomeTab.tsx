
import { ProfileSwitcher } from './ProfileSwitcher';
import { StreakDisplay } from './StreakDisplay';
import { QuoteDisplay } from './QuoteDisplay';
import { TradeForm } from './TradeForm';
import { StatsDisplay } from './StatsDisplay';
import { GameState } from '@/types/gameState';

interface HomeTabProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound: (soundType: 'check' | 'win' | 'click') => void;
}

export const HomeTab = ({ gameState, updateGameState, playSound }: HomeTabProps) => {
  return (
    <div className="space-y-6">
      <ProfileSwitcher 
        activeProfile={gameState.activeProfile}
        onProfileChange={(profile) => updateGameState(state => ({ ...state, activeProfile: profile }))}
      />
      
      <StreakDisplay 
        streak={gameState.currentStreak}
        streakMilestones={gameState.streakMilestones}
      />
      
      <QuoteDisplay />
      
      <TradeForm 
        gameState={gameState}
        updateGameState={updateGameState}
        playSound={playSound}
      />
      
      <StatsDisplay 
        gameState={gameState}
        playSound={playSound}
      />
    </div>
  );
};
