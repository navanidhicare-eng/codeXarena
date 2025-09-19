
"use client";

import { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import BattleScoreboard from "@/components/BattleScoreboard";
import { PlayerPanel } from "@/components/PlayerPanel";
import { OpponentPanel } from "@/components/OpponentPanel";
import { ProblemPanel } from "@/components/ProblemPanel";
import { AIHintModal } from "@/components/AIHintModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useParams } from "next/navigation";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { EmojiToolbar } from "@/components/EmojiToolbar";
import { motion, AnimatePresence } from "framer-motion";
import { DiceRollAnimation } from "@/components/DiceRollAnimation";
import mockSocketService from "@/services/mockSocketService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Language = "javascript" | "python" | "java" | "cpp";

export default function ArenaView() {
  const params = useParams();
  const router = useRouter();
  const {
    playerName,
    gameState,
    emitRunCode,
    emitGetHint,
    hint,
    isHintLoading,
    clearHint,
    opponentEmoji,
    sendEmoji,
    leaveGame,
    codeOutput,
  } = useContext(AppContext);

  const [playerCode, setPlayerCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [showDiceRoll, setShowDiceRoll] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Redirect if player name is not set, but only after the component has mounted on the client
    if (isMounted && !playerName) {
      router.push("/");
    }
  }, [playerName, router, isMounted]);
  
  useEffect(() => {
    if (gameState?.problem?.starterCode) {
      setPlayerCode(gameState.problem.starterCode[selectedLanguage]);
    }
  }, [gameState?.problem?.starterCode, selectedLanguage])

  const handleCodeChange = (code: string) => {
    setPlayerCode(code);
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  }

  const handleRunCode = async () => {
    if (!gameState?.problem.title) return;
    setIsCodeRunning(true);
    await emitRunCode(playerCode, selectedLanguage, gameState.problem.title);
    setIsCodeRunning(false);
  };

  const handleGetHint = () => {
    emitGetHint(playerCode);
  };

  const handleSendEmoji = (emoji: string) => {
    sendEmoji(emoji);
  }

  const handleAnimationComplete = () => {
    setShowDiceRoll(false);
  }

  const handleTimeUp = () => {
    if (!gameState) return;

    const self = gameState.players.find((p) => p.name === playerName);
    const opponent = gameState.players.find((p) => p.name !== playerName);

    if (!self || !opponent) return;

    let winner = null;
    if (self.score > opponent.score) {
      winner = self.name;
    } else if (opponent.score > self.score) {
      winner = opponent.name;
    } else {
      winner = "Draw"; // Or handle draw case specifically
    }
    
    // Use the mock service to end the game
    mockSocketService.endGameOnTimeUp(winner);
  };

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  if (showDiceRoll && gameState) {
    return <DiceRollAnimation onAnimationComplete={handleAnimationComplete} />;
  }

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
    <div className="h-screen w-screen bg-background p-4 flex flex-col gap-4 relative">
        <div className="absolute top-6 left-6 z-20">
            <Button onClick={leaveGame} variant="outline" className="border-secondary/50 hover:bg-secondary/10 hover:text-secondary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Button>
        </div>
      <div className="relative">
        <BattleScoreboard
          player1={{ name: self.name, score: self.testCases.filter(c => c.passed).length }}
          player2={{ name: opponent.name, score: opponent.testCases.filter(c => c.passed).length }}
          totalTests={self.testCases.length}
          onTimeUp={handleTimeUp}
        />
         <AnimatePresence>
          {opponentEmoji && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl"
            >
              {opponentEmoji}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PanelGroup direction="horizontal" className="flex-grow min-h-0">
        <Panel defaultSize={50} minSize={30}>
          <ProblemPanel problem={gameState.problem} />
        </Panel>
        <PanelResizeHandle className="w-4 flex items-center justify-center">
            <div className="w-1 h-12 bg-border rounded-full" />
        </PanelResizeHandle>
        <Panel defaultSize={50} minSize={30}>
           <PanelGroup direction="vertical" className="h-full">
             <Panel defaultSize={65} minSize={20}>
                <section className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-4 h-full overflow-y-auto flex flex-col">
                  <PlayerPanel
                    playerData={{
                      code: playerCode,
                      output: codeOutput,
                    }}
                    selectedLanguage={selectedLanguage}
                    onCodeChange={handleCodeChange}
                    onLanguageChange={handleLanguageChange}
                    onRunCode={handleRunCode}
                    onGetHint={handleGetHint}
                    isHintLoading={isHintLoading}
                    isCodeRunning={isCodeRunning}
                  />
                </section>
            </Panel>
             <PanelResizeHandle className="h-4 flex items-center justify-center">
                <div className="w-12 h-1 bg-border rounded-full" />
            </PanelResizeHandle>
             <Panel defaultSize={35} minSize={20}>
                <section className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-4 h-full overflow-y-auto flex flex-col">
                  <OpponentPanel
                    playerData={{
                      name: opponent.name,
                      testCases: opponent.testCases.map(tc => tc.passed),
                    }}
                  />
                </section>
            </Panel>
           </PanelGroup>
        </Panel>
      </PanelGroup>

      <AIHintModal
        open={!!hint}
        onOpenChange={(open) => {
          if (!open) clearHint();
        }}
        hintText={hint || ""}
        isLoading={isHintLoading}
      />
      
      <EmojiToolbar onEmojiSelect={handleSendEmoji} />
    </div>
  );
}
