"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronRight, Globe, Info, Shield } from "lucide-react";
import { MY_COMPANY, COLLABORATIONS } from "@/lib/data/opportunities";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { RolePreviewCard } from "@/components/shell/RolePreviewCard";
import { AMBER } from "@/components/industry/parts";
import { cn } from "@/lib/utils";

/* Mock persona numbers for the profile stats. */
const MOCK_MOUS = 2;
const MOCK_ACTIVE_COLLABS = 3;

/** Mini switch used in settings rows. */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors",
        on ? "bg-brand" : "bg-border"
      )}
    >
      <motion.span
        animate={{ x: on ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function SettingsRow({
  icon,
  title,
  sub,
  right,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? motion.button : motion.div;
  return (
    <Wrapper
      {...(onClick
        ? { whileTap: { scale: 0.99 }, onClick, className: "tap flex w-full items-center gap-3 px-4 py-3.5 text-left" }
        : { className: "flex w-full items-center gap-3 px-4 py-3.5" })}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-bold text-ink">{title}</span>
        {sub && <span className="mt-0.5 block text-[11px] text-ink-soft">{sub}</span>}
      </span>
      {right ?? (
        <ChevronRight size={16} strokeWidth={2.4} className="shrink-0 text-ink-soft/50" />
      )}
    </Wrapper>
  );
}

export function IndustryProfileView() {
  const toast = useApp((s) => s.toast);
  const [notify, setNotify] = React.useState(true);

  // Engagement split derived from mock collaboration values (sums to ₹34.7L).
  const bars = React.useMemo(() => {
    const byType = new Map<string, number>();
    for (const c of COLLABORATIONS) {
      if (c.valueLakh === undefined) continue;
      byType.set(c.supportType, (byType.get(c.supportType) ?? 0) + c.valueLakh);
    }
    const order = ["Infrastructure", "Pilot Support", "Manufacturing"];
    const labels: Record<string, string> = {
      Infrastructure: "Waste-to-energy offtake",
      "Pilot Support": "Pilot operations",
      Manufacturing: "Sensor manufacturing",
    };
    const max = Math.max(...[...byType.values()], 1);
    return order.map((t) => ({
      label: labels[t] ?? t,
      value: byType.get(t) ?? 0,
      pct: ((byType.get(t) ?? 0) / max) * 100,
    }));
  }, []);

  const committed = bars.reduce((s, b) => s + b.value, 0);
  const barColors = ["#0E8A6D", "#96A33B", "#D98A1F"];

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="px-4 pb-3 pt-5">
        <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          Profile
        </h1>
      </div>

      {/* Company card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-4 rounded-3xl bg-card p-5 shadow-float"
      >
        <div className="flex items-center gap-3.5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-[20px] font-black tracking-tight text-white shadow-float">
            GG
          </span>
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
              {MY_COMPANY.name}
            </p>
            <p className="mt-1 text-[12px] text-ink-soft">
              {MY_COMPANY.type} · Ranchi
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-border/70 rounded-2xl bg-secondary/50 py-3.5">
          {[
            { value: MY_COMPANY.deployments, label: "Deployments" },
            { value: MY_COMPANY.cities, label: "Cities" },
            { value: MOCK_MOUS, label: "MOUs" },
          ].map((s, i) => (
            <div key={s.label} className="px-2 text-center">
              <AnimatedNumber
                value={s.value}
                delay={0.1 + i * 0.08}
                className="text-[21px] font-extrabold leading-none tracking-[-0.02em] text-brand-deep"
              />
              <p className="mt-1.5 text-[10px] font-semibold text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Focus areas */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {MY_COMPANY.focus.map((f) => (
            <span
              key={f}
              className="inline-flex items-center rounded-full bg-brand-mist px-2.5 py-1 text-[10.5px] font-bold text-brand-deep"
            >
              {f}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Active engagement */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-4 mt-4 rounded-3xl bg-card p-5 shadow-float"
      >
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-bold tracking-[-0.01em] text-ink">Active engagement</p>
          <span className="flex items-center gap-1.5 rounded-full bg-brand-mist px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-brand-deep">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 bg-brand" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Live
          </span>
        </div>
        <p className="mt-1.5 text-[12.5px] text-ink-soft">
          {MOCK_ACTIVE_COLLABS} active collaborations ·{" "}
          <span className="font-bold" style={{ color: AMBER }}>
            ₹{committed.toFixed(1)}L committed (mock)
          </span>
        </p>

        <div className="mt-4 space-y-3">
          {bars.map((b, i) => (
            <div key={b.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-[11.5px] font-semibold text-ink">{b.label}</span>
                <span className="nums text-[11.5px] font-bold text-ink-soft">
                  ₹{b.value.toFixed(1)}L
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ delay: 0.2 + i * 0.09, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: barColors[i % barColors.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Prototype controls */}
      <div className="pt-5">
        <SectionHeader title="Prototype controls" sub="Switch the whole experience" />
        <RolePreviewCard />
      </div>

      {/* Settings */}
      <div className="mt-5">
        <SectionHeader title="Settings" />
        <div className="mx-4 divide-y divide-border/60 overflow-hidden rounded-3xl bg-card shadow-float">
          <SettingsRow
            icon={<Bell size={16} strokeWidth={2.1} />}
            title="Notifications"
            sub="Opportunity matches & MOU updates"
            right={
              <Toggle
                on={notify}
                onToggle={() => {
                  setNotify((n) => !n);
                  toast(
                    "Notifications",
                    notify ? "Paused for this prototype session" : "Push alerts on (simulated)"
                  );
                }}
              />
            }
          />
          <SettingsRow
            icon={<Globe size={16} strokeWidth={2.1} />}
            title="Language"
            sub="English (India)"
            onClick={() =>
              toast("Language", "English (India) — more languages coming (mock)")
            }
          />
          <SettingsRow
            icon={<Shield size={16} strokeWidth={2.1} />}
            title="Compliance & standards"
            sub="ISO 9001 · BIS certified (mock)"
            onClick={() =>
              toast("Compliance & standards", "Certificates are simulated demo documents")
            }
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mt-4 flex items-start gap-2.5 rounded-2xl bg-secondary/60 p-4">
        <Info size={14} strokeWidth={2.2} className="mt-0.5 shrink-0 text-ink-soft" />
        <p className="text-[11px] leading-relaxed text-ink-soft">
          All companies, institutions and partnerships shown across the industry experience are
          fictional demo data created for this prototype.
        </p>
      </div>
    </div>
  );
}
