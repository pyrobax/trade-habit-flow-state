
import { Button } from '@/components/ui/button';

interface ProfileSwitcherProps {
  activeProfile: 'usa-indices' | 'aud-nzd-pairs';
  onProfileChange: (profile: 'usa-indices' | 'aud-nzd-pairs') => void;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const ProfileSwitcher = ({ activeProfile, onProfileChange, playSound }: ProfileSwitcherProps) => {
  const handleProfileChange = (profile: 'usa-indices' | 'aud-nzd-pairs') => {
    playSound?.('click');
    onProfileChange(profile);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={activeProfile === 'usa-indices' ? 'default' : 'outline'}
        onClick={() => handleProfileChange('usa-indices')}
        className="flex-1"
      >
        USA Indices
      </Button>
      <Button
        variant={activeProfile === 'aud-nzd-pairs' ? 'default' : 'outline'}
        onClick={() => handleProfileChange('aud-nzd-pairs')}
        className="flex-1"
      >
        AUD/NZD Pairs
      </Button>
    </div>
  );
};
