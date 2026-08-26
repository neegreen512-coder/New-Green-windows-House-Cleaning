import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { getPost } from "@/lib/cms";
import { business } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  tag: string;
  readMin: number;
  date: string;
  body: string;
};

async function resolvePost(slug: string): Promise<Article | null> {
  const cms = await getPost(slug);
  if (cms) {
    return {
      slug: cms.slug,
      title: cms.title,
      excerpt: cms.excerpt,
      cover: cms.cover || "",
      tag: cms.tag || "",
      readMin: cms.read_min || 4,
      date: cms.created_at || "",
      body: cms.body || "",
    };
  }
  const local = getBlogPost(slug);
  if (local) {
    return {
      slug: local.slug,
      title: local.title,
      excerpt: local.excerpt,
      cover: local.cover,
      tag: local.tag,
      readMin: local.readMin,
      date: local.date,
      body: local.body,
    };
  }
  return null;
}

function fmtDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  // Line-based render: "## " lines become subheadings; consecutive text lines
  // become a paragraph; blank lines break paragraphs.
  const nodes: React.ReactNode[] = [];
  let para: string[] = [];
  let k = 0;
  const flush = () => {
    if (para.length) {
      nodes.push(
        <p key={k++} className="mt-5 text-[1.07rem] leading-[1.75] text-ink/85 first:mt-0">
          {para.join(" ")}
        </p>
      );
      para = [];
    }
  };
  for (const raw of post.body.split("\n")) {
    const t = raw.trim();
    if (!t) {
      flush();
      continue;
    }
    if (t.startsWith("## ")) {
      flush();
      nodes.push(
        <h2 key={k++} className="h3 mt-10 first:mt-0">
          {t.slice(3)}
        </h2>
      );
      continue;
    }
    para.push(t);
  }
  flush();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date || undefined,
    author: { "@type": "Organization", name: business.name },
    publisher: { "@type": "Organization", name: business.name },
    mainEntityOfPage: `https://${business.domain}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <section className="relative overflow-hidden">
          <div className="container-x pb-6 pt-28 lg:pt-32">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand-800"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                All articles
              </Link>
              <div className="mt-6 flex items-center gap-3">
                {post.tag && <span className="tag">{post.tag}</span>}
                <span className="label-mono text-muted">
                  {[fmtDate(post.date), `${post.readMin} min read`].filter(Boolean).join("  ·  ")}
                </span>
              </div>
              <h1 className="h1 mt-4">{post.title}</h1>
              <p className="lead mt-5">{post.excerpt}</p>
            </div>
          </div>
        </section>

        {post.cover && (
          <div className="container-x">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-lg)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover} alt="" className="aspect-[16/9] w-full object-cover" />
            </div>
          </div>
        )}

        <section className="section pt-10">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">{nodes}</div>
          </div>
        </section>
      </article>

      <CtaBand />
    </>
  );
}
