
import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContributionGraph } from './ContributionGraph';
import type { Habit } from '@/pages/Index';

interface HabitCardProps {
  habit: Habit;
  currentStreak: number;
  onToggleCompletion: (habitId: string, date: string) => void;
}

export const HabitCard = ({ habit, currentStreak, onToggleCompletion }: HabitCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions[today] || false;

  const handleToggleCompletion = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
    onToggleCompletion(habit.id, today);
  };

  const getLastCompletedDate = () => {
    const completedDates = Object.keys(habit.completions)
      .filter(date => habit.completions[date])
      .sort()
      .reverse();
    
    if (completedDates.length === 0) return null;
    
    const lastDate = new Date(completedDates[0]);
    const today = new Date();
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        isAnimating ? 'scale-[0.98]' : 'scale-100'
      }`}
      style={{
        background: `linear-gradient(135deg, ${habit.color}08 0%, ${habit.color}03 100%)`
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-medium"
            style={{ backgroundColor: habit.color }}
          >
            {habit.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {habit.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {habit.description}
            </p>
            {getLastCompletedDate() && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Last completed: {getLastCompletedDate()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {currentStreak > 0 && (
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {currentStreak}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                day streak
              </div>
            </div>
          )}
          
          <Button
            onClick={handleToggleCompletion}
            size="sm"
            variant={isCompletedToday ? "default" : "outline"}
            className={`w-10 h-10 rounded-full transition-all duration-200 ${
              isCompletedToday 
                ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                : 'border-2 hover:scale-105'
            }`}
            style={{
              borderColor: isCompletedToday ? '#10b981' : habit.color,
              color: isCompletedToday ? 'white' : habit.color
            }}
          >
            {isCompletedToday ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Contribution Graph */}
      <ContributionGraph habit={habit} />
    </div>
  );
};
