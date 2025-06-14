
import { Progress } from '@/components/ui/progress';
import { getStreakTitle } from '@/utils/streakCalculator';

interface StreakDisplayProps {
  streak: number;
  streakMilestones: number[];
}

export const StreakDisplay = ({ streak, streakMilestones }: StreakDisplayProps) => {
  // Find the current and next milestones
  const currentMilestone = streakMilestones.filter(m => m <= streak).pop() || 0;
  const nextMilestone = streakMilestones.find(m => m > streak) || streakMilestones[streakMilestones.length - 1];
  
  // Calculate progress percentage
  const progress = nextMilestone > currentMilestone 
    ? ((streak - currentMilestone) / (nextMilestone - currentMilestone)) * 100
    : 100;

  return (
    <div className="text-center space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg font-semibold">Streak: {streak} Days</span>
        {streak > 0 && (
          <span className="text-2xl animate-pulse">🔥</span>
        )}
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-3" />
        <div className="text-sm text-muted-foreground">
          {streak < nextMilestone ? (
            `${nextMilestone - streak} days to next milestone`
          ) : (
            'Maximum milestone reached!'
          )}
        </div>
      </div>
      
      <div className="text-lg font-medium text-primary">
        {getStreakTitle(streak)}
      </div>
    </div>
  );
};
