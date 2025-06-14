
import { useCallback } from 'react';

export const useAudioManager = () => {
  const playSound = useCallback((soundType: 'check' | 'win' | 'click') => {
    try {
      // Create audio context for Web Audio API
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
          playTone(800, 0.1);
          break;
        case 'win':
          // Victory sound - ascending notes
          playTone(523, 0.2); // C
          setTimeout(() => playTone(659, 0.2), 100); // E
          setTimeout(() => playTone(784, 0.3), 200); // G
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
