"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

type Star = {
  bx: number;
  by: number;
  r: number;
  tw: number;
  twSpeed: number;
  layer: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
};

type Props = {
  darkMode: boolean;
  /** Fixed full-viewport layer behind page content (portfolio only; not login). */
  fullscreen?: boolean;
  className?: string;
};

function spawnMeteor(w: number, h: number): Meteor {
  const speed = 14 + Math.random() * 20;
  const fromTop = Math.random() < 0.55;
  let x: number;
  let y: number;
  let vx: number;
  let vy: number;

  if (fromTop) {
    x = Math.random() * w * 1.2 - w * 0.1;
    y = -40 - Math.random() * 120;
    const angle = (Math.PI / 4) * (0.35 + Math.random() * 0.55);
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;
  } else {
    const fromLeft = Math.random() < 0.5;
    x = fromLeft ? -60 : w + 60;
    y = Math.random() * h * 0.55;
    vx = (fromLeft ? 0.75 : -0.75) * speed + (Math.random() - 0.5) * 3;
    vy = 0.35 * speed + Math.random() * 4;
  }

  const maxLife = 0.55 + Math.random() * 0.55;
  return { x, y, vx, vy, life: maxLife, maxLife };
}

function spawnComet(w: number, h: number): Comet {
  const fromLeft = Math.random() < 0.5;
  const x = fromLeft ? -80 : w + 80;
  const y = h * (0.15 + Math.random() * 0.45);
  const speed = 1.8 + Math.random() * 1.4;
  const vx = fromLeft ? speed : -speed;
  const vy = (Math.random() - 0.35) * 0.9;
  const maxLife = 5.5 + Math.random() * 4;
  return {
    x,
    y,
    vx,
    vy,
    ax: (Math.random() - 0.5) * 0.012,
    ay: (Math.random() - 0.5) * 0.008,
    life: maxLife,
    maxLife,
    trail: [],
  };
}

