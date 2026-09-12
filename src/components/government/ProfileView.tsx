"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck, Bell, ChevronRight, FileDown, Globe2, Info, Landmark, MapPin, ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { DISTRICTS, GOV_USER } from "@/lib/data/analytics";
import { RolePreviewCard } from "@/components/shell/RolePreviewCard";
import { SectionHeader } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { CardHead, DemoChip, Panel } from "./parts";

const SETTINGS: { icon: typeof Bell; label: string; sub: string; toast: [string, string] }[] = [
  {
    icon: Bell,
    label: "Alerts & notifications",
    sub: "Critical challenges, milestones & fund alerts",
    toast: ["Notifications", "Demo only — alert preferences are simulated"],
  },
  {
    icon: FileDown,
    label: "Monthly report export",
    sub: "Consolidated pipeline summary as PDF",
    toast: ["Export queued", "Demo only — no file is generated"],
  },
  {
    icon: ShieldCheck,
    label: "Access & security",
    sub: "Session, roles & permissions",
    toast: ["Security", "Demo only — single simulated official account"],
  },
  {
    icon: Globe2,
    label: "Language & region",
    sub: "English (India) · Jharkhand",
    toast: ["Language", "Demo only — localization is not wired up"],
  },
];

export function GovProfileView() {
  const toast = useApp((s) => s.toast);
  const topDistricts = React.useMemo(
    () => [...DISTRICTS].sort((a, b) => b.challenges - a.challenges).slice(0, 3),
    []
  );

  return (
    <div className="pb-2 pt-3">
      {/* Header */}
      <div className="px-4">
        <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          Profile
        </h1>
        <p className="mt-1 text-[13px] text-ink-soft">Government official · demo account</p>
      </div>

      {/* Official card */}
      <div className="mt-4 px-4">
        <Panel className="p-5">
          <div className="flex items-center gap-3.5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-[18px] font-extrabold text-white shadow-float">
              RS
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-extrabold tracking-[-0.01em] text-ink">
                {GOV_USER.name}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-soft">{GOV_USER.role}</p>
              <p className="mt-0.5 text-[11.5px] text-ink-soft/80">{GOV_USER.office}</p>
            </div>
          </div>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-mist px-2.5 py-1 text-[10.5px] font-bold text-brand-deep">
              In office since {GOV_USER.since}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10.5px] font-bold text-ink-soft">
              <BadgeCheck size={11} strokeWidth={2.6} />
              Verified official
            </span>
            <DemoChip className="ml-auto" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Districts reviewed", value: 6 },
              { label: "Approvals granted", value: 24 },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary/50 p-3.5">
                <p className="text-[22px] font-extrabold leading-none nums text-ink">
                  <AnimatedNumber value={s.value} delay={0.15} />
                </p>
                <p className="mt-1.5 text-[10.5px] font-semibold text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[10px] leading-relaxed text-ink-soft/70">
            Review &amp; approval activity this quarter — simulated
          </p>
        </Panel>
      </div>

      {/* Jurisdiction */}
      <div className="mt-4 px-4">
        <Panel className="p-5">
          <CardHead title="Jurisdiction" sub="Operational oversight area" />
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand">
              <Landmark size={18} strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-ink">Jharkhand · 24 districts</p>
              <p className="text-[11.5px] text-ink-soft">Dept. of Innovation &amp; Technology</p>
            </div>
          </div>
          <p className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
            Most active districts
          </p>
          <div className="flex flex-wrap gap-2">
            {topDistricts.map((d) => (
              <span
                key={d.name}
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[11.5px] font-semibold text-ink"
              >
                <MapPin size={11} strokeWidth={2.4} className="text-brand" />
                {d.name}
                <span className="nums text-ink-soft">{d.challenges}</span>
              </span>
            ))}
          </div>
        </Panel>
      </div>

      {/* Prototype controls */}
      <div className="mt-5">
        <SectionHeader title="Prototype controls" sub="Switch the live experience" />
        <RolePreviewCard />
      </div>

      {/* Settings */}
      <div className="mt-5 px-4">
        <Panel className="p-2.5">
          <CardHead title="Settings" sub="Preferences for this demo account" className="px-2.5 pt-1.5" />
          <div className="space-y-1">
            {SETTINGS.map((s) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.label}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast(s.toast[0], s.toast[1])}
                  className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-secondary/60"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft">
                    <Icon size={16} strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-semibold text-ink">{s.label}</span>
                    <span className="block truncate text-[11px] text-ink-soft">{s.sub}</span>
                  </span>
                  <ChevronRight size={15} strokeWidth={2.4} className="shrink-0 text-ink-soft/50" />
                </motion.button>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Data & simulation */}
      <div className="mt-4 px-4">
        <Panel className="p-5">
          <CardHead title="Data &amp; simulation" sub="What this prototype really shows" />
          <div className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-card text-brand shadow-float">
              <Info size={15} strokeWidth={2.2} />
            </span>
            <p className="text-[12px] leading-relaxed text-ink-soft">
              Every figure across the government experience — challenge counts, funnel conversions,
              district density, fund allocations and HEI rankings — is{" "}
              <span className="font-bold text-ink">simulated demo data</span>, clearly marked with
              a “Demo data” chip. No real government data, citizens, institutions or transactions
              are represented.
            </p>
          </div>
        </Panel>
      </div>

      {/* About */}
      <div className="mt-4 px-4">
        <Panel className="p-5">
          <CardHead title="About JanSetu" sub="The people’s bridge" />
          <p className="text-[12.5px] leading-relaxed text-ink-soft">
            <span className="font-bold text-ink">JanSetu</span> — “the people’s bridge” — connects
            citizen-reported problems to university research labs, industry partners and government
            oversight. A problem reported from a village today can become a validated challenge, a
            funded prototype and a deployed solution with measured impact on the ground. This
            prototype demonstrates that journey end-to-end across four experiences: citizen, HEI,
            industry and government.
          </p>
          <div className="mt-3.5 flex items-center gap-2">
            {["Problem", "Prototype", "Impact"].map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-full bg-brand-mist px-2.5 py-1 text-[10.5px] font-bold text-brand-deep">
                  {step}
                </span>
                {i < 2 && <ChevronRight size={12} strokeWidth={2.6} className="text-ink-soft/50" />}
              </React.Fragment>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
