"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortfolioData } from "@/lib/firestore";
import type { PortfolioData, NotePost } from "@/lib/types";
import { PortfolioStarrySky } from "@/components/portfolio-starry-sky";
import { useSyncHtmlThemeFromPortfolio } from "@/hooks/use-sync-html-theme-from-portfolio";

export default function NoteDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? decodeURIComponent(params.slug) : "";
  const [data, setData] = React.useState<PortfolioData | null>(null);
  const [loading, setLoading] = React.useState(true);

  useSyncHtmlThemeFromPortfolio(data, true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await getPortfolioData();
        if (!cancelled) setData(d);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const note: NotePost | undefined = data?.notes?.find((n) => n.slug === slug);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <PortfolioStarrySky darkMode={true} fullscreen />
        <div className="relative z-[5] mx-auto max-w-3xl px-4 py-24">
          <p className="text-muted-foreground">Note not found.</p>
          <Link href="/notes">
            <Button variant="link" className="mt-4 gap-2 px-0">
              <ArrowLeft className="h-4 w-4" /> All notes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PortfolioStarrySky darkMode={true} fullscreen />
      <article className="relative z-[5] mx-auto max-w-3xl px-4 py-24">
        <Link href="/notes">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" /> All notes
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">{note.publishedAt}</p>
        <h1 className="mt-2 font-headline text-3xl font-bold md:text-4xl">{note.title}</h1>
        {note.excerpt ? (
          <p className="mt-4 text-lg text-muted-foreground">{note.excerpt}</p>
        ) : null}
        <div className="prose prose-invert mt-10 max-w-none whitespace-pre-wrap text-foreground/90">
          {note.body || "(Empty)"}
        </div>
        <Link href="/" className="mt-12 inline-block text-sm text-accent hover:underline">
          ← Home
        </Link>
      </article>
    </div>
  );
}
