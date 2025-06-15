

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, ExternalLink } from 'lucide-react';
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
    position: 'long' as 'long' | 'short',
    pnlR: '',
    riskRewardRatio: '',
    notes: '',
    reviewLink: ''
  });
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const dateStr = selectedDate.toISOString().split('T')[0];
  const currentTrades = gameState.trades[gameState.activeProfile].filter(trade => trade.date === dateStr);
  const profileRules = gameState.profiles[gameState.activeProfile].rules.filter(rule => rule.isActive);

  const resetForm = () => {
    setFormData({
      symbol: '',
      position: 'long',
      pnlR: '',
      riskRewardRatio: '',
      notes: '',
      reviewLink: ''
    });
    setSelectedRules([]);
    setEditingTrade(null);
  };

  const startEdit = (trade: Trade) => {
    setFormData({
      symbol: trade.symbol,
      position: trade.position,
      pnlR: trade.pnlR.toString(),
      riskRewardRatio: trade.riskRewardRatio.toString(),
      notes: trade.notes || '',
      reviewLink: trade.reviewLink || ''
    });
    setSelectedRules(trade.rulesFollowed);
    setEditingTrade(trade);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pnlR = parseFloat(formData.pnlR);
    const riskRewardRatio = parseFloat(formData.riskRewardRatio);

    const tradeData = {
      id: editingTrade?.id || uuidv4(),
      date: dateStr,
      symbol: formData.symbol,
      entryPrice: 0, // Not used but required by type
      exitPrice: 0, // Not used but required by type
      position: formData.position,
      riskAmount: 1, // Not used but required by type
      pnlR,
      riskRewardRatio,
      rulesFollowed: selectedRules,
      allRulesFollowed: selectedRules.length === profileRules.length,
      notes: formData.notes,
      reviewLink: formData.reviewLink
    };

    updateGameState(state => {
      if (editingTrade) {
        // Update existing trade
        return {
          ...state,
          trades: {
            ...state.trades,
            [state.activeProfile]: state.trades[state.activeProfile].map(t => 
              t.id === editingTrade.id ? tradeData : t
            )
          }
        };
      } else {
        // Add new trade
        return {
          ...state,
          trades: {
            ...state.trades,
            [state.activeProfile]: [...state.trades[state.activeProfile], tradeData]
          }
        };
      }
    });

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
    // Play check sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.setValueAtTime(1100, audioContext.currentTime);
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.1);
      }, 50);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }

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
              {currentTrades.map((trade, index) => (
                <div key={trade.id} className="border rounded p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{index + 1}. {trade.symbol} - {trade.position.toUpperCase()}</p>
                      <p className={`text-sm font-bold ${trade.pnlR >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        P&L: {trade.pnlR >= 0 ? '+' : ''}{trade.pnlR.toFixed(2)}R
                      </p>
                      <p className="text-sm">
                        Risk:Reward: {trade.riskRewardRatio}:1
                      </p>
                      <p className="text-sm">
                        Rules: {trade.allRulesFollowed ? '✅ Perfect' : '❌ Imperfect'}
                      </p>
                      {trade.notes && (
                        <p className="text-sm text-muted-foreground">{trade.notes}</p>
                      )}
                      {trade.reviewLink && (
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(trade.reviewLink, '_blank')}
                            className="text-xs"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(trade)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTrade(trade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trade Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              {editingTrade ? 'Edit Trade' : 'Log New Trade'}
            </h3>
            
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

              <div>
                <Label htmlFor="reviewLink">Review Link (Optional)</Label>
                <Input
                  id="reviewLink"
                  type="url"
                  placeholder="https://example.com/trade-review"
                  value={formData.reviewLink}
                  onChange={(e) => setFormData({...formData, reviewLink: e.target.value})}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingTrade ? 'Update Trade' : 'Log Trade'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  {editingTrade ? 'Cancel' : 'Clear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
