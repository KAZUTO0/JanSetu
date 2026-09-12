"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { CalendarDays, Monitor, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import type { DistrictStat } from "@/lib/types";
import {
  CardHead, DistrictMap, DistrictSheet, FunnelBars, GOV_KPI_CARDS, KpiCard, Panel, SheetPortal,
  TrendChart, useSheetHost,
} from "./parts";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};

export function GovOverviewView() {
  const push = useApp((s) => s.push);
  const [district, setDistrict] = React.useState<DistrictStat | null>(null);
  const [hostRef, sheetHost] = useSheetHost();

  return (
    <div ref={hostRef} className="pb-2 pt-3">
      {/* Header */}
      <div className="px-4">
        <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand">
          Dept. of Innovation &amp; Technology
        </p>
        <h1 className="mt-1 text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          Overview
        </h1>
        <p className="mt-1 text-[13px] text-ink-soft">State innovation pipeline · demo data</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-bold nums text-ink-soft shadow-float">
            <CalendarDays size={11} strokeWidth={2.4} className="text-brand" />
            FY 2025-26 · Q2
          </span>
        </div>
      </div>

      {/* KPI grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        {GOV_KPI_CARDS.map((k, i) => (
          <KpiCard
            key={k.label}
            icon={k.icon}
            label={k.label}
            value={k.value}
            delta={k.delta}
            delay={i * 0.07}
            className={i === GOV_KPI_CARDS.length - 1 ? "col-span-2" : undefined}
          />
        ))}
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-4 space-y-4">
        {/* District heatmap */}
        <motion.div variants={item} className="px-4">
          <DistrictMap onSelect={(d) => setDistrict(d)} />
        </motion.div>

        {/* Funnel */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <CardHead title="Conversion funnel" sub="Submitted → validated → deployed" />
            <FunnelBars />
          </Panel>
        </motion.div>

        {/* Trend */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <CardHead title="Monthly challenge flow" sub="Reported vs validated · last 12 months" />
            <TrendChart height={168} />
          </Panel>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <CardHead title="Quick actions" sub="Jump deeper into the pipeline" right={null} />
            <button
              onClick={() => push({ type: "command-centre" })}
              className="tap flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[14px] font-bold text-white shadow-float"
            >
              <Monitor size={17} strokeWidth={2.4} />
              Open Command Centre
            </button>
            <button
              onClick={() => push({ type: "impact" })}
              className="tap mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-mist text-[14px] font-bold text-brand-deep"
            >
              <Sparkles size={17} strokeWidth={2.4} />
              View impact stories
            </button>
            <p className="mt-3 text-center text-[10.5px] leading-relaxed text-ink-soft/70">
              Command Centre is the wider analytics screen for review meetings · impact aggregates
              the 21 deployed solutions
            </p>
          </Panel>
        </motion.div>
      </motion.div>

      <SheetPortal host={sheetHost}>
        <DistrictSheet district={district} onClose={() => setDistrict(null)} />
      </SheetPortal>
    </div>
  );
}
