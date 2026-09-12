"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Heart,
  Inbox,
  MapPinned,
  Sprout,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Challenge } from "@/lib/types";
import { STAGES } from "@/lib/types";
import { STAGE_META } from "@/lib/data/categories";
import { useApp } from "@/lib/store";
import { StageBadge } from "@/components/shared/kit";
import { cn } from "@/lib/utils";

type ActivityTab = "reports" | "notifications";

interface NotifItem {
  id: string;
  icon: LucideIcon;
  tint: { bg: string; color: string };
  title: string;
  time: string;
  unread: boolean;
  target?: { kind: "challenge"; id: string } | { kind: "story"; id: string };
  fallbackToast?: string;
}

const NOTIFICATIONS: NotifItem[] = [
  {
    id: "n1",
    icon: BadgeCheck,
    tint: { bg: "rgba(44,140,153,0.12)", color: "#2C8C99" },
    title: "Your report JS-2510 was validated by Ranchi Municipal Corporation",
    time: "2h",
    unread: true,
    target: { kind: "challenge", id: "c-ranchi-waterlogging" },
  },
  {
    id: "n2",
    icon: FlaskConical,
    tint: { bg: "rgba(224,165,56,0.14)", color: "#C98F2A" },
    title: "JS-2481 reached Development stage",
    time: "6h",
    unread: true,
    target: { kind: "challenge", id: "c-bokaro-water" },
  },
  {
    id: "n3",
    icon: Heart,
    tint: { bg: "rgba(217,99,78,0.12)", color: "#D9634E" },
    title: "1,247 citizens supported Bokaro water challenge",
    time: "1d",
    unread: true,
    target: { kind: "challenge", id: "c-bokaro-water" },
  },
  {
    id: "n4",
    icon: GraduationCap,
    tint: { bg: "rgba(14,138,109,0.12)", color: "#0E8A6D" },
    title: "BIT Mesra accepted JS-2481",
    time: "1d",
    unread: false,
    target: { kind: "challenge", id: "c-bokaro-water" },
  },
  {
    id: "n5",
    icon: MapPinned,
    tint: { bg: "rgba(150,163,59,0.13)", color: "#7D8B2B" },
    title: "New cluster formed near you",
    time: "2d",
    unread: false,
    fallbackToast: "3 nearby reports were merged into a new challenge",
  },
  {
    id: "n6",
    icon: Sprout,
    tint: { bg: "rgba(78,159,109,0.13)", color: "#4E9F6D" },
    title: "CropGuard pilot crossed 1,200 farmers",
    time: "3d",
    unread: false,
    target: { kind: "challenge", id: "c-ramgarh-blight" },
  },
  {
    id: "n7",
    icon: Trophy,
    tint: { bg: "rgba(224,165,56,0.14)", color: "#C98F2A" },
    title: "Your district ranked #1 in reports this month",
    time: "5d",
    unread: false,
    fallbackToast: "Ranchi logged 213 reports this month — top in Jharkhand",
  },
  {
    id: "n8",
    icon: BookOpen,
    tint: { bg: "rgba(44,140,153,0.12)", color: "#2C8C99" },
    title: "Impact story published: Clean Water at Every Hand Pump",
    time: "6d",
    unread: false,
    target: { kind: "story", id: "im-water" },
  },
];

/** Mini 7-stage progress dots for a report card. */
function StageDots({ stage }: { stage: Challenge["stage"] }) {
  const step = STAGE_META[stage]?.step ?? 0;
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {STAGES.map((s, idx) => {
          const done = idx < step;
          const current = idx === step;
          return (
            <span
              key={s}
              className={cn(
                "relative block rounded-full",
                current ? "h-2 w-4 bg-brand" : "h-2 w-2",
                done ? "bg-ink/70" : "",
                !done && !current ? "bg-border" : ""
              )}
            >
              {current && (
                <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60" />
              )}
            </span>
          );
        })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
        {step + 1}/7 · {stage}
      </span>
    </div>
  );
}

