"use client";

import { CheckCircle2, XCircle, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

type TestCasesPanelProps = {
  testCases: (boolean | null)[];
};

export function TestCasesPanel({ testCases }: TestCasesPanelProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2 text-foreground/80">Test Cases</h3>
      <div className="flex flex-col gap-2">
        {testCases.map((result, index) => {
          const status = result === true ? "passed" : result === false ? "failed" : "pending";
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm p-2 rounded-md transition-colors",
                status === "passed" && "bg-success/10 text-success",
                status === "failed" && "bg-destructive/10 text-destructive",
                status === "pending" && "bg-muted/10 text-muted-foreground"
              )}
            >
              {status === "passed" && <CheckCircle2 className="h-4 w-4" />}
              {status === "failed" && <XCircle className="h-4 w-4" />}
              {status === "pending" && <CircleDashed className="h-4 w-4" />}
              <span className="font-code">Test Case {index + 1}</span>
              <span className="ml-auto font-bold capitalize">{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
