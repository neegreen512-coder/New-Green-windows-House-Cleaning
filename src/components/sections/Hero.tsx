"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { images } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* Full-bleed photography */}
      <Image
        src={images.heroLuxury.src}
        alt={images.heroLuxury.alt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Legibility scrim — layered so white type stays crisp over a bright room */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,17,13,0.64) 0%, rgba(6,17,13,0.34) 34%, rgba(6,17,13,0.30) 60%, rgba(6,17,13,0.60) 100%), radial-gradient(62% 52% at 50% 46%, rgba(6,17,13,0.42), transparent 72%)",
        }}
      />

      <div className="container-x relative w-full">
        <div className="mx-auto max-w-3xl pb-20 pt-32 text-center lg:pb-24 lg:pt-36">
          <motion.h1
            {...fade(0.05)}
            className="font-[family-name:var(--font-bricolage)] text-[clamp(2.9rem,1.4rem+6vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.034em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]"
          >
            A cleaner home.
            <br />
            <span className="text-brand-100">A brighter view.</span>
          </motion.h1>

          <motion.p
            {...fade(0.16)}
            className="mx-auto mt-6 max-w-xl text-[1.075rem] leading-relaxed text-white/85 sm:text-[1.18rem]"
          >
            Premium window and house cleaning for homes across Mississauga and the GTA. Streak-free
            glass, spotless rooms, and a clear price before we start.
          </motion.p>

          <motion.div
            {...fade(0.26)}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/quote" className="btn btn-ink btn-lg">
              Get your free estimate
              <ArrowRight className="h-[1.05rem] w-[1.05rem]" weight="bold" />
            </Link>
            <Link href="/#services" className="btn btn-outline-light btn-lg">
              Explore our services
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
