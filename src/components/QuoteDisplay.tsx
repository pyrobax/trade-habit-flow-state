
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const quotes = [
  "Anything can happen.",
  "You don't need to know what is going to happen next in order to make money.",
  "There is a random distribution between wins and losses for any given set of variables that define an edge.",
  "An edge is nothing more than an indication of a higher probability of one thing happening over another.",
  "Every moment in the market is unique.",
  "I objectively identify my edges.",
  "I predefine the risk of every trade.",
  "I completely accept the risk or I am willing to let go of the trade.",
  "I act on my edges without reservation or hesitation.",
  "I pay myself as the market makes money available to me.",
  "I continually monitor my susceptibility for making errors.",
  "I understand the absolute necessity of these principles of consistent success and, therefore, I never violate them.",
  "Trade without fear or overconfidence.",
  "Perceive what the market is offering from its – neutral – perspective.",
  "Stay completely focused on the \"now moment opportunity flow\".",
  "Spontaneously enter into the 'zone', it is a strong and virtually unshakeable belief in an uncertain outcome with an edge in your favor."
];

export const QuoteDisplay = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Auto-cycle quotes every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuoteIndex(prev => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="text-center">
        <p className="text-lg italic min-h-[3rem] flex items-center justify-center">
          "{quotes[currentQuoteIndex]}"
        </p>
        <p className="text-sm text-muted-foreground mt-2">— Mark Douglas</p>
      </div>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={prevQuote}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {currentQuoteIndex + 1} / {quotes.length}
        </span>
        
        <Button variant="outline" size="sm" onClick={nextQuote}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
