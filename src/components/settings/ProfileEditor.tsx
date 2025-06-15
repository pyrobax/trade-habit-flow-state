
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Check, X, UserPlus } from 'lucide-react';
import { GameState, ProfileConfig } from '@/types/gameState';

interface ProfileEditorProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const ProfileEditor = ({ gameState, updateGameState, playSound }: ProfileEditorProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string>(gameState.activeProfile);
  const [newRule, setNewRule] = useState('');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editRuleText, setEditRuleText] = useState('');
  const [editingProfileName, setEditingProfileName] = useState<string | null>(null);
  const [editProfileNameText, setEditProfileNameText] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [showAddProfile, setShowAddProfile] = useState(false);

  const profileKeys = Object.keys(gameState.profiles) as Array<keyof typeof gameState.profiles>;

  const handleProfileChange = (profile: string) => {
    playSound?.('click');
    setSelectedProfile(profile);
  };

  const createDefaultProfile = (name: string): ProfileConfig => ({
    name,
    rules: [
      { id: `rule_${Date.now()}_1`, text: 'I confirmed my edge before entering', isActive: true },
      { id: `rule_${Date.now()}_2`, text: 'I predefined my risk before entering', isActive: true },
      { id: `rule_${Date.now()}_3`, text: 'I accepted the risk completely', isActive: true },
      { id: `rule_${Date.now()}_4`, text: 'I acted without hesitation when my edge appeared', isActive: true },
      { id: `rule_${Date.now()}_5`, text: 'I monitored my emotions during the trade', isActive: true }
    ],
    dataFields: {
      symbol: { label: 'Symbol', type: 'text', required: true },
      entryPrice: { label: 'Entry Price', type: 'number', required: true },
      exitPrice: { label: 'Exit Price', type: 'number', required: true },
      position: { label: 'Position', type: 'select', options: ['long', 'short'], required: true },
      riskAmount: { label: 'Risk Amount ($)', type: 'number', required: true },
      riskRewardRatio: { label: 'Risk:Reward Ratio', type: 'number', required: true },
      notes: { label: 'Notes', type: 'textarea', required: false }
    }
  });

  const addNewProfile = () => {
    playSound?.('click');
    if (!newProfileName.trim()) return;
    
    const profileId = `profile_${Date.now()}`;
    
    updateGameState(state => ({
      ...state,
      profiles: {
        ...state.profiles,
        [profileId]: createDefaultProfile(newProfileName.trim())
      },
      trades: {
        ...state.trades,
        [profileId]: []
      }
    }));
    
    setNewProfileName('');
    setShowAddProfile(false);
    setSelectedProfile(profileId);
  };

  const deleteProfile = (profileId: string) => {
    playSound?.('click');
    if (profileKeys.length <= 1) {
      alert('Cannot delete the last profile. You must have at least one profile.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the profile "${gameState.profiles[profileId].name}"? This will also delete all trades associated with this profile.`)) {
      updateGameState(state => {
        const newProfiles = { ...state.profiles };
        const newTrades = { ...state.trades };
        delete newProfiles[profileId];
        delete newTrades[profileId];
        
        // If we're deleting the active profile, switch to the first remaining one
        const newActiveProfile = state.activeProfile === profileId 
          ? Object.keys(newProfiles)[0] 
          : state.activeProfile;
        
        // If we're deleting the selected profile, switch to the new active one
        if (selectedProfile === profileId) {
          setSelectedProfile(newActiveProfile);
        }
        
        return {
          ...state,
          profiles: newProfiles,
          trades: newTrades,
          activeProfile: newActiveProfile
        };
      });
    }
  };

  const startEditProfileName = (profileId: string) => {
    playSound?.('click');
    setEditingProfileName(profileId);
    setEditProfileNameText(gameState.profiles[profileId].name);
  };

  const saveProfileName = (profileId: string) => {
    playSound?.('click');
    if (!editProfileNameText.trim()) return;
    
    updateGameState(state => ({
      ...state,
      profiles: {
        ...state.profiles,
        [profileId]: {
          ...state.profiles[profileId],
          name: editProfileNameText.trim()
        }
      }
    }));
    
    setEditingProfileName(null);
    setEditProfileNameText('');
  };

  const cancelProfileNameEdit = () => {
    playSound?.('click');
    setEditingProfileName(null);
    setEditProfileNameText('');
  };

  const addRule = () => {
    playSound?.('click');
    if (!newRule.trim()) return;
    
    updateGameState(state => ({
      ...state,
      profiles: {
        ...state.profiles,
        [selectedProfile]: {
          ...state.profiles[selectedProfile],
          rules: [
            ...state.profiles[selectedProfile].rules,
            {
              id: `rule_${Date.now()}`,
              text: newRule.trim(),
              isActive: true
            }
          ]
        }
      }
    }));
    setNewRule('');
  };

  const startEditRule = (ruleId: string, currentText: string) => {
    playSound?.('click');
    setEditingRule(ruleId);
    setEditRuleText(currentText);
  };

  const saveRuleEdit = (ruleId: string) => {
    playSound?.('click');
    if (!editRuleText.trim()) return;
    
    updateGameState(state => ({
      ...state,
      profiles: {
        ...state.profiles,
        [selectedProfile]: {
          ...state.profiles[selectedProfile],
          rules: state.profiles[selectedProfile].rules.map(rule =>
            rule.id === ruleId ? { ...rule, text: editRuleText.trim() } : rule
          )
        }
      }
    }));
    
    setEditingRule(null);
    setEditRuleText('');
  };

  const cancelRuleEdit = () => {
    playSound?.('click');
    setEditingRule(null);
    setEditRuleText('');
  };

  const deleteRule = (ruleId: string) => {
    playSound?.('click');
    updateGameState(state => ({
      ...state,
      profiles: {
        ...state.profiles,
        [selectedProfile]: {
          ...state.profiles[selectedProfile],
          rules: state.profiles[selectedProfile].rules.filter(rule => rule.id !== ruleId)
        }
      }
    }));
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      {/* Add New Profile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Manage Profiles</Label>
          <Button
            onClick={() => setShowAddProfile(!showAddProfile)}
            variant="outline"
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Profile
          </Button>
        </div>
        
        {showAddProfile && (
          <div className="flex gap-2">
            <Input
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Enter profile name..."
              onKeyPress={(e) => e.key === 'Enter' && addNewProfile()}
            />
            <Button onClick={addNewProfile}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setShowAddProfile(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Profile Names Editor */}
      <div className="space-y-3">
        <Label>Profile Names</Label>
        {profileKeys.map(profileKey => (
          <div key={profileKey} className="flex items-center justify-between p-3 border rounded">
            {editingProfileName === profileKey ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editProfileNameText}
                  onChange={(e) => setEditProfileNameText(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && saveProfileName(profileKey)}
                />
                <Button size="sm" onClick={() => saveProfileName(profileKey)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelProfileNameEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="font-medium">{gameState.profiles[profileKey].name}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditProfileName(profileKey)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {profileKeys.length > 1 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProfile(profileKey)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Profile Selector */}
      <div className="flex flex-wrap gap-2">
        {profileKeys.map(profileKey => (
          <Button
            key={profileKey}
            variant={selectedProfile === profileKey ? 'default' : 'outline'}
            onClick={() => handleProfileChange(profileKey)}
            className="flex-1 min-w-0"
          >
            {gameState.profiles[profileKey].name}
          </Button>
        ))}
      </div>

      {/* Add New Rule */}
      <div className="space-y-2">
        <Label>Add New Trading Rule</Label>
        <div className="flex gap-2">
          <Input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Enter new trading rule..."
            onKeyPress={(e) => e.key === 'Enter' && addRule()}
          />
          <Button onClick={addRule}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Rules */}
      <div className="space-y-2">
        <Label>Current Rules for {gameState.profiles[selectedProfile]?.name}</Label>
        {gameState.profiles[selectedProfile]?.rules.map(rule => (
          <div key={rule.id} className="flex items-center justify-between p-2 border rounded">
            {editingRule === rule.id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editRuleText}
                  onChange={(e) => setEditRuleText(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && saveRuleEdit(rule.id)}
                />
                <Button size="sm" onClick={() => saveRuleEdit(rule.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelRuleEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="text-sm flex-1">{rule.text}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditRule(rule.id, rule.text)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
