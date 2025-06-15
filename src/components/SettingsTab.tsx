import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Download, Upload, RotateCcw, Plus, Trash2, Trophy, Lock, Edit2, Check, X } from 'lucide-react';
import { GameState } from '@/types/gameState';
import { getDefaultGameState } from '@/utils/defaultData';
import { useTheme } from '@/hooks/useTheme';

interface SettingsTabProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const SettingsTab = ({ gameState, updateGameState, playSound }: SettingsTabProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<'usa-indices' | 'aud-nzd-pairs'>('usa-indices');
  const [newRule, setNewRule] = useState('');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editRuleText, setEditRuleText] = useState('');
  const [editingProfileName, setEditingProfileName] = useState<'usa-indices' | 'aud-nzd-pairs' | null>(null);
  const [editProfileNameText, setEditProfileNameText] = useState('');
  const { theme, toggleTheme } = useTheme();

  const toggleSection = (section: string) => {
    playSound?.('click');
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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

  const exportData = () => {
    playSound?.('click');
    const dataStr = JSON.stringify(gameState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `trade-habit-hero-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    playSound?.('click');
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        updateGameState(() => importedData);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetAllData = () => {
    playSound?.('click');
    if (window.confirm('Are you sure you want to reset ALL data? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your trades, achievements, and settings. Continue?')) {
        updateGameState(() => getDefaultGameState());
        alert('All data has been reset to default.');
      }
    }
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

  const unlockedAchievements = gameState.achievements.filter(a => a.isUnlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.isUnlocked);

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
          <div className="p-4 border rounded-lg space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>

            {/* Export Data */}
            <div className="flex flex-col gap-2">
              <Label>Data Management</Label>
              <div className="flex gap-2">
                <Button onClick={exportData} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <label className="cursor-pointer flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>
            </div>

            {/* Reset Data */}
            <div className="pt-4 border-t">
              <Button onClick={resetAllData} variant="destructive" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This will permanently delete all your data
              </p>
            </div>
          </div>
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
          <div className="p-4 border rounded-lg space-y-4">
            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600">🏆 Unlocked Achievements</h3>
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">{achievement.name}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground">🔒 Locked Achievements</h3>
                {lockedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg opacity-75">
                    <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-muted-foreground">{achievement.name}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
