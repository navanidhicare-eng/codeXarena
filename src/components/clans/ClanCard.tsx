
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Lock, Eye } from 'lucide-react';
import type { Clan } from '@/lib/mock-clans-data';
import { ClanBanner } from './ClanBanner';
import { Sword } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ClanCard({ clan, index }: { clan: Clan, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link href={`/clans/${clan.id}`} className="block h-full">
        <div className="pixel-box bg-[#5a3a22] hover:bg-[#7a583a] text-white p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <ClanBanner symbol={<Sword/>} bgColor={clan.banner.bgColor} size="medium" />
              <div className="text-right">
                <h3 className="font-pixel text-2xl text-yellow-300">{clan.name}</h3>
                <div className="flex items-center justify-end gap-2 text-green-200 mt-1">
                   {clan.isPublic ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                   <span>{clan.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>
            <p className="font-body text-base text-yellow-100/80 mb-6">{clan.description}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-200" />
                <span className="font-pixel text-lg">{clan.memberCount} Members</span>
            </div>
            <div className="flex -space-x-4">
                <TooltipProvider>
                    {clan.members.slice(0, 3).map(member => (
                         <Tooltip key={member.name}>
                            <TooltipTrigger asChild>
                                <Avatar className="w-10 h-10 pixel-box-inset p-0.5 bg-gray-800">
                                    <AvatarImage src={member.avatarUrl} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent className="pixel-box bg-black text-white border-yellow-400">
                                <p>{member.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
