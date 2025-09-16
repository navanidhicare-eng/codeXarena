export type DailyTask = {
  id: string;
  description: string;
  xp: number;
  completed: boolean;
};

export const mockDailyTasks: DailyTask[] = [
  { id: 'task-1', description: 'Win one 1v1 battle', xp: 50, completed: false },
  { id: 'task-2', description: 'Solve a problem in Python', xp: 25, completed: true },
  { id: 'task-3', description: 'Compete in 3 battles', xp: 75, completed: false },
  { id: 'task-4', description: 'Ask the AI for a hint', xp: 10, completed: false },
];
