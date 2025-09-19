
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Balancer from "react-wrap-balancer";
import { Bot, Loader2, Send, Sparkles, User, X, Check, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  getSupportChatMessage,
} from "@/ai/flows/support-chat-flow";
import type { SupportChatMessage } from '@/ai/schemas/support-chat-schemas';

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isFeatureResponse?: boolean;
};

const QuickActions = ({ onSelect }: { onSelect: (action: string) => void }) => {
  const actions = ["Events", "Clans", "Bug Hunts", "Profile", "Roadmaps"];
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map((action) => (
        <Button
          key={action}
          variant="outline"
          size="sm"
          className="bg-background/80 border-primary/50 hover:bg-primary/20"
          onClick={() => onSelect(action)}
        >
          {action}
        </Button>
      ))}
    </div>
  );
};

const FollowUpActions = ({ onSelect }: { onSelect: (action: string) => void }) => {
  return (
    <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-300"
          onClick={() => onSelect("understand")}
        >
          <Check className="w-4 h-4 mr-2"/> I understand
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 text-blue-300"
          onClick={() => onSelect("details")}
        >
          <Brain className="w-4 h-4 mr-2"/> I need more details
        </Button>
    </div>
  );
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-message",
      role: "assistant",
      text: "Hello! I'm your CodeXarena assistant. How can I help you? You can ask me a question or choose one of the options below.",
    },
  ]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (messageText: string, topic: string | null = null, isFeatureQuery: boolean = false) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (isFeatureQuery) {
        setCurrentTopic(messageText);
    }

    try {
      const chatHistory: SupportChatMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const result = await getSupportChatMessage({
        message: messageText,
        history: chatHistory,
        topic: topic,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: result.text,
        isFeatureResponse: isFeatureQuery || !!topic,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting chat response:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        text: "Sorry, I encountered an error. Please try asking in a different way."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentTopic(null); // Reset topic on new manual input
    handleSendMessage(input);
  }
  
  const handleQuickActionSelect = (action: string) => {
    handleSendMessage(action, null, true);
  }

  const handleFollowUpSelect = (action: string) => {
      if (action === "understand") {
          const understandMessage: Message = {
              id: `user-${Date.now()}`,
              role: 'user',
              text: "I understand."
          };
          const nextStepsMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              text: "Great! What else can I help you with?",
          };
          setMessages(prev => [...prev, understandMessage, nextStepsMessage]);
          setCurrentTopic(null);
      } else if (action === "details" && currentTopic) {
          handleSendMessage(`I need more details`, currentTopic, false);
      }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          size="icon"
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Bot className="w-6 h-6" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm"
          >
            <div className="bg-panel backdrop-blur-xl border border-secondary/20 rounded-lg shadow-xl flex flex-col h-[60vh]">
              <header className="p-4 border-b border-secondary/20 flex items-center gap-2">
                <Sparkles className="text-secondary w-5 h-5" />
                <h3 className="font-headline font-semibold text-foreground">
                  CodeXarena Assistant
                </h3>
              </header>

              <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                <div className="flex flex-col gap-4">
                  {messages.map((message) => {
                    const lastMessage = messages[messages.length - 1];
                    const showQuickActions = message.id === 'initial-message' || (message.id === lastMessage.id && message.role === 'assistant' && !message.isFeatureResponse);
                    const showFollowUpActions = message.id === lastMessage.id && message.role === 'assistant' && message.isFeatureResponse;

                    return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-start gap-3",
                            message.role === "user" && "justify-end"
                          )}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                              <Bot className="w-5 h-5 text-secondary" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                              message.role === "assistant"
                                ? "bg-background/50 text-foreground/90"
                                : "bg-primary text-primary-foreground"
                            )}
                          >
                            <Balancer>{message.text}</Balancer>
                            {showQuickActions && <QuickActions onSelect={handleQuickActionSelect} />}
                            {showFollowUpActions && <FollowUpActions onSelect={handleFollowUpSelect} />}
                          </div>
                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                          <Bot className="w-5 h-5 text-secondary" />
                        </div>
                      <div className="bg-background/50 rounded-lg px-4 py-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <footer className="p-4 border-t border-secondary/20">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-grow bg-transparent border-secondary/50 focus-visible:ring-primary"
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
