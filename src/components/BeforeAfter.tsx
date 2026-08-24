"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { useReducedMotion } from "framer-motion";

type Img = { src: string; alt: string };

/**
 * Before/after comparison. Left is the messy "before", right is the clean
 * "after". Auto-sweeps once when it scrolls into view to show the difference,
 * then stays draggable (pointer + keyboard).
 */
export function BeforeAfter({
  before,
  after,
  className = "",
}: {
  before: Img;
  after: Img;
  className?: string;
}) {
  const [pos, setPos] = useState(55);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const reduce = useReducedMotion();

  const setFromX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, p)));
  }, []);

  // Auto sweep once when it enters view.
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const sweep = () => {
      const start = performance.now();
      const dur = 2800;
      const kf = [
        { t: 0, v: 52 },
        { t: 0.28, v: 15 },
        { t: 0.64, v: 87 },
        { t: 1, v: 54 },
      ];
      const step = () => {
        if (touched.current) return;
        const e = Math.min(1, (performance.now() - start) / dur);
        let v = kf[0].v;
        for (let i = 1; i < kf.length; i++) {
          if (e <= kf[i].t) {
            const a = kf[i - 1];
            const b = kf[i];
            const f = (e - a.t) / (b.t - a.t);
            v = a.v + (b.v - a.v) * (f * f * (3 - 2 * f));
            break;
          }
        }
        setPos(v);
        if (e < 1 && !touched.current) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !touched.current) {
          sweep();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce]);

  const onKey = (e: React.KeyboardEvent) => {
    touched.current = true;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  return (
    <div
      ref={ref}
      className={`group relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-lg)] ring-1 ring-black/5 ${className}`}
      onPointerDown={(e) => {
        touched.current = true;
        setDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromX(e.clientX);
      }}
      onPointerMove={(e) => dragging && setFromX(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {/* AFTER (clean) base layer */}
      <Image src={after.src} alt={after.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />
      <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-brand-800/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
        After
      </span>

      {/* BEFORE (messy) clipped to the left of the handle */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
        <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          Before
        </span>
      </div>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.25)]" />
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          tabIndex={0}
          onKeyDown={onKey}
          className="pointer-events-auto absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-[var(--shadow-md)] transition-transform duration-200 group-hover:scale-105"
        >
          <MoveHorizontal className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
