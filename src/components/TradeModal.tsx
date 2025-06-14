import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { GameState, Trade } from '@/types/gameState';
import { v4 as uuidv4 } from 'uuid';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
}

export const TradeModal = ({ isOpen, onClose, selectedDate, gameState, updateGameState }: TradeModalProps) => {
  const [formData, setFormData] = useState({
    symbol: '',
    entryPrice: '',
    exitPrice: '',
    position: 'long' as 'long' | 'short',
    riskAmount: '',
    riskRewardRatio: '',
    notes: ''
  });
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const dateStr = selectedDate.toISOString().split('T')[0];
  const currentTrades = gameState.trades[gameState.activeProfile].filter(trade => trade.date === dateStr);
  const profileRules = gameState.profiles[gameState.activeProfile].rules;

  const resetForm = () => {
    setFormData({
      symbol: '',
      entryPrice: '',
      exitPrice: '',
      position: 'long',
      riskAmount: '',
      riskRewardRatio: '',
      notes: ''
    });
    setSelectedRules([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = parseFloat(formData.exitPrice);
    const riskAmount = parseFloat(formData.riskAmount);
    const riskRewardRatio = parseFloat(formData.riskRewardRatio);
    
    let pnlR = 0;
    if (formData.position === 'long') {
      pnlR = ((exitPrice - entryPrice) / entryPrice) * 100 / riskAmount;
    } else {
      pnlR = ((entryPrice - exitPrice) / entryPrice) * 100 / riskAmount;
    }

    const newTrade: Trade = {
      id: uuidv4(),
      date: dateStr,
      symbol: formData.symbol,
      entryPrice,
      exitPrice,
      position: formData.position,
      riskAmount,
      pnlR,
      riskRewardRatio,
      rulesFollowed: selectedRules,
      allRulesFollowed: selectedRules.length === profileRules.filter(r => r.isActive).length,
      notes: formData.notes
    };

    updateGameState(state => ({
      ...state,
      trades: {
        ...state.trades,
        [state.activeProfile]: [...state.trades[state.activeProfile], newTrade]
      }
    }));

    resetForm();
  };

  const deleteTrade = (tradeId: string) => {
    updateGameState(state => ({
      ...state,
      trades: {
        ...state.trades,
        [state.activeProfile]: state.trades[state.activeProfile].filter(t => t.id !== tradeId)
      }
    }));
  };

  const handleRuleToggle = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Trades */}
          {currentTrades.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Existing Trades</h3>
              {currentTrades.map(trade => (
                <div key={trade.id} className="border rounded p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{trade.symbol} - {trade.position.toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        Entry: ${trade.entryPrice} | Exit: ${trade.exitPrice}
                      </p>
                      <p className={`text-sm font-bold ${trade.pnlR >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        P&L: {trade.pnlR >= 0 ? '+' : ''}{trade.pnlR.toFixed(2)}R
                      </p>
                      <p className="text-sm">
                        Rules: {trade.allRulesFollowed ? '✅ Perfect' : '❌ Imperfect'}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTrade(trade.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Trade Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Log New Trade</h3>
            
            {/* Trading Rules Checklist */}
            <div className="space-y-2">
              <Label className="font-medium">Trading Rules Followed:</Label>
              {profileRules.filter(rule => rule.isActive).map(rule => (
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
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step="0.01"
                    value={formData.entryPrice}
                    onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="exitPrice">Exit Price</Label>
                  <Input
                    id="exitPrice"
                    type="number"
                    step="0.01"
                    value={formData.exitPrice}
                    onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="riskAmount">Risk Amount (%)</Label>
                  <Input
                    id="riskAmount"
                    type="number"
                    step="0.1"
                    value={formData.riskAmount}
                    onChange={(e) => setFormData({...formData, riskAmount: e.target.value})}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
