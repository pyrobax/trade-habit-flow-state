
import { Button } from '@/components/ui/button';
import { GameState } from '@/types/gameState';

interface ProfileSwitcherProps {
  activeProfile: string;
  onProfileChange: (profile: string) => void;
  gameState: GameState;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const ProfileSwitcher = ({ activeProfile, onProfileChange, gameState, playSound }: ProfileSwitcherProps) => {
  const handleProfileChange = (profile: string) => {
    playSound?.('click');
    onProfileChange(profile);
  };

  const profileKeys = Object.keys(gameState.profiles);

  return (
    <div className="flex flex-wrap gap-2">
      {profileKeys.map(profileKey => (
        <Button
          key={profileKey}
          variant={activeProfile === profileKey ? 'default' : 'outline'}
          onClick={() => handleProfileChange(profileKey)}
          className="flex-1 min-w-0"
        >
          {gameState.profiles[profileKey].name}
        </Button>
      ))}
    </div>
  );
};
