
"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

type PlayerScore = {
  name: string;
  score: number;
};

type BattleScoreboardProps = {
  player1: PlayerScore;
  player2: PlayerScore;
  totalTests: number;
  onTimeUp: () => void;
};

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function BattleScoreboard({ player1, player2, totalTests, onTimeUp }: BattleScoreboardProps) {
  const [p1Flash, setP1Flash] = useState(false);
  const [p2Flash, setP2Flash] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  const prevP1Score = usePrevious(player1.score);
  const prevP2Score = usePrevious(player2.score);

  useEffect(() => {
    if (prevP1Score !== undefined && player1.score > prevP1Score) {
      setP1Flash(true);
      const timer = setTimeout(() => setP1Flash(false), 400);
      return () => clearTimeout(timer);
    }
  }, [player1.score, prevP1Score]);

  useEffect(() => {
    if (prevP2Score !== undefined && player2.score > prevP2Score) {
      setP2Flash(true);
      const timer = setTimeout(() => setP2Flash(false), 400);
      return () => clearTimeout(timer);
    }
  }, [player2.score, prevP2Score]);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const ScoreDisplay = ({ flash, score, total }: { flash: boolean, score: number, total: number }) => (
    <span className={cn(
        "font-code text-2xl font-bold transition-all duration-300",
        flash ? "text-success shadow-success-glow scale-125" : "text-foreground"
    )}>
        {score}
    </span>
  );

  return (
    <div className="w-full h-20 flex items-center justify-between px-6 bg-panel backdrop-blur-md border border-secondary/20 rounded-lg">
      {/* Player 1 */}
      <div className="text-left">
        <div className="text-xl font-bold text-primary">{player1.name}</div>
        <div className="flex items-center gap-2">
            <ScoreDisplay flash={p1Flash} score={player1.score} total={totalTests} />
            <span className="text-muted-foreground font-code">/ {totalTests}</span>
        </div>
      </div>

      {/* Timer / Status */}
      <div className="text-center">
        <div className={cn(
            "font-code text-4xl font-bold",
            timeLeft > 60 ? "text-secondary" : "text-destructive animate-pulse"
        )}>
            {formatTime(timeLeft)}
        </div>
      </div>

      {/* Player 2 */}
      <div className="text-right">
        <div className="text-xl font-bold text-secondary">{player2.name}</div>
        <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-code">/ {totalTests}</span>
            <ScoreDisplay flash={p2Flash} score={player2.score} total={totalTests} />
        </div>
      </div>
    </div>
  );
}
