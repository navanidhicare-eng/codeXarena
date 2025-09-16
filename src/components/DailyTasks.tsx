"use client";

import { useState } from 'react';
import { mockDailyTasks, DailyTask } from '@/lib/mock-tasks-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

const PixelCheckbox = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={cn(
        "w-8 h-8 pixel-box-inset flex items-center justify-center cursor-pointer",
        "transition-all duration-200"
      )}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-4 h-4 bg-yellow-400"
          style={{
            boxShadow: '0 0 10px #facc15, 0 0 20px #facc15'
          }}
        />
      )}
    </div>
  )
}

export function DailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>(mockDailyTasks);

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const totalXp = tasks.reduce((sum, task) => task.completed ? sum + task.xp : sum, 0);

  return (
    <div className="w-full max-w-4xl mx-auto font-pixel">
        <div className="pixel-box p-6">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-3xl text-white" style={{ textShadow: '2px 2px #000' }}>Daily Tasks</h2>
                 <div 
                    className="flex items-center gap-2 text-2xl text-yellow-400"
                    style={{ textShadow: '2px 2px #000' }}
                >
                    <Star className="w-6 h-6 fill-current" />
                    <span>{totalXp} XP</span>
                </div>
            </div>
            <ul className="space-y-4">
                {tasks.map((task, index) => (
                    <motion.li
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "flex items-center gap-4 p-4 pixel-box transition-opacity",
                            task.completed && "opacity-50"
                        )}
                    >
                        <PixelCheckbox 
                            checked={task.completed} 
                            onChange={() => handleTaskToggle(task.id)}
                        />
                        <div className="flex-grow">
                            <p className={cn(
                                "text-lg text-white transition-all",
                                task.completed && "line-through"
                            )}>{task.description}</p>
                        </div>
                        <div className="text-lg text-yellow-300 font-bold">
                           + {task.xp} XP
                        </div>
                    </motion.li>
                ))}
            </ul>
        </div>
    </div>
  );
}

// Add this to tailwind.config.ts
// fontFamily: {
//   'pixel': ['"Press Start 2P"', 'cursive'],
// }
