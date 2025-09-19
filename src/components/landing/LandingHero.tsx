
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Swords, Users, LogIn, Bug, Shield, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { JoinRoomModal } from './JoinRoomModal';

type LandingHeroProps = {
  onEnterArena: (playerName: string) => void;
  onCreateRoom: (playerName:string) => void;
  onJoinRoom: (playerName: string, roomId: string) => void;
};

export function LandingHero({ onEnterArena, onCreateRoom, onJoinRoom }: LandingHeroProps) {
  const [playerName, setPlayerName] = useState('');
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const fullText = "Code, Battle, Learn.";
  const [text, setText] = useState('');
  
  useEffect(() => {
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [text, fullText]);


  const handleJoin = (roomId: string) => {
    if (!playerName.trim() || !roomId.trim()) return;
    onJoinRoom(playerName.trim(), roomId.trim());
    setJoinModalOpen(false);
  }

  return (
    <>
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden">
          <header className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
              <Link href="/" className="text-2xl font-headline text-foreground hover:text-primary transition-colors">
                  CodeXarena
              </Link>
              <nav className="flex gap-6 items-center">
                  <Button asChild variant="link" className="text-foreground font-bold hover:text-primary transition-colors">
                      <Link href="/events">Events</Link>
                  </Button>
                  <Button asChild variant="link" className="text-foreground font-bold hover:text-primary transition-colors">
                      <Link href="/clans">Clans</Link>
                  </Button>
                  <Button asChild variant="link" className="text-foreground font-bold hover:text-primary transition-colors">
                      <Link href="/bug-hunts">Bug Hunts</Link>
                  </Button>
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
                  src="https://i.ibb.co/pvfNdW0x/Whats-App-Image-2025-09-19-at-20-29-32-0fa2640d.jpg"
                  alt="CodeXarena battle"
                  fill
                  sizes="100vw"
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
              <h1 className="font-headline font-bold text-3xl sm:text-4xl md:text-5xl text-foreground whitespace-nowrap h-16">
                  {text}
                  <span className="animate-pulse">|</span>
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
                      suppressHydrationWarning
                  />
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
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
                   <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setJoinModalOpen(true)}
                        disabled={!playerName.trim()}
                        className="h-14 text-lg font-bold border-secondary/50 hover:bg-secondary/10 hover:text-secondary"
                    >
                        Join Room
                        <LogIn className="ml-2 h-5 w-5" />
                    </Button>
              </div>
          </motion.div>
      </section>
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoin={handleJoin}
      />
    </>
  );
}
