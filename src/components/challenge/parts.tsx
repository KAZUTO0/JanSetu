"use client";

/* ============================================================
   JanSetu — Challenge Detail sections (Task 2-c)
   Consumed by ChallengeDetail.tsx. Internal to this module.
   ============================================================ */

import * as React from "react";
import { motion } from "framer-motion";
import {
  Activity, BadgeCheck, BookmarkCheck, BookmarkPlus, Check, ChevronRight,
  CircleHelp, Clock, Flame, Gauge, GitMerge, Heart, Layers, MapPin,
  Navigation, Play, Radar, Send, Share2, Sparkles, TriangleAlert, Users,
  type LucideIcon,
} from "lucide-react";
import type { Challenge, DuplicateReport, HEIMatch, MediaItem } from "@/lib/types";
import { useApp } from "@/lib/store";
import { heiById } from "@/lib/data/heis";
import { PROJECTS } from "@/lib/data/projects";
import { AnimatedNumber, compactIN } from "@/components/shared/AnimatedNumber";
import { BottomSheet, SPRING } from "@/components/shared/BottomSheet";
import {
  CategoryChip, CategoryIcon, CoverImage, PriorityPill, ScoreRing, StageBadge,
} from "@/components/shared/kit";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEW = { once: true, margin: "-8% 0px" } as const;

/* ---------------- small shared pieces ---------------- */

/** Section stagger-in wrapper (fades + rises as it enters the viewport). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Mount skeleton for hero + stats (~700ms while data "loads"). */
export function DetailSkeleton() {
  return (
    <div className="pt-1">
      <div className="mx-4 mb-4 overflow-hidden rounded-3xl bg-card shadow-float">
        <div className="shimmer aspect-[16/10] bg-secondary" />
        <div className="space-y-2.5 p-4">
          <div className="flex gap-2">
            <div className="shimmer h-6 w-16 rounded-full bg-secondary" />
            <div className="shimmer h-6 w-20 rounded-full bg-secondary" />
          </div>
          <div className="shimmer h-4 w-11/12 rounded-full bg-secondary" />
          <div className="shimmer h-3.5 w-2/3 rounded-full bg-secondary" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 px-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-card p-3 text-center shadow-float">
            <div className="shimmer mx-auto h-7 w-7 rounded-full bg-secondary" />
            <div className="shimmer mx-auto mt-2 h-4 w-12 rounded-full bg-secondary" />
            <div className="shimmer mx-auto mt-1.5 h-2.5 w-9 rounded-full bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 1. Hero ---------------- */

export function HeroCard({ challenge }: { challenge: Challenge }) {
  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-3xl bg-card shadow-float">
      <CoverImage src={challenge.image} alt={challenge.title} ratio="aspect-[16/10]" className="rounded-t-3xl">
        <span className="glass-dark nums absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-white">
          {challenge.code}
        </span>
        <span className="glass-dark absolute right-3 top-3 inline-flex rounded-full">
          <StageBadge stage={challenge.stage} />
        </span>
        <span className="glass-dark absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold text-white">
          <MapPin size={11} strokeWidth={2.5} />
          {challenge.district} · {challenge.block}
        </span>
        {challenge.verified && (
          <span className="glass-dark absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white">
            <BadgeCheck size={12} strokeWidth={2.4} className="text-[#7FC4A8]" />
            Field verified
          </span>
        )}
      </CoverImage>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryChip category={challenge.category} />
          <PriorityPill priority={challenge.priority} />
          {challenge.trending && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: "rgba(224,165,56,0.15)", color: "#B07818" }}
            >
              <Flame size={12} strokeWidth={2.2} />
              Trending
            </span>
          )}
        </div>
        <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-ink-soft">
          {challenge.summary}
        </p>
      </div>
    </div>
  );
}

/* ---------------- 2. Impact stats ---------------- */

function StatTile({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center shadow-float">
      <span
        className={cn(
          "mx-auto mb-1.5 grid h-7 w-7 place-items-center rounded-full",
          accent ? "bg-brand-mist text-brand" : "bg-secondary text-ink-soft"
        )}
      >
        {icon}
      </span>
      <p className="nums text-[16px] font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1.5 text-[9.5px] font-bold uppercase leading-tight tracking-wider text-ink-soft">
        {label}
      </p>
    </div>
  );
}

