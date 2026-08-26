import type { Metadata } from "next";
import { BeforeAfter } from "@/components/BeforeAfter";
import { CtaBand } from "@/components/CtaBand";
import { images } from "@/lib/site";
import { getGallery } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Before and after: see the difference a New Green clean makes on real homes across Mississauga and the GTA. Drag the slider to compare.",
  alternates: { canonical: "/gallery" },
};

export const revalidate = 60;

type Item = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  same: boolean;
  caption: string;
  service: string;
};

// Sample set, shown until the owner uploads real job photos from /admin.
const fallback: Item[] = [
  { src: images.afterClean.src, caption: "Living room refresh", service: "House Cleaning" },
  { src: images.windowsView.src, caption: "Streak-free windows", service: "Window Cleaning" },
  { src: images.kitchen.src, caption: "Kitchen reset", service: "Deep Cleaning" },
  { src: images.houseCleaning.src, caption: "Whole-home tidy", service: "House Cleaning" },
  { src: images.interior.src, caption: "Sunlit reset", service: "House Cleaning" },
  { src: images.cinematic.src, caption: "Move-in ready", service: "Deep Cleaning" },
].map((x) => ({
  before: { src: x.src, alt: `${x.caption} before a New Green clean` },
  after: { src: x.src, alt: `${x.caption} after a New Green clean` },
  same: true,
  caption: x.caption,
  service: x.service,
}));

export default async function GalleryPage() {
  const cms = await getGallery();
  const items: Item[] = cms.length
    ? cms.map((g) => {
        const twoDistinct = !!g.before_url && !!g.after_url && g.before_url !== g.after_url;
        const single = g.after_url || g.before_url;
        return {
          before: { src: twoDistinct ? g.before_url : single, alt: `${g.caption || "Home"} before` },
          after: { src: twoDistinct ? g.after_url : single, alt: `${g.caption || "Home"} after` },
          same: !twoDistinct,
          caption: g.caption || "",
          service: g.service || "",
        };
      })
    : fallback;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x pb-8 pt-28 lg:pt-32">
          <div className="max-w-2xl">
            <span className="eyebrow">Gallery</span>
            <h1 className="h1 mt-4">Real homes, real results.</h1>
            <p className="lead mt-5">
              Drag any slider to see the difference a proper clean makes, from streak-free glass to a
              whole-home reset. These are the results we hand back across Mississauga and the GTA.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            {items.map((item, i) => (
              <figure key={i}>
                <BeforeAfter before={item.before} after={item.after} treatBefore={item.same} />
                {(item.caption || item.service) && (
                  <figcaption className="mt-3 flex items-center gap-3 px-1">
                    {item.caption && (
                      <span className="text-[1.02rem] font-semibold text-ink">{item.caption}</span>
                    )}
                    {item.service && <span className="label-mono text-brand-700">{item.service}</span>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Want results like these in your home?"
        body="Tell us what you need cleaned and we send a clear quote. It only takes a minute."
      />
    </>
  );
}
