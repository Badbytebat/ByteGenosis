"use client";

import * as React from "react";
import { Loader2, Music, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BackgroundMusicTrack } from "@/lib/types";

type Props = {
  tracks: BackgroundMusicTrack[];
  onTracksChange: (next: BackgroundMusicTrack[]) => void;
  onUploadFile: (file: File) => void;
  isUploading: boolean;
  /** When true, no outer card chrome (nested inside editor panel). */
  embedded?: boolean;
};

export default function BackgroundMusicEditor({
  tracks,
  onTracksChange,
  onUploadFile,
  isUploading,
  embedded = false,
}: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [urlLabel, setUrlLabel] = React.useState("");
  const [urlValue, setUrlValue] = React.useState("");

  const nextId = () =>
    tracks.length === 0 ? 1 : Math.max(...tracks.map((t) => t.id)) + 1;

  const updateTrack = (id: number, field: "label" | "url", value: string) => {
    onTracksChange(tracks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const removeTrack = (id: number) => {
    onTracksChange(tracks.filter((t) => t.id !== id));
  };

  const addFromUrl = () => {
    const url = urlValue.trim();
    if (!url) return;
    const label = urlLabel.trim() || `Track ${tracks.length + 1}`;
    onTracksChange([...tracks, { id: nextId(), label, url }]);
    setUrlLabel("");
    setUrlValue("");
  };

  return (
    <div
      className={cn(
        "text-left",
        embedded ? "space-y-2" : "rounded-lg border border-border/80 bg-card/90 p-3 shadow-sm backdrop-blur"
      )}
    >
      {!embedded ? (
        <>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Music className="h-4 w-4 text-accent" />
            Background music
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Visitors see play, mute, and track switch (below). Audio must be started with Play (browser rules).
          </p>
        </>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Play / mute / tracks appear in the bottom bar for visitors.
        </p>
      )}
      <ul className="mb-3 max-h-40 space-y-2 overflow-y-auto">
        {tracks.map((t) => (
          <li
            key={t.id}
            className="flex flex-col gap-1 rounded-md border border-border/60 bg-background/50 p-2 sm:flex-row sm:items-center"
          >
            <Input
              value={t.label}
              onChange={(e) => updateTrack(t.id, "label", e.target.value)}
              className="h-8 text-xs sm:flex-1"
              placeholder="Label"
            />
            <Input
              value={t.url}
              onChange={(e) => updateTrack(t.id, "url", e.target.value)}
              className="h-8 flex-[2] font-mono text-[10px] sm:text-xs"
              placeholder="https://…"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 self-end sm:self-center"
              onClick={() => removeTrack(t.id)}
              aria-label={`Remove ${t.label}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 border-t border-border/60 pt-2">
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="audio/*,.mp3,.m4a,.aac,.ogg,.wav,.webm,.flac"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) onUploadFile(f);
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={isUploading}
            onClick={() => fileRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload audio
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Input
            value={urlLabel}
            onChange={(e) => setUrlLabel(e.target.value)}
            placeholder="Label (optional)"
            className="h-8 text-xs sm:max-w-[8rem]"
          />
          <Input
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="Audio URL"
            className="h-8 flex-1 font-mono text-xs"
          />
          <Button type="button" size="sm" variant="outline" onClick={addFromUrl} className="shrink-0">
            <Plus className="mr-1 h-4 w-4" />
            Add URL
          </Button>
        </div>
      </div>
    </div>
  );
}
