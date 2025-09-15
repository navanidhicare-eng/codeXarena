"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BattleScoreboard from "@/components/BattleScoreboard";
import { PlayerPanel } from "@/components/PlayerPanel";
import { OpponentPanel } from "@/components/OpponentPanel";
import { AIHintModal } from "@/components/AIHintModal";
import { getAiHint } from "@/ai/flows/ai-hint-system";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data
const mockProblem = {
  title: "Two Sum",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
  starterCode: `function twoSum(nums, target) {\n  // Write your code here\n};`,
};

export default function ArenaView() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [problem, setProblem] = useState(mockProblem);
  const [player1Data, setPlayer1Data] = useState({ name: "DevA", code: problem.starterCode, testCases: [null, null, null] as (boolean | null)[] });
  const [player2Data, setPlayer2Data] = useState({ name: "DevB", testCases: [null, null, null] as (boolean | null)[] });
  const [aiHint, setAiHint] = useState({ text: "", isVisible: false });
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  useEffect(() => {
    const playerName = searchParams.get("player");
    setPlayer1Data(prev => ({ ...prev, name: playerName || "DevA" }));
    // Simulate fetching initial match data
    setTimeout(() => setIsLoading(false), 1000);
  }, [searchParams]);

  const handleCodeChange = (code: string) => {
    setPlayer1Data(prev => ({ ...prev, code }));
  };

  const handleRunCode = () => {
    setIsCodeRunning(true);
    // Simulate code evaluation
    setTimeout(() => {
      // Dummy logic for test results
      const newTestCases = player1Data.testCases.map(() => Math.random() > 0.4);
      setPlayer1Data(prev => ({ ...prev, testCases: newTestCases }));
      
      // Also simulate opponent progress for demo purposes
      if (Math.random() > 0.5) {
          const newOpponentTests = player2Data.testCases.map(() => Math.random() > 0.6);
          setPlayer2Data(prev => ({ ...prev, testCases: newOpponentTests }));
      }

      setIsCodeRunning(false);
    }, 1500);
  };

  const handleGetHint = async () => {
    setIsHintLoading(true);
    setAiHint({ text: "", isVisible: true });
    try {
        const hintResult = await getAiHint({
            problemTitle: problem.title,
            problemDescription: problem.description,
            code: player1Data.code,
        });
        setAiHint({ text: hintResult.text, isVisible: true });
    } catch (error) {
        console.error("Error getting AI hint:", error);
        setAiHint({ text: '', isVisible: false });
        toast({
            variant: "destructive",
            title: "AI Hint Error",
            description: "Could not fetch hint. Please try again later.",
        });
    } finally {
        setIsHintLoading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="h-screen w-screen bg-background p-4 flex flex-col gap-4">
            <Skeleton className="w-full h-20 rounded-lg" />
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="w-full h-full rounded-lg" />
                <Skeleton className="w-full h-full rounded-lg" />
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background p-4 flex flex-col gap-4">
      <BattleScoreboard
        player1={{ name: player1Data.name, score: player1Data.testCases.filter(c => c === true).length }}
        player2={{ name: player2Data.name, score: player2Data.testCases.filter(c => c === true).length }}
        totalTests={problem.starterCode.length}
      />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <section className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-4 overflow-y-auto">
           <PlayerPanel 
             problem={problem}
             playerData={player1Data}
             onCodeChange={handleCodeChange}
             onRunCode={handleRunCode}
             onGetHint={handleGetHint}
             isHintLoading={isHintLoading}
             isCodeRunning={isCodeRunning}
           />
        </section>
        <section className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-4 overflow-y-auto hidden md:block">
            <OpponentPanel playerData={player2Data} />
        </section>
      </main>
      <AIHintModal 
        open={aiHint.isVisible}
        onOpenChange={(open) => setAiHint(prev => ({...prev, isVisible: open}))}
        hintText={aiHint.text}
        isLoading={isHintLoading}
      />
    </div>
  );
}
