"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { images } from "@/lib/site";

export function CinematicBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative h-[62vh] min-h-[440px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 scale-[1.18]">
        <Image
          src={images.cinematic.src}
          alt={images.cinematic.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,42,34,0.9),rgba(11,42,34,0.35)_55%,rgba(11,42,34,0.15))]" />

      <div className="container-x relative flex h-full items-end pb-14 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl on-dark"
        >
          <span className="eyebrow text-accent-soft">In every home</span>
          <h2 className="h2 mt-4 text-white">
            Cleaning you can see. Care you can feel.
          </h2>
          <p className="mt-4 max-w-lg text-brand-100/85">
            Our team treats your home the way we would treat our own, with steady attention to the
            spots most people miss.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
