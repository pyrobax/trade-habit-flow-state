
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: 'achievement' | 'streak';
}

export const CelebrationModal = ({ isOpen, onClose, title, description, type }: CelebrationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // Play achievement sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        };

        // Victory sound - ascending notes
        playTone(523, 0.2); // C
        setTimeout(() => playTone(659, 0.2), 100); // E
        setTimeout(() => playTone(784, 0.3), 200); // G
        setTimeout(() => playTone(1047, 0.4), 300); // High C
      } catch (error) {
        console.warn('Audio playback failed:', error);
      }

      // Create confetti effect
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const confetti: any[] = [];
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];

      for (let i = 0; i < 100; i++) {
        confetti.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          w: Math.random() * 10 + 5,
          h: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 3 + 2,
          angle: Math.random() * Math.PI * 2,
          spin: Math.random() * 0.2 - 0.1
        });
      }

      let animationId: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, index) => {
          c.y += c.speed;
          c.x += Math.sin(c.angle) * 2;
          c.angle += c.spin;
          
          ctx.save();
          ctx.translate(c.x + c.w / 2, c.y + c.h / 2);
          ctx.rotate(c.angle);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          ctx.restore();
          
          if (c.y > canvas.height) {
            confetti.splice(index, 1);
          }
        });
        
        if (confetti.length > 0) {
          animationId = requestAnimationFrame(animate);
        } else {
          document.body.removeChild(canvas);
        }
      };
      
      animate();

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (document.body.contains(canvas)) {
          document.body.removeChild(canvas);
        }
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {title}
          </DialogTitle>
          <p className="text-center text-muted-foreground text-lg">
            {description}
          </p>
        </DialogHeader>
        
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="px-8">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
