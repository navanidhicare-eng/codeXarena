
"use client";

import { TestCasesPanel } from "@/components/TestCasesPanel";
import { User, BookOpen, Code, Terminal } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type OpponentPanelProps = {
  playerData: {
    name: string;
    testCases: (boolean | null)[];
  };
};

export function OpponentPanel({ playerData }: OpponentPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
       <div className="flex items-center gap-2 mb-4">
            <User className="h-6 w-6 text-secondary" />
            <h2 className="text-xl font-bold font-headline text-secondary">{playerData.name}'s Progress</h2>
        </div>
        <ScrollArea className="flex-grow">
             <TestCasesPanel testCases={playerData.testCases} />
        </ScrollArea>
    </div>
  );
}
