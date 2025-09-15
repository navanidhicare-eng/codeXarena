"use client";

import { TestCasesPanel } from "@/components/TestCasesPanel";
import { User } from "lucide-react";

type OpponentPanelProps = {
  playerData: {
    name: string;
    testCases: (boolean | null)[];
  };
};

export function OpponentPanel({ playerData }: OpponentPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <User className="h-6 w-6 text-secondary" />
        <h2 className="text-xl font-bold font-headline text-secondary">{playerData.name}</h2>
      </div>
      <div className="flex-grow rounded-lg p-4 bg-background/50 border border-secondary/20">
        <TestCasesPanel testCases={playerData.testCases} />
        <div className="mt-8 text-center text-muted-foreground">
          <p>Opponent's progress is shown here.</p>
        </div>
      </div>
    </div>
  );
}
