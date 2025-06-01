
import { useMemo } from 'react';
import type { Habit } from '@/pages/Index';

interface ContributionGraphProps {
  habit: Habit;
}

export const ContributionGraph = ({ habit }: ContributionGraphProps) => {
  const graphData = useMemo(() => {
    const weeks: Array<Array<{ date: Date; completed: boolean; dateStr: string }>> = [];
    const today = new Date();
    
    // Start from 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (52 * 7));
    
    // Find the start of the week (Sunday)
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - startDate.getDay());
    
    let currentDate = new Date(startOfWeek);
    let currentWeek: Array<{ date: Date; completed: boolean; dateStr: string }> = [];
    
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
  }, [habit.completions]);

  const getIntensityColor = (completed: boolean) => {
    if (!completed) {
      return 'bg-gray-100 dark:bg-gray-700';
    }
    
    // Convert hex color to RGB for opacity variations
    const hex = habit.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return '';
  };

  const getCellStyle = (completed: boolean) => {
    if (!completed) {
      return {};
    }
    
    return {
      backgroundColor: habit.color,
      opacity: 0.8
    };
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>Activity over the past year</span>
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
      
      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-1">
          {graphData.map((week, weekIndex) => {
            if (weekIndex % 4 === 0 && week[0]) {
              const month = months[week[0].date.getMonth()];
              return (
                <div key={weekIndex} className="text-xs text-gray-500 dark:text-gray-400 w-3 text-center">
                  {month}
                </div>
              );
            }
            return <div key={weekIndex} className="w-3"></div>;
          })}
        </div>
        
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-2">
            {days.map((day, index) => (
              <div key={day} className="text-xs text-gray-500 dark:text-gray-400 h-3 flex items-center">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Graph grid */}
          <div className="flex gap-1">
            {graphData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
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
    </div>
  );
};
