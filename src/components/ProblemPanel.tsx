
"use client";

import { BookOpen, Code, Terminal, FileText, Bot, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        
        <Tabs defaultValue="description" className="w-full flex-grow flex flex-col">
          <TabsList className="bg-transparent p-0 justify-start border-b border-border rounded-none">
            <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
              <FileText className="w-4 h-4 mr-2" /> Description
            </TabsTrigger>
            <TabsTrigger value="editorial" disabled>
               <Bot className="w-4 h-4 mr-2" /> Editorial
            </TabsTrigger>
            <TabsTrigger value="solutions" disabled>
              <Book className="w-4 h-4 mr-2" /> Solutions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="flex-grow mt-4">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                    <p className="text-foreground/80 whitespace-pre-wrap">{description}</p>
                    
                    {samples && (
                        <div>
                            <h3 className="font-semibold text-lg my-2 text-foreground/90">Samples</h3>
                            <div className="prose prose-invert prose-sm max-w-none text-foreground/80 whitespace-pre-wrap p-4 rounded-lg bg-background/50 border-border border" dangerouslySetInnerHTML={{ __html: samples.replace(/```/g, '').replace(/### (.*?)\n/g, '<strong class="text-foreground">$1</strong><br/>') }} />
                        </div>
                    )}

                    {constraints && (
                        <div>
                             <h3 className="font-semibold text-lg my-2 text-foreground/90">Constraints</h3>
                             <div className="p-4 rounded-lg bg-background/50 border-border border">
                                <ul className="list-disc pl-5 text-foreground/80 whitespace-pre-wrap">
                                    {constraints.trim().split('\n-').map((line, i) => line.trim() && <li key={i}>{line.replace(/`/g, '')}</li>)}
                                </ul>
                             </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="editorial">
              {/* Editorial content goes here */}
          </TabsContent>
           <TabsContent value="solutions">
              {/* Solutions content goes here */}
          </TabsContent>
        </Tabs>
    </div>
  );
}
