"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TestCasesPanel } from "@/components/TestCasesPanel";
import { Lightbulb, Loader2, Play, Code } from "lucide-react";

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
      <div className="flex-shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary"/>
            <h2 className="text-xl font-bold font-headline text-primary">Your Code</h2>
        </div>
        <Select defaultValue="javascript">
          <SelectTrigger className="w-[180px] bg-transparent border-primary/50">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-grow flex flex-col">
        <Textarea
          value={playerData.code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="Your code goes here..."
          className="w-full h-full flex-grow font-code bg-transparent border-2 border-primary/50 rounded-lg focus:border-primary focus-visible:ring-0 resize-none text-base"
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
