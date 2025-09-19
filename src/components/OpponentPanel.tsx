"use client";

import { CheckCircle2, XCircle, CircleDashed } from "lucide-react";
import { User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";


type OpponentPanelProps = {
  playerData: {
    name: string;
    testCases: (boolean | null)[];
  };
};

const OpponentTestCases = ({ testCases }: { testCases: (boolean | null)[] }) => {
    return (
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {testCases.map((result, index) => {
                 const status = result === true ? "passed" : result === false ? "failed" : "pending";
                 return (
                    <div key={index} className={cn(
                        "aspect-square rounded-md flex items-center justify-center transition-all duration-300",
                        status === "passed" && "bg-success/20 border-2 border-success",
                        status === "failed" && "bg-destructive/20 border-2 border-destructive",
                        status === "pending" && "bg-muted/30 border-2 border-border"
                    )}>
                         {status === "passed" && <CheckCircle2 className="h-6 w-6 text-success" />}
                         {status === "failed" && <XCircle className="h-6 w-6 text-destructive" />}
                         {status === "pending" && <CircleDashed className="h-6 w-6 text-muted-foreground" />}
                    </div>
                 )
            })}
        </div>
    )
}

export function OpponentPanel({ playerData }: OpponentPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
       <div className="flex items-center gap-2 mb-2">
            <User className="h-6 w-6 text-secondary" />
            <h2 className="text-xl font-bold font-headline text-secondary">{playerData.name}'s Progress</h2>
        </div>
        <ScrollArea className="flex-grow">
             <OpponentTestCases testCases={playerData.testCases} />
        </ScrollArea>
    </div>
  );
}
