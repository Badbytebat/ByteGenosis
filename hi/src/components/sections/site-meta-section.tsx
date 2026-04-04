"use client";

import type { SiteMeta } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  siteMeta: SiteMeta;
  onChange: (field: keyof SiteMeta, value: string) => void;
};

/** SEO fields (edit mode only — wired from parent). */
export default function SiteMetaSection({ siteMeta, onChange }: Props) {
  return (
    <section id="seo" className="scroll-mt-24 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-dashed bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">SEO & sharing</CardTitle>
            <CardDescription>
              Page title, description, and social preview image (saved with your portfolio).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-title">Site title</Label>
              <Input
                id="site-meta-title"
                value={siteMeta.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-desc">Meta description</Label>
              <Textarea
                id="site-meta-desc"
                value={siteMeta.description}
                onChange={(e) => onChange("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-og">Open Graph image URL (optional)</Label>
              <Input
                id="site-meta-og"
                value={siteMeta.ogImageUrl ?? ""}
                onChange={(e) => onChange("ogImageUrl", e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-tw">Twitter @handle (optional)</Label>
              <Input
                id="site-meta-tw"
                value={siteMeta.twitterSite ?? ""}
                onChange={(e) => onChange("twitterSite", e.target.value)}
                placeholder="@username"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
