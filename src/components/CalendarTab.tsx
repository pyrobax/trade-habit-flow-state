
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { GameState } from '@/types/gameState';
import { TradeModal } from './TradeModal';

interface CalendarTabProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
}

export const CalendarTab = ({ gameState, updateGameState }: CalendarTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0); // Force modal to re-render

  const currentTrades = gameState.trades[gameState.activeProfile];
  
  const getTradesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return currentTrades.filter(trade => trade.date === dateStr);
  };

  const getDayPnL = (date: Date) => {
    const trades = getTradesForDate(date);
    return trades.reduce((sum, trade) => sum + trade.pnlR, 0);
  };

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setModalKey(prev => prev + 1); // Force modal to re-render
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
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
    <div className="space-y-6 h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Trading Calendar</h1>
        <p className="text-muted-foreground">
          Active Profile: {gameState.profiles[gameState.activeProfile].name}
        </p>
      </div>

      <div className="bg-card rounded-lg p-4 flex-1 min-h-[500px]">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="w-full h-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 h-full",
            month: "space-y-4 flex-1",
            table: "w-full border-collapse space-y-1 h-full",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1",
            row: "flex w-full mt-2",
            cell: "h-12 w-full text-center text-sm p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
          }}
          components={{
            DayContent: ({ date }) => {
              const trades = getTradesForDate(date);
              const pnl = getDayPnL(date);
              const hasGoodTrades = trades.length > 0 && trades.every(trade => trade.allRulesFollowed);
              const hasBadTrades = trades.length > 0 && !trades.every(trade => trade.allRulesFollowed);
              
              return (
                <div className={`
                  relative w-full h-full flex flex-col items-center justify-center min-h-[40px] rounded-md px-1
                  ${hasGoodTrades ? 'bg-green-500 text-white' : ''}
                  ${hasBadTrades ? 'bg-red-500 text-white' : ''}
                `}>
                  <span className="text-sm font-medium">{date.getDate()}</span>
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
          key={modalKey}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate}
          gameState={gameState}
          updateGameState={updateGameState}
        />
      )}
    </div>
  );
};
