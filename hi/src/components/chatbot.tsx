"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Send, Bot, User, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioData, AiAssistantSettings } from "@/lib/types";

export type VisitorRole = "general" | "recruiter" | "engineer" | "student";

const SUGGESTED_PROMPTS = [
  "Summarize your experience in two sentences.",
  "What projects should I look at first?",
  "How can I get in touch?",
  "What skills are you strongest in?",
];

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
};

type Props = {
  darkMode: boolean;
  portfolioData: PortfolioData;
  /** When true, show collapsible AI prompt / extra-details editors (owner only). */
  isLoggedIn: boolean;
  onAiAssistantChange: (field: keyof AiAssistantSettings, value: string) => void;
  /** Focus target for keyboard shortcut from parent. */
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** Respect system reduced-motion preference. */
  reduceMotion?: boolean;
};

const Chatbot: React.FC<Props> = ({
  darkMode,
  portfolioData,
  isLoggedIn,
  onAiAssistantChange,
  inputRef,
  reduceMotion = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visitorRole, setVisitorRole] = useState<VisitorRole>("general");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const mergedInputRef = inputRef ?? internalInputRef;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "bot",
        text: "Hello! I'm a chatbot assistant. Feel free to ask me anything about this portfolio.",
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    if (!portfolioData) {
      toast({
        variant: "destructive",
        title: "Chatbot Not Ready",
        description: "The portfolio data is still loading. Please try again in a moment.",
      });
      return;
    }

    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    const newMessages = [...messages, newUserMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const historyForAI = newMessages.map(({ id, ...re }) => re);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          portfolioData,
          history: historyForAI,
          visitorRole,
        }),
      });

      const payload = (await res.json()) as { answer?: string; error?: string };

      if (!res.ok) {
        const text =
          typeof payload.answer === "string"
            ? payload.answer
            : payload.error || "Something went wrong. Please try again.";
        throw new Error(text);
      }

      if (!payload.answer?.trim()) {
        throw new Error("Empty response from assistant.");
      }

      const newBotMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: payload.answer.trim(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const description =
        error instanceof Error ? error.message : "Please try again.";
      toast({
        variant: "destructive",
        title: "Chatbot error",
        description,
      });
      const errorBotMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text:
          error instanceof Error
            ? error.message
            : "I'm having a little trouble right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const ai = portfolioData.aiAssistant;

  const msgInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.8, y: 50 };
  const msgAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, y: 0 };
  const msgExit = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.5, transition: { duration: 0.2 } };

  return (
    <Card
      className={cn(
        "w-full max-w-lg transition-all duration-300",
        darkMode ? "bg-card/50 border-primary/20" : "bg-card border"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="text-accent" />
          AI assistant
        </CardTitle>
        <CardDescription className="text-xs">
          {isLoggedIn
            ? 'Expand "AI settings" to edit the prompt and extra context (autosaved).'
            : "Ask questions about this portfolio."}
        </CardDescription>
        <div className="mt-3 space-y-1.5">
          <Label className="text-xs text-muted-foreground">I’m visiting as</Label>
          <Select
            value={visitorRole}
            onValueChange={(v) => setVisitorRole(v as VisitorRole)}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[110]">
              <SelectItem value="general">General visitor</SelectItem>
              <SelectItem value="recruiter">Recruiter / hiring</SelectItem>
              <SelectItem value="engineer">Engineer / peer</SelectItem>
              <SelectItem value="student">Student / learner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((p) => (
            <Button
              key={p}
              type="button"
              variant="secondary"
              size="sm"
              className="h-auto max-w-full whitespace-normal py-1.5 text-left text-[11px] leading-snug"
              disabled={isLoading}
              onClick={() => {
                setInput(p);
                mergedInputRef.current?.focus();
              }}
            >
              {p}
            </Button>
          ))}
        </div>
        {isLoggedIn && (
          <Collapsible className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
            <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 text-left text-sm font-medium">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                AI settings (saved with your portfolio)
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3 data-[state=closed]:animate-none">
              <div className="space-y-1.5">
                <Label htmlFor="chat-ai-instructions" className="text-xs">
                  1. Chat instructions (prompt)
                </Label>
                <Textarea
                  id="chat-ai-instructions"
                  value={ai.instructions}
                  onChange={(e) =>
                    onAiAssistantChange("instructions", e.target.value)
                  }
                  placeholder="How the assistant should behave…"
                  className="min-h-[100px] font-mono text-xs leading-relaxed"
                  rows={4}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="chat-ai-extra" className="text-xs">
                  2. Extra details about you
                </Label>
                <Textarea
                  id="chat-ai-extra"
                  value={ai.extraDetails}
                  onChange={(e) =>
                    onAiAssistantChange("extraDetails", e.target.value)
                  }
                  placeholder="Goals, tone, anything not in the rest of the site…"
                  className="min-h-[72px] text-xs leading-relaxed"
                  rows={3}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="h-64 overflow-y-auto space-y-4 rounded-md border p-3">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout={!reduceMotion}
                initial={msgInitial}
                animate={msgAnimate}
                exit={msgExit}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "bot" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.text}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                key="loading"
                layout={!reduceMotion}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                className="flex items-start justify-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Bot size={18} />
                </div>
                <div className="flex items-center rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2">
          <Input
            ref={mergedInputRef as React.Ref<HTMLInputElement>}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about my experience… ( / to focus )"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
