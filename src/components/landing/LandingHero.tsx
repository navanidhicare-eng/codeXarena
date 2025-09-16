
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Swords, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type LandingHeroProps = {
  onEnterArena: (playerName: string) => void;
  onCreateRoom: (playerName: string) => void;
};

export function LandingHero({ onEnterArena, onCreateRoom }: LandingHeroProps) {
  const [playerName, setPlayerName] = useState('');

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden">
        <header className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
            <Link href="/" className="text-2xl font-headline text-foreground hover:text-primary transition-colors">
                CodeXarena
            </Link>
            <nav className="flex gap-6">
                <Button asChild variant="link" className="text-foreground font-bold hover:text-primary transition-colors">
                    <Link href="/roadmaps">Roadmaps</Link>
                </Button>
                <Button asChild variant="link" className="text-foreground font-bold hover:text-primary transition-colors">
                    <Link href="/profile">Profile</Link>
                </Button>
            </nav>
        </header>

        {/* Background Video/Image */}
        <div className="absolute inset-0 w-full h-full bg-black z-0">
            <Image
                src="https://picsum.photos/seed/arena-battle/1920/1080"
                alt="CodeXarena battle"
                fill
                className="object-cover opacity-30"
                data-ai-hint="code battle animation"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center gap-4"
        >
            <h1 className="font-headline font-bold text-4xl sm:text-5xl md:text-6xl text-foreground whitespace-nowrap">
                Code, Battle, Learn.
            </h1>
            <h2 className="font-headline font-bold text-2xl md:text-3xl text-primary">
                The Arena Waits
            </h2>

            <p className="max-w-3xl text-base md:text-lg lg:text-xl text-muted-foreground">
                The first real-time multiplayer coding arena. Challenge friends, get AI hints, and prove your skills in live head-to-head battles.
            </p>

            <div className="flex w-full max-w-lg items-center space-x-2">
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
            </div>
             <div className="flex gap-4 mt-2">
                 <Button
                    size="lg"
                    onClick={() => onEnterArena(playerName)}
                    disabled={!playerName.trim()}
                    className="h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-primary-glow"
                >
                    Find Match
                    <Swords className="ml-2 h-5 w-5" />
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => onCreateRoom(playerName)}
                    disabled={!playerName.trim()}
                    className="h-14 text-lg font-bold shadow-secondary-glow"
                >
                    Create Room
                    <Users className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </motion.div>
    </section>
  );
}