function ReportCard({ report, index }: { report: Challenge; index: number }) {
  const push = useApp((s) => s.push);
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.07, 0.35),
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => push({ type: "challenge", challengeId: report.id })}
      className="w-full rounded-3xl bg-card p-4 text-left shadow-float"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold tracking-wide text-ink-soft">
          {report.code}
        </span>
        <StageBadge stage={report.stage} />
        <span className="ml-auto flex items-center gap-0.5 text-[11.5px] font-semibold text-brand">
          View progress
          <ChevronRight size={12} strokeWidth={2.6} />
        </span>
      </div>

      <p className="mt-2.5 line-clamp-2 text-[14px] font-bold leading-snug tracking-[-0.01em] text-ink">
        {report.title}
      </p>

      <StageDots stage={report.stage} />

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px] text-ink-soft">
          {report.supporters} supporters · {report.district}
        </span>
        {report.trending && (
          <span className="flex items-center gap-1 rounded-full bg-brand-mist px-2 py-0.5 text-[10.5px] font-bold text-brand-deep">
            <TrendingUp size={11} strokeWidth={2.4} />
            +2.1K this week
          </span>
        )}
      </div>
    </motion.button>
  );
}

export function ActivityView() {
  const challenges = useApp((s) => s.challenges);
  const push = useApp((s) => s.push);
  const toast = useApp((s) => s.toast);
  const setTab = useApp((s) => s.setTab);

  const [tab, setActivityTab] = React.useState<ActivityTab>("reports");

  const myReports = challenges.filter(
    (c) => c.id === "c-ranchi-waterlogging" || c.id.startsWith("user-")
  );
  const hasUserSubmissions = myReports.some((c) => c.id.startsWith("user-"));

  const openNotification = (n: NotifItem) => {
    if (n.target?.kind === "challenge") {
      toast("Opening related challenge", n.title);
      push({ type: "challenge", challengeId: n.target.id });
    } else if (n.target?.kind === "story") {
      toast("Opening impact story", n.title);
      push({ type: "impact-story", storyId: n.target.id });
    } else {
      toast("Notification", n.fallbackToast ?? n.title);
    }
  };

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="px-4 pb-3 pt-5">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          Activity
        </h1>
        <p className="mt-1 text-[12px] text-ink-soft">
          Your reports &amp; platform updates
        </p>
      </div>

      {/* Segmented control */}
      <div className="px-4 pb-4">
        <div className="flex rounded-full bg-secondary p-1">
          {(
            [
              { id: "reports", label: "My Reports" },
              { id: "notifications", label: "Notifications" },
            ] as { id: ActivityTab; label: string }[]
          ).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActivityTab(t.id)}
                className="relative flex-1 rounded-full py-2 text-[12.5px] font-semibold"
              >
                {active && (
                  <motion.span
                    layoutId="activity-seg-thumb"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-card shadow-float"
                  />
                )}
                <span
                  className={cn("relative", active ? "text-ink" : "text-ink-soft")}
                >
                  {t.label}
                  {t.id === "notifications" && (
                    <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === "reports" ? (
        <div className="flex flex-col gap-3 px-4">
          {myReports.map((r, i) => (
            <ReportCard key={r.id} report={r} index={i} />
          ))}

          {!hasUserSubmissions && (
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab("submit")}
              className="flex items-center gap-3.5 rounded-3xl border border-dashed border-border bg-card/60 p-4 text-left"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-ink-soft">
                <Inbox size={19} strokeWidth={2.1} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-bold text-ink">
                  Reported problems will appear here
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-relaxed text-ink-soft">
                  File a new report from the Submit tab to follow its journey
                  from validation to impact.
                </span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-ink-soft/50" />
            </motion.button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 px-4">
          {NOTIFICATIONS.map((n, i) => {
            const Icon = n.icon;
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(i * 0.05, 0.4),
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openNotification(n)}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-float"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: n.tint.bg, color: n.tint.color }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold leading-snug text-ink">
                    {n.title}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-ink-soft">
                    {n.time} ago
                  </span>
                </span>
                {n.unread && (
                  <span className="mt-1 h-2 w-2 shrink-0 self-start rounded-full bg-brand" />
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
