"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX, Play, Pause, Music, ChevronLeft, ChevronRight } from "lucide-react";
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
import { tryExtractPortfolioStorageObjectPath } from "@/lib/supabase-storage-path";

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
  const [playableSrc, setPlayableSrc] = React.useState("");
  const [loadHint, setLoadHint] = React.useState<string | null>(null);

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
  const src = active?.url?.trim() ?? "";

  /** Private Supabase buckets need a signed URL; public buckets use the stored URL as-is. */
  React.useEffect(() => {
    let cancelled = false;
    setLoadHint(null);
    if (!src) {
      setPlayableSrc("");
      return;
    }
    setPlayableSrc(src);
    const objectPath = tryExtractPortfolioStorageObjectPath(src);
    if (!objectPath) return () => {
      cancelled = true;
    };

    (async () => {
      try {
        const r = await fetch(
          `/api/storage-signed-url?path=${encodeURIComponent(objectPath)}`,
          { cache: "no-store" }
        );
        if (cancelled) return;
        if (r.status === 501) {
          return;
        }
        if (!r.ok) return;
        const j = (await r.json()) as { signedUrl?: string; error?: string };
        if (j.signedUrl) setPlayableSrc(j.signedUrl);
      } catch {
        /* keep public URL */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  React.useLayoutEffect(() => {
    const el = audioRef.current;
    if (!el || !playableSrc) return;
    el.pause();
    setPlaying(false);
    el.removeAttribute("crossOrigin");
    el.src = playableSrc;
    el.loop = true;
    el.volume = 1;
    el.muted = muted;
    el.load();
  }, [playableSrc]);

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
    const onPlay = () => {
      setLoadHint(null);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      setLoadHint(
        "Could not load this track. For Supabase: make the `portfolio-files` bucket public for reads, or set SUPABASE_SERVICE_ROLE_KEY (server only) for signed URLs."
      );
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [playableSrc]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !playableSrc) return;
    setLoadHint(null);
    if (!el.paused) {
      el.pause();
      return;
    }
    const failLoad = () => {
      setPlaying(false);
      setLoadHint(
        "Could not load this track. For Supabase: make the `portfolio-files` bucket public for reads, or set SUPABASE_SERVICE_ROLE_KEY (server only) for signed URLs."
      );
    };
    const playWhenReady = () => {
      void el
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
          setLoadHint("Playback was blocked or failed. Click Play again, or check the track URL / Supabase access.");
        });
    };
    if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      playWhenReady();
      return;
    }
    const timeoutId = window.setTimeout(() => {
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("error", onErr);
      if (el.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        setLoadHint("Track is taking too long to load. Check the Network tab for 403 on the audio URL.");
      }
    }, 12000);

    function onReady() {
      window.clearTimeout(timeoutId);
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("error", onErr);
      playWhenReady();
    }
    function onErr() {
      window.clearTimeout(timeoutId);
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("error", onErr);
      failLoad();
    }
    el.addEventListener("canplay", onReady, { once: true });
    el.addEventListener("error", onErr, { once: true });
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

  const rawIdx = tracks.findIndex((t) => t.id === activeId);
  const trackIndex = rawIdx === -1 ? 0 : rawIdx;
  const canSkip = tracks.length > 1;
  const goPrev = () => {
    if (!canSkip) return;
    const i = trackIndex <= 0 ? tracks.length - 1 : trackIndex - 1;
    onTrackChange(String(tracks[i].id));
  };
  const goNext = () => {
    if (!canSkip) return;
    const i = trackIndex >= tracks.length - 1 ? 0 : trackIndex + 1;
    onTrackChange(String(tracks[i].id));
  };

  if (!mounted || tracks.length === 0) return null;

  const ui = (
    <div
      className={cn(
        "pointer-events-auto fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-1 sm:bottom-8",
        "max-w-[min(100vw-1rem,28rem)]"
      )}
      role="region"
      aria-label="Background music"
    >
      {loadHint ? (
        <p className="max-h-24 overflow-y-auto rounded-lg border border-destructive/40 bg-background/95 px-3 py-2 text-center text-[11px] leading-snug text-destructive shadow-lg backdrop-blur">
          {loadHint}
        </p>
      ) : null}
      <div
        className={cn(
          "flex w-full items-center gap-1.5 rounded-2xl border border-primary/25 bg-gradient-to-br from-card/95 via-background/90 to-card/95 px-2 py-2 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.35),0_0_0_1px_hsl(var(--accent)/0.12)] backdrop-blur-xl sm:gap-2 sm:px-3",
          playing && "ring-1 ring-accent/40"
        )}
      >
        <audio
          ref={audioRef}
          preload="auto"
          loop
          playsInline
          className="pointer-events-none fixed left-0 top-0 h-[1px] w-[1px] opacity-[0.01]"
          aria-hidden
        />
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary",
            playing && "animate-pulse shadow-[0_0_16px_hsl(var(--accent)/0.45)]"
          )}
          aria-hidden
        >
          <Music className="h-4 w-4" />
        </div>
        {canSkip ? (
          <Button
            type="button"
            data-matrix-cta
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0 rounded-xl hover:bg-primary/10"
            onClick={goPrev}
            aria-label="Previous track"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          type="button"
          data-matrix-cta
          size="icon"
          variant="ghost"
          className="h-9 w-9 shrink-0 rounded-xl hover:bg-primary/10"
          onClick={togglePlay}
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </Button>
        {canSkip ? (
          <Button
            type="button"
            data-matrix-cta
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0 rounded-xl hover:bg-primary/10"
            onClick={goNext}
            aria-label="Next track"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          type="button"
          data-matrix-cta
          size="icon"
          variant="ghost"
          className="h-9 w-9 shrink-0 rounded-xl hover:bg-primary/10"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        {tracks.length > 1 ? (
          <Select value={String(activeId)} onValueChange={onTrackChange}>
            <SelectTrigger
              type="button"
              data-matrix-cta
              className="h-9 min-w-0 flex-1 rounded-xl border-border/60 bg-muted/30 text-xs sm:text-sm"
            >
              <SelectValue placeholder="Track" />
            </SelectTrigger>
            <SelectContent className="z-[250]">
              {tracks.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="truncate px-1 text-xs font-medium text-foreground/90 sm:text-sm">{active?.label}</span>
        )}
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
