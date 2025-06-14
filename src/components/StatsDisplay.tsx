
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GameState } from '@/types/gameState';

interface StatsDisplayProps {
  gameState: GameState;
}

export const StatsDisplay = ({ gameState }: StatsDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentTrades = gameState.trades[gameState.activeProfile];
  const totalTrades = currentTrades.length;
  const perfectTrades = currentTrades.filter(trade => trade.allRulesFollowed).length;
  const imperfectTrades = totalTrades - perfectTrades;

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        className="w-full flex items-center justify-between"
      >
        <span>Stats</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <div className="p-4 border rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Total Trades</p>
              <p className="text-2xl font-bold">{totalTrades}</p>
            </div>
            <div>
              <p className="font-medium">Rules Followed</p>
              <p className="text-2xl font-bold text-green-600">{perfectTrades}</p>
            </div>
            <div>
              <p className="font-medium">Rules Broken</p>
              <p className="text-2xl font-bold text-red-600">{imperfectTrades}</p>
            </div>
            <div>
              <p className="font-medium">Rules Win Rate</p>
              <p className="text-2xl font-bold">
                {totalTrades > 0 ? Math.round((perfectTrades / totalTrades) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
