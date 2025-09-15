"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import "./DiceRollAnimation.css";

type DiceRollAnimationProps = {
  onAnimationComplete: () => void;
};

export function DiceRollAnimation({ onAnimationComplete }: DiceRollAnimationProps) {
  const [status, setStatus] = useState("rolling");

  useEffect(() => {
    const rollTimer = setTimeout(() => {
      setStatus("selecting");
    }, 3000); // Roll for 3 seconds

    const selectTimer = setTimeout(() => {
      setStatus("complete");
    }, 4500); // Show "selecting" for 1.5 seconds

    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 6000); // Show "complete" for 1.5 seconds and then transition

    return () => {
      clearTimeout(rollTimer);
      clearTimeout(selectTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden">
      <div className="scene">
        <div className={`dice ${status === "rolling" ? "rolling" : ""}`}>
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <AnimatePresence mode="wait">
          {status === "rolling" && (
            <motion.h2
              key="rolling"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl font-headline text-secondary"
            >
              Rolling for a question...
            </motion.h2>
          )}
          {status === "selecting" && (
            <motion.h2
              key="selecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-3xl font-headline text-primary"
            >
              Selecting a worthy challenge!
            </motion.h2>
          )}
          {status === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3 text-3xl font-headline text-success"
            >
              <CheckCircle className="h-10 w-10" />
              <span>Question Selected!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
