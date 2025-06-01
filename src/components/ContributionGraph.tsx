
import { useMemo } from 'react';
import type { Habit } from '@/pages/Index';

interface ContributionGraphProps {
  habit: Habit;
}

export const ContributionGraph = ({ habit }: ContributionGraphProps) => {
  const graphData = useMemo(() => {
    const weeks: Array<Array<{ date: Date; completed: boolean; dateStr: string }>> = [];
    const today = new Date();
    const startDate = new Date(habit.createdAt);
    
    // Find the start of the week (Sunday) for the creation date
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - startDate.getDay());
    
    let currentDate = new Date(startOfWeek);
    let currentWeek: Array<{ date: Date; completed: boolean; dateStr: string }> = [];
    
    // Only go up to today, don't show future dates
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const completed = habit.completions[dateStr] || false;
      
      currentWeek.push({
        date: new Date(currentDate),
        completed,
        dateStr
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Add remaining days if any
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [habit.completions, habit.createdAt]);

  const getIntensityColor = (completed: boolean) => {
    if (!completed) {
      return 'bg-gray-100 dark:bg-gray-700';
    }
    
    return '';
  };

  const getCellStyle = (completed: boolean) => {
    if (!completed) {
      return {};
    }
    
    return {
      background: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)`,
      boxShadow: `0 0 8px ${habit.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
      border: `1px solid ${habit.color}`,
    };
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>Activity since {new Date(habit.createdAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-sm bg-gray-100 dark:bg-gray-700"></div>
            <div 
              className="w-2 h-2 rounded-sm opacity-25" 
              style={{ backgroundColor: habit.color }}
            ></div>
            <div 
              className="w-2 h-2 rounded-sm opacity-50" 
              style={{ backgroundColor: habit.color }}
            ></div>
            <div 
              className="w-2 h-2 rounded-sm opacity-75" 
              style={{ backgroundColor: habit.color }}
            ></div>
            <div 
              className="w-2 h-2 rounded-sm" 
              style={{ backgroundColor: habit.color }}
            ></div>
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        {/* Month labels */}
        <div className="flex mb-1 overflow-x-auto scrollbar-hide">
          {graphData.map((week, weekIndex) => {
            if (weekIndex % 4 === 0 && week[0]) {
              const month = months[week[0].date.getMonth()];
              return (
                <div key={weekIndex} className="text-xs text-gray-500 dark:text-gray-400 w-3 text-center flex-shrink-0">
                  {month}
                </div>
              );
            }
            return <div key={weekIndex} className="w-3 flex-shrink-0"></div>;
          })}
        </div>
        
        <div className="flex overflow-x-auto scrollbar-hide">
          {/* Day labels */}
          <div className="flex flex-col mr-2 flex-shrink-0">
            {days.map((day, index) => (
              <div key={day} className="text-xs text-gray-500 dark:text-gray-400 h-3 flex items-center">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Graph grid */}
          <div className="flex gap-1">
            {graphData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 flex-shrink-0">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm transition-all duration-200 hover:scale-110 ${getIntensityColor(day.completed)}`}
                    style={getCellStyle(day.completed)}
                    title={`${day.date.toLocaleDateString()} - ${day.completed ? 'Completed' : 'Not completed'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
