
import { Trophy, Lock } from 'lucide-react';
import { GameState } from '@/types/gameState';

interface AchievementTrackerProps {
  gameState: GameState;
}

export const AchievementTracker = ({ gameState }: AchievementTrackerProps) => {
  const unlockedAchievements = gameState.achievements.filter(a => a.isUnlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.isUnlocked);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-green-600">🏆 Unlocked Achievements</h3>
          {unlockedAchievements.map(achievement => (
            <div key={achievement.id} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">{achievement.name}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-muted-foreground">🔒 Locked Achievements</h3>
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg opacity-75">
              <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-muted-foreground">{achievement.name}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
