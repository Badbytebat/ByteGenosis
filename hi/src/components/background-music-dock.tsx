"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BackgroundMusicTrack } from "@/lib/types";

const LS_TRACK = "portfolio-music-track-id";
const LS_MUTED = "portfolio-music-muted";

type Props = {
  tracks: BackgroundMusicTrack[];
  /** Fires when actual playback starts/stops (for starfield sync). */
  onPlayingChange?: (playing: boolean) => void;
};

/**
 * Floating audio controls (center-bottom). Browsers block autoplay with sound;
 * visitor taps Play to start. Track + mute preferences persist in localStorage.
 */
export default function BackgroundMusicDock({ tracks, onPlayingChange }: Props) {
  const [mounted, setMounted] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = React.useState<number>(() => tracks[0]?.id ?? 0);
  const [muted, setMuted] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (tracks.length === 0) return;
    try {
      const raw = localStorage.getItem(LS_TRACK);
      const id = raw ? parseInt(raw, 10) : NaN;
      if (Number.isFinite(id) && tracks.some((t) => t.id === id)) {
        setActiveId(id);
      } else {
        setActiveId(tracks[0].id);
      }
      setMuted(localStorage.getItem(LS_MUTED) === "1");
    } catch {
      setActiveId(tracks[0].id);
    }
  }, [tracks]);

  const active = tracks.find((t) => t.id === activeId) ?? tracks[0];
  const src = active?.url ?? "";

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;
    el.pause();
    setPlaying(false);
    el.src = src;
    el.muted = muted;
    el.loop = true;
  }, [src]);

  React.useEffect(() => {
    const el = audioRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  React.useEffect(() => {
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !src) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(LS_MUTED, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const onTrackChange = (v: string) => {
    const id = parseInt(v, 10);
    if (!Number.isFinite(id)) return;
    setActiveId(id);
    try {
      localStorage.setItem(LS_TRACK, String(id));
    } catch {
      /* ignore */
    }
  };

  if (!mounted || tracks.length === 0) return null;

  const ui = (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-1 rounded-full border border-border/80 bg-background/85 px-2 py-1.5 shadow-lg backdrop-blur-md sm:gap-2 sm:px-3",
        "max-w-[min(100vw-1rem,28rem)]"
      )}
      role="region"
      aria-label="Background music"
    >
      <audio ref={audioRef} preload="metadata" loop playsInline className="hidden" />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-9 w-9 shrink-0"
        onClick={togglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-9 w-9 shrink-0"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      {tracks.length > 1 ? (
        <Select value={String(activeId)} onValueChange={onTrackChange}>
          <SelectTrigger className="h-9 min-w-0 flex-1 border-0 bg-transparent text-xs sm:text-sm">
            <SelectValue placeholder="Track" />
          </SelectTrigger>
          <SelectContent className="z-[110]">
            {tracks.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="truncate px-1 text-xs text-muted-foreground sm:text-sm">{active?.label}</span>
      )}
    </div>
  );

  return createPortal(ui, document.body);
}
