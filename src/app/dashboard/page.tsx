"use client";

import { motion } from "framer-motion";
import { DailyTasks } from "@/components/DailyTasks";
import { LeaderboardView } from "@/components/LeaderboardView";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { PixelatedBackground } from "@/components/PixelatedBackground";

export default function DashboardPage() {
    return (
        <div className="relative min-h-screen w-full bg-background text-foreground p-4 sm:p-6 lg:p-8 overflow-hidden">
            <PixelatedBackground />
            <div className="relative z-10 max-w-7xl mx-auto space-y-12">
                 <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl font-pixel text-white text-center" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)'}}>
                        Your Dashboard
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <DailyTasks />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <UpcomingEvents />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <LeaderboardView />
                </motion.div>
            </div>
        </div>
    );
}
