"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Swords, Plus, LogIn, Map, ChevronDown, Trophy } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LeaderboardView } from "@/components/LeaderboardView";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from 'framer-motion';


export default function HomePage() {
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { connectAndJoin, createRoom, playerName } = useContext(AppContext);

  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomPassword, setRoomPassword] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const handleQuickMatch = () => {
    if (!playerNameInput.trim() || isLoading) return;
    setIsLoading(true);
    connectAndJoin(playerNameInput.trim());
    router.push('/matchmaking');
  };

  const handleCreateRoom = () => {
    if (!playerNameInput.trim()) {
      // Maybe show a toast to enter a name first
      return;
    }
    setShowCreateRoomModal(true);
  };
  
  const handleJoinRoom = () => {
     if (!playerNameInput.trim()) {
      return;
    }
    setShowJoinRoomModal(true);
  }

  const submitCreateRoom = () => {
    if (!playerNameInput.trim()) return;
    
    createRoom({
      playerName: playerNameInput.trim(),
      isPrivate,
      password: roomPassword,
    });
    setShowCreateRoomModal(false);
  }

  const submitJoinRoom = () => {
    console.log(`Joining room: ${joinRoomId}`);
    setShowJoinRoomModal(false);
    connectAndJoin(playerNameInput.trim());
    router.push(`/room/${joinRoomId}`);
  }


  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-background text-foreground p-4 relative overflow-y-auto">
       <div className="absolute top-6 right-6 flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12 border-secondary/50 hover:bg-secondary/10">
            <Link href="/roadmaps">
                <Map className="h-6 w-6 text-secondary" />
                <span className="sr-only">Roadmaps</span>
            </Link>
        </Button>
        <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12 border-primary/50 hover:bg-primary/10">
          <Link href="/profile">
            <User className="h-6 w-6 text-primary" />
            <span className="sr-only">Profile</span>
          </Link>
        </Button>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-8 pt-20 md:pt-28">
        <div className="text-center">
             <h1 className="font-headline font-bold text-6xl bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text" style={{ textShadow: '0 0 15px hsla(var(--primary), 0.5)' }}>
                CodeXarena
            </h1>
            <p className="font-headline text-secondary text-xl mt-2">
                Stop Grinding. Start Battling.
            </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
            <Input
            type="text"
            placeholder="Enter your gladiator name to play"
            value={playerNameInput}
            onChange={(e) => setPlayerNameInput(e.target.value)}
            className="h-14 text-lg text-center bg-transparent border-2 border-secondary/50 rounded-lg transition-all duration-300 focus:border-primary focus-visible:ring-0 focus:scale-105"
            disabled={isLoading}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                onClick={handleQuickMatch}
                disabled={!playerNameInput.trim() || isLoading}
                className="h-14 text-lg font-bold transition-all duration-300 bg-primary hover:bg-primary/80 hover:shadow-primary-glow disabled:bg-muted disabled:shadow-none disabled:cursor-not-allowed col-span-1 md:col-span-3"
                >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Entering the Arena...
                    </>
                ) : (
                    <>
                    <Swords className="mr-2 h-6 w-6" />
                    Quick Match
                    </>
                )}
                </Button>
                <Button
                onClick={handleCreateRoom}
                disabled={!playerNameInput.trim()}
                variant="outline"
                className="h-14 text-lg font-bold border-secondary/50 hover:bg-secondary/10 hover:text-secondary disabled:bg-muted/20 disabled:text-muted-foreground disabled:border-muted"
                >
                <Plus className="mr-2 h-6 w-6" />
                Create
                </Button>
                <Button
                onClick={handleJoinRoom}
                disabled={!playerNameInput.trim()}
                variant="outline"
                className="h-14 text-lg font-bold border-primary/50 hover:bg-primary/10 hover:text-primary col-span-2 disabled:bg-muted/20 disabled:text-muted-foreground disabled:border-muted"
                >
                <LogIn className="mr-2 h-6 w-6" />
                Join Room
                </Button>
            </div>
        </div>

        <div className="w-full max-w-4xl mt-12">
           <Collapsible open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
                <CollapsibleTrigger asChild>
                    <motion.button 
                        className="w-full flex items-center justify-center gap-3 text-xl font-headline text-primary/80 hover:text-primary transition-colors"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Trophy className="w-6 h-6" />
                        <span>View Global Rankings</span>
                        <ChevronDown className={`w-6 h-6 transition-transform ${isLeaderboardOpen ? 'rotate-180' : ''}`} />
                    </motion.button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="mt-4">
                        <LeaderboardView />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    </div>
      
      {/* Create Room Modal */}
      <Dialog open={showCreateRoomModal} onOpenChange={setShowCreateRoomModal}>
        <DialogContent className="bg-panel backdrop-blur-md border border-secondary/20">
          <DialogHeader>
            <DialogTitle className="text-secondary font-headline">Create New Room</DialogTitle>
            <DialogDescription>
              Configure your battle room and invite your friends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Switch id="private-mode" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private-mode">Private Room</Label>
            </div>
            {isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="password">Room Password</Label>
                <Input id="password" type="password" value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} className="bg-transparent border-secondary/50"/>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRoomModal(false)}>Cancel</Button>
            <Button onClick={submitCreateRoom} className="bg-secondary hover:bg-secondary/80">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Join Room Modal */}
       <Dialog open={showJoinRoomModal} onOpenChange={setShowJoinRoomModal}>
        <DialogContent className="bg-panel backdrop-blur-md border border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-primary font-headline">Join a Room</DialogTitle>
            <DialogDescription>
              Enter the Room ID to join a battle.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
              <Label htmlFor="room-id">Room ID</Label>
              <Input id="room-id" value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} className="bg-transparent border-primary/50" placeholder="e.g. AX-7B-WQ"/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinRoomModal(false)}>Cancel</Button>
            <Button onClick={submitJoinRoom}>Join</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
