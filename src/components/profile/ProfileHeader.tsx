"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Crown, Gem } from "lucide-react";
import Image from 'next/image';
import { motion } from 'framer-motion';

type ProfileData = {
  avatarUrl: string;
  username: string;
  title: string;
  level: number;
  currentXp: number;
  xpForNextLevel: number;
  xpCoins: number;
};

type ProfileHeaderProps = {
  data: ProfileData;
};

export function ProfileHeader({ data }: ProfileHeaderProps) {
  const xpPercentage = (data.currentXp / data.xpForNextLevel) * 100;

  return (
    <div className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary shadow-primary-glow">
          <AvatarImage src={data.avatarUrl} alt={data.username} />
          <AvatarFallback>{data.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </motion.div>

      <div className="flex-grow w-full text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">{data.username}</h1>
        <p className="text-lg text-secondary font-semibold flex items-center justify-center sm:justify-start gap-2">
          <Crown className="w-5 h-5" />
          {data.title}
        </p>

        <div className="mt-4 w-full">
            <div className="flex justify-between items-center mb-1 text-sm font-code">
                <span className="font-bold text-primary">Lvl {data.level}</span>
                <span className="text-muted-foreground">{data.currentXp} / {data.xpForNextLevel} XP</span>
            </div>
            <Progress value={xpPercentage} className="h-3 bg-primary/20" />
        </div>
      </div>
      
      <div className="flex-shrink-0 flex items-center gap-2 bg-background/50 border border-secondary/20 px-4 py-2 rounded-lg">
        <Gem className="w-6 h-6 text-secondary"/>
        <span className="text-xl font-bold font-code text-foreground">{data.xpCoins.toLocaleString()}</span>
      </div>
    </div>
  );
}
