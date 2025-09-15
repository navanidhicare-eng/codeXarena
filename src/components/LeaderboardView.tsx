
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Gem, Medal, Trophy } from "lucide-react";
import { mockLeaderboardData, regionData, currentUser, LeaderboardPlayer } from "@/lib/mock-leaderboard-data";
import { cn } from "@/lib/utils";

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Gem className="w-5 h-5 text-yellow-700" />;
  return <span className="text-muted-foreground w-5 text-center">{rank}</span>;
};

export function LeaderboardView() {
  const [continent, setContinent] = useState("North America");
  const [country, setCountry] = useState("USA");
  const [filteredData, setFilteredData] = useState<LeaderboardPlayer[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardPlayer | undefined>(undefined);
  
  const countryOptions = useMemo(() => {
    return regionData[continent as keyof typeof regionData] || [];
  }, [continent]);

  useEffect(() => {
    let data = mockLeaderboardData;
    if (continent !== 'Global') {
      data = data.filter(p => p.continent === continent);
      if (country && country !== 'All') {
        data = data.filter(p => p.country === country);
      }
    }
    
    // Re-calculate ranks for the filtered view
    const rankedData = data.sort((a, b) => b.xp - a.xp).map((player, index) => ({
      ...player,
      rank: index + 1, // This is the view-specific rank
    }));

    setFilteredData(rankedData);
    setUserRank(mockLeaderboardData.find(p => p.id === currentUser.id));

  }, [continent, country]);

  useEffect(() => {
    // Reset country when continent changes
    if(continent === 'Global') {
        setCountry('All');
    } else {
        const countries = regionData[continent as keyof typeof regionData];
        if (countries.length > 0) {
            setCountry(countries[0]);
        }
    }
  }, [continent]);

  return (
    <div className="bg-panel backdrop-blur-md border border-primary/20 rounded-lg p-6 w-full max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Global Rankings</h1>
        <div className="flex gap-2">
          <Select value={continent} onValueChange={setContinent}>
            <SelectTrigger className="w-[180px] bg-transparent border-secondary/50">
              <SelectValue placeholder="Select Continent" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(regionData).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={country} onValueChange={setCountry} disabled={continent === 'Global'}>
            <SelectTrigger className="w-[180px] bg-transparent border-secondary/50">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Countries</SelectItem>
              {countryOptions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="relative">
        <ScrollArea className="h-96 pr-4">
          <ul className="space-y-2">
            {filteredData.map((player, index) => (
              <li
                key={player.id}
                className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-colors bg-background/30 border border-transparent",
                    player.id === currentUser.id && "border-primary/50 bg-primary/10"
                )}
              >
                <div className="w-8 flex justify-center">
                    <RankIcon rank={player.rank} />
                </div>
                <Avatar className="w-10 h-10 border-2 border-secondary/50">
                  <AvatarImage src={player.avatarUrl} alt={player.username} />
                  <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground flex-grow">{player.username}</span>
                <span className="font-code text-primary font-bold">{player.xp.toLocaleString()} XP</span>
              </li>
            ))}
          </ul>
        </ScrollArea>

        {userRank && (
            <div className="sticky bottom-0 left-0 right-0 mt-4 bg-primary/20 backdrop-blur-sm p-3 rounded-lg border-2 border-primary shadow-primary-glow flex items-center gap-4">
                <div className="w-8 flex justify-center">
                    <RankIcon rank={userRank.rank} />
                </div>
                <Avatar className="w-10 h-10 border-2 border-secondary/50">
                <AvatarImage src={userRank.avatarUrl} alt={userRank.username} />
                <AvatarFallback>{userRank.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground flex-grow">{userRank.username} (You)</span>
                <span className="font-code text-primary font-bold">{userRank.xp.toLocaleString()} XP</span>
            </div>
        )}
      </div>
    </div>
  );
}
