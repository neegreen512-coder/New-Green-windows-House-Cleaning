import Link from "next/link";
import { business } from "@/lib/site";

/**
 * New Green mark ("Clear Drop"): a green pane of glass with a water droplet cut
 * out as negative space, so the drop always shows the surface behind it. A small
 * brass gleam sits in the field. Adapts to light and dark surfaces.
 */
export function LogoMark({
  className = "",
  tone = "light",
  title = "New Green",
}: {
  className?: string;
  tone?: "light" | "dark";
  title?: string;
}) {
  const isDark = tone === "dark";
  const pane = isDark ? "#eef4f0" : "#124a37";
  const gleam = isDark ? "#e0bd72" : "#c0902f";

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="ngDrop">
          <rect x="2" y="2" width="44" height="44" rx="14" fill="white" />
          <path
            d="M24 10 C27.6 15.2 34.5 20.9 34.5 28.5 A10.5 10.5 0 1 1 13.5 28.5 C13.5 20.9 20.4 15.2 24 10 Z"
            fill="black"
          />
        </mask>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill={pane} mask="url(#ngDrop)" />
      <circle cx="33.6" cy="13.6" r="2.5" fill={gleam} />
    </svg>
  );
}

export function Brand({
  tone = "default",
  className = "",
}: {
  tone?: "default" | "onDark";
  className?: string;
}) {
  const onDark = tone === "onDark";

  return (
    <Link
      href="/"
      aria-label={`${business.name}, home`}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <LogoMark tone={onDark ? "dark" : "light"} className="h-9 w-9 shrink-0" />
      <span
        className={`font-[family-name:var(--font-bricolage)] text-[1.3rem] font-semibold leading-none tracking-[-0.02em] ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        New Green
      </span>
    </Link>
  );
}
