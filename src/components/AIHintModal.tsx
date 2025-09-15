"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type AIHintModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hintText: string;
  isLoading: boolean;
};

export function AIHintModal({ open, onOpenChange, hintText, isLoading }: AIHintModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-panel backdrop-blur-md border border-secondary/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-secondary font-headline">AI Hint</DialogTitle>
          <DialogDescription>
            Here is a hint to get you on the right track.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 min-h-[200px] flex items-center justify-center rounded-lg bg-background/50 p-4 border border-secondary/20">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Generating hint...</p>
            </div>
          ) : (
            <ScrollArea className="h-full max-h-64 w-full">
               <p className="whitespace-pre-wrap font-code">{hintText}</p>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
