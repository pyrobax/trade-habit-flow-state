
import { GameState } from '@/types/gameState';

interface CalendarTabProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
}

export const CalendarTab = ({ gameState, updateGameState }: CalendarTabProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Calendar View</h1>
        <p className="text-muted-foreground">
          Active Profile: {gameState.profiles[gameState.activeProfile].name}
        </p>
      </div>
      
      <div className="text-center text-muted-foreground">
        <p>Calendar functionality coming soon...</p>
      </div>
    </div>
  );
};
