"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icons";
import { processSteps } from "@/lib/site";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const olRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  // Measure the mobile rail so it spans exactly node 1 -> node 4 (no overshoot
  // past the last icon, since the last step's text extends below its node).
  const [mRail, setMRail] = useState<{ top: number; height: number } | null>(null);
  useIsoLayoutEffect(() => {
    const measure = () => {
      const wrap = ref.current;
      const ol = olRef.current;
      if (!wrap || !ol) return;
      const nodes = ol.querySelectorAll<HTMLElement>("[data-node]");
      if (nodes.length < 2) return;
      const wrapTop = wrap.getBoundingClientRect().top;
      const first = nodes[0].getBoundingClientRect();
      const last = nodes[nodes.length - 1].getBoundingClientRect();
      const top = first.top + first.height / 2 - wrapTop;
      const bottom = last.top + last.height / 2 - wrapTop;
      setMRail({ top, height: Math.max(0, bottom - top) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 74%", "end 62%"],
  });

  // Smooth, cursor-like follow: the dot eases toward the scroll position both
  // ways (no one-time limit — scroll down it drifts right, scroll up it drifts back).
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.5 });
  const dotX = useTransform(smooth, [0, 1], ["0%", "100%"]);
  const dotOpacity = useTransform(smooth, [0, 0.03, 0.985, 1], [0, 1, 1, 0.6]);

  const [p, setP] = useState(reduce ? 1 : 0);
  useMotionValueEvent(smooth, "change", (v) => {
    if (!reduce) setP(v);
  });

  const n = processSteps.length;
  const lit = (i: number) => p >= Math.max(0.02, i / (n - 1) - 0.03);

  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow eyebrow--center justify-center">How it works</span>
          <h2 className="h2 mt-4">From quote to spotless in four steps.</h2>
          <p className="lead mt-5">
            A simple, transparent path, from your first message to a home that shines.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-14 lg:mt-20">
          {/* Connector + the single light that eases along with your scroll */}
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-[2px] bg-ink/15 lg:block"
            aria-hidden="true"
          >
            {!reduce && (
              <motion.span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_4px_rgba(20,32,27,0.12),0_0_18px_5px_rgba(20,32,27,0.45)]"
                style={{ left: dotX, opacity: dotOpacity }}
              />
            )}
          </div>
          <div
            className="pointer-events-none absolute left-7 w-[2px] bg-ink/15 lg:hidden"
            style={{ top: mRail?.top ?? 28, height: mRail?.height ?? 0 }}
            aria-hidden="true"
          >
            {!reduce && (
              <motion.span
                className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_4px_rgba(20,32,27,0.12),0_0_18px_5px_rgba(20,32,27,0.45)]"
                style={{ top: dotX, opacity: dotOpacity }}
              />
            )}
          </div>

          <ol ref={olRef} className="flex flex-col gap-10 lg:flex-row lg:gap-0">
            {processSteps.map((step, i) => {
              const on = lit(i);
              return (
                <li key={step.n} className="relative lg:flex-1 lg:px-3">
                  <div className="flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                    <div
                      data-node
                      className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl ring-1 ring-ink/10 transition-all duration-500 ${
                        on
                          ? "scale-110 bg-ink text-white shadow-[0_16px_32px_-12px_rgba(10,18,14,0.7)]"
                          : "bg-surface text-ink shadow-[var(--shadow-sm)]"
                      }`}
                    >
                      <Icon name={step.icon} className="h-[1.6rem] w-[1.6rem]" />
                    </div>
                    <div className="lg:mt-6">
                      <span
                        className={`label-mono transition-colors duration-500 ${
                          on ? "text-ink" : "text-ink/55"
                        }`}
                      >
                        Step {step.n}
                      </span>
                      <h3 className="mt-1 text-[1.15rem] font-semibold text-ink">{step.title}</h3>
                      <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-muted lg:mx-auto">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
