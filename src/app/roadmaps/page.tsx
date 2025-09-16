"use client";

import Link from 'next/link';
import { roadmaps, Roadmap } from '@/lib/mock-roadmaps-data';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function RoadmapsHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
        >
            <div>
                <h1 className="text-4xl font-headline font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    Learning Roadmaps
                </h1>
                <p className="text-muted-foreground mt-2">
                    Follow guided paths to master new skills and technologies.
                </p>
            </div>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmaps.map((roadmap, index) => (
            <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                <Card className="bg-panel backdrop-blur-md border border-border hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <CardTitle className="text-2xl font-headline text-primary">{roadmap.title}</CardTitle>
                             <Badge className={cn("shrink-0", difficultyColors[roadmap.difficulty])}>
                                {roadmap.difficulty}
                             </Badge>
                        </div>
                        <CardDescription className="pt-2">{roadmap.description}</CardDescription>
                    </CardHeader>
                    <div className="flex-grow" />
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href={`/roadmaps/${roadmap.id}`}>
                                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
