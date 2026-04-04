"use client";

import React from "react";
import Link from "next/link";
import { Loader2, FileText } from "lucide-react";
import { getPortfolioData } from "@/lib/firestore";
import type { PortfolioData } from "@/lib/types";
import { PortfolioStarrySky } from "@/components/portfolio-starry-sky";
import { useSyncHtmlThemeFromPortfolio } from "@/hooks/use-sync-html-theme-from-portfolio";

export default function NotesIndexPage() {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const notes = data?.notes ?? [];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PortfolioStarrySky darkMode={true} fullscreen />
      <div className="relative z-[5] mx-auto max-w-3xl px-4 py-24">
        <Link href="/" className="text-sm text-accent hover:underline">
          ← Home
        </Link>
        <h1 className="mt-6 font-headline text-3xl font-bold">Notes</h1>
        {notes.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No notes published yet.</p>
        ) : (
          <ul className="mt-8 space-y-6">
            {notes.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/notes/${encodeURIComponent(n.slug)}`}
                  className="group flex gap-3 rounded-lg border border-border/60 p-4 transition-colors hover:border-accent/40"
                >
                  <FileText className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <h2 className="font-semibold group-hover:text-accent">{n.title}</h2>
                    <p className="text-sm text-muted-foreground">{n.publishedAt}</p>
                    {n.excerpt ? (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {n.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
