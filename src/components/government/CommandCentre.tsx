"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Monitor, Rocket, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { ALLOCATIONS } from "@/lib/data/analytics";
import { ScoreRing } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import {
  CardHead, CompletionMetrics, DemoChip, DistrictMap, DomainDonut, FunnelBars, GOV_KPI_CARDS,
  HeiRanking, IndustryEngagementTiles, KpiCard, Panel, TrendChart, fundAggregates,
} from "./parts";

/**
 * Command Centre — full-viewport analytics overlay for wider screens.
 * Pushed via the view stack; closes by popping. On mobile it simply scrolls
 * as a normal page; on desktop it breaks out of the phone frame (fixed inset-0).
 * All figures are simulated demo data.
 */
export function CommandCentreView() {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);

  const totals = React.useMemo(() => fundAggregates(ALLOCATIONS), []);
  const topAllocations = React.useMemo(
    () => [...ALLOCATIONS].sort((a, b) => b.sanctionedLakh - a.sanctionedLakh).slice(0, 5),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.985, y: 8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[70] overflow-y-auto bg-background"
    >
      {/* Top bar */}
      <div className="glass sticky top-0 z-10 border-b border-border/60">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-float">
              <Monitor size={19} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[16px] font-extrabold tracking-[-0.02em] text-ink">
                Command Centre
              </p>
              <p className="truncate text-[11px] text-ink-soft">
                JanSetu Innovation Hub · Government analytics
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <DemoChip className="hidden sm:inline-flex" />
            <button
              onClick={pop}
              aria-label="Close Command Centre"
              className="tap grid h-10 w-10 place-items-center rounded-full bg-card text-ink shadow-float"
            >
              <X size={18} strokeWidth={2.6} />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive dashboard grid */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 p-4 md:grid-cols-2 xl:grid-cols-3 lg:p-8">
        {/* KPI row */}
        <div className="col-span-full grid grid-cols-2 gap-4 md:grid-cols-5">
          {GOV_KPI_CARDS.map((k, i) => (
            <KpiCard
              key={k.label}
              icon={k.icon}
              label={k.label}
              value={k.value}
              delta={k.delta}
              delay={i * 0.06}
            />
          ))}
        </div>

        {/* Funnel */}
        <Panel className="p-5">
          <CardHead title="Conversion funnel" sub="Submitted → validated → deployed" />
          <FunnelBars />
        </Panel>

        {/* Domain distribution */}
        <Panel className="p-5">
          <CardHead title="Domain distribution" sub="Citizen-reported domains" />
          <DomainDonut height={228} />
        </Panel>

        {/* Monthly trend */}
        <Panel className="p-5">
          <CardHead title="Monthly challenge flow" sub="Reported vs validated · 12 months" />
          <TrendChart height={244} />
        </Panel>

        {/* District heatmap */}
        <div className="md:col-span-2 xl:col-span-2">
          <DistrictMap
            title="Challenge density by district"
            sub="Tap a district to highlight it"
            mapHeight="h-[300px] xl:h-[380px]"
            hint={null}
          />
        </div>

        {/* HEI ranking */}
        <Panel className="p-5">
          <CardHead title="HEI participation" sub="Institute leaderboard" />
          <HeiRanking limit={6} />
        </Panel>

        {/* Industry engagement */}
        <Panel className="p-5 md:col-span-2 xl:col-span-2">
          <CardHead title="Industry engagement" sub="Partners converting research into scale" />
          <IndustryEngagementTiles />
        </Panel>

        {/* Project completion */}
        <Panel className="p-5">
          <CardHead title="Project completion" sub="Timeline adherence across pilots" />
          <CompletionMetrics />
        </Panel>

        {/* Allocation summary */}
        <Panel className="p-5 md:col-span-2 xl:col-span-2">
          <CardHead
            title="Innovation fund · top allocations"
            sub="FY 2025-26 disbursement"
          />
          <div className="space-y-3.5">
            {topAllocations.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="w-[68px] shrink-0 text-[10.5px] font-bold nums text-ink-soft">
                  {r.projectCode}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[12.5px] font-semibold text-ink">{r.project}</p>
                    <span className="shrink-0 text-[10.5px] font-bold nums text-ink-soft">
                      ₹{r.disbursedLakh.toFixed(1)}L / ₹{r.sanctionedLakh}L
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary/70">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand"
                      initial={{ width: 0 }}
                      animate={{ width: `${(r.disbursedLakh / r.sanctionedLakh) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-[10px] text-ink-soft/70">
            Top 5 of 8 tracked allocations · full ledger on the Funds tab
          </p>
        </Panel>

        {/* Fund utilisation */}
        <Panel className="flex flex-col p-5">
          <CardHead title="Fund utilisation" sub="Sanctioned vs disbursed" />
          <div className="flex flex-1 items-center gap-5">
            <ScoreRing
              value={totals.utilisationPct}
              size={104}
              stroke={9}
              color="#0E8A6D"
              label="used"
            />
            <div className="flex-1 space-y-2.5">
              {[
                { dot: "#0E8A6D", label: "Sanctioned", value: `₹${(totals.sanctionedLakh / 100).toFixed(2)} Cr` },
                { dot: "#45B08C", label: "Disbursed", value: `₹${totals.disbursedLakh.toFixed(1)}L` },
                { dot: "#E0A538", label: "Balance", value: `₹${totals.balanceLakh.toFixed(1)}L` },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: l.dot }} />
                  <span className="flex-1 text-[12px] font-semibold text-ink">{l.label}</span>
                  <span className="text-[12px] font-bold nums text-ink">{l.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Impact strip */}
        <div className="relative col-span-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-deep via-brand to-[#12906F] p-6 shadow-float-lg lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/[0.07]" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/[0.05]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/70">
                Outcome at scale · demo data
              </p>
              <p className="mt-2 text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[26px]">
                <AnimatedNumber value={21} delay={0.2} /> deployed solutions ·{" "}
                <AnimatedNumber value={210} delay={0.3} format={(n) => `${Math.round(n)}K+`} />{" "}
                citizens reached
              </p>
              <p className="mt-1.5 max-w-[520px] text-[12.5px] leading-relaxed text-white/75">
                From fluoride filtration in Bokaro to maternal outreach in Simdega — every deployed
                solution is measured on the ground.
              </p>
            </div>
            <button
              onClick={() => push({ type: "impact" })}
              className="tap flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-white px-5 text-[13.5px] font-bold text-brand-deep shadow-float"
            >
              <Rocket size={16} strokeWidth={2.4} />
              View impact stories
            </button>
          </div>
        </div>
      </div>

      <div className="h-12" />
    </motion.div>
  );
}
