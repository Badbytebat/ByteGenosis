"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContactMethod } from "@/lib/types";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Globe,
  MessageCircle,
  Codepen,
  Dribbble,
  Palette,
  BookOpen,
  Rss,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import {
  WhatsappIcon,
  KaggleIcon,
  HackerRankIcon,
  GeeksforGeeksIcon,
  LeetCodeIcon,
} from "@/components/layout/custom-icons";
import { cn } from "@/lib/utils";
import { CONTACT_SOCIAL_PRESETS, getPresetLabelForIcon } from "@/lib/contact-social-presets";

const ICONS: { [key: string]: React.ElementType } = {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Globe,
  MessageCircle,
  Discord: MessageSquare,
  Whatsapp: WhatsappIcon,
  Kaggle: KaggleIcon,
  HackerRank: HackerRankIcon,
  GeeksforGeeks: GeeksforGeeksIcon,
  LeetCode: LeetCodeIcon,
  Codepen,
  Dribbble,
  Behance: Palette,
  Medium: BookOpen,
  Rss,
};

type AnimatedCardProps = {
  method: ContactMethod;
  index: number;
  formatHref: (url: string) => string;
  darkMode: boolean;
};

const AnimatedContactCard: React.FC<AnimatedCardProps> = ({
  method,
  index,
  formatHref,
  darkMode,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const IconComponent = ICONS[method.icon] || Mail;

  const transition = darkMode
    ? { duration: 0.8, delay: index * 0.1, ease: "easeOut" }
    : { type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={transition}
    >
      <a
        href={formatHref(method.href)}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <Card
          className={cn(
            "h-full p-6 text-center transition-all duration-300",
            darkMode
              ? "border-primary/20 bg-card/50 hover:-rotate-1 hover:scale-105 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
              : "border bg-card light-card"
          )}
        >
          <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
            <IconComponent
              className={cn(
                "h-10 w-10 text-accent",
                !darkMode && "light-icon-pop"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            />
            <p className="text-lg font-bold">{method.label}</p>
            <p className="text-sm text-muted-foreground">{method.value}</p>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
};

type EditCardProps = {
  method: ContactMethod;
  index: number;
  updateEntry: (section: "contact", id: number, field: string, value: string) => void;
  deleteEntry: (section: "contact", id: number) => void;
  darkMode: boolean;
};

const ContactEditCard: React.FC<EditCardProps> = ({
  method,
  index,
  updateEntry,
  deleteEntry,
  darkMode,
}) => {
  const IconComponent = ICONS[method.icon] || Mail;

  const applyPreset = (iconKey: string) => {
    updateEntry("contact", method.id, "icon", iconKey);
    const preset = CONTACT_SOCIAL_PRESETS.find((p) => p.value === iconKey);
    if (preset && (method.label === "New link" || method.label === getPresetLabelForIcon(method.icon))) {
      updateEntry("contact", method.id, "label", preset.label);
    }
  };

  return (
    <Card
      className={cn(
        "border p-4 text-left",
        darkMode ? "border-primary/25 bg-card/60" : "bg-card"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconComponent className="h-8 w-8 shrink-0 text-accent" />
          <span className="text-xs font-medium text-muted-foreground">Card {index + 1}</span>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 shrink-0 text-destructive"
          onClick={() => deleteEntry("contact", method.id)}
          aria-label="Remove contact"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
            Platform / icon
          </label>
          <Select value={method.icon} onValueChange={applyPreset}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Choose social" />
            </SelectTrigger>
            <SelectContent className="z-[120] max-h-72">
              {CONTACT_SOCIAL_PRESETS.map((p) => {
                const Ic = ICONS[p.value] || Globe;
                return (
                  <SelectItem key={p.value} value={p.value} className="text-xs">
                    <span className="flex items-center gap-2">
                      <Ic className="h-4 w-4 shrink-0 opacity-80" />
                      {p.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Input
          value={method.label}
          onChange={(e) => updateEntry("contact", method.id, "label", e.target.value)}
          placeholder="Label"
          className="h-9 text-sm"
        />
        <Input
          value={method.value}
          onChange={(e) => updateEntry("contact", method.id, "value", e.target.value)}
          placeholder="Shown text (handle, email, etc.)"
          className="h-9 text-sm"
        />
        <Input
          value={method.href}
          onChange={(e) => updateEntry("contact", method.id, "href", e.target.value)}
          placeholder="https://… or mailto:…"
          className="h-9 font-mono text-xs"
        />
      </div>
    </Card>
  );
};

type Props = {
  data: ContactMethod[];
  editMode: boolean;
  updateEntry: (section: "contact", id: number, field: string, value: string) => void;
  addEntry: (section: "contact") => void;
  deleteEntry: (section: "contact", id: number) => void;
  darkMode: boolean;
};

const ContactSection: React.FC<Props> = ({
  data,
  editMode,
  updateEntry,
  addEntry,
  deleteEntry,
  darkMode,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const formatHref = (url: string = ""): string => {
    if (!url) return "#";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("mailto:")
    ) {
      return url;
    }
    if (url.includes("@")) {
      return `mailto:${url}`;
    }
    return `https://${url}`;
  };

  const transition = darkMode
    ? { duration: 0.8, ease: "easeOut" }
    : { type: "spring", stiffness: 100, damping: 20 };

  return (
    <motion.section
      ref={ref}
      id="contact"
      className="overflow-hidden py-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={transition}
    >
      <div className="mx-auto mb-12 max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent md:text-4xl">
          Contact Me
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {darkMode
            ? "Have a question or want to work together? Send a signal."
            : "Let's connect. I'm available for new opportunities."}
        </p>
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {editMode ? (
          <>
            <div className="mb-4 flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={() => addEntry("contact")}
              >
                <Plus className="h-4 w-4" />
                Add social card
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {data.map((method, index) => (
                <ContactEditCard
                  key={method.id}
                  method={method}
                  index={index}
                  updateEntry={updateEntry}
                  deleteEntry={deleteEntry}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {data.map((method, index) => (
              <AnimatedContactCard
                key={method.id}
                method={method}
                index={index}
                formatHref={formatHref}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ContactSection;
