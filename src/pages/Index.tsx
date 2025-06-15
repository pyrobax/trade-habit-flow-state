
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeTab } from '@/components/HomeTab';
import { CalendarTab } from '@/components/CalendarTab';
import { SettingsTab } from '@/components/SettingsTab';
import { CelebrationModal } from '@/components/CelebrationModal';
import { useGameState } from '@/hooks/useGameState';
import { useAudioManager } from '@/hooks/useAudioManager';

const Index = () => {
  const { gameState, updateGameState, celebration, closeCelebration } = useGameState();
  const { playSound } = useAudioManager();

  const handleTabClick = () => {
    playSound('click');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="home" className="w-full">
          <div className="pt-4">
            <TabsContent value="home">
              <HomeTab 
                gameState={gameState} 
                updateGameState={updateGameState}
                playSound={playSound}
              />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarTab 
                gameState={gameState} 
                updateGameState={updateGameState}
              />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsTab 
                gameState={gameState} 
                updateGameState={updateGameState}
                playSound={playSound}
              />
            </TabsContent>
          </div>
          
          {/* Fixed Bottom Tab Bar */}
          <TabsList className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t grid grid-cols-3">
            <TabsTrigger value="home" className="flex flex-col gap-1" onClick={handleTabClick}>
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex flex-col gap-1" onClick={handleTabClick}>
              <span className="text-xs">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col gap-1" onClick={handleTabClick}>
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={closeCelebration}
        title={celebration.title}
        description={celebration.description}
        type={celebration.type}
      />
    </div>
  );
};

export default Index;
