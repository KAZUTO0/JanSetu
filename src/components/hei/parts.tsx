"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import type { Category, Challenge, MatchFactor, ProjectMember, ProjectStage } from "@/lib/types";
import { CATEGORY_META } from "@/lib/data/categories";
import { CoverImage, CategoryIcon } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils";

/* ============================================================
   HEI module shared parts — persona: BIT Mesra Coordination Cell
   ============================================================ */

export const MY_HEI_ID = "bit-mesra";

/* ---------------- Capability-match computation ---------------- */

export interface BitMatch {
  percent: number;
  factors: MatchFactor[];
  /** true when BIT Mesra appears in the challenge's heiMatches list */
  exact: boolean;
}

/**
 * BIT Mesra match for a challenge. When the institution is present in the
 * challenge's heiMatches we use its own score; otherwise we derive a mock
 * score from the top-ranked institution (top match − 6).
 */
export function bitMatchOf(challenge: Challenge): BitMatch {
  const sorted = [...challenge.heiMatches].sort(
    (a, b) => b.matchPercent - a.matchPercent
  );
  const mine = sorted.find((m) => m.heiId === MY_HEI_ID);
  if (mine) {
    return { percent: mine.matchPercent, factors: mine.factors, exact: true };
  }
  const top = sorted[0];
  if (!top) {
    return { percent: 50, factors: [], exact: false };
  }
  return {
    percent: Math.max(0, top.matchPercent - 6),
    factors: top.factors,
    exact: false,
  };
}

/** Top-N match factors sorted by weight (e.g. "Faculty Expertise 94%"). */
export function topFactors(factors: MatchFactor[], count = 2): MatchFactor[] {
  return [...factors]
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

/* ---------------- Project stage + member type meta ---------------- */

export const PROJECT_STAGE_META: Record<ProjectStage, { color: string; step: number }> = {
  Research: { color: "#2C8C99", step: 0 },
  Prototype: { color: "#0E8A6D", step: 1 },
  Testing: { color: "#96A33B", step: 2 },
  Pilot: { color: "#E0A538", step: 3 },
  Deployment: { color: "#0A5C48", step: 4 },
};

export const PROJECT_STAGE_ORDER: ProjectStage[] = [
  "Research",
  "Prototype",
  "Testing",
  "Pilot",
  "Deployment",
];

export function ProjectStageBadge({
  stage,
  className,
}: {
  stage: ProjectStage;
  className?: string;
}) {
  const meta = PROJECT_STAGE_META[stage];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        className
      )}
      style={{ background: `${meta.color}1A`, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {stage}
    </span>
  );
}

export const MEMBER_TYPE_META: Record<ProjectMember["type"], { color: string; label: string }> = {
  faculty: { color: "#0E8A6D", label: "Faculty" },
  student: { color: "#2C8C99", label: "Student" },
  industry: { color: "#E0A538", label: "Industry" },
  mentor: { color: "#96A33B", label: "Mentor" },
};

/* ---------------- Small building blocks ---------------- */

/** Colored circular initials tile (team members, chat participants). */
export function InitialsTile({
  initials,
  color,
  size = 38,
  className,
}: {
  initials: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 select-none place-items-center rounded-full font-bold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.max(9, Math.round(size * 0.3)),
      }}
    >
      {initials}
    </span>
  );
}

/** Overlapping initials avatar stack with "+n" overflow. */
export function AvatarStack({
  members,
  max = 4,
  size = 27,
}: {
  members: ProjectMember[];
  max?: number;
  size?: number;
}) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((m) => (
          <span
            key={m.name}
            className="grid place-items-center rounded-full border-2 border-card font-bold text-white"
            style={{
              width: size,
              height: size,
              background: MEMBER_TYPE_META[m.type].color,
              fontSize: Math.max(8, Math.round(size * 0.34)),
            }}
            title={`${m.name} · ${m.role}`}
          >
            {m.initials}
          </span>
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-[11px] font-semibold text-ink-soft">+{extra}</span>
      )}
    </div>
  );
}

