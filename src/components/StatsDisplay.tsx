
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GameState } from '@/types/gameState';

interface StatsDisplayProps {
  gameState: GameState;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const StatsDisplay = ({ gameState, playSound }: StatsDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentTrades = gameState.trades[gameState.activeProfile];
  const totalTrades = currentTrades.length;
  const winningTrades = currentTrades.filter(trade => trade.pnlR > 0).length;
  const losingTrades = currentTrades.filter(trade => trade.pnlR < 0).length;
  const breakevenTrades = currentTrades.filter(trade => trade.pnlR === 0).length;
  const perfectTrades = currentTrades.filter(trade => trade.allRulesFollowed).length;
  const imperfectTrades = totalTrades - perfectTrades;
  
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const rulesWinRate = totalTrades > 0 ? (perfectTrades / totalTrades) * 100 : 0;
  
  const totalPnL = currentTrades.reduce((sum, trade) => sum + trade.pnlR, 0);
  const averagePnL = totalTrades > 0 ? totalPnL / totalTrades : 0;
  
  const largestWin = currentTrades.length > 0 ? Math.max(...currentTrades.map(t => t.pnlR)) : 0;
  const largestLoss = currentTrades.length > 0 ? Math.min(...currentTrades.map(t => t.pnlR)) : 0;

  const handleToggle = () => {
    playSound?.('click');
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleToggle}
        variant="outline"
        className="w-full flex items-center justify-between"
      >
        <span>Trading Statistics</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <div className="p-4 border rounded-lg space-y-4">
          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded">
              <p className="font-medium text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold text-foreground">{totalTrades}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded">
              <p className="font-medium text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-green-500">{gameState.currentStreak}</p>
            </div>
          </div>

          {/* P&L Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className={`text-center p-3 rounded ${totalPnL >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
              <p className="font-medium text-white">Total P&L</p>
              <p className="text-2xl font-bold text-white">
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}R
              </p>
            </div>
            <div className={`text-center p-3 rounded ${averagePnL >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
              <p className="font-medium text-white">Average P&L</p>
              <p className="text-2xl font-bold text-white">
                {averagePnL >= 0 ? '+' : ''}{averagePnL.toFixed(2)}R
              </p>
            </div>
          </div>

          {/* Win/Loss Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-green-500 rounded">
              <p className="font-medium text-white">Wins</p>
              <p className="text-xl font-bold text-white">{winningTrades}</p>
            </div>
            <div className="text-center p-3 bg-red-500 rounded">
              <p className="font-medium text-white">Losses</p>
              <p className="text-xl font-bold text-white">{losingTrades}</p>
            </div>
            <div className="text-center p-3 bg-gray-500 rounded">
              <p className="font-medium text-white">Breakeven</p>
              <p className="text-xl font-bold text-white">{breakevenTrades}</p>
            </div>
          </div>

          {/* Win Rates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className={`text-center p-3 rounded ${winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}>
              <p className="font-medium text-white">Win Rate</p>
              <p className="text-xl font-bold text-white">
                {winRate.toFixed(1)}%
              </p>
            </div>
            <div className={`text-center p-3 rounded ${rulesWinRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}>
              <p className="font-medium text-white">Rules Win Rate</p>
              <p className="text-xl font-bold text-white">
                {rulesWinRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Rules Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-green-500 rounded">
              <p className="font-medium text-white">Rules Followed</p>
              <p className="text-xl font-bold text-white">{perfectTrades}</p>
            </div>
            <div className="text-center p-3 bg-red-500 rounded">
              <p className="font-medium text-white">Rules Broken</p>
              <p className="text-xl font-bold text-white">{imperfectTrades}</p>
            </div>
          </div>

          {/* Best/Worst */}
          {totalTrades > 0 && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-green-500 rounded">
                <p className="font-medium text-white">Largest Win</p>
                <p className="text-xl font-bold text-white">+{largestWin.toFixed(2)}R</p>
              </div>
              <div className="text-center p-3 bg-red-500 rounded">
                <p className="font-medium text-white">Largest Loss</p>
                <p className="text-xl font-bold text-white">{largestLoss.toFixed(2)}R</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
