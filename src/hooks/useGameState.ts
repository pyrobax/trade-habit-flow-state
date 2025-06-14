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

  const [lastProfileSwitchTime, setLastProfileSwitchTime] = useState(Date.now());

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    localStorage.setItem('tradeHabitHero', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updater: (prevState: GameState) => GameState) => {
    setGameState(prevState => {
      const newState = updater(prevState);
      const oldStreak = prevState.currentStreak;
      const oldActiveProfile = prevState.activeProfile;
      const oldAchievements = prevState.achievements;
      
      // Check if this is a profile switch
      const isProfileSwitch = newState.activeProfile !== oldActiveProfile;
      if (isProfileSwitch) {
        setLastProfileSwitchTime(Date.now());
      }
      
      // Recalculate streak after any change
      const updatedStreak = calculateStreak(newState);
      
      // Check for achievement unlocks
      const updatedAchievements = checkAchievements({
        ...newState,
        currentStreak: updatedStreak
      });

      // Only show celebrations if not a recent profile switch (within 1 second)
      const timeSinceProfileSwitch = Date.now() - lastProfileSwitchTime;
      const shouldShowCelebrations = !isProfileSwitch && timeSinceProfileSwitch > 1000;

      if (shouldShowCelebrations) {
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
