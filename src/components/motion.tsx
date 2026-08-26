"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reveal on scroll-in, with a hard fail-safe: content is guaranteed to show
 * even if the viewport observer never fires (which we saw hide images on some
 * mobile browsers). inView reveals it; a short timeout reveals it regardless.
 */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (inView) setShow(true);
  }, [inView]);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return { ref, show };
}

/** Premium reveal: rise + de-blur into place. Respects reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal();
  // Runtime picks the real element from `as`; the type cast keeps the ref simple.
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Curtain reveal for imagery: unmasks top-to-bottom while settling from a
 *  slight zoom. Gives the "structure fills in" feel on scroll. */
export function RevealImage({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.06 }}
      animate={show ? { clipPath: "inset(0 0 0% 0)", scale: 1 } : undefined}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
