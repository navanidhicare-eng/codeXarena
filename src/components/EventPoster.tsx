"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import type { Event } from '@/lib/mock-events-data';

export function EventPoster({ event, index }: { event: Event, index: number }) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 50, rotateZ: (Math.random() - 0.5) * 4 }}
        animate={{ opacity: 1, y: 0, rotateZ: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.03, y: -8, transition: { duration: 0.2 } }}
        className="h-full"
    >
        <div 
            className="h-full flex flex-col p-1 bg-[#e0d6b3] border-4 border-[#2c2115] relative"
            style={{
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
                backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAMqADAAQAAAABAAAAMgAAAADSPQyWAAAB5ElEQVRoBe2av0rDQBgHf52sOIqD4OLg4iA4+Cg4OvgZ/BOL4Kfg4iKo4ObgJ+jgJ+jgJ+jgJzjoiI0iTnEppQuL3C3tQ/J3l233P//d3X07oFhf2B1+n24F4FADwAUAFQAcAFwA0AEABwA9ADD2Ha98dwAAcLi/3u/3GgC4VU3DRIBVEQAAhC67F2y585E/4e/s+jsAYPeyQ5FQAAAQwos+9x0AXG4dYyQCAAAh/Pz9/X0WAGA2IloEAAAhVHW0bVuI2xOBg/gBQH/N389f5xMAgHh/jwBYgL+Aow9gKACoAOACgA4AOADoAGD6f+5/h+GqAMACgA4AOgDoAKADAA4AKgD4vQFYgL+AnY9gKACoAOACgA4AOADoAGD6v3b3J8y7GAAgO/f0/zYAgGqNFgEAQAgBAB8A3A4A/yYA4J0VAQBACO3YBjI5AGD3s4MhUAAAEEJ4eXk5CgAwmxG/SwAAEKpqmubJ1fU0AHA7A7OKcQEAQAgBAAD+h/wBwG3bsvR/AwDweyMAVoC/gO0ewVAAUAEABwAcAHQA0AEAx/Yh/wAATk5OVgQAYFbrrSgCACClce7lcgCAU1QvAMYJADk5ORlFAPgGjG90QXpAW5gAAAAASUVORK5CYII=")'
            }}
        >
             {/* Tack */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#4a4a4a] rounded-full pixel-box-inset" />

            <div className="relative w-full h-32">
                <Image 
                    src={event.headerImageUrl} 
                    alt={`${event.title} banner`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover pixel-box"
                />
            </div>
            
            <div className="p-4 flex flex-col flex-grow bg-[#f5efd9] m-2 pixel-box-inset">
                 <h3 className="font-pixel text-xl text-[#3a2d1d] mb-3">{event.title}</h3>

                 <div className="space-y-2 mb-4 font-body text-sm text-[#5a3a22]">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/><span>{event.date}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/><span>{event.location}</span></div>
                    {event.prizePool && <div className="flex items-center gap-2"><Trophy className="w-4 h-4"/><span>{event.prizePool}</span></div>}
                 </div>

                 <p className="font-body text-sm text-[#3a2d1d] mb-4 flex-grow">{event.description}</p>
                 
                 <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.map(tag => (
                        <Badge key={tag} className="pixel-box bg-blue-600/20 text-blue-900 border-blue-900/50">{tag}</Badge>
                    ))}
                 </div>
                 
                 <Button className="w-full mt-auto pixel-box bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-lg">
                    Learn More
                 </Button>
            </div>
        </div>
    </motion.div>
  );
}
