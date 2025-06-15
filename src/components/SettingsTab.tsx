
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GameState } from '@/types/gameState';
import { GeneralSettings } from './settings/GeneralSettings';
import { ProfileEditor } from './settings/ProfileEditor';
import { AchievementTracker } from './settings/AchievementTracker';

interface SettingsTabProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const SettingsTab = ({ gameState, updateGameState, playSound }: SettingsTabProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    playSound?.('click');
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const unlockedAchievements = gameState.achievements.filter(a => a.isUnlocked);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      {/* General Settings */}
      <div className="space-y-4">
        <Button
          onClick={() => toggleSection('general')}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span>General Settings</span>
          {expandedSections.includes('general') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {expandedSections.includes('general') && (
          <GeneralSettings 
            gameState={gameState}
            updateGameState={updateGameState}
            playSound={playSound}
          />
        )}
      </div>

      {/* Profile Editor */}
      <div className="space-y-4">
        <Button
          onClick={() => toggleSection('profiles')}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span>Profile Editor</span>
          {expandedSections.includes('profiles') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {expandedSections.includes('profiles') && (
          <ProfileEditor 
            gameState={gameState}
            updateGameState={updateGameState}
            playSound={playSound}
          />
        )}
      </div>

      {/* Achievement Tracker */}
      <div className="space-y-4">
        <Button
          onClick={() => toggleSection('achievements')}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span>Achievement Tracker ({unlockedAchievements.length} / {gameState.achievements.length})</span>
          {expandedSections.includes('achievements') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {expandedSections.includes('achievements') && (
          <AchievementTracker gameState={gameState} />
        )}
      </div>
    </div>
  );
};
