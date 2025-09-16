"use client";

import { useState } from 'react';
import { mockDailyTasks, DailyTask } from '@/lib/mock-tasks-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

export function DailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>(mockDailyTasks);

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;
  const totalXpGained = tasks.reduce((sum, task) => task.completed ? sum + task.xp : sum, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-panel backdrop-blur-md border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-headline text-primary flex items-center gap-3">
                <Star className="w-6 h-6"/>
                Daily Tasks
            </CardTitle>
            <div className="text-right">
                <p className="font-bold text-lg text-primary">+{totalXpGained} XP Earned</p>
                <p className="text-sm text-muted-foreground">{completedTasks} of {totalTasks} completed</p>
            </div>
        </div>
         <Progress value={progressPercentage} className="mt-4 h-2 bg-primary/20" indicatorClassName="bg-primary" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleTaskToggle(task.id)}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200",
                "bg-background/50 border border-border hover:border-primary/50",
                task.completed && "bg-primary/10 border-primary/30"
              )}
            >
              <Checkbox
                checked={task.completed}
                id={`task-${task.id}`}
                className="w-5 h-5"
              />
              <div className="flex-grow">
                <p className={cn(
                  "text-base text-foreground transition-all",
                  task.completed && "line-through text-muted-foreground"
                )}>{task.description}</p>
              </div>
              <div className="text-base text-primary/80 font-bold">
                + {task.xp} XP
              </div>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