export function PortfolioStarrySky({
  darkMode,
  fullscreen = false,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const cometsRef = useRef<Comet[]>([]);
  const nextMeteorAt = useRef(0);
  const nextCometAt = useRef(0);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const initStars = useCallback((w: number, h: number) => {
    const target = Math.min(420, Math.max(140, Math.floor((w * h) / 3800)));
    const stars: Star[] = [];
    for (let i = 0; i < target; i++) {
      stars.push({
        bx: Math.random() * w,
        by: Math.random() * h,
        r: Math.random() * 1.15 + 0.15,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.4 + Math.random() * 2.2,
        layer: Math.floor(Math.random() * 3),
      });
    }
    starsRef.current = stars;
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fullscreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const measure = () => {
      const w = fullscreen
        ? window.innerWidth
        : wrap.clientWidth || window.innerWidth;
      const h = fullscreen
        ? window.innerHeight
        : wrap.clientHeight || window.innerHeight;
      sizeRef.current = { w, h };
      return { w, h };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { w, h } = measure();
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(w, h);
      const now = performance.now();
      nextMeteorAt.current = now + 1500 + Math.random() * 5000;
      nextCometAt.current = now + 12000 + Math.random() * 22000;
    };

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    const drawSkyGradient = (w: number, h: number) => {
      if (darkMode) {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#030814");
        g.addColorStop(0.35, "#0a1028");
        g.addColorStop(0.72, "#0d1530");
        g.addColorStop(1, "#060a14");
        ctx.fillStyle = g;
      } else {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#9eb8d9");
        g.addColorStop(0.45, "#c5d6eb");
        g.addColorStop(1, "#e8eef6");
        ctx.fillStyle = g;
      }
      ctx.fillRect(0, 0, w, h);

      if (darkMode) {
        const ng = ctx.createRadialGradient(
          w * 0.2,
          h * 0.08,
          0,
          w * 0.35,
          h * 0.2,
          Math.max(w, h) * 0.55
        );
        ng.addColorStop(0, "rgba(40, 55, 120, 0.22)");
        ng.addColorStop(0.5, "rgba(20, 30, 70, 0.08)");
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const frame = (now: number) => {
      if (document.visibilityState === "hidden") {
        raf = requestAnimationFrame(frame);
        return;
      }

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      timeRef.current += dt;

      let { w, h } = sizeRef.current;
      if (w < 1 || h < 1) {
        const m = measure();
        w = m.w;
        h = m.h;
      }

      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);
      drawSkyGradient(w, h);

      const parallax = [0.04, 0.09, 0.16];
      const driftX = Math.sin(t * 0.08) * 8;
      const driftY = Math.cos(t * 0.06) * 5;

      for (const s of starsRef.current) {
        const p = parallax[s.layer] ?? 0.08;
        const scroll = fullscreen ? scrollRef.current : 0;
        const sx =
          s.bx +
          driftX * (s.layer + 1) * 0.15 +
          Math.sin(t * 0.03 + s.layer) * p * 6 -
          scroll * (0.012 + p * 0.035) * (s.layer + 1);
        const sy =
          s.by +
          driftY * (s.layer + 1) * 0.12 +
          Math.sin(t * s.twSpeed + s.tw) * 1.2 -
          scroll * 0.004 * (s.layer + 1);

        const twinkle =
          0.45 +
          0.55 * (0.5 + 0.5 * Math.sin(t * s.twSpeed * 1.7 + s.tw));

        if (sx < -2 || sy < -2 || sx > w + 2 || sy > h + 2) continue;

        if (darkMode) {
          ctx.fillStyle = `rgba(230, 242, 255, ${0.35 + twinkle * 0.65})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + twinkle * 0.35})`;
        }
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (now > nextMeteorAt.current && meteorsRef.current.length < 4) {
        meteorsRef.current.push(spawnMeteor(w, h));
        nextMeteorAt.current = now + 1800 + Math.random() * 7000;
      }

      if (now > nextCometAt.current && cometsRef.current.length < 1) {
        cometsRef.current.push(spawnComet(w, h));
        nextCometAt.current = now + 18000 + Math.random() * 28000;
      }

      meteorsRef.current = meteorsRef.current.filter((m) => {
        m.life -= dt;
        m.x += m.vx * dt * 60;
        m.y += m.vy * dt * 60;

        if (m.life <= 0) return false;

        const fade = m.life / m.maxLife;
        const len = 80 + 140 * fade;
        const speed = Math.hypot(m.vx, m.vy) || 1;
        const nx = m.x - (m.vx / speed) * len;
        const ny = m.y - (m.vy / speed) * len;

        const grad = ctx.createLinearGradient(nx, ny, m.x, m.y);
        if (darkMode) {
          grad.addColorStop(0, `rgba(180, 210, 255, 0)`);
          grad.addColorStop(0.45, `rgba(200, 230, 255, ${0.35 * fade})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${0.95 * fade})`);
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
          grad.addColorStop(0.5, `rgba(255, 255, 255, ${0.45 * fade})`);
          grad.addColorStop(1, `rgba(200, 220, 255, ${0.85 * fade})`);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * fade})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        return m.x > -200 && m.x < w + 200 && m.y > -200 && m.y < h + 200;
      });

      cometsRef.current = cometsRef.current.filter((c) => {
        c.life -= dt;
        c.vx += c.ax * dt * 60;
        c.vy += c.ay * dt * 60;
        c.x += c.vx * dt * 55;
        c.y += c.vy * dt * 55;

        c.trail.push({ x: c.x, y: c.y });
        if (c.trail.length > 48) c.trail.shift();

        if (c.life <= 0) return false;

        const fade = c.life / c.maxLife;

        for (let i = 0; i < c.trail.length - 1; i++) {
          const a = i / c.trail.length;
          const alpha = a * a * 0.35 * fade;
          const p0 = c.trail[i];
          const p1 = c.trail[i + 1];
          ctx.strokeStyle = darkMode
            ? `rgba(160, 200, 255, ${alpha})`
            : `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.lineWidth = 3 * (1 - a * 0.85);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }

        const headR = 3.2 + Math.sin(t * 3) * 0.35;
        const glow = ctx.createRadialGradient(
          c.x,
          c.y,
          0,
          c.x,
          c.y,
          headR * 4
        );
        glow.addColorStop(0, `rgba(255, 255, 255, ${0.95 * fade})`);
        glow.addColorStop(0.25, `rgba(200, 230, 255, ${0.5 * fade})`);
        glow.addColorStop(1, `rgba(100, 140, 220, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(c.x, c.y, headR * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, headR * 0.55, 0, Math.PI * 2);
        ctx.fill();

        return c.x > -300 && c.x < w + 300 && c.y > -300 && c.y < h + 300;
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [darkMode, fullscreen, initStars]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "overflow-hidden",
        fullscreen
          ? "pointer-events-none fixed inset-0 z-[1] h-[100dvh] w-full"
          : "absolute inset-0",
        className
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
