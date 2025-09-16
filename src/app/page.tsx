
"use client";

import { LandingHero } from "@/components/landing/LandingHero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const { connectAndJoin } = useContext(AppContext);
    const router = useRouter();

    const handleEnterArena = (playerName: string) => {
        if (!playerName.trim()) return;
        connectAndJoin(playerName.trim());
        router.push('/matchmaking');
    };

    return (
        <div className="w-full bg-background text-foreground">
            <main className="min-h-screen flex flex-col">
                <LandingHero onEnterArena={handleEnterArena} />
                <HowItWorks />
                <Features />
                <FinalCTA onEnterArena={handleEnterArena} />
            </main>
        </div>
    );
}
