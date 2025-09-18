"use client";

import { Bug, Pickaxe, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { BugHuntChallenge } from '@/lib/bug-hunts-data';

const difficultyMap = {
    Easy: { icon: <Pickaxe className="w-4 h-4 mr-1" />, color: 'bg-green-700/50 text-green-300 border-green-500' },
    Medium: { icon: <><Skull className="w-4 h-4 mr-1" /><Skull className="w-4 h-4 mr-1" /></>, color: 'bg-yellow-700/50 text-yellow-300 border-yellow-500' },
    Hard: { icon: <><Skull className="w-4 h-4 mr-1" /><Skull className="w-4 h-4 mr-1" /><Skull className="w-4 h-4 mr-1" /></>, color: 'bg-red-700/50 text-red-300 border-red-500' },
};


export function BountyPoster({ hunt, index }: { hunt: BugHuntChallenge, index: number }) {

    const langColors: { [key: string]: string } = {
        javascript: 'bg-yellow-400/20 text-yellow-300 border-yellow-500/50',
        python: 'bg-blue-400/20 text-blue-300 border-blue-500/50',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateZ: (Math.random() - 0.5) * 5 }}
            animate={{ opacity: 1, y: 0, rotateZ: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10, rotateZ: (Math.random() - 0.5) * 2, transition: { duration: 0.2 } }}
        >
            <Link href={`/bug-hunts/${hunt.id}`} className="block">
                <div className="h-full bg-[#3a2d1d] border-4 border-[#21180d] rounded-lg p-6 flex flex-col text-center shadow-lg transform transition-transform">
                    <div className="border-b-2 border-dashed border-[#574834] pb-4 mb-4">
                        <h2 className="font-pixel text-xl text-[#f7e097] uppercase">Wanted: Bug Squashed</h2>
                    </div>

                    <Bug className="w-20 h-20 text-[#c8a666] mx-auto my-4" />

                    <h3 className="font-pixel text-2xl text-white my-2">{hunt.problemId}</h3>
                    
                    <div className="flex justify-center items-center my-3">
                        <Badge className={`font-pixel text-sm flex items-center ${difficultyMap[hunt.difficulty].color}`}>
                            {difficultyMap[hunt.difficulty].icon}
                            {hunt.difficulty}
                        </Badge>
                    </div>

                    <div className="flex-grow" />

                    <div className="flex justify-center gap-2 my-4">
                        {hunt.availableLanguages.map(lang => (
                            <Badge key={lang} variant="outline" className={`font-code ${langColors[lang]}`}>
                                {lang}
                            </Badge>
                        ))}
                    </div>

                    <div className="mt-4 border-t-2 border-dashed border-[#574834] pt-4">
                        <p className="font-pixel text-lg text-[#ffd700]">Reward</p>
                        <p className="font-pixel text-3xl text-white">+{hunt.xpReward} XP</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
