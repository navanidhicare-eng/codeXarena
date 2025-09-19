"use client";

import { TestCasesPanel } from "@/components/TestCasesPanel";
import { User, BookOpen, Code, Terminal } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type OpponentPanelProps = {
  playerData: {
    name: string;
    testCases: (boolean | null)[];
  };
  problem: {
    title: string;
    description: string;
  };
};

export function OpponentPanel({ playerData, problem }: OpponentPanelProps) {
  const [description, samples, constraints] = problem.description.split('---');

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold font-headline text-secondary">{problem.title}</h2>
      </div>

      <div className="flex-grow space-y-4 pr-4 overflow-y-auto">
            <Card className="bg-background/50 border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-secondary/90">
                  <BookOpen className="w-5 h-5"/>
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-wrap">{description}</p>
              </CardContent>
            </Card>

            {samples && (
              <Card className="bg-background/50 border-secondary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-secondary/90">
                    <Code className="w-5 h-5"/>
                    Samples
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert prose-sm max-w-none text-foreground/80 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: samples.replace(/```/g, '').replace(/### (.*?)\n/g, '<strong>$1</strong><br/>') }} />
              </Card>
            )}

            {constraints && (
                <Card className="bg-background/50 border-secondary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-secondary/90">
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
      
      <div className="flex-shrink-0 rounded-lg p-4 bg-background/50 border border-secondary/20">
         <div className="flex items-center gap-2 mb-4">
            <User className="h-6 w-6 text-secondary" />
            <h2 className="text-xl font-bold font-headline text-secondary">{playerData.name}</h2>
        </div>
        <TestCasesPanel testCases={playerData.testCases} />
      </div>
    </div>
  );
}
