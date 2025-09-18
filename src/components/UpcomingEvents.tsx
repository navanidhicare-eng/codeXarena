"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockEventsData } from "@/lib/mock-events-data";
import { EventPoster } from "@/components/EventPoster";
import { ArrowRight, Megaphone } from "lucide-react";

export function UpcomingEvents() {
    const featuredEvents = mockEventsData.slice(0, 4);

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-pixel text-white flex items-center gap-3" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.5)'}}>
                    <Megaphone className="w-8 h-8"/>
                    Latest Tidings
                </h2>
                <Button asChild className="pixel-box bg-[#5a3a22] hover:bg-[#7a583a] text-white h-12">
                     <Link href="/events">
                        View All Events <ArrowRight className="ml-2"/>
                     </Link>
                </Button>
            </div>
            <Carousel opts={{
                align: "start",
                loop: true,
            }} className="w-full">
                <CarouselContent>
                    {featuredEvents.map((event, index) => (
                        <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                             <div className="p-1">
                                <EventPoster event={event} index={index} />
                             </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="pixel-box bg-[#5a3a22] text-white hover:bg-[#7a583a]"/>
                <CarouselNext className="pixel-box bg-[#5a3a22] text-white hover:bg-[#7a583a]"/>
            </Carousel>
        </div>
    );
}
