
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldPlus, Search, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { myClans } from '@/lib/mock-clans-data';
import { ClanCard } from '@/components/clans/ClanCard';

export default function ClansHubPage() {
  return (
    <div 
        className="min-h-screen text-white p-4 sm:p-6 lg:p-8"
        style={{
            backgroundColor: '#3a543a',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%232c402c\' fill-opacity=\'0.4\'%3E%3Cpath opacity=\'.5\' d=\'M96 95h4v1h-4v-1zm-7 5h4v1h-4v-1zm7 5h4v1h-4v-1zm-7 5h4v1h-4v-1zm7 5h4v1h-4v-1zm-7 5h4v1h-4v-1zm7 5h4v1h-4v-1zm-7 5h4v1h-4v-1zm7 5h4v1h-4v-1zm-7 5h4v1h-4v-1zm7 5h4v1h-4v-1zm-7 5h4v1h-4v-1zm7 5h4v1h-4v-1zm-7 5h4v1h-4v-1zm7 5h4v1h-4v-1zm-7 5h4v1h-4v-1z\'/%3E%3Cpath d=\'M6 5V0h4v5H6zM6 15V10h4v5H6zM6 25V20h4v5H6zM6 35V30h4v5H6zM6 45V40h4v5H6zM6 55V50h4v5H6zM6 65V60h4v5H6zM6 75V70h4v5H6zM6 85V80h4v5H6zM6 95V90h4v5H6zM0 95h4v5H0v-5zM10 95h4v5h-4v-5zM20 95h4v5h-4v-5zM30 95h4v5h-4v-5zM40 95h4v5h-4v-5zM50 95h4v5h-4v-5zM60 95h4v5h-4v-5zM70 95h4v5h-4v-5zM80 95h4v5h-4v-5z\'/%3E%E3C/g%3E%3C/g%3E%3C/svg%3E")',
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
            <Map className="w-24 h-24 text-yellow-300 mx-auto mb-4" />
            <h1 className="text-5xl font-pixel text-white mb-2" style={{ textShadow: '4px 4px #2c402c' }}>
                Clan Overworld
            </h1>
            <p className="text-lg text-green-200 font-body">Your strongholds and alliances await.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#3a2d1d]/80 backdrop-blur-sm border-4 border-[#21180d] p-6 rounded-lg text-center"
            >
                <h2 className="font-pixel text-2xl text-yellow-400 mb-4">Forge a New Clan</h2>
                <p className="text-white/80 mb-6">Build a new headquarters and invite your allies to join your cause.</p>
                <Button asChild className="pixel-box bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-xl w-full">
                    <Link href="/clans/new">
                        <ShieldPlus className="mr-3 h-7 w-7" />
                        Forge Clan
                    </Link>
                </Button>
            </motion.div>
             <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#3a2d1d]/80 backdrop-blur-sm border-4 border-[#21180d] p-6 rounded-lg text-center"
            >
                <h2 className="font-pixel text-2xl text-yellow-400 mb-4">Find a Clan</h2>
                <p className="text-white/80 mb-6">Search for public clans to join or enter an invite code.</p>
                <Button className="pixel-box bg-blue-600 hover:bg-blue-500 text-white h-14 text-xl w-full">
                    <Search className="mr-3 h-7 w-7" />
                    Search Clans
                </Button>
            </motion.div>
        </div>

        <div>
            <h2 className="font-pixel text-3xl text-center text-white mb-6" style={{ textShadow: '3px 3px #2c402c' }}>Your Strongholds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClans.map((clan, index) => (
                    <ClanCard key={clan.id} clan={clan} index={index} />
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
}

