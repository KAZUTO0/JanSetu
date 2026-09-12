"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Flag,
  FlaskConical,
  Heart,
  MapPin,
  Microscope,
  Rocket,
  Route,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ImpactMetric, ImpactStory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CardSkeleton, CategoryIcon, CoverImage } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

/* ============================================================
   Impact module — shared parts (demo-data experience)
   ============================================================ */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Amber accents (after / improvement), deep brand for success. */
export const AMBER = "#E0A538";
export const AMBER_DEEP = "#B07E22";
export const AMBER_SOFT = "#F6EDD8";

/** Shared scroll-reveal props for sections. Fires once, 30px inside viewport. */
export function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-30px" },
    transition: { delay, duration: 0.55, ease: EASE },
  };
}

/** Short skeleton gate on mount to simulate data fetch. */
export function useSkeletonDelay(ms = 700): boolean {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}

/* ---------------- value helpers ---------------- */

/** First numeric value in a string, e.g. "₹4,800" -> 4800, "—" -> null. */
export function extractNumber(s: string): number | null {
  const m = s.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

/** Normalised before/after bar widths (0–1) for a metric, per-metric scale. */
export function metricBarRatio(m: ImpactMetric): { before: number; after: number } {
  const b = extractNumber(m.before);
  const a = extractNumber(m.after);
  if (b === null || a === null) return { before: 0.22, after: 0.94 };
  const max = Math.max(b, a);
  if (max === 0) return { before: 0.5, after: 0.5 };
  return {
    before: Math.max(0.05, b / max),
    after: Math.max(0.08, a / max),
  };
}

/** "42,000 citizens reached" -> { num: 42000, suffix: "citizens reached" } */
export function parseHeadline(s: string): { num: number | null; suffix: string } {
  const m = s.match(/^([\d,]+(?:\.\d+)?)\s*(.*)$/);
  if (!m) return { num: null, suffix: s };
  return { num: parseFloat(m[1].replace(/,/g, "")), suffix: m[2] };
}

/** Compact a metric value string for small pills ("0 villages" -> "0 vill."). */
export function compactMetric(s: string): string {
  return s
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*villages?/gi, " vill.")
    .replace(/\s*months?/gi, " mo")
    .trim();
}

/** Initials tile for partner names ("IIT (ISM) Dhanbad" -> "ID"). */
export function initialsOf(name: string): string {
  const cleaned = name.replace(/\([^)]*\)/g, " ");
  const words = cleaned
    .split(/\s+/)
    .filter((w) => w.length > 1 && !/^(pvt|ltd|llp|private|limited)$/i.test(w));
  const letters = words.slice(0, 2).map((w) => w.charAt(0).toUpperCase());
  return (letters.join("") || name.slice(0, 2)).toUpperCase();
}

/* ---------------- chips ---------------- */

/** Small "Demo data" tag used across the impact module. */
export function DemoChip({ label = "Demo data", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft",
        className
      )}
    >
      <FlaskConical size={11} strokeWidth={2.2} />
      {label}
    </span>
  );
}

/** Frosted chip for use on top of cover images. */
export function ImageChip({
  icon,
  children,
  className,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-float backdrop-blur-md",
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** "Deployed 3 months ago" — brand tint in card body, frosted white on images. */
export function DeployedChip({
  text,
  onImage = false,
  className,
}: {
  text: string;
  onImage?: boolean;
  className?: string;
}) {
  if (onImage) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-float backdrop-blur-md",
          className
        )}
      >
        <Rocket size={11} strokeWidth={2.2} className="text-brand" />
        {text}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-brand-mist px-2.5 py-1 text-[11px] font-semibold text-brand-deep",
        className
      )}
    >
      <Rocket size={11} strokeWidth={2.2} />
      {text}
    </span>
  );
}

/* ---------------- journey strip (lifecycle) ---------------- */

const JOURNEY_STEPS: { label: string; icon: LucideIcon; final?: boolean }[] = [
  { label: "Challenge", icon: Flag },
  { label: "Research", icon: Microscope },
  { label: "Prototype", icon: Wrench },
  { label: "Pilot", icon: Rocket },
  { label: "Deployment", icon: CheckCircle2 },
  { label: "Impact", icon: Heart, final: true },
];

