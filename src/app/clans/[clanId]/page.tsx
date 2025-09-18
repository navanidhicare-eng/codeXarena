
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getClanById, getClanMessages, Clan, ClanMember } from '@/lib/mock-clans-data';
import { ArrowLeft, MessageSquare, Sword, Users, Send, Settings, Mic, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClanBanner } from '@/components/clans/ClanBanner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const roleColors: { [key: string]: string } = {
    Admin: 'text-yellow-400',
    Moderator: 'text-blue-400',
    Member: 'text-white',
};

export default function ClanStrongholdPage() {
    const params = useParams();
    const router = useRouter();
    const clanId = params.clanId as string;

    const [clan, setClan] = useState<Clan | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if(clanId) {
            const foundClan = getClanById(clanId);
            if(foundClan) {
                setClan(foundClan);
                setMessages(getClanMessages(clanId));
            } else {
                router.push('/clans');
            }
        }
    }, [clanId, router]);

    if (!clan) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Stronghold...</div>
    }

    const handleSendMessage = () => {
        if(newMessage.trim() === '') return;
        const newMsg = {
            id: `msg-${Date.now()}`,
            clanId: clan.id,
            author: { name: 'SyntaxSleuth', role: 'Admin', avatarUrl: 'https://picsum.photos/seed/player1/40/40' },
            content: newMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
    }

    return (
        <div 
            className="min-h-screen font-pixel"
            style={{
                backgroundColor: '#262626',
                backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
                    url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v12H0V0zm24 0h12v12H24V0zm24 0h12v12H48V0zm24 0h12v12H72V0zM12 12h12v12H12V12zm24 0h12v12H36V12zm24 0h12v12H60V12zm24 0h12v12H84V12zm-48 12h12v12H36V24zm24 0h12v12H60V24zm-12 12h12v12H48V36z' fill='%231a1a1a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")
                `
            }}
        >
            <div className="flex h-screen">
                {/* Left Panel: Room List */}
                <aside className="w-64 bg-black/50 p-4 flex flex-col pixel-box-inset">
                    <div className="flex items-center gap-4 mb-6">
                        <ClanBanner symbol={<Sword/>} bgColor={clan.banner.bgColor} size="medium" />
                        <div>
                             <h1 className="text-xl text-white">{clan.name}</h1>
                             <Badge className={clan.isPublic ? "bg-green-700/50 text-green-300 border-green-500" : "bg-red-700/50 text-red-300 border-red-500"}>
                                {clan.isPublic ? 'Public' : 'Private'}
                             </Badge>
                        </div>
                    </div>
                    <Separator className="bg-gray-600 mb-4" />
                    <nav className="flex flex-col gap-2 flex-grow">
                        <h2 className="text-gray-400 uppercase text-sm px-2 mb-2">Text Channels</h2>
                        <a href="#" className="flex items-center gap-2 p-2 rounded bg-gray-700/50 text-white">
                            <MessageSquare className="w-5 h-5"/> # general
                        </a>
                        <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700/50 text-gray-300">
                            <MessageSquare className="w-5 h-5"/> # announcements
                        </a>
                         <Link href={`/clans/${clanId}/forge`} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700/50 text-gray-300">
                            <Sword className="w-5 h-5 text-red-400"/> The Forge
                        </Link>
                        <h2 className="text-gray-400 uppercase text-sm px-2 mt-6 mb-2">Voice Channels</h2>
                         <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700/50 text-gray-300">
                            <Headphones className="w-5 h-5"/> Voice Chat
                        </a>
                    </nav>
                     <div className="mt-auto">
                        <Button asChild variant="outline" className="w-full pixel-box bg-[#5a3a22] hover:bg-[#7a583a] text-white">
                             <Link href="/clans"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Map</Link>
                        </Button>
                     </div>
                </aside>

                {/* Center Panel: Chat */}
                <main className="flex-1 flex flex-col bg-black/30">
                    <header className="p-4 pixel-box-inset bg-gray-800/50 flex justify-between items-center">
                        <h2 className="text-2xl text-white flex items-center gap-2"><MessageSquare/> # general</h2>
                        <div className="flex gap-4">
                            <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50 hover:text-white"><Users /></Button>
                            <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50 hover:text-white"><Settings /></Button>
                        </div>
                    </header>
                    <ScrollArea className="flex-1 p-4">
                         <div className="space-y-6">
                            {messages.map((msg, index) => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-4"
                                >
                                    <Avatar className="w-12 h-12 pixel-box-inset p-1 bg-gray-800">
                                        <AvatarImage src={msg.author.avatarUrl} />
                                        <AvatarFallback>{msg.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">
                                            <span className={roleColors[msg.author.role]}>{msg.author.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </p>
                                        <p className="text-gray-200 font-body text-base">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                         </div>
                    </ScrollArea>
                    <footer className="p-4 bg-gray-900/50">
                        <div className="flex items-center gap-2 pixel-box bg-gray-800 p-2">
                             <Input 
                                placeholder="Message #general"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="bg-transparent border-none text-white font-body text-base focus-visible:ring-0"
                             />
                             <Button size="icon" onClick={handleSendMessage} className="pixel-box bg-emerald-600 hover:bg-emerald-500 w-12 h-12">
                                <Send />
                             </Button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
