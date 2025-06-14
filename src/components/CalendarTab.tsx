
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GameState } from '@/types/gameState';
import { TradeModal } from './TradeModal';

interface CalendarTabProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
}

export const CalendarTab = ({ gameState, updateGameState }: CalendarTabProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentTrades = gameState.trades[gameState.activeProfile];
  
  const getTradesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return currentTrades.filter(trade => trade.date === dateStr);
  };

  const getDayPnL = (date: Date) => {
    const trades = getTradesForDate(date);
    return trades.reduce((sum, trade) => sum + trade.pnlR, 0);
  };

  const isDayPerfect = (date: Date) => {
    const trades = getTradesForDate(date);
    return trades.length > 0 && trades.every(trade => trade.allRulesFollowed);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const modifiers = {
    hasTradesGood: (date: Date) => {
      const trades = getTradesForDate(date);
      return trades.length > 0 && trades.every(trade => trade.allRulesFollowed);
    },
    hasTradesBad: (date: Date) => {
      const trades = getTradesForDate(date);
      return trades.length > 0 && !trades.every(trade => trade.allRulesFollowed);
    }
  };

  const modifiersStyles = {
    hasTradesGood: {
      backgroundColor: '#22c55e',
      color: 'white',
      borderRadius: '4px',
      width: '100%',
      height: '100%'
    },
    hasTradesBad: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '4px',
      width: '100%',
      height: '100%'
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Trading Calendar</h1>
        <p className="text-muted-foreground">
          Active Profile: {gameState.profiles[gameState.activeProfile].name}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <Button variant="outline" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-card rounded-lg p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          month={currentDate}
          onMonthChange={setCurrentDate}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="w-full"
          components={{
            DayContent: ({ date }) => {
              const trades = getTradesForDate(date);
              const pnl = getDayPnL(date);
              const hasGoodTrades = trades.length > 0 && trades.every(trade => trade.allRulesFollowed);
              const hasBadTrades = trades.length > 0 && !trades.every(trade => trade.allRulesFollowed);
              
              return (
                <div className={`
                  relative w-full h-full flex flex-col items-center justify-center min-h-[36px] rounded
                  ${hasGoodTrades ? 'bg-green-500 text-white' : ''}
                  ${hasBadTrades ? 'bg-red-500 text-white' : ''}
                `}>
                  <span className="text-sm">{date.getDate()}</span>
                  {trades.length > 0 && (
                    <span className="text-xs font-bold">
                      {pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}R
                    </span>
                  )}
                </div>
              );
            }
          }}
        />
      </div>

      <div className="text-center space-y-2">
        <div className="flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Perfect Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Imperfect Day</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Click any date to view or log trades
        </p>
      </div>

      {selectedDate && (
        <TradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          gameState={gameState}
          updateGameState={updateGameState}
        />
      )}
    </div>
  );
};
