
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Swords } from 'lucide-react';
import { motion } from 'framer-motion';

type FinalCTAProps = {
  onEnterArena: (playerName: string) => void;
};

export function FinalCTA({ onEnterArena }: FinalCTAProps) {
  const [playerName, setPlayerName] = useState('');

  return (
    <section className="py-20 md:py-32 bg-background">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="container mx-auto px-4 flex flex-col items-center text-center"
        >
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-foreground mb-8">Ready to Battle?</h2>
             <div className="flex w-full max-w-md items-center space-x-2">
                <Input
                    type="text"
                    placeholder="Enter Your Gladiator Name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="h-14 flex-1 text-lg bg-background/50 border-2 border-primary/50 focus-visible:ring-primary"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onEnterArena(playerName)
                    }}
                />
                <Button
                    size="lg"
                    onClick={() => onEnterArena(playerName)}
                    disabled={!playerName.trim()}
                    className="h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-primary-glow"
                >
                    Find Match
                    <Swords className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </motion.div>
    </section>
  );
}
