"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Percent, Swords, Code, Bug } from "lucide-react";
import { motion } from "framer-motion";

type StatItem = {
  title: string;
  value: string;
  icon: string;
};

type StatsShowcaseProps = {
  stats: StatItem[];
};

const iconComponents: { [key: string]: React.FC<any> } = {
    Percent: Percent,
    Swords: Swords,
    Flame: Flame,
    Code: Bug,
};

const StatCard = ({ item, index }: { item: StatItem, index: number }) => {
    const Icon = typeof item.icon === 'string' && iconComponents[item.icon] ? iconComponents[item.icon] : Swords;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="bg-panel backdrop-blur-md border border-secondary/10 h-full text-center hover:border-secondary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center justify-center pb-2">
                    <div className="text-secondary mb-2">
                        <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-lg font-headline text-muted-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold font-code text-foreground">{item.value}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};


export function StatsShowcase({ stats }: StatsShowcaseProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} item={stat} index={index} />
      ))}
    </div>
  );
}
