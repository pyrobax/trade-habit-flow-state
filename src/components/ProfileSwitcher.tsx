
import { Button } from '@/components/ui/button';

interface ProfileSwitcherProps {
  activeProfile: 'usa-indices' | 'aud-nzd-pairs';
  onProfileChange: (profile: 'usa-indices' | 'aud-nzd-pairs') => void;
}

export const ProfileSwitcher = ({ activeProfile, onProfileChange }: ProfileSwitcherProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeProfile === 'usa-indices' ? 'default' : 'outline'}
        onClick={() => onProfileChange('usa-indices')}
        className="flex-1"
      >
        USA Indices
      </Button>
      <Button
        variant={activeProfile === 'aud-nzd-pairs' ? 'default' : 'outline'}
        onClick={() => onProfileChange('aud-nzd-pairs')}
        className="flex-1"
      >
        AUD/NZD Pairs
      </Button>
    </div>
  );
};
