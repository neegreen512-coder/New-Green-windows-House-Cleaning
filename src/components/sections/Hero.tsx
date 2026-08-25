"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Check } from "lucide-react";
import { images } from "@/lib/site";
import { LogoMark } from "@/components/Brand";
import { Bubbles } from "@/components/Motifs";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-28 lg:pt-40">
        {/* Copy */}
        <div className="max-w-xl">
          <motion.p {...fade(0)} className="eyebrow">
            Window &amp; house cleaning, Mississauga &amp; the GTA
          </motion.p>

          <motion.h1 {...fade(0.08)} className="h-display mt-6">
            A cleaner home.
            <br />
            <span className="text-brand-700">A brighter view.</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="lead mt-6 max-w-md">
            Window and house cleaning for homes across Mississauga and the GTA. Streak-free glass,
            spotless rooms, and a clear price before we start.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/quote" className="btn btn-primary btn-lg">
              Get a free quote
              <ArrowRight className="h-[1.05rem] w-[1.05rem]" weight="bold" />
            </Link>
            <Link href="/#services" className="btn btn-secondary btn-lg">
              Explore our services
            </Link>
          </motion.div>

          <motion.ul
            {...fade(0.32)}
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[0.9rem] font-medium text-muted"
          >
            {["Owner-operated", "Insured & bonded", "Background-checked cleaners"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-600" strokeWidth={2.4} />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="relative"
        >
          <Bubbles className="absolute -left-10 -top-8 -z-10 hidden h-40 w-40 lg:block" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-surface shadow-[var(--shadow-xl)] ring-1 ring-black/5 sm:aspect-[16/11]">
            <Image
              src={images.heroClean.src}
              alt={images.heroClean.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
            {/* Branded team badge */}
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-1.5 pr-3.5 shadow-[var(--shadow-md)] backdrop-blur">
              <LogoMark className="h-6 w-6" />
              <span className="text-[0.8rem] font-semibold text-ink">New Green team</span>
            </div>
          </div>

          {/* Insured chip */}
          <div className="absolute -bottom-5 right-4 rounded-xl bg-brand-800 px-4 py-3 text-white shadow-[var(--shadow-lg)] lg:right-8">
            <div className="font-[family-name:var(--font-bricolage)] text-lg font-bold leading-none">
              Fully insured
            </div>
            <div className="mt-1 text-[0.72rem] text-brand-100/80">Free, no-obligation quotes</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
