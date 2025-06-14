
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GameState, Trade } from '@/types/gameState';
import { v4 as uuidv4 } from 'uuid';

interface TradeFormProps {
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
  playSound: (soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => void;
}

export const TradeForm = ({ gameState, updateGameState, playSound }: TradeFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    position: 'long' as 'long' | 'short',
    pnlR: '',
    riskRewardRatio: '',
    notes: ''
  });
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const profileRules = gameState.profiles[gameState.activeProfile].rules.filter(rule => rule.isActive);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    playSound('click');
  };

  const resetForm = () => {
    setFormData({
      symbol: '',
      position: 'long',
      pnlR: '',
      riskRewardRatio: '',
      notes: ''
    });
    setSelectedRules([]);
  };

  const handleRuleToggle = (ruleId: string) => {
    playSound('check');
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pnlR = parseFloat(formData.pnlR);
    const riskRewardRatio = parseFloat(formData.riskRewardRatio);
    const today = new Date().toISOString().split('T')[0];

    const newTrade: Trade = {
      id: uuidv4(),
      date: today,
      symbol: formData.symbol,
      entryPrice: 0, // Not used but required by type
      exitPrice: 0, // Not used but required by type
      position: formData.position,
      riskAmount: 1, // Not used but required by type
      pnlR,
      riskRewardRatio,
      rulesFollowed: selectedRules,
      allRulesFollowed: selectedRules.length === profileRules.length,
      notes: formData.notes
    };

    updateGameState(state => ({
      ...state,
      trades: {
        ...state.trades,
        [state.activeProfile]: [...state.trades[state.activeProfile], newTrade]
      }
    }));

    if (newTrade.allRulesFollowed) {
      playSound('perfect-day');
    }

    resetForm();
    setIsExpanded(false);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={toggleExpanded}
        variant="outline"
        className="w-full flex items-center justify-between"
      >
        <span>Log Trade</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <div className="p-4 border rounded-lg space-y-4">
          {/* Trading Rules Checklist */}
          <div className="space-y-2">
            <Label className="font-medium">Trading Rules Followed:</Label>
            {profileRules.map(rule => (
              <div key={rule.id} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={rule.id}
                  checked={selectedRules.includes(rule.id)}
                  onChange={() => handleRuleToggle(rule.id)}
                />
                <label htmlFor={rule.id} className="text-sm">{rule.text}</label>
              </div>
            ))}
          </div>

          {/* Trade Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value: 'long' | 'short') => setFormData({...formData, position: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pnlR">P&L (R)</Label>
                <Input
                  id="pnlR"
                  type="number"
                  step="0.1"
                  value={formData.pnlR}
                  onChange={(e) => setFormData({...formData, pnlR: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="riskRewardRatio">Risk:Reward Ratio</Label>
                <Input
                  id="riskRewardRatio"
                  type="number"
                  step="0.1"
                  value={formData.riskRewardRatio}
                  onChange={(e) => setFormData({...formData, riskRewardRatio: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Log Trade</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Clear</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
