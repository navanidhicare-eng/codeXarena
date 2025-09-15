"use client";

import { TestCasesPanel } from "@/components/TestCasesPanel";
import { User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type OpponentPanelProps = {
  playerData: {
    name: string;
    testCases: (boolean | null)[];
  };
  problem: {
    title: string;
    description: string;
  };
};

export function OpponentPanel({ playerData, problem }: OpponentPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold font-headline text-secondary">{problem.title}</h2>
      </div>

      <ScrollArea className="flex-shrink-0 h-40 border border-secondary/20 rounded-lg p-4 bg-background/50">
        <p className="text-foreground/80 whitespace-pre-wrap">{problem.description}</p>
      </ScrollArea>
      
      <div className="flex-grow rounded-lg p-4 bg-background/50 border border-secondary/20">
         <div className="flex items-center gap-2 mb-4">
            <User className="h-6 w-6 text-secondary" />
            <h2 className="text-xl font-bold font-headline text-secondary">{playerData.name}</h2>
        </div>
        <TestCasesPanel testCases={playerData.testCases} />
        <div className="mt-8 text-center text-muted-foreground">
          <p>Opponent's progress is shown here.</p>
        </div>
      </div>
    </div>
  );
}
