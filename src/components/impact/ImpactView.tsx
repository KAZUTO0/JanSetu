"use client";

import { motion } from "framer-motion";
import { Info, Sparkles, Sprout, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { useApp } from "@/lib/store";
import { IMPACT_STORIES } from "@/lib/data/impact";
import { cn } from "@/lib/utils";
import { DetailView } from "@/components/shell/DetailView";
import { SectionHeader } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import {
  DemoChip,
  ImpactSkeleton,
  JourneyStrip,
  reveal,
  StoryCard,
  useSkeletonDelay,
} from "./parts";

/* ============================================================
   Impact — the measurable-change view (pushed, demo data)
   ============================================================ */

/** Aggregate KPI banner stats (simulated totals across deployments). */
const KPI_STATS: {
  value: number;
  format?: (n: number) => string;
  suffix?: string;
  label: string;
  accent?: boolean;
}[] = [
  { value: 210, format: (n) => `${Math.round(n)}K+`, label: "citizens reached", accent: true },
  { value: 21, label: "deployments live" },
  { value: 5, label: "flagship stories" },
  { value: 9.4, format: (n) => n.toFixed(1), suffix: " mo", label: "avg solution cycle" },
];

/** "Across all deployments" aggregate outcome rows. */
const ACROSS: {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  bg: string;
  color: string;
}[] = [
  { icon: Users, value: 59400, suffix: "+", label: "citizens with safe water", bg: "#E3F1EA", color: "#0A5C48" },
  { icon: Sprout, value: 3200, suffix: "", label: "farms protected", bg: "rgba(150,163,59,0.16)", color: "#6E7A2A" },
  { icon: Zap, value: 5600, suffix: "", label: "citizens with 18-hour power", bg: "#F6EDD8", color: "#B07E22" },
];

function KpiStat({
  value,
  format,
  suffix,
  label,
  accent,
}: {
  value: number;
  format?: (n: number) => string;
  suffix?: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <p
          className={cn(
            "nums text-[26px] font-extrabold leading-none tracking-[-0.02em]",
            accent ? "text-[#E0A538]" : "text-white"
          )}
        >
          <AnimatedNumber value={value} format={format} duration={1.3} />
          {suffix && <span className="text-[15px] font-bold">{suffix}</span>}
        </p>
        {accent && <TrendingUp size={14} strokeWidth={2.4} className="text-[#E0A538]" />}
      </div>
      <p className="mt-1.5 text-[11px] font-medium leading-tight text-white/55">{label}</p>
    </div>
  );
}

export function ImpactView() {
  const { pop, push } = useApp();
  const ready = useSkeletonDelay();

  return (
    <DetailView title="Impact" eyebrow="Measurable change" onBack={pop}>
      {!ready ? (
        <ImpactSkeleton />
      ) : (
        <div className="space-y-5 pt-1">
          {/* Hero statement */}
          <motion.section {...reveal(0)} className="px-4">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand">
              From problem to progress
            </p>
            <p className="mt-1.5 text-[15px] font-medium leading-[1.55] text-ink/90">
              Citizen-reported problems, solved end-to-end — with numbers you can verify.
            </p>
            <div className="mt-3">
              <DemoChip />
            </div>
          </motion.section>

          {/* Aggregate KPI banner */}
          <motion.section {...reveal(0.08)} className="px-4">
            <div className="card-hairline relative overflow-hidden rounded-3xl bg-ink p-5 shadow-float">
              <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#0E8A6D]/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-[#E0A538]/20 blur-3xl" />
              <div className="relative flex items-center gap-2">
                <Sparkles size={13} strokeWidth={2.4} className="text-[#E0A538]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                  Aggregate outcomes
                </p>
              </div>
              <div className="relative mt-4 grid grid-cols-2 gap-x-3 gap-y-5">
                {KPI_STATS.map((s) => (
                  <KpiStat key={s.label} {...s} />
                ))}
              </div>
              <p className="relative mt-4 border-t border-white/10 pt-3 text-[10px] font-medium leading-snug text-white/45">
                Citizen reach summed across the flagship deployments below · demo data
              </p>
            </div>
          </motion.section>

          {/* The journey strip */}
          <motion.section {...reveal(0.16)} className="px-4">
            <JourneyStrip />
          </motion.section>

          {/* Flagship story cards */}
          <section>
            <SectionHeader
              title="Flagship stories"
              sub="Before → after, from five live deployments"
            />
            <div className="space-y-4 px-4">
              {IMPACT_STORIES.map((s, i) => (
                <StoryCard
                  key={s.id}
                  story={s}
                  index={i}
                  onOpen={() => push({ type: "impact-story", storyId: s.id })}
                />
              ))}
            </div>
          </section>

          {/* Across all deployments */}
          <section>
            <SectionHeader
              title="Across all deployments"
              sub="Outcomes beyond the flagship five"
            />
            <div className="space-y-3 px-4">
              {ACROSS.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.div
                    key={a.label}
                    {...reveal(0.06 + i * 0.08)}
                    className="card-hairline flex items-center gap-3.5 rounded-3xl bg-card p-4 shadow-float"
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                      style={{ background: a.bg, color: a.color }}
                    >
                      <Icon size={19} strokeWidth={2.1} />
                    </span>
                    <div className="min-w-0">
                      <p className="nums text-[21px] font-extrabold leading-none tracking-[-0.02em] text-ink">
                        <AnimatedNumber value={a.value} />
                        {a.suffix}
                      </p>
                      <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{a.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Footer note */}
          <motion.section {...reveal(0.1)} className="px-4">
            <div className="flex items-start gap-3 rounded-3xl border border-dashed border-border bg-card p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-ink-soft">
                <Info size={14} strokeWidth={2.2} />
              </span>
              <p className="text-[11.5px] leading-relaxed text-ink-soft">
                All outcomes shown are prototype/demo data to illustrate measurable impact
                reporting.
              </p>
            </div>
          </motion.section>
        </div>
      )}
    </DetailView>
  );
}
