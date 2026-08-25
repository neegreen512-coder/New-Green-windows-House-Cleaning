"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ReviewForm } from "@/components/ReviewForm";
import { testimonials as fallbackData } from "@/lib/site";
import { getApprovedReviews, type CmsReview } from "@/lib/cms";

const FALLBACK: CmsReview[] = fallbackData.map((t, i) => ({ id: -(i + 1), ...t }));

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ReviewCard({ r }: { r: CmsReview }) {
  return (
    <figure className="card flex w-[20.5rem] shrink-0 flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[var(--shadow-lg)]">
      <div className="flex items-center gap-3">
        {r.avatar ? (
          <Image
            src={r.avatar}
            alt={r.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-line"
          />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
            {initials(r.name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-[0.95rem] font-semibold text-ink">{r.name}</div>
          {r.context && <div className="truncate text-[0.8rem] text-muted">{r.context}</div>}
        </div>
        <div className="ml-auto flex gap-0.5">
          {Array.from({ length: Math.max(0, Math.min(5, r.rating || 5)) }).map((_, s) => (
            <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={0} />
          ))}
        </div>
      </div>
      <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/85">
        “{r.quote}”
      </blockquote>
      {r.photos && r.photos.length > 0 && (
        <div className="mt-4 flex gap-2">
          {r.photos.slice(0, 3).map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p} src={p} alt="" className="h-14 w-14 rounded-lg object-cover ring-1 ring-line" />
          ))}
        </div>
      )}
      {r.service && (
        <div className="mt-5 border-t border-line pt-4">
          <span className="label-mono text-brand-700">{r.service}</span>
        </div>
      )}
    </figure>
  );
}

function SkeletonCard() {
  return (
    <div className="card w-[20.5rem] shrink-0 p-6">
      <div className="flex items-center gap-3">
        <div className="skel h-12 w-12 rounded-full" />
        <div className="flex-1">
          <div className="skel h-3 w-28 rounded" />
          <div className="skel mt-2 h-2.5 w-16 rounded" />
        </div>
      </div>
      <div className="skel mt-6 h-3 w-full rounded" />
      <div className="skel mt-2.5 h-3 w-11/12 rounded" />
      <div className="skel mt-2.5 h-3 w-4/6 rounded" />
      <div className="skel mt-6 h-3 w-24 rounded" />
    </div>
  );
}

export function Testimonials() {
  const [reviews, setReviews] = useState<CmsReview[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let active = true;
    getApprovedReviews()
      .then((live) => active && setReviews(live.length ? live : FALLBACK))
      .catch(() => active && setReviews(FALLBACK));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section bg-surface-muted">
      <div className="container-x">
        <SectionHeading
          eyebrow="Kind words"
          title="What a great clean feels like."
          lead="Real words from the homeowners we clean for across Mississauga and the GTA."
          align="center"
        />
      </div>

      <div className="mt-14">
        {reviews === null ? (
          <div className="container-x flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="marquee">
            <div className="marquee-track px-2">
              {[...reviews, ...reviews].map((r, i) => (
                <ReviewCard key={i} r={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container-x mt-10 text-center">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="btn btn-secondary">
            Leave a review
          </button>
        ) : (
          <div className="mx-auto mt-4 max-w-xl text-left">
            <ReviewForm onClose={() => setShowForm(false)} />
          </div>
        )}
      </div>
    </section>
  );
}
