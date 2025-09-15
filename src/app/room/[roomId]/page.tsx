
"use client";

import { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Copy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Simple QR Code generator component
const QRCode = ({ text }: { text: string }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
  return <Image src={qrUrl} alt="Room QR Code" width={150} height={150} className="rounded-lg border-4 border-primary" />;
};


export default function RoomWaitingPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const { playerName, gameState } = useContext(AppContext);
  const { toast } = useToast();

  const [players, setPlayers] = useState([playerName]);

  // Mock effect for players joining
  useEffect(() => {
    const interval = setInterval(() => {
      if (players.length < 4) {
        setPlayers(prev => [...prev, `Player_${Math.floor(Math.random() * 100)}`]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [players.length]);


  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Room ID Copied!",
      description: "You can now share it with your friends.",
    });
  };

  const fullRoomUrl = typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}` : '';

  // Assuming the first player is the admin
  const isAdmin = players[0] === playerName;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">Waiting Room</h1>
      <p className="text-muted-foreground mb-8">Share the Room ID or QR Code with others to join.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Left Panel: Info */}
        <div className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-headline text-secondary mb-4">Invite Your Opponents</h2>
           <div className="mb-6">
             <QRCode text={fullRoomUrl} />
          </div>
          <p className="text-muted-foreground mb-2">Or share this Room ID:</p>
          <div className="flex items-center gap-2 bg-background/50 border border-border px-4 py-2 rounded-lg">
            <span className="text-2xl font-code text-primary">{roomId}</span>
            <Button variant="ghost" size="icon" onClick={copyRoomId}>
              <Copy className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>

        {/* Right Panel: Players */}
        <div className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-6">
          <h2 className="text-2xl font-headline text-secondary mb-4 flex items-center gap-2">
            <Users className="w-6 h-6"/>
            Players in Room ({players.length}/4)
          </h2>
          <div className="space-y-3">
            {players.map((player, index) => (
              <div key={index} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border">
                <span className="font-semibold text-foreground">{player}</span>
                {index === 0 && <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-full">Admin</span>}
              </div>
            ))}
          </div>
           {isAdmin && (
              <Button 
                className="w-full mt-6 h-12 text-lg"
                disabled={players.length < 2}
              >
                Start Battle ({players.length}/2)
              </Button>
           )}
        </div>
      </div>
    </div>
  );
}
