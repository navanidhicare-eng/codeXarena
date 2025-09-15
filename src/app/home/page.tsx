
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";

export default function HomePage() {
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { connectAndJoin } = useContext(AppContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!playerNameInput.trim() || isLoading) return;

    setIsLoading(true);
    connectAndJoin(playerNameInput.trim());
    router.push('/matchmaking');
  };

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden relative">
       <div className="absolute top-6 right-6">
        <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12 border-primary/50 hover:bg-primary/10">
          <Link href="/profile">
            <User className="h-6 w-6 text-primary" />
            <span className="sr-only">Profile</span>
          </Link>
        </Button>
      </div>

      <div className="text-center">
        <h1 className="font-headline font-bold text-7xl md:text-8xl bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text animate-pulse-slow">
          CodeVerse
        </h1>
        <p className="font-headline text-secondary text-xl mt-2">
          Stop Grinding. Start Battling.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 w-full max-w-sm flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Enter your gladiator name"
          value={playerNameInput}
          onChange={(e) => setPlayerNameInput(e.target.value)}
          className="h-14 text-lg text-center bg-transparent border-2 border-secondary/50 rounded-lg transition-all duration-300 focus:border-primary focus-visible:ring-0 focus:scale-105"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!playerNameInput.trim() || isLoading}
          className="h-14 text-lg font-bold transition-all duration-300 bg-primary hover:bg-primary/80 hover:shadow-primary-glow disabled:bg-muted disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Entering the Arena...
            </>
          ) : (
            "Find 1v1 Match"
          )}
        </Button>
      </form>
    </main>
  );
}
