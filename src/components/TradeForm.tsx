
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GameState } from '@/types/gameState';

interface TradeFormProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound: (soundType: 'check' | 'win' | 'click') => void;
}

export const TradeForm = ({ gameState, updateGameState, playSound }: TradeFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    playSound('click');
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={toggleExpanded}
        variant="outline"
        className="w-full flex items-center justify-between"
      >
        <span>Log Trade</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <div className="p-4 border rounded-lg space-y-4">
          <p className="text-center text-muted-foreground">
            Trade logging form coming soon...
          </p>
          
          <div className="space-y-2">
            <p className="font-medium">Trading Rules:</p>
            {gameState.profiles[gameState.activeProfile].rules.map(rule => (
              <div key={rule.id} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={rule.id}
                  onChange={() => playSound('check')}
                />
                <label htmlFor={rule.id} className="text-sm">{rule.text}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
