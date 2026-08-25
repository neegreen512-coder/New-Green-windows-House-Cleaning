import Link from "next/link";
import { business } from "@/lib/site";

/**
 * New Green mark: the brand "N", a bold capital N with two-tone green strokes
 * (deep forest verticals, fresh-green diagonal). Adapts to light and dark
 * surfaces via the `tone` prop.
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
  const bar = isDark ? "#eef4f0" : "#124a37";
  const diag = isDark ? "#6cc070" : "#43a047";

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="11,9 19,9 37,39 29,39" fill={diag} />
      <polygon points="11,9 19,9 19,39 11,39" fill={bar} />
      <polygon points="29,9 37,9 37,39 29,39" fill={bar} />
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
