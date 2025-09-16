"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earned: boolean;
};

type BadgeDisplayProps = {
  badges: Badge[];
};

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-6">
       <TooltipProvider>
            <div className="grid grid-cols-8 gap-3">
                {badges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={cn(
                                    "aspect-square rounded-full flex items-center justify-center p-1 transition-all duration-300",
                                    badge.earned ? "bg-primary/20 border-2 border-primary/50" : "bg-muted/50 border-2 border-dashed border-border"
                                )}>
                                    {badge.earned ? (
                                        <Image
                                            src={badge.imageUrl}
                                            alt={badge.name}
                                            width={32}
                                            height={32}
                                            className="transform hover:scale-110 transition-transform"
                                        />
                                    ) : (
                                        <Lock className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-background border-primary">
                                <p className="font-bold text-primary">{badge.name}</p>
                                <p className="text-sm text-foreground/80">{badge.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </motion.div>
                ))}
            </div>
       </TooltipProvider>
    </div>
  );
}
