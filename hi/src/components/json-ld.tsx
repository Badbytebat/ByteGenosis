"use client";

import { useEffect } from "react";
import type { PortfolioData } from "@/lib/types";

const SCRIPT_ID = "portfolio-json-ld-person";

type Props = {
  data: PortfolioData;
  siteUrl?: string;
};

/** Person + WebSite structured data for search engines. */
export default function JsonLd({ data, siteUrl }: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const base = siteUrl?.replace(/\/$/, "") || "";
    const sameAs = data.contact
      .map((c) => c.href)
      .filter((h) => h.startsWith("http"));

    const json = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          name: data.hero.title,
          description: data.about.description1.slice(0, 500),
          url: base || undefined,
          sameAs: sameAs.length ? sameAs : undefined,
          image: data.about.imageUrl?.startsWith("http")
            ? data.about.imageUrl
            : undefined,
        },
        {
          "@type": "WebSite",
          name: data.siteMeta.title,
          description: data.siteMeta.description,
          url: base || undefined,
        },
      ],
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(json);
  }, [data, siteUrl]);

  return null;
}
