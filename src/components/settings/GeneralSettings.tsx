
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { GameState } from '@/types/gameState';
import { getDefaultGameState } from '@/utils/defaultData';
import { useTheme } from '@/hooks/useTheme';

interface GeneralSettingsProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound?: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const GeneralSettings = ({ gameState, updateGameState, playSound }: GeneralSettingsProps) => {
  const { theme, toggleTheme } = useTheme();

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

  return (
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
  );
};
