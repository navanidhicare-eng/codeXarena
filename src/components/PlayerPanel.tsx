"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TestCasesPanel } from "@/components/TestCasesPanel";
import { Lightbulb, Loader2, Play, Code, Terminal, Clipboard } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";


type Language = "javascript" | "python" | "java" | "cpp";

type PlayerPanelProps = {
  playerData: {
    code: string;
    testCases: (boolean | null)[];
    output: { stdout: string | null; stderr: string | null; error: string | null; };
  };
  selectedLanguage: Language;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
  onRunCode: () => void;
  onGetHint: () => void;
  isHintLoading: boolean;
  isCodeRunning: boolean;
};

const OutputDisplay = ({ output }: { output: PlayerPanelProps['playerData']['output'] }) => {
    const { toast } = useToast();

    const hasOutput = output.stdout || output.stderr || output.error;

    const handleCopy = (text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast({ title: "Output copied to clipboard!" });
    }

    if (!hasOutput) {
        return <p className="text-muted-foreground text-sm p-4">Run your code to see the output here.</p>;
    }

    return (
        <div className="font-code text-sm p-2 relative">
            {output.stdout && (
                 <div className="group">
                    <pre className="text-foreground whitespace-pre-wrap p-2 rounded-md bg-transparent">{output.stdout}</pre>
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(output.stdout)}>
                        <Clipboard className="w-4 h-4" />
                    </Button>
                 </div>
            )}
            {output.stderr && (
                 <div className="group mt-2">
                    <pre className="text-destructive whitespace-pre-wrap p-2 rounded-md bg-destructive/10">{output.stderr}</pre>
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(output.stderr)}>
                        <Clipboard className="w-4 h-4" />
                    </Button>
                 </div>
            )}
             {output.error && (
                 <div className="group mt-2">
                    <pre className="text-destructive whitespace-pre-wrap p-2 rounded-md bg-destructive/10">{output.error}</pre>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(output.error)}>
                        <Clipboard className="w-4 h-4" />
                    </Button>
                 </div>
            )}
        </div>
    )
}

export function PlayerPanel({
  playerData,
  selectedLanguage,
  onCodeChange,
  onLanguageChange,
  onRunCode,
  onGetHint,
  isHintLoading,
  isCodeRunning,
}: PlayerPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary"/>
            <h2 className="text-xl font-bold font-headline text-primary">Your Code</h2>
        </div>
        <Select defaultValue={selectedLanguage} onValueChange={(value: Language) => onLanguageChange(value)}>
          <SelectTrigger className="w-[180px] bg-transparent border-primary/50">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <PanelGroup direction="vertical" className="flex-grow min-h-0">
        <Panel defaultSize={60} minSize={20}>
          <Textarea
            value={playerData.code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Your code goes here..."
            className="w-full h-full flex-grow font-code bg-transparent border-2 border-primary/50 rounded-lg focus:border-primary focus-visible:ring-0 resize-none text-base"
          />
        </Panel>
        <PanelResizeHandle className="h-4 flex items-center justify-center">
            <div className="h-1 w-12 bg-border rounded-full" />
        </PanelResizeHandle>
        <Panel defaultSize={40} minSize={20}>
           <Tabs defaultValue="tests" className="h-full flex flex-col">
              <TabsList className="bg-transparent p-0 justify-start border-b border-border rounded-none mb-2">
                  <TabsTrigger value="tests" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                     Test Cases
                  </TabsTrigger>
                  <TabsTrigger value="output" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                     <Terminal className="w-4 h-4 mr-2" /> Output
                  </TabsTrigger>
              </TabsList>
               <TabsContent value="tests" className="flex-grow mt-0">
                <ScrollArea className="h-full">
                  <TestCasesPanel testCases={playerData.testCases} />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="output" className="flex-grow mt-0">
                  <ScrollArea className="h-full">
                     <OutputDisplay output={playerData.output} />
                  </ScrollArea>
              </TabsContent>
            </Tabs>
        </Panel>
      </PanelGroup>

      <div className="flex-shrink-0 flex items-center justify-between gap-4">
        <Button
          onClick={onGetHint}
          disabled={isHintLoading}
          variant="outline"
          className="border-secondary/50 hover:bg-secondary/10 hover:text-secondary"
        >
          {isHintLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Get Hint
        </Button>
        <Button
          onClick={onRunCode}
          disabled={isCodeRunning}
          className="bg-success text-background hover:bg-success/80"
        >
          {isCodeRunning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Run Tests
        </Button>
      </div>
    </div>
  );
}
