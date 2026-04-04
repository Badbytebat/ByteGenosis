"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortfolioData } from "@/lib/firestore";
import { getProjectSlug } from "@/lib/project-path";
import type { PortfolioData, Project } from "@/lib/types";
import { PortfolioStarrySky } from "@/components/portfolio-starry-sky";
import { useSyncHtmlThemeFromPortfolio } from "@/hooks/use-sync-html-theme-from-portfolio";

function findProject(slug: string, projects: Project[]): Project | undefined {
  return projects.find((p) => getProjectSlug(p) === slug);
}

export default function ProjectCaseStudyPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
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

  const project = data ? findProject(slug, data.projects) : undefined;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <PortfolioStarrySky darkMode={true} fullscreen />
        <div className="relative z-[5] mx-auto max-w-3xl px-4 py-24">
          <p className="text-lg text-muted-foreground">Project not found.</p>
          <Link href="/#projects">
            <Button variant="link" className="mt-4 gap-2 px-0">
              <ArrowLeft className="h-4 w-4" /> Back to portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const body =
    project.caseStudyBody?.trim() ||
    project.description ||
    "No additional write-up yet.";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PortfolioStarrySky darkMode={true} fullscreen />
      <article className="relative z-[5] mx-auto max-w-3xl px-4 py-24">
        <Link href="/#projects">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" /> Projects
          </Button>
        </Link>
        <h1 className="font-headline text-3xl font-bold md:text-4xl">{project.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-muted-foreground">
          {body}
        </div>
        {project.link && project.link !== "#" && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-accent underline-offset-4 hover:underline"
          >
            Open project link
          </a>
        )}
      </article>
    </div>
  );
}