/** Horizontal lifecycle stepper with an animated connector line. */
export function JourneyStrip() {
  return (
    <div className="card-hairline rounded-3xl bg-card p-4 shadow-float">
      <div className="mb-3.5 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-mist text-brand">
          <Route size={13} strokeWidth={2.4} />
        </span>
        <p className="text-[13px] font-bold tracking-[-0.01em] text-ink">The JanSetu journey</p>
      </div>

      <div className="relative flex">
        {/* connector line, draws on mount */}
        <motion.div
          className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[22px] z-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-[#C9D2CC] via-[#0E8A6D] to-[#E0A538]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: 0.45, duration: 1, ease: EASE }}
        />
        {JOURNEY_STEPS.map((s, i) => {
          const Icon = s.icon;
          const final = !!s.final;
          return (
            <motion.div
              key={s.label}
              className="relative z-10 flex flex-1 flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: 0.3 + i * 0.09, duration: 0.45, ease: EASE }}
            >
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-2xl",
                  final ? "bg-[#F6EDD8] text-[#B07E22]" : "bg-secondary text-ink-soft"
                )}
              >
                <Icon size={19} strokeWidth={2.1} />
              </span>
              <span
                className={cn(
                  "mt-1.5 text-[9px] font-bold tracking-tight",
                  final ? "text-[#B07E22]" : "text-ink-soft"
                )}
              >
                {s.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[11px] font-medium text-ink-soft">
        Every solution follows this journey on JanSetu
      </p>
    </div>
  );
}

/* ---------------- before -> after mini pill (story cards) ---------------- */

function MiniDelta({ metric }: { metric: ImpactMetric }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10.5px] font-semibold">
      <span className="text-ink-soft">{compactMetric(metric.before)}</span>
      <ArrowRight size={9} strokeWidth={2.8} className="shrink-0 text-brand" />
      <span className="text-brand-deep">{compactMetric(metric.after)}</span>
    </span>
  );
}

/* ---------------- flagship story card ---------------- */

export function StoryCard({
  story,
  index,
  onOpen,
}: {
  story: ImpactStory;
  index: number;
  onOpen: () => void;
}) {
  const head = parseHeadline(story.headlineMetric);
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: 0.05 + index * 0.07, duration: 0.55, ease: EASE }}
      whileTap={{ scale: 0.98 }}
      className="block w-full overflow-hidden rounded-3xl bg-card text-left shadow-float"
    >
      <CoverImage src={story.image} alt={story.title} ratio="aspect-[16/9]">
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <ImageChip icon={<CategoryIcon category={story.category} size={12} />}>
            {story.category}
          </ImageChip>
          <ImageChip icon={<MapPin size={11} strokeWidth={2.2} className="text-ink-soft" />}>
            {story.district}
          </ImageChip>
        </div>
      </CoverImage>

      <div className="p-4">
        <DeployedChip text={story.deployedAgo} />
        <h3 className="mt-2.5 text-[16.5px] font-bold leading-snug tracking-[-0.015em] text-ink">
          {story.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft">
          {story.summary}
        </p>

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
            {head.num !== null ? (
              <>
                <span className="nums text-[22px] font-extrabold leading-none tracking-[-0.02em] text-brand">
                  <AnimatedNumber value={head.num} />
                </span>
                <span className="text-[12px] font-bold text-brand/75">{head.suffix}</span>
              </>
            ) : (
              <span className="text-[22px] font-extrabold leading-none tracking-[-0.02em] text-brand">
                {story.headlineMetric}
              </span>
            )}
          </p>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-ink-soft">
            <ChevronRight size={16} strokeWidth={2.4} />
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {story.metrics.slice(0, 2).map((m) => (
            <MiniDelta key={m.label} metric={m} />
          ))}
        </div>
      </div>
    </motion.button>
  );
}

/* ---------------- before -> after metric card (detail grid) ---------------- */

export function MetricCard({ metric, index }: { metric: ImpactMetric; index: number }) {
  const bars = metricBarRatio(metric);
  const d = 0.12 + index * 0.09;
  const afterBig = metric.after.length <= 10;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: d, duration: 0.5, ease: EASE }}
      className="card-hairline rounded-3xl bg-card p-4 shadow-float"
    >
      <p className="text-[11.5px] font-semibold leading-snug text-ink-soft">{metric.label}</p>

      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-ink-soft/60">
            Before
          </span>
          <span className="mt-0.5 break-words text-[12px] font-medium leading-snug text-ink-soft">
            {metric.before}
          </span>
        </div>
        <motion.span
          initial={{ x: -8, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: d + 0.25, duration: 0.4, ease: EASE }}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-mist text-brand"
        >
          <ArrowRight size={13} strokeWidth={2.6} />
        </motion.span>
        <div className="flex min-w-0 flex-1 flex-col items-end text-right">
          <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-brand">After</span>
          <span
            className={cn(
              "mt-0.5 break-words font-extrabold leading-snug text-ink",
              afterBig ? "text-[18px]" : "text-[15px]"
            )}
          >
            {metric.after}
          </span>
        </div>
      </div>

      {/* dual comparison bars, normalised per metric */}
      <div className="mt-3.5 space-y-1.5">
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-[#C2CBC3]"
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.round(bars.before * 100)}%` }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: d + 0.2, duration: 0.8, ease: EASE }}
          />
        </div>
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand to-[#0A5C48]"
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.round(bars.after * 100)}%` }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: d + 0.32, duration: 0.8, ease: EASE }}
          />
        </div>
      </div>

      <div className="mt-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-mist px-2.5 py-1 text-[10.5px] font-bold text-brand-deep">
          <TrendingUp size={11} strokeWidth={2.4} />
          {metric.improvement}
        </span>
      </div>
    </motion.div>
  );
}

/* ---------------- skeletons (~700ms gate) ---------------- */

export function ImpactSkeleton() {
  return (
    <div className="pt-2">
      <div className="px-4">
        <div className="shimmer h-3 w-32 rounded-full bg-secondary" />
        <div className="shimmer mt-2.5 h-4 w-full rounded-lg bg-secondary" />
        <div className="shimmer mt-1.5 h-4 w-3/5 rounded-lg bg-secondary" />
        <div className="shimmer mt-3.5 h-6 w-24 rounded-full bg-secondary" />
      </div>
      <div className="shimmer mx-4 mt-4 h-[188px] rounded-3xl bg-secondary" />
      <div className="shimmer mx-4 mt-4 h-[150px] rounded-3xl bg-secondary" />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function StorySkeleton() {
  return (
    <div className="pt-2">
      <div className="shimmer mx-4 aspect-[16/9] rounded-3xl bg-secondary" />
      <div className="mx-4 mt-4 space-y-2.5 rounded-3xl bg-card p-4 shadow-float">
        <div className="shimmer h-7 w-2/3 rounded-lg bg-secondary" />
        <div className="shimmer h-3.5 w-full rounded-full bg-secondary" />
        <div className="shimmer h-3.5 w-2/3 rounded-full bg-secondary" />
      </div>
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shimmer h-44 rounded-3xl bg-secondary" />
        ))}
      </div>
      <div className="shimmer mx-4 mt-4 h-64 rounded-3xl bg-secondary" />
    </div>
  );
}
