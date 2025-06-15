
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
      console.log('🔄 UpdateGameState called');
      
      // Create a deep copy of ORIGINAL achievements before ANY processing
      const originalAchievements = prevState.achievements.map(a => ({
        ...a,
        isUnlocked: a.isUnlocked
      }));
      console.log('📊 Original achievements (deep copy):', originalAchievements.map(a => ({ id: a.id, unlocked: a.isUnlocked })));
      
      const newState = updater(prevState);
      const oldActiveProfile = prevState.activeProfile;
      
      // Check if this is a profile switch
      const isProfileSwitch = newState.activeProfile !== oldActiveProfile;
      console.log('🔄 Is profile switch:', isProfileSwitch);
      
      // Recalculate streak after any change
      const updatedStreak = calculateStreak(newState);
      console.log('🏆 Updated streak:', updatedStreak);
      
      // Check for achievement unlocks
      const updatedAchievements = checkAchievements({
        ...newState,
        currentStreak: updatedStreak
      });

      console.log('🎯 New achievements:', updatedAchievements.map(a => ({ id: a.id, unlocked: a.isUnlocked })));

      // Check for new achievement unlocks - compare against ORIGINAL deep copy
      const newAchievements = updatedAchievements.filter(newAchievement => {
        const originalAchievement = originalAchievements.find(orig => orig.id === newAchievement.id);
        const wasUnlocked = originalAchievement ? originalAchievement.isUnlocked : false;
        const isNowUnlocked = newAchievement.isUnlocked;
        
        console.log(`🔍 Checking achievement ${newAchievement.id}: was ${wasUnlocked}, now ${isNowUnlocked}`);
        
        return !wasUnlocked && isNowUnlocked;
      });
      
      console.log('🎉 New unlocked achievements:', newAchievements);

      // Only show celebrations if NOT a profile switch AND there are new achievements
      if (!isProfileSwitch && newAchievements.length > 0) {
        const achievement = newAchievements[0];
        console.log('🎊 Setting celebration for:', achievement.name);
        setCelebration({
          isOpen: true,
          title: achievement.name,
          description: achievement.description,
          type: achievement.type === 'streak' ? 'streak' : 'achievement'
        });
      } else {
        console.log('❌ No celebration - isProfileSwitch:', isProfileSwitch, 'newAchievements:', newAchievements.length);
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
    console.log('🚪 Closing celebration');
    setCelebration(prev => ({ ...prev, isOpen: false }));
  };

  console.log('🎭 Current celebration state:', celebration);

  return { gameState, updateGameState, celebration, closeCelebration };
};
