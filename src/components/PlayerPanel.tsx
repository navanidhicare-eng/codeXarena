
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Lightbulb, Loader2, Play, Code, Terminal, Clipboard, CheckCircle2, XCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { CodeExecutionResult } from "@/context/AppContext";

type Language = "javascript" | "python" | "java" | "cpp";

type PlayerPanelProps = {
  playerData: {
    code: string;
    output: CodeExecutionResult;
  };
  selectedLanguage: Language;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
  onRunCode: () => void;
  onGetHint: () => void;
  isHintLoading: boolean;
  isCodeRunning: boolean;
};

const ResultBar = ({ result }: { result: CodeExecutionResult }) => {
    if (!result || !result.finalResult) return null;

    const allPassed = result.finalResult === 'Accepted';
    const passedCount = result.testCaseResults.filter(r => r.passed).length;
    const totalCount = result.testCaseResults.length;

    return (
        <div className={cn(
            "p-2 rounded-t-lg text-center font-bold font-headline text-lg",
            allPassed ? "bg-success/20 text-success shadow-success-glow" : "bg-destructive/20 text-destructive"
        )}>
            {allPassed ? 'Accepted' : `Wrong Answer: ${passedCount} / ${totalCount} Cases Passed`}
        </div>
    );
};


const OutputDisplay = ({ result }: { result: CodeExecutionResult }) => {
    const { toast } = useToast();
    const hasOutput = result.stdout || result.stderr || result.error;

    const handleCopy = (text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast({ title: "Output copied to clipboard!" });
    }

    if (!hasOutput) {
        return <p className="text-muted-foreground text-sm p-4">Run your code to see the console output here.</p>;
    }

    return (
        <div className="font-code text-sm p-2 relative bg-black/50 rounded-lg">
            {result.stdout && (
                 <div className="group">
                    <pre className="text-foreground whitespace-pre-wrap p-2 rounded-md bg-transparent">{result.stdout}</pre>
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(result.stdout)}>
                        <Clipboard className="w-4 h-4" />
                    </Button>
                 </div>
            )}
            {result.stderr && (
                 <div className="group mt-2">
                    <pre className="text-destructive whitespace-pre-wrap p-2 rounded-md bg-destructive/10">{result.stderr}</pre>
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(result.stderr)}>
                        <Clipboard className="w-4 h-4" />
                    </Button>
                 </div>
            )}
             {result.error && (
                 <div className="group mt-2">
                    <pre className="text-destructive whitespace-pre-wrap p-2 rounded-md bg-destructive/10">{result.error}</pre>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(result.error)}>
                        <Clipboard className="w-4 h-4" />
                    </Button>
                 </div>
            )}
        </div>
    )
}

const TestCasesDisplay = ({ results }: { results: CodeExecutionResult['testCaseResults'] }) => {
    if (!results || results.length === 0) {
        return <p className="text-muted-foreground text-sm p-4">Run your code to see test case results.</p>;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {results.map((tc, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className={cn(
                        "font-code hover:no-underline rounded-lg px-2",
                        tc.passed ? "text-success" : "text-destructive"
                    )}>
                        <div className="flex items-center gap-2">
                             {tc.passed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                             Test Case {index + 1}: {tc.passed ? "Accepted" : "Wrong Answer"}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 space-y-2">
                        <div className="bg-black/30 p-3 rounded-md">
                            <h4 className="font-semibold text-muted-foreground text-xs uppercase">Input</h4>
                            <pre className="font-code text-sm whitespace-pre-wrap">{tc.input}</pre>
                        </div>
                         <div className="bg-black/30 p-3 rounded-md">
                            <h4 className="font-semibold text-muted-foreground text-xs uppercase">Your Output</h4>
                            <pre className="font-code text-sm whitespace-pre-wrap text-destructive">{tc.output}</pre>
                        </div>
                        <div className="bg-black/30 p-3 rounded-md">
                            <h4 className="font-semibold text-muted-foreground text-xs uppercase">Expected Output</h4>
                            <pre className="font-code text-sm whitespace-pre-wrap text-success">{tc.expected}</pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
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
            <div className={cn("h-full flex flex-col border-2 rounded-lg", playerData.output.finalResult === "Accepted" ? "border-success/50" : playerData.output.finalResult ? "border-destructive/50" : "border-transparent")}>
                <ResultBar result={playerData.output} />
                <Tabs defaultValue="tests" className="h-full flex flex-col flex-grow">
                    <TabsList className="bg-transparent p-0 justify-start border-b border-border rounded-none mb-2 px-2">
                        <TabsTrigger value="tests" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                            Test Cases
                        </TabsTrigger>
                        <TabsTrigger value="output" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
                            <Terminal className="w-4 h-4 mr-2" /> Console
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tests" className="flex-grow mt-0 px-2">
                        <ScrollArea className="h-full">
                           <TestCasesDisplay results={playerData.output.testCaseResults} />
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="output" className="flex-grow mt-0 px-2">
                        <ScrollArea className="h-full">
                            <OutputDisplay result={playerData.output} />
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
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
          className="bg-success text-background hover:bg-success/80 w-40"
        >
          {isCodeRunning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Run & Verify
        </Button>
      </div>
    </div>
  );
}
