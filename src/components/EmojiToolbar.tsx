
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Smile } from "lucide-react";
import { motion } from "framer-motion";

type EmojiToolbarProps = {
    onEmojiSelect: (emoji: string) => void;
};

const emojis = ['👍', '😂', '🤔', '🔥', '🤯', '🎉'];

export function EmojiToolbar({ onEmojiSelect }: EmojiToolbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (emoji: string) => {
        onEmojiSelect(emoji);
        setIsOpen(false);
    }

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="icon"
                        className="rounded-full w-14 h-14 bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/30"
                    >
                        <Smile className="w-6 h-6" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-panel backdrop-blur-xl border-secondary/20 p-2" side="top" align="start">
                    <div className="flex gap-2">
                        {emojis.map((emoji, i) => (
                            <motion.button
                                key={emoji}
                                onClick={() => handleSelect(emoji)}
                                className="text-2xl p-2 rounded-md hover:bg-primary/20 transition-colors"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
