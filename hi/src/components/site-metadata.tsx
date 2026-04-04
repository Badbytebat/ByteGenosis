"use client";

import { useEffect } from "react";
import type { SiteMeta } from "@/lib/types";

type Props = {
  siteMeta: SiteMeta;
  canonicalUrl?: string;
};

/** Syncs document title and basic meta tags from portfolio data (client-side). */
export default function SiteMetadata({ siteMeta, canonicalUrl }: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = siteMeta.title;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", siteMeta.description);
    setMeta("og:title", siteMeta.title, "property");
    setMeta("og:description", siteMeta.description, "property");
    setMeta("og:type", "website", "property");
    if (siteMeta.ogImageUrl?.trim()) {
      setMeta("og:image", siteMeta.ogImageUrl.trim(), "property");
    }
    setMeta("twitter:card", "summary_large_image");
    if (siteMeta.twitterSite?.trim()) {
      setMeta("twitter:site", siteMeta.twitterSite.trim());
    }

    if (canonicalUrl?.trim()) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl.trim();
    }
  }, [
    siteMeta.title,
    siteMeta.description,
    siteMeta.ogImageUrl,
    siteMeta.twitterSite,
    canonicalUrl,
  ]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const fav = siteMeta.faviconUrl?.trim();
    const favLinkSel = 'link[rel="icon"][data-portfolio-favicon="1"]';
    const existingFav = document.querySelector(favLinkSel) as HTMLLinkElement | null;

    if (fav) {
      document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((node) => {
        if (!node.getAttribute("data-portfolio-favicon")) node.remove();
      });

      let link = document.querySelector(favLinkSel) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        link.setAttribute("data-portfolio-favicon", "1");
        document.head.prepend(link);
      }

      const pathOnly = fav.split(/[?#]/)[0] ?? fav;
      const ext = pathOnly.split(".").pop()?.toLowerCase();
      const mime =
        ext === "svg"
          ? "image/svg+xml"
          : ext === "png"
            ? "image/png"
            : ext === "jpg" || ext === "jpeg"
              ? "image/jpeg"
              : ext === "webp"
                ? "image/webp"
                : ext === "ico"
                  ? "image/x-icon"
                  : "";
      if (mime) link.type = mime;
      else link.removeAttribute("type");

      let href: string;
      try {
        const u = new URL(fav);
        u.searchParams.set("cb", String(Date.now()));
        href = u.toString();
      } catch {
        const sep = fav.includes("?") ? "&" : "?";
        href = `${fav}${sep}cb=${Date.now()}`;
      }
      link.href = href;

      let apple = document.querySelector(
        'link[rel="apple-touch-icon"][data-portfolio-favicon="1"]'
      ) as HTMLLinkElement | null;
      if (!apple) {
        apple = document.createElement("link");
        apple.rel = "apple-touch-icon";
        apple.setAttribute("data-portfolio-favicon", "1");
        document.head.appendChild(apple);
      }
      apple.href = href;
    } else {
      existingFav?.remove();
      document
        .querySelectorAll('link[rel="apple-touch-icon"][data-portfolio-favicon="1"]')
        .forEach((n) => n.remove());
    }
  }, [siteMeta.faviconUrl]);

  return null;
}
