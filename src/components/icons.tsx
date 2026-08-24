import {
  ShieldCheck,
  Sparkle,
  Leaf,
  CalendarCheck,
  Smiley,
  Target,
  Clock,
  Path,
  Heart,
  NotePencil,
  Receipt,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";

type Weight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
type IconCmp = ComponentType<{ className?: string; weight?: Weight; "aria-hidden"?: boolean }>;

const MAP = {
  shield: ShieldCheck,
  sparkles: Sparkle,
  leaf: Leaf,
  calendar: CalendarCheck,
  smile: Smiley,
  target: Target,
  clock: Clock,
  route: Path,
  heart: Heart,
  note: NotePencil,
  receipt: Receipt,
} as unknown as Record<string, IconCmp>;

export function Icon({
  name,
  className,
  weight = "duotone",
}: {
  name: string;
  className?: string;
  weight?: Weight;
}) {
  const Cmp = MAP[name] ?? MAP.sparkles;
  return <Cmp className={className} weight={weight} aria-hidden />;
}
