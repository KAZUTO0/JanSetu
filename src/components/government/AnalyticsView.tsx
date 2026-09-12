"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Monitor } from "lucide-react";
import { useApp } from "@/lib/store";
import type { DistrictStat } from "@/lib/types";
import { SectionHeader } from "@/components/shared/kit";
import {
  CompletionMetrics, DistrictMap, DistrictSheet, DomainDonut, FunnelBars, HeiRanking,
  IndustryEngagementTiles, Panel, SheetPortal, TrendChart, useSheetHost,
} from "./parts";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};

export function GovAnalyticsView() {
  const push = useApp((s) => s.push);
  const [district, setDistrict] = React.useState<DistrictStat | null>(null);
  const [hostRef, sheetHost] = useSheetHost();

  return (
    <div ref={hostRef} className="pb-2 pt-3">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 px-4">
        <div>
          <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Analytics
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">Pipeline intelligence · demo data</p>
        </div>
        <button
          onClick={() => push({ type: "command-centre" })}
          className="tap mb-1 flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[11.5px] font-bold text-white shadow-float"
        >
          <Monitor size={13} strokeWidth={2.4} />
          Command Centre
        </button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-4 space-y-4">
        {/* Conversion */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <SectionHeader
              className="mb-3 px-0"
              title="Challenge conversion"
              sub="Every stage of the 1,284 reported challenges"
            />
            <FunnelBars />
          </Panel>
        </motion.div>

        {/* Domain distribution */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <SectionHeader
              className="mb-3 px-0"
              title="Domain distribution"
              sub="Where citizens report the most"
            />
            <DomainDonut height={186} />
          </Panel>
        </motion.div>

        {/* Monthly trend */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <SectionHeader
              className="mb-3 px-0"
              title="Monthly trend"
              sub="Reported vs validated · last 12 months"
            />
            <TrendChart height={200} />
          </Panel>
        </motion.div>

        {/* HEI participation */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <SectionHeader
              className="mb-3 px-0"
              title="HEI participation"
              sub="Which institutes carry the pipeline"
            />
            <HeiRanking limit={6} />
          </Panel>
        </motion.div>

        {/* Industry engagement */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <SectionHeader
              className="mb-3 px-0"
              title="Industry engagement"
              sub="Partners converting research into scale"
            />
            <IndustryEngagementTiles />
          </Panel>
        </motion.div>

        {/* Project completion */}
        <motion.div variants={item} className="px-4">
          <Panel className="p-5">
            <SectionHeader
              className="mb-3 px-0"
              title="Project completion"
              sub="How pilot projects track their timelines"
            />
            <CompletionMetrics />
          </Panel>
        </motion.div>

        {/* District heatmap */}
        <motion.div variants={item} className="px-4">
          <DistrictMap onSelect={(d) => setDistrict(d)} />
        </motion.div>
      </motion.div>

      <SheetPortal host={sheetHost}>
        <DistrictSheet district={district} onClose={() => setDistrict(null)} />
      </SheetPortal>
    </div>
  );
}
