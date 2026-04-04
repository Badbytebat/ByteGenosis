"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { DownloadableAsset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
type Props = {
  data: DownloadableAsset[];
  editMode: boolean;
  updateEntry: (
    section: "downloadableAssets",
    id: number,
    field: string,
    value: string
  ) => void;
  addEntry: (section: "downloadableAssets") => void;
  deleteEntry: (section: "downloadableAssets", id: number) => void;
  darkMode: boolean;
};

export default function DownloadableAssetsSection({
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
    <section id="downloads" className="py-16 px-4 sm:px-8 scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          className="mb-8 text-center"
        >
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Downloads</h2>
          <p className="mt-2 text-muted-foreground">Resumes, decks, and other files</p>
        </motion.div>

        <ul className="space-y-3">
          {data.map((asset, index) => (
            <motion.li
              key={asset.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -12 }}
              transition={{ delay: index * 0.04 }}
              className={cn(
                "flex flex-wrap items-center gap-3 rounded-lg border p-4",
                darkMode ? "border-primary/20 bg-card/40" : "border bg-card"
              )}
            >
              {editMode ? (
                <>
                  <Input
                    value={asset.label}
                    onChange={(e) =>
                      updateEntry("downloadableAssets", asset.id, "label", e.target.value)
                    }
                    className="max-w-xs flex-1"
                    placeholder="Label"
                  />
                  <Input
                    value={asset.url}
                    onChange={(e) =>
                      updateEntry("downloadableAssets", asset.id, "url", e.target.value)
                    }
                    className="min-w-[200px] flex-[2] font-mono text-sm"
                    placeholder="https://…"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteEntry("downloadableAssets", asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center gap-2 font-medium hover:text-accent"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    {asset.label}
                  </a>
                </>
              )}
            </motion.li>
          ))}
        </ul>

        {editMode && (
          <div className="mt-6 flex justify-center">
            <Button onClick={() => addEntry("downloadableAssets")} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add file
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
