
"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Copy, Users, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

const QRCode = ({ text, qrCodeRef }: { text: string; qrCodeRef: React.RefObject<HTMLDivElement> }) => {
  if (!text) return null;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  return (
    <div ref={qrCodeRef} className="p-2 bg-white rounded-lg">
        <Image src={qrUrl} alt="Room QR Code" width={200} height={200} className="rounded-md" priority />
    </div>
  );
};

export default function RoomWaitingPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { playerName, roomPlayers, isRoomAdmin, startBattle } = useContext(AppContext);
  const { toast } = useToast();
  const router = useRouter();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !playerName) {
      router.push('/');
    }
  }, [playerName, router, isMounted]);

  const fullRoomUrl = isMounted ? `${window.location.origin}/join/${roomId}` : '';
  
  const copyRoomId = () => {
    if(!fullRoomUrl) return;
    navigator.clipboard.writeText(fullRoomUrl);
    toast({
      title: "Room URL Copied!",
      description: "You can now share it with your friends.",
    });
  };

  const downloadQRCode = () => {
    const qrImage = qrCodeRef.current?.querySelector('img');
    if (qrImage) {
        const link = document.createElement('a');
        link.href = qrImage.src;
        link.download = `codexarena-room-${roomId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
         toast({
            title: "QR Code Downloaded!",
        });
    }
  };

  const shareOnWhatsApp = () => {
    if(!fullRoomUrl) return;
    const message = encodeURIComponent(`Join my CodeXarena battle! Click the link to enter the room: ${fullRoomUrl}`);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">Waiting Room</h1>
      <p className="text-muted-foreground mb-8">Share the Room URL or QR Code with your opponent to join.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Left Panel: Info */}
        <div className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-headline text-secondary mb-4">Invite Your Opponent</h2>
           <div className="mb-6 h-[216px]">
             <QRCode text={fullRoomUrl} qrCodeRef={qrCodeRef} />
          </div>
          <div className="flex items-center gap-2 bg-background/50 border border-border px-4 py-2 rounded-lg mb-4">
            <span className="text-lg font-code text-primary truncate">{fullRoomUrl}</span>
            <Button variant="ghost" size="icon" onClick={copyRoomId}>
              <Copy className="h-5 w-5 text-primary" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadQRCode} variant="outline" className="border-secondary/50 hover:bg-secondary/10 hover:text-secondary">
                <Download className="mr-2 h-4 w-4" />
                Download QR
            </Button>
             <Button onClick={shareOnWhatsApp} className="bg-green-500 hover:bg-green-600 text-white">
                <Share2 className="mr-2 h-4 w-4" />
                Share on WhatsApp
            </Button>
          </div>
        </div>

        {/* Right Panel: Players */}
        <div className="bg-panel backdrop-blur-md border border-secondary/20 rounded-lg p-6">
          <h2 className="text-2xl font-headline text-secondary mb-4 flex items-center gap-2">
            <Users className="w-6 h-6"/>
            Players in Room ({roomPlayers.length}/2)
          </h2>
          <div className="space-y-3 min-h-[150px]">
            {roomPlayers.map((player, index) => (
              <div key={index} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border">
                <span className="font-semibold text-foreground">{player}</span>
                {index === 0 && <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-full">Admin</span>}
              </div>
            ))}
            {roomPlayers.length < 2 && (
              <div className="flex items-center justify-center text-muted-foreground p-3 h-full">
                Waiting for opponent...
              </div>
            )}
          </div>
           {isRoomAdmin && (
              <Button 
                className="w-full mt-6 h-12 text-lg"
                disabled={roomPlayers.length < 2}
                onClick={() => startBattle(roomId)}
              >
                Start Battle ({roomPlayers.length}/2)
              </Button>
           )}
           {!isRoomAdmin && roomPlayers.length > 0 && (
             <div className="text-center mt-6 text-muted-foreground">
                Waiting for the admin to start the battle...
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
