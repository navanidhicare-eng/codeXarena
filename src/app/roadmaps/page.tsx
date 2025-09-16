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

const difficultyColors: { [key: string]: string } = {
  Beginner: 'bg-green-100 text-green-800 border-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Advanced: 'bg-red-100 text-red-800 border-red-300',
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
                <h1 className="text-4xl font-bold text-gray-800">
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
                <Card className="bg-card border border-border hover:border-primary/50 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-lg">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <CardTitle className="text-2xl text-gray-800">{roadmap.title}</CardTitle>
                             <Badge className={cn("shrink-0", difficultyColors[roadmap.difficulty])} variant="outline">
                                {roadmap.difficulty}
                             </Badge>
                        </div>
                        <CardDescription className="pt-2">{roadmap.description}</CardDescription>
                    </CardHeader>
                    <div className="flex-grow" />
                    <CardFooter>
                        <Button asChild className="w-full bg-primary hover:bg-primary/90">
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
