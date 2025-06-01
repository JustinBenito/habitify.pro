
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Habit } from '@/pages/Index';

interface AddHabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
}

const PRESET_HABITS = [
  { icon: '🚶', name: 'Walk around the block', description: 'Go for a short walk to clear the mind', color: '#10b981' },
  { icon: '📚', name: 'Learn Norwegian', description: 'Three lessons per day', color: '#8b5cf6' },
  { icon: '🍎', name: 'Eat a piece of fruit', description: 'Stay healthy and don\'t overeat', color: '#ef4444' },
  { icon: '🧘', name: 'Stretch for 5 minutes', description: 'Improve flexibility and relax muscles', color: '#f59e0b' },
  { icon: '💨', name: 'Deep breathing exercise', description: 'Calm your mind with a quick exercise', color: '#06b6d4' },
  { icon: '💧', name: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day', color: '#3b82f6' },
  { icon: '📝', name: 'Write in journal', description: 'Reflect on your day and thoughts', color: '#ec4899' },
  { icon: '🏃', name: 'Exercise for 30 minutes', description: 'Keep your body active and healthy', color: '#f97316' },
];

const COLORS = [
  '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', 
  '#3b82f6', '#ec4899', '#f97316', '#84cc16', '#6366f1'
];

export const AddHabitDialog = ({ isOpen, onClose, onAdd }: AddHabitDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📝');
  const [color, setColor] = useState(COLORS[0]);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      description: description.trim(),
      icon,
      color
    });

    // Reset form
    setName('');
    setDescription('');
    setIcon('📝');
    setColor(COLORS[0]);
    setShowCustomForm(false);
  };

  const handlePresetSelect = (preset: typeof PRESET_HABITS[0]) => {
    onAdd(preset);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setShowCustomForm(false);
    setName('');
    setDescription('');
    setIcon('📝');
    setColor(COLORS[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>

        {!showCustomForm ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose from popular habits or create your own:
            </p>
            
            <div className="grid gap-2">
              {PRESET_HABITS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSelect(preset)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: preset.color + '20' }}
                  >
                    {preset.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {preset.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {preset.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button 
              onClick={() => setShowCustomForm(true)}
              variant="outline"
              className="w-full"
            >
              Create Custom Habit
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Read for 30 minutes"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Read books to expand knowledge and relax"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="📚"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      color === colorOption ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCustomForm(false)}>
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Add Habit
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
