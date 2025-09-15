"use client";

import { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import BattleScoreboard from "@/components/BattleScoreboard";
import { PlayerPanel } from "@/components/PlayerPanel";
import { OpponentPanel } from "@/components/OpponentPanel";
import { AIHintModal } from "@/components/AIHintModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { EmojiToolbar } from "@/components/EmojiToolbar";
import { motion, AnimatePresence } from "framer-motion";

type Language = "javascript" | "python" | "java" | "cpp";

export default function ArenaView({ params }: { params: { roomId: string } }) {
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
  } = useContext(AppContext);

  const [playerCode, setPlayerCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  useEffect(() => {
    if (!playerName) {
      router.push("/");
    }
  }, [playerName, router]);
  
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

  const handleRunCode = () => {
    setIsCodeRunning(true);
    emitRunCode(playerCode);
    setTimeout(() => {
      setIsCodeRunning(false);
    }, 1500);
  };

  const handleGetHint = () => {
    emitGetHint();
  };

  const handleSendEmoji = (emoji: string) => {
    sendEmoji(emoji);
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
    <div className="h-screen w-screen bg-background p-4 flex flex-col gap-4">
      <div className="relative">
        <BattleScoreboard
          player1={{ name: self.name, score: self.testCases.filter(c => c.passed).length }}
          player2={{ name: opponent.name, score: opponent.testCases.filter(c => c.passed).length }}
          totalTests={self.testCases.length}
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
        <Panel defaultSize={50}>
            <section className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-4 h-full overflow-y-auto hidden md:flex flex-col">
              <OpponentPanel
                playerData={{
                  name: opponent.name,
                  testCases: opponent.testCases.map(tc => tc.passed),
                }}
                problem={gameState.problem}
              />
            </section>
        </Panel>
        <PanelResizeHandle className="w-4 flex items-center justify-center">
            <div className="w-1 h-12 bg-border rounded-full" />
        </PanelResizeHandle>
        <Panel defaultSize={50}>
            <section className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-4 h-full overflow-y-auto flex flex-col">
              <PlayerPanel
                problem={gameState.problem}
                playerData={{
                  code: playerCode,
                  testCases: self.testCases.map(tc => tc.passed),
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
