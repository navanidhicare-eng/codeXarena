
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

type JoinRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
};

export function JoinRoomModal({ isOpen, onClose, onJoin }: JoinRoomModalProps) {
  const [roomId, setRoomId] = useState('');

  const handleJoinClick = () => {
    onJoin(roomId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-panel backdrop-blur-md border border-secondary/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-secondary font-headline">Join a Private Room</DialogTitle>
          <DialogDescription>
            Enter the Room ID given to you by your opponent to join their battle.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder="Enter Room ID..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="h-12 text-lg text-center font-code bg-background/50 border-2 border-secondary/50 focus-visible:ring-primary"
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleJoinClick();
            }}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={handleJoinClick}
            disabled={!roomId.trim()}
            className="w-full h-12 text-lg bg-secondary hover:bg-secondary/90"
          >
            Join Battle
            <LogIn className="ml-2 h-5 w-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
