"use client";

import { bugHuntChallenges } from '@/lib/bug-hunts-data';
import { BountyPoster } from '@/components/bug-hunts/BountyPoster';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BugHuntsHubPage() {
  return (
    <div 
        className="min-h-screen text-foreground p-4 sm:p-6 lg:p-8"
        style={{
            backgroundColor: '#5a3a22', // Dirt brown background
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23442d1a\' fill-opacity=\'0.3\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
        }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-12"
        >
            <div className="bg-[#3a2d1d]/80 backdrop-blur-sm border-2 border-[#21180d] p-4 rounded-md">
                <h1 className="text-4xl font-pixel text-[#f7e097]">
                    Bug Bounty Board
                </h1>
                <p className="text-[#c8a666] mt-2 font-body">
                    Choose a case file and squash some bugs to earn rewards.
                </p>
            </div>
            <Button asChild variant="outline" className="pixel-box bg-[#7a583a] text-white hover:bg-[#9d724d] h-14 text-lg font-pixel">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Home
                </Link>
            </Button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bugHuntChallenges.map((hunt, index) => (
            <BountyPoster key={hunt.id} hunt={hunt} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
