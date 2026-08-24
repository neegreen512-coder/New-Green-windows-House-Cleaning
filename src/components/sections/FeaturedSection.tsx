import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RevealImage } from "@/components/motion";
import { images } from "@/lib/site";

export function FeaturedSection() {
  return (
    <section className="section pt-0">
      <div className="container-x">
        <RevealImage>
          <div className="relative overflow-hidden rounded-[2rem] border border-line shadow-[var(--shadow-lg)]">
            <div className="relative aspect-[16/10] w-full sm:aspect-[16/8] lg:aspect-[16/6.5]">
              <Image
                src={images.kitchen.src}
                alt={images.kitchen.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,42,34,0.92)_0%,rgba(11,42,34,0.7)_38%,rgba(11,42,34,0.15)_75%,transparent_100%)]"
                aria-hidden="true"
              />
            </div>

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 py-8 on-dark sm:px-10 lg:px-14">
                <span className="eyebrow text-accent-soft">Every room, considered</span>
                <h2 className="h2 mt-4 text-white">
                  A home that feels brand&nbsp;new, without the effort.
                </h2>
                <p className="mt-4 max-w-md text-brand-100/85">
                  Kitchens, bathrooms, living spaces and bedrooms, cleaned to a standard you&apos;ll
                  notice the moment you walk in. Book a one-time refresh or a recurring plan.
                </p>
                <Link href="/house-cleaning" className="btn btn-on-dark mt-7">
                  Explore House Cleaning
                  <ArrowRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </RevealImage>
      </div>
    </section>
  );
}
