"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { NotePost } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
type Props = {
  data: NotePost[];
  editMode: boolean;
  updateEntry: (section: "notes", id: number, field: string, value: string) => void;
  addEntry: (section: "notes") => void;
  deleteEntry: (section: "notes", id: number) => void;
  darkMode: boolean;
};

export default function NotesSection({
  data,
  editMode,
  updateEntry,
  addEntry,
  deleteEntry,
  darkMode,
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  if (!editMode && (!data || data.length === 0)) return null;

  return (
    <section id="notes" className="py-20 px-4 sm:px-8 scroll-mt-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 24 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Notes</h2>
          <p className="mt-2 text-muted-foreground">Articles and short updates</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {data.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "h-full transition-all duration-300",
                  darkMode
                    ? "bg-card/50 border-primary/20"
                    : "bg-card border light-card"
                )}
              >
                <CardHeader>
                  {editMode ? (
                    <Input
                      value={note.title}
                      onChange={(e) => updateEntry("notes", note.id, "title", e.target.value)}
                      className="text-lg font-bold"
                    />
                  ) : (
                    <CardTitle className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <Link
                        href={`/notes/${encodeURIComponent(note.slug)}`}
                        className="hover:text-accent hover:underline"
                      >
                        {note.title}
                      </Link>
                    </CardTitle>
                  )}
                  {editMode ? (
                    <Input
                      value={note.slug}
                      onChange={(e) => updateEntry("notes", note.id, "slug", e.target.value)}
                      placeholder="url-slug"
                      className="font-mono text-xs"
                    />
                  ) : (
                    <CardDescription>{note.excerpt || note.publishedAt}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {editMode ? (
                    <>
                      <Input
                        type="date"
                        value={note.publishedAt}
                        onChange={(e) =>
                          updateEntry("notes", note.id, "publishedAt", e.target.value)
                        }
                      />
                      <Textarea
                        value={note.excerpt}
                        onChange={(e) =>
                          updateEntry("notes", note.id, "excerpt", e.target.value)
                        }
                        placeholder="Excerpt"
                        rows={2}
                      />
                      <Textarea
                        value={note.body}
                        onChange={(e) => updateEntry("notes", note.id, "body", e.target.value)}
                        placeholder="Body (plain text or markdown-style)"
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEntry("notes", note.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground line-clamp-4">{note.excerpt}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {editMode && (
          <div className="mt-8 flex justify-center">
            <Button onClick={() => addEntry("notes")} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add note
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
