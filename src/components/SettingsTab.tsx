
import { GameState } from '@/types/gameState';

interface SettingsTabProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
}

export const SettingsTab = ({ gameState, updateGameState }: SettingsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-4">
        <div className="text-center text-muted-foreground">
          <p>Settings functionality coming soon...</p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Achievements unlocked: {gameState.achievements.filter(a => a.isUnlocked).length} / {gameState.achievements.length}</p>
        </div>
      </div>
    </div>
  );
};
