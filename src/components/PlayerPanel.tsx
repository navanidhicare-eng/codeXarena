"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { TestCasesPanel } from "@/components/TestCasesPanel";
import { Lightbulb, Loader2, Play } from "lucide-react";

type PlayerPanelProps = {
  problem: {
    title: string;
    description: string;
  };
  playerData: {
    code: string;
    testCases: (boolean | null)[];
  };
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  onGetHint: () => void;
  isHintLoading: boolean;
  isCodeRunning: boolean;
};

export function PlayerPanel({
  problem,
  playerData,
  onCodeChange,
  onRunCode,
  onGetHint,
  isHintLoading,
  isCodeRunning,
}: PlayerPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold font-headline text-secondary">{problem.title}</h2>
      </div>

      <ScrollArea className="flex-shrink-0 h-40 border border-secondary/20 rounded-lg p-4 bg-background/50">
        <p className="text-foreground/80 whitespace-pre-wrap">{problem.description}</p>
      </ScrollArea>
      
      <div className="flex-grow flex flex-col">
        <Textarea
          value={playerData.code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="Your code goes here..."
          className="w-full h-full flex-grow font-code bg-transparent border-2 border-secondary/50 rounded-lg focus:border-primary focus-visible:ring-0 resize-none"
        />
      </div>

      <div className="flex-shrink-0">
         <TestCasesPanel testCases={playerData.testCases} />
      </div>

      <div className="flex-shrink-0 flex items-center justify-between gap-4">
        <Button
          onClick={onGetHint}
          disabled={isHintLoading}
          variant="outline"
          className="border-secondary/50 hover:bg-secondary/10 hover:text-secondary"
        >
          {isHintLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Get Hint
        </Button>
        <Button
          onClick={onRunCode}
          disabled={isCodeRunning}
          className="bg-success text-background hover:bg-success/80"
        >
          {isCodeRunning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Run Tests
        </Button>
      </div>
    </div>
  );
}
