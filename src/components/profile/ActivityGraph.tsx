"use client";

import React, { useMemo } from 'react';
import { addDays, format, getDay, isSameDay, startOfWeek } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

type ActivityData = {
  date: string;
  count: number;
};

type ActivityGraphProps = {
  activityData: ActivityData[];
};

const getColor = (count: number) => {
  if (count === 0) return 'bg-muted/20';
  if (count >= 1 && count <= 2) return 'bg-secondary/30';
  if (count >= 3 && count <= 5) return 'bg-secondary';
  if (count >= 6 && count <= 9) return 'bg-primary/70';
  return 'bg-primary shadow-primary-glow';
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ActivityGraph({ activityData }: ActivityGraphProps) {
  const { grid, totalContributions, longestStreak, currentStreak } = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 365 }).map((_, i) => {
      const date = addDays(today, -364 + i);
      const activity = activityData.find(d => isSameDay(new Date(d.date), date));
      return {
        date,
        count: activity?.count || 0,
      };
    });

    const grid = Array.from({ length: 7 }, () => Array(53).fill(null));
    let dayIndex = 0;

    // Adjust for the starting day of the week
    const firstDayOfWeek = getDay(days[0].date);
    dayIndex += firstDayOfWeek;
    
    days.forEach(day => {
        const week = Math.floor(dayIndex / 7);
        const dayOfWeek = dayIndex % 7;
        if(week < 53 && dayOfWeek < 7) {
            grid[dayOfWeek][week] = day;
        }
        dayIndex++;
    });

    // Calculate streaks
    let current = 0;
    let longest = 0;
    let total = 0;

    days.forEach(day => {
        total += day.count;
        if(day.count > 0) {
            current++;
        } else {
            longest = Math.max(longest, current);
            current = 0;
        }
    });
    longest = Math.max(longest, current);
    
    // Calculate current streak ending today or yesterday
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if(days[i].count > 0) {
            streak++;
        } else {
            // Check if streak was broken before today/yesterday
            if (!isSameDay(days[i].date, today) && !isSameDay(days[i].date, addDays(today, -1))) {
                break;
            }
        }
    }
    // If the last day has no activity, the current streak is 0
    if (days[days.length - 1].count === 0 && days[days.length-2].count === 0) {
        streak = 0;
    }


    return { grid, totalContributions: total, longestStreak: longest, currentStreak: streak };
  }, [activityData]);

  return (
    <div className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-6">
        <h2 className="text-2xl font-headline font-bold text-primary mb-4 flex items-center gap-2">
            <Activity />
            Contribution Activity
        </h2>
      <TooltipProvider>
        <div className="flex gap-3">
             <div className="flex flex-col text-xs text-muted-foreground pt-5">
                {weekDays.map((day, i) => (
                    <div key={day} className="h-3.5 flex items-center" style={{marginTop: i % 2 !== 0 ? '0.2rem' : '0.1rem', marginBottom: i % 2 !== 0 ? '0.2rem' : '0.1rem'}}>
                     {i % 2 !== 0 && <span>{day}</span>}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-53 grid-rows-7 gap-1 overflow-x-auto">
            {grid.flat().map((day, i) =>
              day ? (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'w-3.5 h-3.5 rounded-[2px]',
                        getColor(day.count)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{day.count} contributions</p>
                    <p className="text-muted-foreground">{format(day.date, 'eeee, MMMM d, yyyy')}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={i} className="w-3.5 h-3.5 rounded-[2px] bg-background/20" />
              )
            )}
          </div>
        </div>
      </TooltipProvider>
      <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground border-t border-border/50 pt-4">
        <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="w-3 h-3 rounded-[2px] bg-muted/20" />
            <div className="w-3 h-3 rounded-[2px] bg-secondary/30" />
            <div className="w-3 h-3 rounded-[2px] bg-secondary" />
            <div className="w-3 h-3 rounded-[2px] bg-primary/70" />
            <div className="w-3 h-3 rounded-[2px] bg-primary" />
            <span>More</span>
        </div>
        <div className="flex gap-6 font-code">
            <p>Total: <span className="font-bold text-foreground">{totalContributions.toLocaleString()}</span></p>
            <p>Longest Streak: <span className="font-bold text-foreground">{longestStreak} days</span></p>
            <p>Current Streak: <span className="font-bold text-primary">{currentStreak} days</span></p>
        </div>
      </div>
    </div>
  );
}

// Add this to tailwind.config.ts gridTemplateColumns
// '53': 'repeat(53, minmax(0, 1fr))',
