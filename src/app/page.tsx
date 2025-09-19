
import { LandingHero } from "@/components/landing/LandingHero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function LandingPage() {
    return (
        <div className="w-full bg-background text-foreground">
            <main className="min-h-screen flex flex-col">
                <LandingHero />
                <HowItWorks />
                <Features />
                <FinalCTA />
            </main>
        </div>
    );
}
