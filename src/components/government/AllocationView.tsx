"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Building2, ChevronRight, Landmark, MapPin, Wallet,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { ALLOCATIONS } from "@/lib/data/analytics";
import { PROJECTS } from "@/lib/data/projects";
import type { AllocationRow, ProjectStage } from "@/lib/types";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { FilterChips, ScoreRing } from "@/components/shared/kit";
import { CardHead, DemoChip, Panel, SheetPortal, fundAggregates, useSheetHost } from "./parts";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<AllocationRow["status"], string> = {
  Disbursed: "bg-brand-mist text-brand-deep",
  "Partially disbursed": "bg-[#E0A538]/15 text-[#9A6D14]",
  Pending: "bg-secondary text-ink-soft",
  "Utilisation pending": "bg-[#96A33B]/15 text-[#5F6B21]",
};

const PROJECT_STAGE_STYLE: Record<ProjectStage, string> = {
  Research: "bg-[#8A938C]/15 text-[#55605A]",
  Prototype: "bg-[#2C8C99]/12 text-[#1F6570]",
  Testing: "bg-[#4E9F6D]/15 text-[#2F6B4B]",
  Pilot: "bg-[#E0A538]/15 text-[#9A6D14]",
  Deployment: "bg-[#0A5C48]/12 text-[#0A5C48]",
};

const STATUS_ITEMS: { id: string; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Disbursed", label: "Disbursed" },
  { id: "Partially disbursed", label: "Partial" },
  { id: "Pending", label: "Pending" },
  { id: "Utilisation pending", label: "Utilisation" },
];

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const rowVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 25 } },
};

