"use client";

import { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import BattleScoreboard from "@/components/BattleScoreboard";
import { PlayerPanel } from "@/components/PlayerPanel";
import { OpponentPanel } from "@/components/OpponentPanel";
import { AIHintModal } from "@/components/AIHintModal";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function ArenaView({ params }: { params: { roomId: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    playerName,
    gameState,
    emitRunCode,
    emitGetHint,
    hint,
    isHintLoading,
    clearHint,
  } = useContext(AppContext);

  const [playerCode, setPlayerCode] = useState("");
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  useEffect(() => {
    // Redirect if we land here without a player name.
    if (!playerName) {
      router.push("/");
    }
  }, [playerName, router]);
  
  useEffect(() => {
    if (gameState?.problem?.starterCode) {
      setPlayerCode(gameState.problem.starterCode);
    }
  }, [gameState?.problem?.starterCode])

  const handleCodeChange = (code: string) => {
    setPlayerCode(code);
  };

  const handleRunCode = () => {
    setIsCodeRunning(true);
    emitRunCode(playerCode);
    // In a real app, we'd get a confirmation from the server.
    // For now, we'll just simulate a delay.
    setTimeout(() => {
      setIsCodeRunning(false);
    }, 1500);
  };

  const handleGetHint = () => {
    emitGetHint();
  };

  if (!gameState || !playerName) {
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

  const self = gameState.players.find((p) => p.name === playerName);
  const opponent = gameState.players.find((p) => p.name !== playerName);

  if (!self || !opponent) {
    return (
      <div className="h-screen w-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center text-secondary font-headline text-2xl">
          Waiting for opponent...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background p-4 flex flex-col gap-4">
      <BattleScoreboard
        player1={{ name: self.name, score: self.testCases.filter(c => c.passed).length }}
        player2={{ name: opponent.name, score: opponent.testCases.filter(c => c.passed).length }}
        totalTests={self.testCases.length}
      />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <section className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-4 overflow-y-auto hidden md:block">
          <OpponentPanel
            playerData={{
              name: opponent.name,
              testCases: opponent.testCases.map(tc => tc.passed),
            }}
             problem={gameState.problem}
          />
        </section>
        <section className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-4 overflow-y-auto">
          <PlayerPanel
            problem={gameState.problem}
            playerData={{
              code: playerCode,
              testCases: self.testCases.map(tc => tc.passed),
            }}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            onGetHint={handleGetHint}
            isHintLoading={isHintLoading}
            isCodeRunning={isCodeRunning}
          />
        </section>
      </main>
      <AIHintModal
        open={!!hint}
        onOpenChange={(open) => {
          if (!open) clearHint();
        }}
        hintText={hint || ""}
        isLoading={isHintLoading}
      />
    </div>
  );
}
