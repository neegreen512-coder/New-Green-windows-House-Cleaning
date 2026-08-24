import type { ReactNode } from "react";
import { Reveal } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && <span className={`eyebrow ${centered ? "eyebrow--center" : ""}`}>{eyebrow}</span>}
      <h2 className="h2 mt-4">{title}</h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </Reveal>
  );
}