export function GovAllocationView() {
  const push = useApp((s) => s.push);
  const toast = useApp((s) => s.toast);

  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [active, setActive] = React.useState<AllocationRow | null>(null);
  const [hostRef, sheetHost] = useSheetHost();

  const totals = React.useMemo(() => fundAggregates(ALLOCATIONS), []);
  const filtered = React.useMemo(
    () => (statusFilter ? ALLOCATIONS.filter((r) => r.status === statusFilter) : ALLOCATIONS),
    [statusFilter]
  );

  const openProject = (row: AllocationRow) => {
    const project = PROJECTS.find((p) => p.code === row.projectCode);
    if (project) {
      setActive(null);
      push({ type: "project", projectId: project.id });
    } else {
      toast("Workspace not in demo", `${row.projectCode} is simulated — no workspace exists yet`);
    }
  };

  return (
    <div ref={hostRef} className="pb-2 pt-3">
      {/* Header */}
      <div className="px-4">
        <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          Allocation
        </h1>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-[13px] text-ink-soft">Innovation fund disbursement · FY 2025-26</p>
          <DemoChip />
        </div>
      </div>

      {/* Summary tiles */}
      <div className="mt-4 grid grid-cols-3 gap-3 px-4">
        {[
          { label: "Sanctioned", value: totals.sanctionedLakh, format: (n: number) => `₹${(n / 100).toFixed(2)} Cr` },
          { label: "Disbursed", value: totals.disbursedLakh, format: (n: number) => `₹${n.toFixed(1)}L` },
          { label: "Utilised", value: totals.utilisationPct, format: (n: number) => `${Math.round(n)}%` },
        ].map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 24 }}
            className="rounded-2xl bg-card p-3.5 shadow-float"
          >
            <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-soft">
              {t.label}
            </p>
            <p className="mt-1.5 text-[18px] font-extrabold leading-none tracking-[-0.01em] text-ink nums">
              <AnimatedNumber value={t.value} format={t.format} delay={0.1 + i * 0.05} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Utilisation card */}
      <div className="mt-4 px-4">
        <Panel className="p-5">
          <CardHead title="Fund utilisation" sub="Disbursed against total sanctions" />
          <div className="flex items-center gap-5">
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
      </div>

      {/* Status filter */}
      <div className="mt-4">
        <FilterChips
          items={STATUS_ITEMS}
          value={statusFilter ?? "All"}
          onChange={(v) => setStatusFilter(v === "All" ? null : v)}
        />
      </div>

      {/* Allocation rows */}
      <div className="mt-2.5">
        <div className="flex items-center justify-between px-4">
          <p className="text-[12px] font-semibold nums text-ink-soft">
            {filtered.length} allocations · ₹{(totals.sanctionedLakh / 100).toFixed(2)} Cr sanctioned
          </p>
        </div>
        <motion.div
          key={statusFilter ?? "All"}
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="mt-2.5"
        >
          {filtered.map((row) => {
            const pct = Math.round((row.disbursedLakh / row.sanctionedLakh) * 100);
            return (
              <div key={row.id} className="px-4 pb-3">
                <motion.button
                  variants={rowVariant}
                  onClick={() => setActive(row)}
                  className="tap w-full rounded-3xl border border-border/70 bg-card p-4 text-left shadow-float"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0">
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold nums text-ink-soft">
                        {row.projectCode}
                      </span>
                      <p className="mt-1.5 text-[14px] font-bold leading-snug tracking-[-0.01em] text-ink">
                        {row.project}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-ink-soft">
                        {row.hei} · {row.district}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide leading-tight",
                        STATUS_STYLE[row.status]
                      )}
                    >
                      {row.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/70">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10.5px] font-semibold nums text-ink-soft">
                      <span>Sanctioned ₹{row.sanctionedLakh.toFixed(1)}L</span>
                      <span className="text-ink">
                        Disbursed ₹{row.disbursedLakh.toFixed(1)}L · {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        PROJECT_STAGE_STYLE[row.stage]
                      )}
                    >
                      {row.stage}
                    </span>
                    <ChevronRight size={14} strokeWidth={2.4} className="ml-auto text-ink-soft/50" />
                  </div>
                </motion.button>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Detail sheet (portaled to the content layer) */}
      <SheetPortal host={sheetHost}>
        <BottomSheet
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.project ?? ""}
        subtitle={`${active?.projectCode ?? ""} · ${active?.hei ?? ""}`}
      >
        {active && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", STATUS_STYLE[active.status])}>
                {active.status}
              </span>
              <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold", PROJECT_STAGE_STYLE[active.stage])}>
                {active.stage} stage
              </span>
              <DemoChip className="ml-auto" />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Sanctioned", value: active.sanctionedLakh, format: (n: number) => `₹${n.toFixed(1)}L` },
                { label: "Disbursed", value: active.disbursedLakh, format: (n: number) => `₹${n.toFixed(1)}L` },
                {
                  label: "Balance",
                  value: Math.round((active.sanctionedLakh - active.disbursedLakh) * 10) / 10,
                  format: (n: number) => `₹${n.toFixed(1)}L`,
                },
              ].map((t) => (
                <div key={t.label} className="rounded-2xl bg-secondary/60 p-3 text-center">
                  <p className="text-[16px] font-extrabold leading-none nums text-ink">
                    <AnimatedNumber value={t.value} format={t.format} delay={0.1} />
                  </p>
                  <p className="mt-1 text-[9.5px] font-bold uppercase tracking-wider text-ink-soft">
                    {t.label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-ink-soft">
                <span>Disbursement progress</span>
                <span className="nums text-ink">
                  {Math.round((active.disbursedLakh / active.sanctionedLakh) * 100)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/70">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand"
                  initial={{ width: 0 }}
                  animate={{ width: `${(active.disbursedLakh / active.sanctionedLakh) * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="space-y-2.5 rounded-2xl bg-secondary/40 p-3.5">
              {[
                { icon: Building2, label: "Implementing HEI", value: active.hei },
                { icon: MapPin, label: "District", value: active.district },
                { icon: Landmark, label: "Fund", value: "JanSetu Innovation Fund · FY 2025-26" },
                { icon: Wallet, label: "Tranche flow", value: `${active.status} · ${active.stage.toLowerCase()} phase` },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-card text-brand shadow-float">
                      <Icon size={14} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-soft">
                        {m.label}
                      </p>
                      <p className="truncate text-[12.5px] font-semibold text-ink">{m.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => openProject(active)}
              className="tap flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[14px] font-bold text-white shadow-float"
            >
              View project workspace
              <ChevronRight size={16} strokeWidth={2.6} />
            </button>
            <p className="text-center text-[10px] leading-relaxed text-ink-soft/70">
              Opens the HEI project workspace for {active.projectCode} where available in the demo
              set
            </p>
          </div>
        )}
        </BottomSheet>
      </SheetPortal>
    </div>
  );
}