/** Author tile color: matches an update author back to a team member type. */
export function memberTypeOf(
  team: ProjectMember[],
  name: string
): ProjectMember["type"] | undefined {
  return team.find((m) => m.name === name)?.type;
}

/** Initials for an arbitrary display name, e.g. "Dr. Ananya Sen" -> "AS". */
export function initialsOf(name: string): string {
  const parts = name
    .replace(/^(Dr|Er|Capt|Prof)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Animated gradient progress bar. */
export function Bar({
  value,
  height = 6,
  from = "#0E8A6D",
  to = "#45B08C",
  delay = 0.15,
  className,
}: {
  value: number;
  height?: number;
  from?: string;
  to?: string;
  delay?: number;
  className?: string;
}) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-secondary", className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
      />
    </div>
  );
}

/** Compact stat tile with count-up number. */
export function StatTile({
  value,
  label,
  format,
  icon,
  accent = false,
  className,
}: {
  value: number;
  label: string;
  format?: (n: number) => string;
  icon?: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex-1 rounded-2xl p-3 text-center",
        accent ? "bg-brand-mist" : "bg-secondary",
        className
      )}
    >
      {icon && (
        <div className={cn("mb-1.5 flex justify-center", accent ? "text-brand" : "text-ink-soft")}>
          {icon}
        </div>
      )}
      <p
        className={cn(
          "nums text-[17px] font-extrabold leading-none tracking-[-0.01em]",
          accent ? "text-brand-deep" : "text-ink"
        )}
      >
        <AnimatedNumber value={value} format={format} duration={1.05} />
      </p>
      <p className="mt-1.5 text-[9.5px] font-bold uppercase leading-tight tracking-[0.06em] text-ink-soft">
        {label}
      </p>
    </div>
  );
}

/** Large title block used by HEI tab views. */
export function HeiPageHeader({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="px-4 pb-1 pt-3">
      {eyebrow && (
        <p className="mb-1 text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand">
          {eyebrow}
        </p>
      )}
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-[30px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink">
          {title}
        </h1>
        {right}
      </div>
      {sub && <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{sub}</p>}
    </div>
  );
}

/* ---------------- Motion helpers ---------------- */

export const listStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

export const riseItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

/** Skeleton shimmer shown briefly on mount (~800ms) before content appears. */
export function useDelayedReady(ms = 800): boolean {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}

/** Row-shaped skeleton for list views (messages, etc.). */
export function RowsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 px-4 pt-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-float"
        >
          <div className="shimmer h-11 w-11 shrink-0 rounded-full bg-secondary" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-3 w-2/3 rounded-full bg-secondary" />
            <div className="shimmer h-2.5 w-1/2 rounded-full bg-secondary" />
          </div>
          <div className="shimmer h-2.5 w-8 rounded-full bg-secondary" />
        </div>
      ))}
    </div>
  );
}

/* ---------------- Cover image with graceful fallback ---------------- */

function useImageOk(src: string): boolean {
  const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    setOk(false);
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setOk(true);
    };
    img.onerror = () => {
      if (!cancelled) setOk(false);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return ok;
}

/**
 * CoverImage when the asset exists; otherwise an elegant category-tinted
 * gradient tile (some mock images may not be generated yet).
 */
export function CoverOrGradient({
  src,
  alt,
  category,
  ratio = "aspect-[16/10]",
  className,
  children,
}: {
  src: string;
  alt: string;
  category: Category | string;
  ratio?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const ok = useImageOk(src);
  if (ok) {
    return (
      <CoverImage src={src} alt={alt} ratio={ratio} className={className}>
        {children}
      </CoverImage>
    );
  }
  const meta = CATEGORY_META[category as Category];
  return (
    <div
      className={cn("relative overflow-hidden", ratio, className)}
      style={{
        background: `linear-gradient(140deg, ${meta?.soft ?? "#ECEDE6"} 0%, #ECEDE6 78%)`,
      }}
    >
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="absolute inset-0 grid place-items-center text-ink-soft/50">
        <CategoryIcon category={category} size={30} />
      </div>
      {children}
    </div>
  );
}
