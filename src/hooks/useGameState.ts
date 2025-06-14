
import { useState, useEffect } from 'react';
import { GameState, Trade, Achievement } from '@/types/gameState';
import { calculateStreak } from '@/utils/streakCalculator';
import { checkAchievements } from '@/utils/achievementEngine';
import { getDefaultGameState } from '@/utils/defaultData';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('tradeHabitHero');
    return saved ? JSON.parse(saved) : getDefaultGameState();
  });

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    localStorage.setItem('tradeHabitHero', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updater: (prevState: GameState) => GameState) => {
    setGameState(prevState => {
      const newState = updater(prevState);
      
      // Recalculate streak after any change
      const updatedStreak = calculateStreak(newState);
      
      // Check for achievement unlocks
      const updatedAchievements = checkAchievements({
        ...newState,
        currentStreak: updatedStreak
      });
      
      return {
        ...newState,
        currentStreak: updatedStreak,
        achievements: updatedAchievements,
        lastCalculatedDate: new Date().toISOString().split('T')[0]
      };
    });
  };

  return { gameState, updateGameState };
};
