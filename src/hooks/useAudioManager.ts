
import { useCallback } from 'react';

export const useAudioManager = () => {
  const playSound = useCallback((soundType: 'check' | 'win' | 'click' | 'achievement' | 'perfect-day') => {
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

      switch (soundType) {
        case 'check':
          // Game-like pickup sound
          playTone(880, 0.1);
          setTimeout(() => playTone(1100, 0.1), 50);
          break;
        case 'win':
        case 'achievement':
        case 'perfect-day':
          // Victory sound - ascending notes
          playTone(523, 0.2); // C
          setTimeout(() => playTone(659, 0.2), 100); // E
          setTimeout(() => playTone(784, 0.3), 200); // G
          setTimeout(() => playTone(1047, 0.4), 300); // High C
          break;
        case 'click':
          playTone(400, 0.05);
          break;
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  return { playSound };
};
