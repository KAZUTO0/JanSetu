"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Download,
  Droplets,
  Flag,
  Globe,
  Megaphone,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { RolePreviewCard } from "@/components/shell/RolePreviewCard";
import { Switch } from "@/components/ui/switch";

interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  tint: { bg: string; color: string };
}

const BADGES: BadgeDef[] = [
  {
    id: "water-guardian",
    name: "Water Guardian",
    desc: "Supported 5+ safe-water challenges across Jharkhand.",
    icon: Droplets,
    tint: { bg: "rgba(44,140,153,0.12)", color: "#2C8C99" },
  },
  {
    id: "first-reporter",
    name: "First Reporter",
    desc: "Filed a verified report within the first week of joining.",
    icon: Flag,
    tint: { bg: "rgba(14,138,109,0.12)", color: "#0E8A6D" },
  },
  {
    id: "crowd-voice",
    name: "Crowd Voice",
    desc: "Helped rally 1,000+ supporters behind a single challenge.",
    icon: Megaphone,
    tint: { bg: "rgba(224,165,56,0.14)", color: "#C98F2A" },
  },
];

export function CitizenProfileView() {
  const toast = useApp((s) => s.toast);
  const [notificationsOn, setNotificationsOn] = React.useState(true);

  const stats: { value: number; label: string }[] = [
    { value: 3, label: "Reports" },
    { value: 12, label: "Supported" },
    { value: 48, label: "Impact pts" },
  ];

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="px-4 pb-4 pt-5">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          Profile
        </h1>
      </div>

      {/* Identity card */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="card-hairline rounded-3xl bg-card p-5 shadow-float"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand text-[20px] font-extrabold tracking-wide text-white shadow-float">
              AX
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[19px] font-extrabold tracking-[-0.02em] text-ink">
                Aarav Xalxo
              </p>
              <p className="mt-0.5 text-[12.5px] text-ink-soft">
                Citizen Reporter · Ranchi
              </p>
              <span className="mt-2 inline-block rounded-full bg-secondary px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                Reporting since Mar 2024
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl bg-secondary/60 py-3 text-center"
              >
                <p className="text-[20px] font-extrabold leading-none text-ink">
                  <AnimatedNumber
                    value={s.value}
                    delay={0.15 + i * 0.08}
                    duration={0.9}
                  />
                </p>
                <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-soft">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Community badges */}
      <div className="pt-6">
        <SectionHeader title="Community badges" sub="Earned through action" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: Math.min(i * 0.06, 0.3),
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-[170px] shrink-0 rounded-3xl bg-card p-4 shadow-float"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ background: b.tint.bg, color: b.tint.color }}
                >
                  <Icon size={19} strokeWidth={2.2} />
                </span>
                <p className="mt-3 text-[13.5px] font-bold text-ink">{b.name}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                  {b.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Prototype controls */}
      <div className="pt-2">
        <SectionHeader
          title="Prototype controls"
          sub="Switch the full experience"
        />
        <div className="my-5">
          <RolePreviewCard />
        </div>
      </div>

      {/* Settings */}
      <div className="px-4">
        <div className="card-hairline overflow-hidden rounded-3xl bg-card shadow-float">
          {/* Notifications */}
          <div
            onClick={() =>
              toast(
                "Notifications",
                "Toggle updates for matches and stage changes"
              )
            }
            className="flex cursor-pointer items-center gap-3 px-4 py-3.5"
          >
            <span
              onClick={(e) => e.stopPropagation()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft"
            >
              <Bell size={16} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-ink">Notifications</p>
              <p className="mt-0.5 text-[11.5px] text-ink-soft">
                Match &amp; stage updates
              </p>
            </div>
            <span onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={notificationsOn}
                onCheckedChange={(v) => {
                  setNotificationsOn(v);
                  toast(
                    v ? "Notifications on" : "Notifications off",
                    "Demo preference — stored locally for this session"
                  );
                }}
              />
            </span>
          </div>

          <div className="h-px bg-border/70" />

          {/* Language */}
          <button
            onClick={() =>
              toast("Language", "Switching languages is simulated in this prototype")
            }
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft">
              <Globe size={16} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-ink">Language</p>
              <p className="mt-0.5 text-[11.5px] text-ink-soft">English (India)</p>
            </div>
            <ChevronRight size={15} className="shrink-0 text-ink-soft/50" />
          </button>

          <div className="h-px bg-border/70" />

          {/* Privacy */}
          <button
            onClick={() =>
              toast("Privacy", "Reports stay anonymous by default in this demo")
            }
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft">
              <Shield size={16} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-ink">Privacy</p>
              <p className="mt-0.5 text-[11.5px] text-ink-soft">
                Anonymous reporting is always on
              </p>
            </div>
            <ChevronRight size={15} className="shrink-0 text-ink-soft/50" />
          </button>

          <div className="h-px bg-border/70" />

          {/* Offline cache */}
          <button
            onClick={() =>
              toast("Offline cache (mock)", "4.2 MB of demo data marked for offline use")
            }
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft">
              <Download size={16} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-ink">Offline cache</p>
              <p className="mt-0.5 text-[11.5px] text-ink-soft">
                (mock) · 4.2 MB demo data
              </p>
            </div>
            <ChevronRight size={15} className="shrink-0 text-ink-soft/50" />
          </button>
        </div>
      </div>

      {/* About this prototype */}
      <div className="mb-6 mt-6 px-4">
        <div className="rounded-3xl bg-card p-5 shadow-float">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[14.5px] font-bold tracking-[-0.01em] text-ink">
              About this prototype
            </p>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-ink-soft">
              Prototype v0.1
            </span>
          </div>
          <p className="text-[12.5px] leading-relaxed text-ink-soft">
            JanSetu bridges everyday citizen problems to higher education
            institutions, industry and government — so a reported issue can travel
            from a hand pump to a deployed solution. All challenges, matches and
            metrics shown here are simulated demo data; no real partnerships or
            endorsements are implied.
          </p>
        </div>
      </div>
    </div>
  );
}
