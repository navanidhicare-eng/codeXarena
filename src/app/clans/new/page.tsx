
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Palette, Eye, Lock, ArrowLeft, Check, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClanBanner } from '@/components/clans/ClanBanner';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const bannerSymbols = [
    { id: 'sword', icon: <Swords className="w-12 h-12" /> },
    { id: 'shield', icon: <Shield className="w-12 h-12" /> },
    { id: 'bug', icon: <Check className="w-12 h-12" /> },
];

const bannerColors = ['#dc2626', '#2563eb', '#16a34a', '#facc15', '#9333ea', '#ea580c'];

export default function ForgeClanPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [clanName, setClanName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [selectedColor, setSelectedColor] = useState(bannerColors[0]);
    const [selectedSymbol, setSelectedSymbol] = useState(bannerSymbols[0]);

    const handleForgeClan = () => {
        if (clanName.trim().length < 3) {
            toast({
                variant: 'destructive',
                title: "Invalid Name",
                description: "Clan name must be at least 3 characters long.",
            });
            return;
        }
        // Mock success
        toast({
            title: "Clan Forged!",
            description: `Your new clan "${clanName}" has been established.`,
            variant: 'default',
            className: 'bg-green-500/20 border-green-500 text-white'
        });
        router.push('/clans');
    }

  return (
    <div 
        className="min-h-screen text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center"
        style={{
            backgroundColor: '#4a4a4a', // Stone background
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23383838\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
    >
      <div className="absolute top-6 left-6 z-10">
        <Button asChild className="pixel-box bg-[#5a3a22] hover:bg-[#7a583a] text-white h-12 text-lg">
            <Link href="/clans"><ArrowLeft className="mr-2"/> Back to Overworld</Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-2xl bg-[#1a140e]/80 backdrop-blur-sm p-8 pixel-box-inset"
      >
        <h1 className="font-pixel text-4xl text-center text-yellow-400 mb-8">Forge a New Clan</h1>
        
        <div className="space-y-8">
            {/* Clan Name */}
            <div className="p-4 bg-black/30 pixel-box">
                 <label className="font-pixel text-xl text-yellow-300 mb-2 block">Clan Name</label>
                 <Input 
                    placeholder="Name your clan..."
                    value={clanName}
                    onChange={(e) => setClanName(e.target.value)}
                    className="font-code text-white bg-gray-800 border-2 border-gray-600 h-14 text-xl"
                 />
            </div>

            {/* Banner Creator */}
            <div className="p-4 bg-black/30 pixel-box">
                <label className="font-pixel text-xl text-yellow-300 mb-4 block">Clan Banner</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex justify-center items-center">
                        <ClanBanner 
                            symbol={selectedSymbol.icon} 
                            bgColor={selectedColor} 
                            size="large"
                        />
                    </div>
                    <div>
                        <div className="mb-4">
                            <h3 className="font-pixel text-lg text-white mb-2 flex items-center gap-2"><Palette/> Color</h3>
                            <div className="flex gap-2">
                                {bannerColors.map(color => (
                                    <button 
                                        key={color} 
                                        onClick={() => setSelectedColor(color)}
                                        className={cn("w-10 h-10 pixel-box", selectedColor === color && 'ring-4 ring-yellow-400')}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-pixel text-lg text-white mb-2 flex items-center gap-2"><Shield/> Symbol</h3>
                            <div className="flex gap-2">
                                {bannerSymbols.map(symbol => (
                                    <button 
                                        key={symbol.id} 
                                        onClick={() => setSelectedSymbol(symbol)}
                                        className={cn("w-14 h-14 pixel-box flex items-center justify-center", selectedSymbol.id === symbol.id ? 'bg-yellow-600' : 'bg-gray-600')}
                                    >
                                        {symbol.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Setting */}
             <div className="p-4 bg-black/30 pixel-box">
                <label className="font-pixel text-xl text-yellow-300 mb-4 block">Clan Privacy</label>
                <div 
                    onClick={() => setIsPublic(!isPublic)}
                    className="flex pixel-box bg-gray-800 border-gray-600 h-16 text-lg cursor-pointer relative"
                >
                    <motion.div 
                        layout 
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute inset-0 w-1/2 h-full bg-emerald-600 pixel-box"
                        style={{ left: isPublic ? '0%' : '50%' }}
                    />
                    <div className="w-1/2 z-10 flex items-center justify-center gap-2">
                       <Eye /> Open Gates
                    </div>
                    <div className="w-1/2 z-10 flex items-center justify-center gap-2">
                       <Lock /> Guarded
                    </div>
                </div>
             </div>

             <Button 
                onClick={handleForgeClan}
                className="w-full pixel-box bg-emerald-600 hover:bg-emerald-500 h-16 text-2xl mt-8"
            >
                Forge Clan
            </Button>
        </div>
      </motion.div>
    </div>
  );
}

