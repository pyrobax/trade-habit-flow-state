
import { useState, useEffect } from 'react';
import { GameState, Trade, Achievement } from '@/types/gameState';
import { calculateStreak } from '@/utils/streakCalculator';
import { checkAchievements } from '@/utils/achievementEngine';
import { getDefaultGameState } from '@/utils/defaultData';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('tradeHabitHero');
    if (saved) {
      const parsedState = JSON.parse(saved);
      // Ensure activeProfile exists in profiles
      if (!parsedState.profiles[parsedState.activeProfile]) {
        const firstProfile = Object.keys(parsedState.profiles)[0];
        parsedState.activeProfile = firstProfile;
      }
      return parsedState;
    }
    return getDefaultGameState();
  });

  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'achievement' | 'streak';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'achievement'
  });

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    localStorage.setItem('tradeHabitHero', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updater: (prevState: GameState) => GameState) => {
    setGameState(prevState => {
      const newState = updater(prevState);
      const oldActiveProfile = prevState.activeProfile;
      const oldAchievements = prevState.achievements;
      
      // Check if this is a profile switch
      const isProfileSwitch = newState.activeProfile !== oldActiveProfile;
      
      // Recalculate streak after any change
      const updatedStreak = calculateStreak(newState);
      
      // Check for achievement unlocks
      const updatedAchievements = checkAchievements({
        ...newState,
        currentStreak: updatedStreak
      });

      // Only show celebrations if NOT a profile switch
      if (!isProfileSwitch) {
        // Check for new achievement unlocks (any type)
        const newAchievements = updatedAchievements.filter(a => 
          a.isUnlocked && !oldAchievements.find(pa => pa.id === a.id && pa.isUnlocked)
        );
        
        if (newAchievements.length > 0) {
          const achievement = newAchievements[0];
          setCelebration({
            isOpen: true,
            title: achievement.name,
            description: achievement.description,
            type: achievement.type === 'streak' ? 'streak' : 'achievement'
          });
        }
      }
      
      return {
        ...newState,
        currentStreak: updatedStreak,
        achievements: updatedAchievements,
        lastCalculatedDate: new Date().toISOString().split('T')[0]
      };
    });
  };

  const closeCelebration = () => {
    setCelebration(prev => ({ ...prev, isOpen: false }));
  };

  return { gameState, updateGameState, celebration, closeCelebration };
};
