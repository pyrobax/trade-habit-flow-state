
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

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
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
              <p className="text-2xl font-bold">{totalTrades}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded">
              <p className="font-medium text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{gameState.currentStreak}</p>
            </div>
          </div>

          {/* P&L Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded">
              <p className="font-medium text-muted-foreground">Total P&L</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}R
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded">
              <p className="font-medium text-muted-foreground">Average P&L</p>
              <p className={`text-2xl font-bold ${averagePnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {averagePnL >= 0 ? '+' : ''}{averagePnL.toFixed(2)}R
              </p>
            </div>
          </div>

          {/* Win/Loss Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded">
              <p className="font-medium text-green-700 dark:text-green-300">Wins</p>
              <p className="text-xl font-bold text-green-600">{winningTrades}</p>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded">
              <p className="font-medium text-red-700 dark:text-red-300">Losses</p>
              <p className="text-xl font-bold text-red-600">{losingTrades}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded">
              <p className="font-medium text-gray-700 dark:text-gray-300">Breakeven</p>
              <p className="text-xl font-bold text-gray-600">{breakevenTrades}</p>
            </div>
          </div>

          {/* Win Rates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <p className="font-medium text-blue-700 dark:text-blue-300">Win Rate</p>
              <p className="text-xl font-bold text-blue-600">{winRate.toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded">
              <p className="font-medium text-purple-700 dark:text-purple-300">Rules Win Rate</p>
              <p className="text-xl font-bold text-purple-600">{rulesWinRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Rules Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded">
              <p className="font-medium text-green-700 dark:text-green-300">Rules Followed</p>
              <p className="text-xl font-bold text-green-600">{perfectTrades}</p>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded">
              <p className="font-medium text-red-700 dark:text-red-300">Rules Broken</p>
              <p className="text-xl font-bold text-red-600">{imperfectTrades}</p>
            </div>
          </div>

          {/* Best/Worst */}
          {totalTrades > 0 && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">Largest Win</p>
                <p className="text-xl font-bold text-emerald-600">+{largestWin.toFixed(2)}R</p>
              </div>
              <div className="text-center p-3 bg-rose-50 dark:bg-rose-950 rounded">
                <p className="font-medium text-rose-700 dark:text-rose-300">Largest Loss</p>
                <p className="text-xl font-bold text-rose-600">{largestLoss.toFixed(2)}R</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