export function ImpactStats({
  challenge,
  supportersShown,
  supported,
}: {
  challenge: Challenge;
  supportersShown: number;
  supported: boolean;
}) {
  const pct = Math.min(100, (supportersShown / 2000) * 100);
  return (
    <div className="mb-4">
      <div className="grid grid-cols-3 gap-2.5 px-4">
        <StatTile
          icon={<Users size={14} strokeWidth={2.3} />}
          value={<AnimatedNumber value={challenge.affectedPopulation} format={compactIN} />}
          label="Affected"
        />
        <StatTile
          accent={supported}
          icon={<Heart size={14} strokeWidth={2.3} fill={supported ? "currentColor" : "none"} />}
          value={<AnimatedNumber value={supportersShown} />}
          label="Supporters"
        />
        <StatTile
          icon={<Layers size={14} strokeWidth={2.3} />}
          value={<AnimatedNumber value={challenge.reportsCount} />}
          label="Citizen reports"
        />
      </div>
      <div className="mx-4 mt-2.5 rounded-2xl bg-card p-3.5 shadow-float">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Support momentum
          </span>
          <span className="nums text-[11px] font-bold text-ink">
            {supportersShown.toLocaleString("en-IN")}
            <span className="font-medium text-ink-soft"> / 2,000 goal</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={VIEW}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            className="h-full rounded-full bg-gradient-to-r from-[#45B08C] to-brand"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- 3. About ---------------- */

export function AboutCard({ challenge }: { challenge: Challenge }) {
  return (
    <div className="mx-4 mb-4 rounded-3xl bg-card p-5 shadow-float">
      <p className="text-[13.5px] leading-[1.65] text-ink/90">{challenge.description}</p>
      <div className="mt-4 flex items-center gap-1.5">
        <Sparkles size={12} strokeWidth={2.4} className="text-brand" />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">AI tags</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {challenge.tags.slice(0, 5).map((t) => (
          <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 4. Evidence carousel ---------------- */

function splitVideoCaption(caption: string): { dur: string; text: string } {
  const m = caption.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[—-]\s*(.*)$/);
  if (m) return { dur: m[1], text: m[2] };
  return { dur: "", text: caption };
}

function VideoTile({ item }: { item: MediaItem }) {
  const toast = useApp((s) => s.toast);
  const { dur, text } = splitVideoCaption(item.caption);
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => toast("Video evidence", "Playback is simulated in this prototype")}
      className="relative aspect-[4/3] w-56 shrink-0 overflow-hidden rounded-2xl bg-ink text-left shadow-float"
    >
      <div className="dot-grid absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(150px_95px_at_50%_42%,rgba(14,138,109,0.4),transparent_72%)]" />
      {dur && (
        <span className="nums absolute left-2.5 top-2.5 rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur-sm">
          {dur}
        </span>
      )}
      <span className="absolute left-1/2 top-[42%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-sm">
        <Play size={17} className="translate-x-[1px] fill-white text-white" />
      </span>
      <p className="absolute inset-x-2.5 bottom-2.5 line-clamp-2 text-[11px] leading-snug text-white/85">
        {text}
      </p>
    </motion.button>
  );
}

export function EvidenceCarousel({
  challenge,
  onOpenPhoto,
}: {
  challenge: Challenge;
  onOpenPhoto: (m: MediaItem) => void;
}) {
  return (
    <div className="no-scrollbar mb-4 flex gap-3 overflow-x-auto px-4 pb-1">
      {challenge.media.map((m, i) =>
        m.type === "photo" ? (
          <motion.button
            key={`${m.url}-${i}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenPhoto(m)}
            className="w-56 shrink-0 rounded-2xl bg-card p-2 text-left shadow-float"
          >
            <CoverImage src={m.url} alt={m.caption} ratio="aspect-[4/3]" className="rounded-xl" />
            <p className="mt-2 line-clamp-2 px-1 pb-0.5 text-[11px] leading-snug text-ink-soft">
              {m.caption}
            </p>
          </motion.button>
        ) : (
          <VideoTile key={`video-${i}`} item={m} />
        )
      )}
    </div>
  );
}

/* ---------------- 5. Location ---------------- */

export function LocationCard({ challenge }: { challenge: Challenge }) {
  const toast = useApp((s) => s.toast);
  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-3xl bg-card shadow-float">
      <div className="dot-grid relative h-36 bg-secondary/50">
        <div className="absolute inset-0 bg-[radial-gradient(190px_115px_at_50%_44%,rgba(14,138,109,0.16),transparent_72%)]" />
        <span className="glass absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold text-ink">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          3 nearby reports this week
        </span>
        <span className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
          <span className="pulse-ring relative grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-float-lg">
            <MapPin size={19} strokeWidth={2.4} />
          </span>
        </span>
        <div className="absolute inset-x-3 top-[44%] mt-8 flex flex-col items-center gap-1 text-center">
          <p className="text-[12.5px] font-bold text-ink">
            {challenge.village ? `${challenge.village} · ` : ""}
            {challenge.block}
          </p>
          <p className="text-[10.5px] font-medium text-ink-soft">{challenge.district} district</p>
          <span className="nums rounded-full bg-card/90 px-2 py-0.5 text-[9.5px] font-bold text-ink-soft shadow-float">
            {challenge.location.lat.toFixed(4)}° N · {challenge.location.lng.toFixed(4)}° E
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-ink">{challenge.location.label}</p>
          <p className="mt-0.5 text-[11px] text-ink-soft">
            GPS-clustered from {challenge.reportsCount} citizen reports
          </p>
        </div>
        <button
          onClick={() =>
            toast("Opening directions", `${challenge.location.label} — maps simulated in this prototype`)
          }
          className="tap flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-3.5 text-[12px] font-semibold text-ink"
        >
          <Navigation size={14} strokeWidth={2.4} className="text-brand" />
          Get directions
        </button>
      </div>
    </div>
  );
}

/* ---------------- 6. Journey timeline ---------------- */

export function JourneyCard({ challenge }: { challenge: Challenge }) {
  const timeline = challenge.timeline;
  const stageIdx = timeline.findIndex((e) => e.stage === challenge.stage);
  const firstNotDone = timeline.findIndex((e) => !e.done);
  const currentIdx =
    stageIdx >= 0 ? stageIdx : firstNotDone >= 0 ? firstNotDone : timeline.length - 1;

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const currentDotRef = React.useRef<HTMLSpanElement>(null);
  const [fillPx, setFillPx] = React.useState(0);

  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const dot = currentDotRef.current;
    if (!wrap || !dot) return;
    const wr = wrap.getBoundingClientRect();
    const dr = dot.getBoundingClientRect();
    setFillPx(Math.max(0, dr.top - wr.top + dr.height / 2 - 16));
  }, [challenge.id]);

  return (
    <div className="mx-4 mb-4 rounded-3xl bg-card p-5 shadow-float">
      <div className="relative" ref={wrapRef}>
        <div className="absolute bottom-4 left-[15px] top-4 w-[2px] rounded-full bg-secondary" />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: fillPx }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="absolute left-[15px] top-4 w-[2px] rounded-full bg-gradient-to-b from-brand-soft via-brand to-brand-deep"
        />
        <div className="space-y-4">
          {timeline.map((e, i) => {
            const status: "done" | "current" | "future" =
              i < currentIdx ? "done" : i === currentIdx ? "current" : "future";
            const hasDate = Boolean(e.date && e.date !== "—");
            return (
              <div key={e.stage} className="relative flex gap-3.5">
                {status === "done" && (
                  <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white shadow-float">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                {status === "current" && (
                  <span
                    ref={currentDotRef}
                    className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-brand bg-card"
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-brand" />
                    </span>
                  </span>
                )}
                {status === "future" && (
                  <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-secondary/60">
                    <span className="h-2 w-2 rounded-full bg-ink-soft/40" />
                  </span>
                )}
                <div className="min-w-0 flex-1 pb-0.5 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p
                      className={cn(
                        "text-[13px] font-semibold",
                        status === "future" ? "text-ink-soft/70" : "text-ink"
                      )}
                    >
                      {e.stage}
                    </p>
                    {status === "current" && (
                      <span className="rounded-full bg-brand-mist px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-brand-deep">
                        Current stage
                      </span>
                    )}
                  </div>
                  {hasDate && (
                    <p
                      className={cn(
                        "nums mt-0.5 text-[11px] font-bold",
                        status === "future" ? "text-ink-soft/50" : "text-brand"
                      )}
                    >
                      {e.date}
                    </p>
                  )}
                  {e.note && (
                    <p className="mt-0.5 text-[11.5px] leading-snug text-ink-soft">{e.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 7. JanSetu Intelligence (dark) ---------------- */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10 text-white/80">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">{label}</p>
        <p className="truncate text-[12.5px] font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export function IntelligenceCard({
  challenge,
  onWhy,
}: {
  challenge: Challenge;
  onWhy: () => void;
}) {
  return (
    <div className="mx-4 mb-4 rounded-3xl bg-ink p-5 text-white shadow-float-lg">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand">
          <Sparkles size={17} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold tracking-[-0.01em]">JanSetu Intelligence</p>
          <p className="mt-0.5 text-[10.5px] font-medium text-white/50">
            Priority &amp; capability assessment
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white/60">
          simulated AI
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <ScoreRing value={challenge.priorityScore} size={76} stroke={6} color="#45B08C" />
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
            priority
          </span>
        </div>
        <div className="flex-1 space-y-2.5">
          <InfoRow
            icon={<CategoryIcon category={challenge.category} size={13} />}
            label="Domain"
            value={challenge.category}
          />
          <InfoRow
            icon={<Gauge size={13} strokeWidth={2.3} />}
            label="Confidence"
            value={`${challenge.confidence}% · ${challenge.confidence >= 80 ? "High" : "Medium"}`}
          />
          <InfoRow
            icon={<Users size={13} strokeWidth={2.3} />}
            label="Affected"
            value={`${compactIN(challenge.affectedPopulation)} people`}
          />
        </div>
      </div>

      <p className="mt-4 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/45">
        Required expertise
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {challenge.expertise.map((x) => (
          <span
            key={x}
            className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/90"
          >
            {x}
          </span>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onWhy}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/10 text-[13px] font-semibold text-white"
      >
        <CircleHelp size={15} strokeWidth={2.4} className="text-[#45B08C]" />
        Why this score?
      </motion.button>
    </div>
  );
}

/* ---------------- 8. Duplicate detection ---------------- */

const DUP_COLORS = ["#0E8A6D", "#2C8C99", "#D98A1F", "#96A33B", "#C97B5A"];

function DupRow({ dup, color, index }: { dup: DuplicateReport; color: string; index: number }) {
  const merged = dup.status.toLowerCase().includes("merge");
  const initials = dup.reporter
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="py-3.5">
      <div className="flex items-start gap-3">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[12px] font-bold text-white"
          style={{ background: color }}
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-snug text-ink">{dup.title}</p>
              <p className="mt-0.5 text-[11px] text-ink-soft">
                {dup.reporter} · {dup.district} · {dup.distanceKm} km · {dup.daysAgo}d ago
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide",
                merged ? "bg-brand-mist text-brand-deep" : "bg-secondary text-ink-soft"
              )}
            >
              {merged ? "Merged" : "Under review"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${dup.similarity}%` }}
                viewport={VIEW}
                transition={{ duration: 0.9, delay: 0.15 + index * 0.1, ease: EASE }}
                className={cn(
                  "h-full rounded-full",
                  merged
                    ? "bg-gradient-to-r from-[#45B08C] to-brand"
                    : "bg-gradient-to-r from-[#E0A538] to-[#D98A1F]"
                )}
              />
            </div>
            <span className="nums shrink-0 text-[11px] font-bold text-ink">{dup.similarity}% match</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DuplicatesCard({ challenge }: { challenge: Challenge }) {
  return (
    <div className="mx-4 mb-4 rounded-3xl bg-card p-4 shadow-float">
      <div className="flex items-start gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand-deep">
          <GitMerge size={15} strokeWidth={2.3} />
        </span>
        <p className="text-[12.5px] leading-relaxed text-ink-soft">
          JanSetu AI merged{" "}
          <span className="nums font-bold text-ink">{challenge.reportsCount} reports</span> into this
          cluster — matched on wording, location and evidence.
        </p>
      </div>
      <div className="mt-1 divide-y divide-border/70">
        {challenge.duplicates.map((d, i) => (
          <DupRow key={d.id} dup={d} color={DUP_COLORS[i % DUP_COLORS.length]} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- 9. Recommended HEIs ---------------- */

function initialsOf(name: string): string {
  const words = name.replace(/[(),]/g, "").split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return "HE";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function HeiMatchCard({
  match,
  best,
  onOpen,
}: {
  match: HEIMatch;
  best: boolean;
  onOpen: () => void;
}) {
  const hei = heiById(match.heiId);
  return (
    <div className="relative mx-4 mb-3 overflow-hidden rounded-3xl bg-card p-4 shadow-float">
      {best && (
        <span className="absolute right-0 top-0 z-10 rounded-bl-2xl bg-brand px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-white">
          Best match
        </span>
      )}
      <div className={cn("flex items-start gap-3", best && "mt-2")}>
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[13px] font-extrabold text-white"
          style={{ background: hei.color }}
        >
          {initialsOf(hei.shortName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold tracking-[-0.01em] text-ink">{hei.shortName}</p>
          <p className="mt-0.5 truncate text-[11px] text-ink-soft">
            {hei.city} · {hei.type}
          </p>
        </div>
        <ScoreRing value={match.matchPercent} size={54} stroke={5} color="#0E8A6D" label="match" />
      </div>

      <div className="mt-3.5 space-y-2">
        {match.factors.slice(0, 3).map((f) => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="w-[118px] shrink-0 truncate text-[10.5px] font-semibold text-ink-soft">
              {f.label}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${f.value}%` }}
                viewport={VIEW}
                transition={{ duration: 0.8, ease: EASE }}
                className="h-full rounded-full bg-gradient-to-r from-[#45B08C] to-brand"
              />
            </div>
            <span className="nums w-8 shrink-0 text-right text-[10px] font-bold text-ink">
              {f.value}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1.5">
        {match.reasons.slice(0, 3).map((r) => (
          <div key={r} className="flex items-start gap-2">
            <Check size={13} strokeWidth={3} className="mt-[2px] shrink-0 text-brand" />
            <p className="text-[11.5px] leading-snug text-ink/85">{r}</p>
          </div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onOpen}
        className="mt-3.5 flex w-full items-center justify-between rounded-xl bg-secondary/60 px-3.5 py-2.5"
      >
        <span className="text-[12px] font-semibold text-ink">Full match breakdown</span>
        <ChevronRight size={15} strokeWidth={2.4} className="text-ink-soft" />
      </motion.button>
    </div>
  );
}

/* ---------------- 10. Bottom action bar ---------------- */

function ShareBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label="Share challenge"
      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-card text-ink shadow-float"
    >
      <Share2 size={17} strokeWidth={2.3} />
    </motion.button>
  );
}

export function ActionBar({
  challenge,
  supportersShown,
  supported,
}: {
  challenge: Challenge;
  supportersShown: number;
  supported: boolean;
}) {
  const role = useApp((s) => s.role);
  const toast = useApp((s) => s.toast);
  const toggleSupport = useApp((s) => s.toggleSupport);
  const acceptChallenge = useApp((s) => s.acceptChallenge);
  const push = useApp((s) => s.push);
  const accepted = useApp((s) => s.acceptedChallengeIds.includes(challenge.id));
  const [following, setFollowing] = React.useState(false);

  const share = () =>
    toast("Link copied", `${challenge.code} · challenge link copied to clipboard`);

  return (
    <div className="sticky bottom-0 z-20 -mb-8">
      <div className="glass border-t border-border px-4 py-3">
        {role === "citizen" && (
          <div className="flex gap-2.5">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const turningOn = !supported;
                toggleSupport(challenge.id);
                if (turningOn)
                  toast("Supporting this challenge", "You'll receive updates as it progresses");
              }}
              className={cn(
                "flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl text-[13.5px] font-semibold text-white transition-colors",
                supported ? "bg-brand" : "bg-ink"
              )}
            >
              <motion.span
                key={supported ? "on" : "off"}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={SPRING}
                className="shrink-0"
              >
                <Heart size={16} strokeWidth={2.4} fill={supported ? "currentColor" : "none"} />
              </motion.span>
              <span className="truncate">{supported ? "Supporting" : "Support this challenge"}</span>
              <span
                className={cn(
                  "nums shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                  supported ? "bg-white/20 text-white" : "bg-white/15 text-white/90"
                )}
              >
                <AnimatedNumber value={supportersShown} duration={0.6} startOnView={false} />
              </span>
            </motion.button>
            <ShareBtn onClick={share} />
          </div>
        )}

        {role === "hei" && (
          <div className="flex gap-2.5">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!accepted) {
                  acceptChallenge(challenge.id);
                  toast("Challenge accepted", "Assigned to your institution");
                } else {
                  toast("Already accepted", "This challenge is assigned to your institution");
                }
              }}
              className={cn(
                "flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl text-[13.5px] font-semibold",
                accepted ? "bg-brand-mist text-brand-deep" : "bg-brand text-white"
              )}
            >
              {accepted ? (
                <BadgeCheck size={16} strokeWidth={2.4} />
              ) : (
                <Check size={16} strokeWidth={3} />
              )}
              <span className="truncate">{accepted ? "Accepted" : "Accept Challenge"}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const project = PROJECTS.find((p) => p.challengeId === challenge.id);
                if (project) push({ type: "project", projectId: project.id });
                else
                  toast("Team formation workspace", "Opening soon — simulated in this prototype");
              }}
              className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink text-[13.5px] font-semibold text-white"
            >
              <Users size={16} strokeWidth={2.4} />
              <span className="truncate">Form Team</span>
            </motion.button>
          </div>
        )}

        {(role === "industry" || role === "government") && (
          <div className="flex gap-2.5">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setFollowing(true);
                toast("Following challenge", `You'll receive stage updates for ${challenge.code}`);
              }}
              className={cn(
                "flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl text-[13.5px] font-semibold",
                following ? "bg-brand-mist text-brand-deep" : "bg-ink text-white"
              )}
            >
              {following ? (
                <BookmarkCheck size={16} strokeWidth={2.4} />
              ) : (
                <BookmarkPlus size={16} strokeWidth={2.4} />
              )}
              <span className="truncate">{following ? "Following" : "Follow challenge"}</span>
            </motion.button>
            <ShareBtn onClick={share} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Bottom sheets ---------------- */

const WHY_ICONS: LucideIcon[] = [Users, TriangleAlert, Layers, Activity, Clock, MapPin];

export function WhyScoreSheet({
  open,
  onClose,
  challenge,
}: {
  open: boolean;
  onClose: () => void;
  challenge: Challenge;
}) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Why this score?"
      subtitle={`Priority ${challenge.priorityScore}/100 · ${challenge.priority} priority`}
    >
      <div className="space-y-2.5 pt-1">
        {challenge.whyScore.map((w, i) => {
          const Icon = WHY_ICONS[i % WHY_ICONS.length];
          return (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-card text-brand-deep shadow-float">
                <Icon size={15} strokeWidth={2.2} />
              </span>
              <p className="text-[12.5px] font-medium leading-relaxed text-ink/90">{w}</p>
            </div>
          );
        })}
        <p className="flex items-center gap-1.5 pb-1 pt-2 text-[11px] font-medium text-ink-soft">
          <Sparkles size={12} strokeWidth={2.4} className="text-brand" />
          Simulated explainability for the prototype
        </p>
      </div>
    </BottomSheet>
  );
}

export function MatchSheet({
  open,
  onClose,
  match,
}: {
  open: boolean;
  onClose: () => void;
  match: HEIMatch | null;
}) {
  const toast = useApp((s) => s.toast);
  const hei = match ? heiById(match.heiId) : null;
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={hei?.shortName ?? ""}
      subtitle={match ? `Full capability match · ${match.matchPercent}% overall` : undefined}
    >
      {match && hei && (
        <div className="pt-1">
          <div className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-4">
            <ScoreRing value={match.matchPercent} size={64} stroke={6} color="#0E8A6D" label="match" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold leading-snug text-ink">{hei.name}</p>
              <p className="mt-0.5 text-[11px] text-ink-soft">
                {hei.city} · {hei.type}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Match factors
          </p>
          <div className="mt-2.5 space-y-3">
            {match.factors.map((f, i) => (
              <div key={f.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-ink">{f.label}</span>
                  <span className="nums text-[12px] font-bold text-ink">{f.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.value}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: EASE }}
                    className="h-full rounded-full bg-gradient-to-r from-[#45B08C] to-brand"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Why this institution
          </p>
          <div className="mt-2 space-y-1.5">
            {match.reasons.map((r) => (
              <div key={r} className="flex items-start gap-2">
                <Check size={13} strokeWidth={3} className="mt-[2px] shrink-0 text-brand" />
                <p className="text-[12px] leading-snug text-ink/85">{r}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              toast("Brief sent", `Challenge brief shared with ${hei.shortName} (simulated)`);
              onClose();
            }}
            className="tap mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[13.5px] font-semibold text-white shadow-float"
          >
            <Send size={15} strokeWidth={2.4} />
            Send challenge to HEI
          </motion.button>
          <p className="mt-3 pb-1 text-center text-[10.5px] text-ink-soft">
            Simulated matching for the prototype
          </p>
        </div>
      )}
    </BottomSheet>
  );
}

export function PhotoSheet({
  open,
  onClose,
  photo,
}: {
  open: boolean;
  onClose: () => void;
  photo: MediaItem | null;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Field evidence" subtitle={photo?.caption}>
      {photo && (
        <div className="pt-1">
          {/* Plain img on purpose: prototype lightbox for a local static asset. */}
          <img src={photo.url} alt={photo.caption} className="w-full rounded-2xl shadow-float" />
          <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">{photo.caption}</p>
        </div>
      )}
    </BottomSheet>
  );
}
