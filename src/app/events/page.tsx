"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockEventsData } from '@/lib/mock-events-data';
import { EventPoster } from '@/components/EventPoster';

export default function EventsPage() {
  return (
    <div 
        className="min-h-screen text-white p-4 sm:p-6 lg:p-8"
        style={{
            backgroundColor: '#3a2d1d', // Dark oak wood color
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%232c2115\' fill-opacity=\'0.4\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2l-10 10V8zm0 4l12-12h2l-14 14V12zm0 4l16-16h2l-18 18V16zm0 4l20-20h2l-22 22V20zm0 4l24-24h2l-26 26V24zm0 4l28-28h2l-30 30V28zm0 4l32-32h2l-34 34V32zm0 4l36-36h2l-38 38V36z\'/%3E%3C/g%3E%3C/svg%3E")'
        }}
    >
        <div className="absolute top-6 left-6 z-10">
            <Button asChild className="pixel-box bg-[#5a3a22] hover:bg-[#7a583a] text-white h-12 text-lg">
                <Link href="/">Back to Home</Link>
            </Button>
        </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
        >
            <header className="text-center mb-12">
                <div className="inline-block p-4 bg-[#4a3a2a] pixel-box">
                    <h1 className="text-5xl font-pixel text-yellow-300" style={{ textShadow: '4px 4px #2c2115' }}>
                        The Event Board
                    </h1>
                </div>
            </header>

            <div className="mb-8 p-4 pixel-box-inset bg-[#2c2115] flex flex-wrap items-center justify-center gap-4">
                 <SlidersHorizontal className="text-yellow-300 w-6 h-6"/>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] pixel-box bg-[#5a3a22] text-white h-12">
                        <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent className="pixel-box bg-black text-white border-yellow-400">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="competition">Competition</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                </Select>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] pixel-box bg-[#5a3a22] text-white h-12">
                        <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="pixel-box bg-black text-white border-yellow-400">
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                </Select>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] pixel-box bg-[#5a3a22] text-white h-12">
                        <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent className="pixel-box bg-black text-white border-yellow-400">
                        <SelectItem value="all">Any Date</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockEventsData.map((event, index) => (
                    <EventPoster key={event.id} event={event} index={index} />
                ))}
            </div>
      </motion.div>
    </div>
  );
}
