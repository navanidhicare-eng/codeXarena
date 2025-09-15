"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";


type Match = {
  id: string;
  outcome: "Victory" | "Defeat";
  problemTitle: string;
  opponent: string;
  timestamp: string; // ISO date string
};

type MatchHistoryProps = {
  matches: Match[];
};

type FormattedMatch = Omit<Match, 'timestamp'> & {
    formattedTimestamp: string;
}

export function MatchHistory({ matches }: MatchHistoryProps) {
  const [formattedMatches, setFormattedMatches] = useState<FormattedMatch[]>([]);

  useEffect(() => {
    setFormattedMatches(
      matches.map(match => ({
        ...match,
        formattedTimestamp: formatDistanceToNow(new Date(match.timestamp), { addSuffix: true }),
      }))
    );
  }, [matches]);

  if (!formattedMatches.length) {
    // Render a loading state or nothing until the client-side effect runs
    return (
        <div className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-2 h-96">
          <ScrollArea className="h-full w-full">
            <div className="p-4 space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-background/50 border border-border rounded-lg p-4 h-[78px] animate-pulse" />
                ))}
            </div>
          </ScrollArea>
        </div>
    );
  }

  return (
    <div className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-2 h-96">
      <ScrollArea className="h-full w-full">
        <div className="p-4">
            <ul className="space-y-4">
            {formattedMatches.map((match, index) => (
                <motion.li
                    key={match.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-background/50 border border-border hover:border-secondary/50 rounded-lg p-4 transition-colors duration-300"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className={cn(
                                "font-bold text-lg",
                                match.outcome === "Victory" ? "text-success" : "text-destructive"
                            )}>
                                {match.outcome}
                            </span>
                            <p className="font-headline text-foreground">{match.problemTitle}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">vs {match.opponent}</p>
                            <p className="text-xs text-muted-foreground/70">{match.formattedTimestamp}</p>
                        </div>
                    </div>
                </motion.li>
            ))}
            </ul>
        </div>
      </ScrollArea>
    </div>
  );
}
