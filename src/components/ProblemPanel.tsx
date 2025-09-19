
"use client";

import { BookOpen, Code, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

type ProblemPanelProps = {
  problem: {
    title: string;
    description: string;
  };
};

export function ProblemPanel({ problem }: ProblemPanelProps) {
  const [description, samples, constraints] = problem.description.split('---');

  return (
    <div className="h-full flex flex-col gap-4 bg-panel backdrop-blur-md border border-border rounded-lg p-4">
        <h2 className="text-2xl font-bold font-headline text-foreground flex-shrink-0">{problem.title}</h2>
        <ScrollArea className="flex-grow pr-4">
            <div className="space-y-4">
                <Card className="bg-background/50 border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground/90">
                    <BookOpen className="w-5 h-5"/>
                    Description
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 whitespace-pre-wrap">{description}</p>
                </CardContent>
                </Card>

                {samples && (
                <Card className="bg-background/50 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground/90">
                        <Code className="w-5 h-5"/>
                        Samples
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-invert prose-sm max-w-none text-foreground/80 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: samples.replace(/```/g, '').replace(/### (.*?)\n/g, '<strong>$1</strong><br/>') }} />
                </Card>
                )}

                {constraints && (
                    <Card className="bg-background/50 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground/90">
                            <Terminal className="w-5 h-5"/>
                            Constraints
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-foreground/80 whitespace-pre-wrap">
                            {constraints.trim().split('\n-').map((line, i) => line.trim() && <li key={i}>{line.replace(/`/g, '')}</li>)}
                        </ul>
                    </CardContent>
                    </Card>
                )}
            </div>
        </ScrollArea>
    </div>
  );
}
