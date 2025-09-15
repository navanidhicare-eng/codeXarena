"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Loader2, Swords } from "lucide-react";

export default function MatchmakingPage() {
  const { playerName, gameState } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!playerName) {
      router.push("/");
    }
  }, [playerName, router]);
  
  useEffect(() => {
    if (gameState?.matchId) {
      router.push(`/arena/${gameState.matchId}`);
    }
  }, [gameState, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-headline font-bold text-primary">
          Welcome, {playerName}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Prepare for battle!
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="relative my-16 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
          }}
          className="absolute w-64 h-64 border-4 border-dashed border-secondary/50 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          className="absolute w-48 h-48 border-4 border-dashed border-primary/50 rounded-full"
        />
        <Swords className="w-24 h-24 text-primary animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex items-center text-2xl text-secondary font-headline"
      >
        <Loader2 className="mr-3 h-8 w-8 animate-spin" />
        Searching for a worthy opponent...
      </motion.div>
    </div>
  );
}
