
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { GameState } from '@/types/gameState';

interface SymbolDropdownProps {
  value: string;
  onChange: (value: string) => void;
  gameState: GameState;
  updateGameState: (updater: (prevState: GameState) => GameState) => void;
}

export const SymbolDropdown = ({ value, onChange, gameState, updateGameState }: SymbolDropdownProps) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [showManageSymbols, setShowManageSymbols] = useState(false);

  const addNewSymbol = () => {
    if (newSymbol.trim() && !gameState.symbols.includes(newSymbol.trim().toUpperCase())) {
      const symbolToAdd = newSymbol.trim().toUpperCase();
      updateGameState(state => ({
        ...state,
        symbols: [...state.symbols, symbolToAdd]
      }));
      onChange(symbolToAdd);
      setNewSymbol('');
      setShowAddNew(false);
    }
  };

  const removeSymbol = (symbolToRemove: string) => {
    updateGameState(state => ({
      ...state,
      symbols: state.symbols.filter(s => s !== symbolToRemove)
    }));
    if (value === symbolToRemove) {
      onChange('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addNewSymbol();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="symbol">Symbol</Label>
      {!showAddNew && !showManageSymbols ? (
        <div className="flex gap-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a symbol" />
            </SelectTrigger>
            <SelectContent>
              {gameState.symbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddNew(true)}
            title="Add new symbol"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowManageSymbols(true)}
            title="Manage symbols"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : showAddNew ? (
        <div className="flex gap-2">
          <Input
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Enter new symbol"
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNewSymbol}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddNew(false);
              setNewSymbol('');
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm font-medium">Manage Symbols</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {gameState.symbols.map(symbol => (
              <div key={symbol} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{symbol}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSymbol(symbol)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowManageSymbols(false)}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
};
