import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { blogPosts } from "@/lib/blog";
import { getPosts } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Cleaning tips, seasonal guides, and straight advice from New Green — streak-free windows, house-cleaning routines, and keeping a home fresh across Mississauga and the GTA.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

type Card = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  tag: string;
  readMin: number;
  date: string;
};

function fmtDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

export default async function BlogPage() {
  const cms = await getPosts();
  const cards: Card[] = cms.length
    ? cms.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover: p.cover || "",
        tag: p.tag || "",
        readMin: p.read_min || 4,
        date: fmtDate(p.created_at),
      }))
    : blogPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover: p.cover,
        tag: p.tag,
        readMin: p.readMin,
        date: fmtDate(p.date),
      }));

  const [featured, ...rest] = cards;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x pb-8 pt-28 lg:pt-32">
          <div className="max-w-2xl">
            <span className="eyebrow">The Journal</span>
            <h1 className="h1 mt-4">Cleaning tips & guides.</h1>
            <p className="lead mt-5">
              Practical advice for keeping a home bright and fresh, from streak-free glass to
              seasonal resets, written for homes across Mississauga and the GTA.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container-x">
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="card card-hover group mb-8 grid overflow-hidden lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                {featured.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.cover}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-7 lg:p-10">
                <div className="flex items-center gap-3">
                  {featured.tag && <span className="tag">{featured.tag}</span>}
                  <span className="label-mono text-muted">
                    {[featured.date, `${featured.readMin} min read`].filter(Boolean).join("  ·  ")}
                  </span>
                </div>
                <h2 className="h3 mt-4">{featured.title}</h2>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{featured.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-800">
                  Read the article
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          )}

          {/* Rest */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    {p.tag && <span className="label-mono text-brand-700">{p.tag}</span>}
                  </div>
                  <h2 className="mt-2 text-[1.15rem] font-semibold leading-snug text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[0.94rem] leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-4 label-mono text-muted">
                    {[p.date, `${p.readMin} min read`].filter(Boolean).join("  ·  ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready for a home that shines?"
        body="Reading is nice, but a real clean is nicer. Tell us about your home and we send a clear quote."
      />
    </>
  );
}
