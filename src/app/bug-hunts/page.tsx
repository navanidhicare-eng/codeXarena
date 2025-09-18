"use client";

import { useRouter } from 'next/navigation';
import { bugHuntChallenges } from '@/lib/bug-hunts-data';
import { motion } from 'framer-motion';
import { ArrowLeft, Bug, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BugHuntsHubPage() {
  const router = useRouter();

  const handleStartRandomHunt = () => {
    const randomHunt = bugHuntChallenges[Math.floor(Math.random() * bugHuntChallenges.length)];
    router.push(`/bug-hunts/${randomHunt.id}`);
  };

  return (
    <div 
        className="min-h-screen text-foreground p-4 sm:p-6 lg:p-8 flex items-center justify-center"
        style={{
            backgroundColor: '#5a3a22', // Dirt brown background
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23442d1a\' fill-opacity=\'0.3\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
        }}
    >
      <div className="absolute top-6 left-6">
        <Button asChild variant="outline" className="pixel-box bg-[#7a583a] text-white hover:bg-[#9d724d] h-14 text-lg font-pixel">
            <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
            </Link>
        </Button>
      </div>

      <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-[#3a2d1d]/80 backdrop-blur-sm border-4 border-[#21180d] p-8 rounded-lg text-center shadow-2xl"
        >
            <Bug className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-pixel text-white mb-2">
                Bug Hunter
            </h1>
            <p className="text-[#c8a666] mt-2 font-body max-w-md mx-auto mb-8">
                Ready to squash some bugs? You'll be assigned a random challenge. Find the bug, fix the code, and claim your XP!
            </p>

            <Button
              onClick={handleStartRandomHunt}
              className="pixel-box bg-emerald-600 hover:bg-emerald-500 text-white h-16 text-2xl font-pixel w-full"
            >
              <Dices className="mr-4 h-8 w-8" />
              Start a Random Hunt
            </Button>
        </motion.div>
    </div>
  );
}
