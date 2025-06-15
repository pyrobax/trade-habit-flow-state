
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { GameState } from '@/types/gameState';

interface ProfileEditorProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const ProfileEditor = ({ gameState, updateGameState, playSound }: ProfileEditorProps) => {
  const [selectedProfile, setSelectedProfile] = useState<'usa-indices' | 'aud-nzd-pairs'>('usa-indices');
  const [newRule, setNewRule] = useState('');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editRuleText, setEditRuleText] = useState('');
  const [editingProfileName, setEditingProfileName] = useState<'usa-indices' | 'aud-nzd-pairs' | null>(null);
  const [editProfileNameText, setEditProfileNameText] = useState('');

  const handleProfileChange = (profile: 'usa-indices' | 'aud-nzd-pairs') => {
    playSound?.('click');
    setSelectedProfile(profile);
  };

  const startEditProfileName = (profile: 'usa-indices' | 'aud-nzd-pairs') => {
    playSound?.('click');
    setEditingProfileName(profile);
    setEditProfileNameText(gameState.profiles[profile].name);
  };

  const saveProfileName = (profile: 'usa-indices' | 'aud-nzd-pairs') => {
    playSound?.('click');
    if (!editProfileNameText.trim()) return;
    
    updateGameState(state => ({
      ...state,
      profiles: {
        ...state.profiles,
        [profile]: {
          ...state.profiles[profile],
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
      {/* Profile Names Editor */}
      <div className="space-y-3">
        <Label>Profile Names</Label>
        {(['usa-indices', 'aud-nzd-pairs'] as const).map(profileKey => (
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEditProfileName(profileKey)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Profile Selector */}
      <div className="flex gap-2">
        <Button
          variant={selectedProfile === 'usa-indices' ? 'default' : 'outline'}
          onClick={() => handleProfileChange('usa-indices')}
          className="flex-1"
        >
          {gameState.profiles['usa-indices'].name}
        </Button>
        <Button
          variant={selectedProfile === 'aud-nzd-pairs' ? 'default' : 'outline'}
          onClick={() => handleProfileChange('aud-nzd-pairs')}
          className="flex-1"
        >
          {gameState.profiles['aud-nzd-pairs'].name}
        </Button>
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
        <Label>Current Rules for {gameState.profiles[selectedProfile].name}</Label>
        {gameState.profiles[selectedProfile].rules.map(rule => (
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
