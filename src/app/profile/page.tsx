"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsShowcase } from "@/components/profile/StatsShowcase";
import { BadgeDisplay } from "@/components/profile/BadgeDisplay";
import { MatchHistory } from "@/components/profile/MatchHistory";
import {
  mockProfileData,
  mockStatsData,
  mockBadgeData,
  mockMatchHistory,
  mockActivityData,
} from "@/lib/mock-profile-data";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ActivityGraph } from "@/components/profile/ActivityGraph";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-body">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
            <Button asChild variant="outline" className="border-secondary/50 hover:bg-secondary/10 hover:text-secondary">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>

        <ProfileHeader data={mockProfileData} />
        
        <Separator className="my-8 bg-border/50" />
        
        <ActivityGraph activityData={mockActivityData} />

        <Separator className="my-8 bg-border/50" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
                <h2 className="text-2xl font-headline font-bold text-primary mb-4">Stats Showcase</h2>
                <StatsShowcase stats={mockStatsData} />
            </div>
            <div>
                <h2 className="text-2xl font-headline font-bold text-primary mb-4">Match History</h2>
                <MatchHistory matches={mockMatchHistory} />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-2xl font-headline font-bold text-primary mb-4">Badges</h2>
                <BadgeDisplay badges={mockBadgeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
