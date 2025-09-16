
"use client";

import { LandingHero } from "@/components/landing/LandingHero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const { connectAndJoin, createRoom, playerName: existingPlayerName, gameState } = useContext(AppContext);
    const router = useRouter();

    useEffect(() => {
        if (gameState?.matchId) {
            router.push(`/arena/${gameState.matchId}`);
        }
    }, [gameState, router]);


    const handleEnterArena = (playerName: string) => {
        if (!playerName.trim()) return;
        connectAndJoin(playerName.trim());
        router.push('/matchmaking');
    };

    const handleCreateRoom = (playerName: string) => {
        if (!playerName.trim()) return;
        createRoom({ playerName: playerName.trim() });
    }

    return (
        <div className="w-full bg-background text-foreground">
            <main className="min-h-screen flex flex-col">
                <LandingHero onEnterArena={handleEnterArena} onCreateRoom={handleCreateRoom} />
                <HowItWorks />
                <Features />
                <FinalCTA onEnterArena={handleEnterArena} />
            </main>
        </div>
    );
}
