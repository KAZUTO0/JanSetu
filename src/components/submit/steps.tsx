"use client";

/* ============================================================
   JanSetu Submit flow — step sub-components (Task 2-b)
   Presentational steps orchestrated by SubmitFlow.tsx.
   ============================================================ */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Combine, GraduationCap, ArrowRight, MapPin, ChevronRight,
  LocateFixed, Check, Loader2, Video, Info, Search, HelpCircle,
  Clock, Eye, Send, PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import type { Category, Challenge } from "@/lib/types";
import { STAGES } from "@/lib/types";
import { categoryOf } from "@/lib/data/categories";
import { BottomSheet, SPRING, SPRING_SOFT } from "@/components/shared/BottomSheet";
import { compactIN } from "@/components/shared/AnimatedNumber";
import {
  CategoryChip, PriorityPill, StageBadge, ScoreRing, CoverImage, CategoryIcon,
} from "@/components/shared/kit";

/* ---------------- Shared types & constants ---------------- */

export type PopChoice = { id: string; label: string; value: number };

export interface AiResult {
  category: Category;
  priority: "Critical" | "High" | "Medium" | "Low";
  priorityScore: number;
  confidence: number;
  affectedPopulation: number;
  expertise: string[];
  tags: string[];
  whyScore: string[];
  evidenceCount: number;
}

export interface SimilarReport {
  id: string;
  title: string;
  distanceKm: number;
  similarity: number;
  reporter: string;
  daysAgo: number;
}

export const POP_CHOICES: PopChoice[] = [
  { id: "u1k", label: "Under 1K", value: 850 },
  { id: "r5k", label: "1–5K", value: 3200 },
  { id: "r20k", label: "5–20K", value: 12400 },
  { id: "p20k", label: "20K+", value: 42000 },
];

export const DISTRICTS: string[] = [
  "Ranchi", "Bokaro", "Dhanbad", "East Singhbhum", "Giridih", "Hazaribagh",
  "Ramgarh", "Khunti", "Gumla", "Simdega", "West Singhbhum", "Saraikela-Kharsawan",
  "Lohardaga", "Palamu", "Chatra", "Koderma", "Latehar", "Garhwa",
  "Sahibganj", "Pakur", "Godda", "Dumka", "Deoghar", "Jamtara",
];

export const EVIDENCE_PHOTOS: { url: string; label: string }[] = [
  { url: "/images/water-groundwater.png", label: "Water source" },
  { url: "/images/agriculture-crop.png", label: "Crop field" },
  { url: "/images/waterlogging.png", label: "Waterlogged road" },
  { url: "/images/waste.png", label: "Waste site" },
  { url: "/images/healthcare.png", label: "Health centre" },
  { url: "/images/education.png", label: "School" },
];

/** Scrolls the app's scroll container (rendered by the shell) back to top. */
export function scrollFlowTop(node: HTMLElement | null) {
  const scroller = node?.closest(".jansetu-scroll") as HTMLElement | null;
  scroller?.scrollTo({ top: 0 });
}

/* ---------------- Small shared pieces ---------------- */

function StepHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-1">
      <h1 className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">{title}</h1>
      {sub && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{sub}</p>}
    </div>
  );
}

export function ContinueButton({
  label, onClick, disabled, hint,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <motion.button
        type="button"
        whileTap={disabled ? undefined : { scale: 0.97 }}
        onClick={() => { if (!disabled) onClick(); }}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold transition-colors duration-200",
          disabled ? "bg-secondary text-ink-soft/60" : "bg-brand text-white shadow-float"
        )}
      >
        {label}
        <ArrowRight size={17} strokeWidth={2.4} />
      </motion.button>
      {hint && (
        <motion.p
          initial={false}
          animate={{ opacity: disabled ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-center text-[11.5px] leading-snug text-ink-soft"
        >
          {hint}
        </motion.p>
      )}
    </div>
  );
}

const HINT_AMBER = "#D98A1F";

/* ================= STEP 0 — Welcome ================= */

export function StepWelcome({ onStart, onHowItWorks }: { onStart: () => void; onHowItWorks: () => void }) {
  const rows = [
    { icon: Sparkles, text: "AI classifies & scores your report" },
    { icon: Combine, text: "Nearby duplicates are merged automatically" },
    { icon: GraduationCap, text: "Universities pick it up and build solutions" },
  ];
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Citizen reporting</p>
      <h1 className="mt-2 text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink">
        Spot a problem.<br />JanSetu takes it further.
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: 0.1 }}
        className="mt-5"
      >
        <CoverImage
          src="/images/hero-landscape.png"
          alt="Rural Jharkhand landscape at sunrise"
          className="rounded-3xl shadow-float"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 shadow-float backdrop-blur-md"
          >
            <MapPin size={12} strokeWidth={2.5} className="text-brand" />
            <span className="text-[11px] font-bold text-ink">24 districts covered</span>
          </motion.div>
        </CoverImage>
      </motion.div>

      <div className="mt-6 space-y-3">
        {rows.map((r, i) => (
          <motion.div
            key={r.text}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.25 + i * 0.09 }}
            className="flex items-center gap-3.5"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-mist text-brand-deep">
              <r.icon size={19} strokeWidth={2.2} />
            </div>
            <p className="text-[13.5px] font-medium leading-snug text-ink">{r.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-7 space-y-2.5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[15px] font-semibold text-white shadow-float"
        >
          Start a report
          <ArrowRight size={17} strokeWidth={2.4} />
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onHowItWorks}
          className="tap flex h-11 w-full items-center justify-center rounded-2xl border border-border bg-card text-[13.5px] font-semibold text-ink"
        >
          How it works
        </motion.button>
      </div>
    </div>
  );
}

/* ================= STEP 1 — Describe ================= */

export function StepDescribe({
  title, onTitleChange, description, onDescriptionChange, pop, onPopChange, onContinue,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  pop: PopChoice | null;
  onPopChange: (p: PopChoice | null) => void;
  onContinue: () => void;
}) {
  const titleOk = title.trim().length >= 8;
  const descOk = description.trim().length >= 60;
  const valid = titleOk && descOk;

  return (
    <div className="space-y-4">
      <StepHeader title="Describe the problem" sub="A clear first sentence helps the AI classify your report accurately." />

      <div className="card-hairline rounded-3xl bg-card p-5 shadow-float">
        <label htmlFor="sf-title" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">
          Title
        </label>
        <input
          id="sf-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Hand pump water turns white"
          maxLength={90}
          className="h-12 w-full rounded-2xl bg-secondary/60 px-4 text-[14px] font-medium text-ink outline-none transition-shadow placeholder:text-ink-soft/60 focus:ring-2 focus:ring-brand/40"
        />
        {title.length > 0 && !titleOk && (
          <p className="mt-1.5 text-[11px] font-medium" style={{ color: HINT_AMBER }}>
            Add a few more words — minimum 8 characters.
          </p>
        )}

        <label htmlFor="sf-desc" className="mb-2 mt-5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">
          Description
        </label>
        <textarea
          id="sf-desc"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="What did you see? Who is affected? Since when?"
          maxLength={600}
          className="min-h-32 w-full resize-none rounded-2xl bg-secondary/60 p-4 text-[14px] leading-relaxed text-ink outline-none transition-shadow placeholder:text-ink-soft/60 focus:ring-2 focus:ring-brand/40"
        />
        <div className="mt-1.5 flex items-center justify-end gap-1">
          {description.trim().length >= 140 && <Check size={11} strokeWidth={3} className="text-brand" />}
          <span
            className={cn(
              "nums text-[11px] font-semibold",
              description.trim().length >= 140 ? "text-brand" : "text-ink-soft/70"
            )}
          >
            {description.trim().length} chars · 140+ recommended
          </span>
        </div>
        {description.length > 0 && !descOk && (
          <p className="mt-1 text-right text-[11px] font-medium" style={{ color: HINT_AMBER }}>
            Description needs at least 60 characters.
          </p>
        )}

        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">
            {"Who's affected?"}
          </p>
          <div className="flex flex-wrap gap-2">
            {POP_CHOICES.map((p) => {
              const active = pop?.id === p.id;
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={() => onPopChange(active ? null : p)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
                    active ? "border-transparent bg-ink text-white" : "border-border bg-card text-ink-soft"
                  )}
                >
                  {p.label}
                </motion.button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-ink-soft/70">
            Not sure? Leave it blank — the AI estimates from your description.
          </p>
        </div>
      </div>

      <ContinueButton
        label="Continue"
        onClick={onContinue}
        disabled={!valid}
        hint="Add a title (8+ chars) and a description (60+ chars) to continue."
      />
    </div>
  );
}

/* ================= STEP 2 — Evidence ================= */

export function StepEvidence({
  selected, onSelectedChange, video, onVideoChange, onContinue,
}: {
  selected: string[];
  onSelectedChange: (urls: string[]) => void;
  video: boolean;
  onVideoChange: (v: boolean) => void;
  onContinue: () => void;
}) {
  const toast = useApp((s) => s.toast);

  const togglePhoto = (url: string) => {
    if (selected.includes(url)) {
      onSelectedChange(selected.filter((u) => u !== url));
    } else if (selected.length >= 3) {
      toast("Photo limit reached", "You can attach up to 3 photos");
    } else {
      onSelectedChange([...selected, url]);
    }
  };

  const hasEvidence = selected.length > 0 || video;

  return (
    <div className="space-y-4">
      <StepHeader title="Add evidence" sub="Pick photos from the device roll, or record a short video on-site." />

      <div className="card-hairline rounded-3xl bg-card p-5 shadow-float">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">Device roll</p>
          <span className="nums rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-ink-soft">
            {selected.length}/3 selected
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {EVIDENCE_PHOTOS.map((p) => {
            const active = selected.includes(p.url);
            return (
              <figure key={p.url} className="flex flex-col gap-1">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => togglePhoto(p.url)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-2xl transition-shadow",
                    active ? "shadow-float ring-2 ring-brand ring-offset-2 ring-offset-card" : "ring-1 ring-ink/10"
                  )}
                >
                  <img src={p.url} alt={p.label} className="h-full w-full object-cover" />
                  {active && (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-brand text-white shadow-float"
                    >
                      <Check size={13} strokeWidth={3} />
                    </motion.span>
                  )}
                </motion.button>
                <figcaption className="truncate text-center text-[9.5px] font-semibold text-ink-soft/80">
                  {p.label}
                </figcaption>
              </figure>
            );
          })}

          <figure className="flex flex-col gap-1">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onVideoChange(!video)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border-2 transition-colors",
                video ? "border-brand bg-brand-mist text-brand-deep" : "border-dashed border-border text-ink-soft"
              )}
            >
              {video ? (
                <>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white shadow-float">
                    <Video size={17} strokeWidth={2.2} />
                  </span>
                  <span className="px-1 text-center text-[9.5px] font-bold leading-tight">
                    0:42 video attached
                  </span>
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-brand text-white shadow-float"
                  >
                    <Check size={13} strokeWidth={3} />
                  </motion.span>
                </>
              ) : (
                <>
                  <Video size={22} strokeWidth={2} />
                  <span className="text-[9.5px] font-semibold">Record video</span>
                </>
              )}
            </motion.button>
            <figcaption className="truncate text-center text-[9.5px] font-semibold text-ink-soft/80">Video</figcaption>
          </figure>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary/50 px-3 py-2.5">
          <Info size={13} strokeWidth={2.2} className="mt-0.5 shrink-0 text-ink-soft" />
          <p className="text-[11.5px] leading-snug text-ink-soft">
            {"Evidence strengthens the AI's confidence (simulated)."}
          </p>
        </div>
      </div>

      <ContinueButton
        label="Continue"
        onClick={onContinue}
        disabled={!hasEvidence}
        hint="Attach at least one photo or record a video to continue."
      />
    </div>
  );
}

/* ================= STEP 3 — Location ================= */

export function StepLocation({
  district, onDistrictChange, block, onBlockChange, onContinue,
}: {
  district: string;
  onDistrictChange: (d: string) => void;
  block: string;
  onBlockChange: (b: string) => void;
  onContinue: () => void;
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [gps, setGps] = React.useState<"idle" | "scanning" | "done">("idle");
  const gpsTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => () => {
    if (gpsTimer.current) clearTimeout(gpsTimer.current);
  }, []);

  const openSheet = () => {
    setQuery("");
    scrollFlowTop(rootRef.current);
    setSheetOpen(true);
  };

  const startGps = () => {
    if (gps === "scanning") return;
    setGps("scanning");
    if (gpsTimer.current) clearTimeout(gpsTimer.current);
    gpsTimer.current = setTimeout(() => {
      setGps("done");
      onDistrictChange("Bokaro");
      if (!block.trim()) onBlockChange("Petarwar");
    }, 1400);
  };

  const filtered = DISTRICTS.filter((d) => d.toLowerCase().includes(query.trim().toLowerCase()));
  const mapLabel = district
    ? `${block.trim() ? `${block.trim()} · ` : ""}${district}`
    : "Pin your report";

  return (
    <div ref={rootRef} className="space-y-4">
      <StepHeader title="Where is it?" sub="Pinning the location lets JanSetu cluster nearby reports." />

      <div className="card-hairline space-y-4 rounded-3xl bg-card p-5 shadow-float">
        <button type="button" onClick={openSheet} className="tap flex w-full items-center gap-3 text-left">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-mist text-brand-deep">
            <MapPin size={18} strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-ink-soft">District</span>
            <span className={cn("block truncate text-[14.5px] font-semibold", district ? "text-ink" : "text-ink-soft/70")}>
              {district || "Select district"}
            </span>
          </span>
          <ChevronRight size={16} strokeWidth={2.4} className="shrink-0 text-ink-soft/60" />
        </button>

        <div>
          <label htmlFor="sf-block" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">
            Block / village
          </label>
          <input
            id="sf-block"
            value={block}
            onChange={(e) => onBlockChange(e.target.value)}
            placeholder="e.g. Petarwar"
            maxLength={60}
            className="h-12 w-full rounded-2xl bg-secondary/60 px-4 text-[14px] font-medium text-ink outline-none transition-shadow placeholder:text-ink-soft/60 focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={startGps}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand-mist text-[12.5px] font-semibold text-brand-deep"
        >
          {gps === "scanning" ? (
            <>
              <LocateFixed size={16} strokeWidth={2.3} className="animate-spin" />
              Locating you…
            </>
          ) : gps === "done" ? (
            <>
              <Check size={16} strokeWidth={2.6} />
              Located — Petarwar, Bokaro
            </>
          ) : (
            <>
              <LocateFixed size={16} strokeWidth={2.3} />
              Use my current location
            </>
          )}
        </motion.button>
      </div>

      {/* Mini map preview */}
      <div className="card-hairline rounded-3xl bg-card p-3.5 shadow-float">
        <div className="relative h-40 overflow-hidden rounded-2xl dot-grid bg-background">
          <div className="absolute left-[16%] top-[28%] h-16 w-16 rounded-full border border-ink/10" />
          <div className="absolute bottom-[22%] right-[14%] h-20 w-24 rounded-full border border-ink/10" />
          <div className="absolute left-[58%] top-[24%] h-1.5 w-1.5 rounded-full bg-ink/25" />
          <div className="absolute bottom-[32%] left-[28%] h-1.5 w-1.5 rounded-full bg-ink/25" />
          <div className="absolute right-[30%] top-[62%] h-1.5 w-1.5 rounded-full bg-ink/25" />

          <div className="absolute left-1/2 top-[38%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
            <div className="relative">
              <span className="pulse-ring absolute inset-0 rounded-full" />
              <motion.div
                initial={{ scale: 0, y: -16 }}
                animate={{ scale: 1, y: 0 }}
                transition={SPRING}
                className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-float-lg"
              >
                <MapPin size={20} strokeWidth={2.3} />
              </motion.div>
            </div>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SOFT, delay: 0.15 }}
              className="whitespace-nowrap rounded-full bg-ink/85 px-3 py-1 text-[10.5px] font-bold text-white backdrop-blur-sm"
            >
              {mapLabel}
            </motion.span>
          </div>
        </div>
      </div>

      <ContinueButton
        label="Continue"
        onClick={onContinue}
        disabled={!district}
        hint="Select your district to continue."
      />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Select district"
        subtitle="All 24 Jharkhand districts"
      >
        <div className="sticky top-0 z-10 -mx-1 mb-2 bg-card pb-2 pt-1">
          <div className="flex h-10 items-center gap-2 rounded-xl bg-secondary/70 px-3.5">
            <Search size={14} strokeWidth={2.4} className="shrink-0 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search districts"
              className="w-full bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-ink-soft/60"
            />
          </div>
        </div>
        <div className="space-y-1">
          {filtered.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                onDistrictChange(d);
                setSheetOpen(false);
              }}
              className="tap flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-secondary/50"
            >
              <MapPin size={15} strokeWidth={2.2} className="shrink-0 text-brand/70" />
              <span className="flex-1 text-[13.5px] font-medium text-ink">{d}</span>
              {district === d && <Check size={15} strokeWidth={2.8} className="text-brand" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-[12.5px] text-ink-soft">No district found</p>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}

/* ================= STEP 4 — AI processing ================= */

const RING_R = 85;
const RING_C = 2 * Math.PI * RING_R;
const LINE_GAP = 1300;
const LINE_RESOLVE = 1050;
const LINE_FIRST = 420;

export function StepProcessing({ ai, onDone }: { ai: AiResult; onDone: () => void }) {
  const [shown, setShown] = React.useState(0);
  const [resolved, setResolved] = React.useState(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };
    for (let i = 0; i < 5; i++) {
      const t = LINE_FIRST + i * LINE_GAP;
      at(t, () => setShown(i + 1));
      at(t + LINE_RESOLVE, () => setResolved(i + 1));
    }
    at(LINE_FIRST + 4 * LINE_GAP + LINE_RESOLVE + 800, onDone);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [ai, onDone]);

  const pct = Math.round((resolved / 5) * 100);

  const lines: { label: string; result: React.ReactNode }[] = [
    {
      label: "Classifying domain…",
      result: (
        <>
          <span className="font-extrabold">{ai.category}</span>
          {" — "}
          {ai.confidence}% confidence
        </>
      ),
    },
    { label: "Checking duplicates…", result: <>3 similar reports within 8 km</> },
    {
      label: "Estimating affected population…",
      result: <>≈ {ai.affectedPopulation.toLocaleString("en-IN")} residents</>,
    },
    {
      label: "Identifying required expertise…",
      result: (
        <>
          {ai.expertise[0]} + {ai.expertise.length - 1} more
        </>
      ),
    },
    { label: "Scoring priority", result: <>{ai.priorityScore} / 100</> },
  ];

  return (
    <div className="card-hairline rounded-3xl bg-card p-6 shadow-float">
      <div className="flex flex-col items-center">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">AI triage</p>
        <h2 className="mt-1 text-[21px] font-extrabold tracking-[-0.02em] text-ink">Analyzing your report</h2>

        {/* Orb with progress ring */}
        <div className="relative my-6 h-[178px] w-[178px]">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 178 178">
            <circle cx="89" cy="89" r={RING_R} fill="none" stroke="#E3F1EA" strokeWidth="3" />
            <motion.circle
              cx="89"
              cy="89"
              r={RING_R}
              fill="none"
              stroke="#0E8A6D"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              initial={{ strokeDashoffset: RING_C }}
              animate={{ strokeDashoffset: RING_C - (RING_C * pct) / 100 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-[14px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(14,138,109,0.22) 0%, rgba(14,138,109,0.06) 55%, transparent 72%)",
              }}
              animate={{ scale: [1, 1.38, 1], opacity: [0.85, 0.3, 0.85] }}
              transition={{ duration: 2.7 + i * 0.55, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
            />
          ))}

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[38px] grid place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep shadow-[0_14px_44px_rgba(14,138,109,0.45)]"
          >
            <Sparkles size={30} strokeWidth={2.1} className="text-white" />
          </motion.div>

          <motion.span
            key={pct}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING}
            className="nums absolute bottom-[4px] left-1/2 -translate-x-1/2 rounded-full bg-brand-mist px-2 py-0.5 text-[9.5px] font-bold text-brand-deep"
          >
            {pct}%
          </motion.span>
        </div>

        {/* Status lines */}
        <div className="w-full space-y-2.5">
          {lines.map((ln, i) => {
            const isVisible = i < shown;
            const isDone = i < resolved;
            if (!isVisible) return null;
            return (
              <motion.div
                key={ln.label}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={SPRING}
                className="flex items-center gap-3"
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors duration-300",
                    isDone ? "bg-brand text-white" : "bg-brand-mist text-brand-deep"
                  )}
                >
                  {isDone ? (
                    <motion.span
                      initial={{ scale: 0.3 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <Loader2 size={13} strokeWidth={2.6} className="animate-spin" />
                  )}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  {isDone ? (
                    <motion.p
                      key="result"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="text-[13px] font-semibold text-ink"
                    >
                      {ln.result}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="label"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="text-[13px] text-ink-soft"
                    >
                      {ln.label}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-5 text-[10px] font-medium text-ink-soft/60">
          Simulated intelligence — no data leaves your device
        </p>
      </div>
    </div>
  );
}

/* ================= STEP 5 — AI result ================= */

export function StepResult({ ai, onContinue }: { ai: AiResult; onContinue: () => void }) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const confidenceLevel = ai.confidence >= 90 ? "High" : "Medium";

  const openWhy = () => {
    scrollFlowTop(rootRef.current);
    setWhyOpen(true);
  };

  return (
    <div ref={rootRef} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="rounded-3xl bg-ink p-5 text-white shadow-float-lg"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand">
            <Sparkles size={19} strokeWidth={2.2} className="text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold leading-tight">JanSetu Intelligence</p>
            <p className="mt-0.5 text-[11px] text-white/50">AI triage complete</p>
          </div>
          <span className="rounded-full bg-white/10 px-2 py-1 text-[8.5px] font-bold uppercase tracking-[0.12em] text-white/60">
            Simulated
          </span>
        </div>

        <div className="my-4 border-t border-white/10" />

        <div className="flex items-center gap-4">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
            style={{ background: categoryOf(ai.category).soft }}
          >
            <CategoryIcon category={ai.category} size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45">Domain</p>
            <p className="text-[17px] font-extrabold leading-tight">{ai.category}</p>
            <p className="mt-0.5 text-[11.5px] text-white/55">
              ≈ {compactIN(ai.affectedPopulation)} affected · {ai.evidenceCount} evidence{" "}
              {ai.evidenceCount === 1 ? "item" : "items"}
            </p>
          </div>
          <ScoreRing value={ai.priorityScore} size={64} stroke={5} />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/45">AI confidence</p>
            <p className="text-[12.5px] font-bold">
              Confidence {ai.confidence}% · {confidenceLevel}
            </p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ai.confidence}%` }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-soft"
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white/45">Required expertise</p>
          <div className="flex flex-wrap gap-1.5">
            {ai.expertise.map((e) => (
              <span key={e} className="rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-semibold text-white/85">
                {e}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white/45">AI tags</p>
          <div className="flex flex-wrap gap-1.5">
            {ai.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10.5px] font-semibold text-white/60"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={openWhy}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 text-[13.5px] font-semibold text-white/85"
        >
          <HelpCircle size={15} strokeWidth={2.2} />
          Why this score?
        </motion.button>
      </motion.div>

      <ContinueButton label="Continue to review" onClick={onContinue} />

      <BottomSheet
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        title="Why this score?"
        subtitle="Simulated factors behind the priority score"
      >
        <div className="space-y-3.5 pt-1">
          {ai.whyScore.map((w) => (
            <div key={w} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-mist text-brand-deep">
                <Check size={12} strokeWidth={3} />
              </span>
              <p className="text-[13px] leading-relaxed text-ink">{w}</p>
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

/* ================= STEP 6 — Similar nearby challenges ================= */

function ChoiceCard({
  selected, onPick, title, sub, children,
}: {
  selected: boolean;
  onPick: () => void;
  title: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onPick}
      className={cn(
        "w-full cursor-pointer rounded-2xl border p-4 transition-colors",
        selected ? "border-brand bg-brand-mist/40" : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
            selected ? "border-brand" : "border-ink/20"
          )}
        >
          {selected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              className="h-2.5 w-2.5 rounded-full bg-brand"
            />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold text-ink">{title}</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-ink-soft">{sub}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export function StepSimilar({
  category, similar, mergeMode, onMergeModeChange, options, mergeId, onMergeIdChange, onContinue,
}: {
  category: Category;
  similar: SimilarReport[];
  mergeMode: "new" | "merge";
  onMergeModeChange: (m: "new" | "merge") => void;
  options: Challenge[];
  mergeId: string | null;
  onMergeIdChange: (id: string) => void;
  onContinue: () => void;
}) {
  const color = categoryOf(category).color;

  return (
    <div className="space-y-4">
      <StepHeader title="Similar nearby reports" sub="JanSetu found reports that may describe the same problem." />

      <div className="card-hairline rounded-3xl bg-card p-5 shadow-float">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">Duplicate check</p>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-ink-soft">3 found</span>
        </div>

        <div className="space-y-4">
          {similar.map((s, i) => (
            <div key={s.id}>
              <p className="text-[13px] font-semibold leading-snug text-ink">{s.title}</p>
              <p className="mt-0.5 text-[11px] text-ink-soft">
                {s.distanceKm} km away · {s.reporter} · {s.daysAgo} days ago
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.similarity}%` }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
                <span className="nums text-[10px] font-bold text-ink-soft">{s.similarity}% match</span>
              </div>
            </div>
          ))}
        </div>

        <div className="my-4 border-t border-border/70" />

        <div className="space-y-2.5">
          <ChoiceCard
            selected={mergeMode === "new"}
            onPick={() => onMergeModeChange("new")}
            title="Submit as a new challenge"
            sub="Start a fresh challenge with your report"
          />
          <ChoiceCard
            selected={mergeMode === "merge"}
            onPick={() => onMergeModeChange("merge")}
            title="Merge with existing challenge"
            sub="Strengthen an active cluster near you"
          >
            {mergeMode === "merge" && options.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ ...SPRING_SOFT, opacity: { duration: 0.2 } }}
                className="mt-3 space-y-2 overflow-hidden border-t border-brand/20 pt-3"
              >
                {options.map((o) => {
                  const active = mergeId === o.id;
                  return (
                    <motion.button
                      key={o.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMergeIdChange(o.id);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        active ? "border-brand bg-card shadow-float" : "border-border/70 bg-card"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="nums text-[9.5px] font-bold text-ink-soft">{o.code}</p>
                        <p className="truncate text-[12.5px] font-semibold leading-tight text-ink">{o.title}</p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">
                          {o.district} · {o.supporters.toLocaleString("en-IN")} supporters
                        </p>
                      </div>
                      <CategoryChip category={o.category} />
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                          active ? "bg-brand text-white" : "bg-secondary text-ink-soft/40"
                        )}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </ChoiceCard>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-brand-mist p-3.5">
          <Info size={14} strokeWidth={2.3} className="mt-0.5 shrink-0 text-brand-deep" />
          <p className="text-[12px] font-medium leading-relaxed text-brand-deep">
            {"Merging increases the cluster's priority score and notifies its supporters."}
          </p>
        </div>
      </div>

      <ContinueButton label="Continue" onClick={onContinue} />
    </div>
  );
}

/* ================= STEP 7 — Confirm & submit ================= */

function ReviewRow({ label, value, onEdit }: { label: string; value: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="w-[84px] shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-ink-soft">
        {label}
      </span>
      <div className="min-w-0 flex-1 text-[13.5px] font-semibold text-ink">{value}</div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${label}`}
        className="tap grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-ink-soft"
      >
        <PenLine size={12} strokeWidth={2.4} />
      </button>
    </div>
  );
}

export function StepReview({
  title, locationLabel, ai, evidenceLabel, handlingLabel, submitting, onSubmit,
}: {
  title: string;
  locationLabel: string;
  ai: AiResult;
  evidenceLabel: string;
  handlingLabel: string;
  submitting: boolean;
  onSubmit: () => void;
}) {
  const toast = useApp((s) => s.toast);
  const editToast = () => toast("Editing is simulated", "Use the back arrow to revise your answers");

  return (
    <div className="space-y-4">
      <StepHeader title="Review & submit" sub="One last look before your report reaches verified institutions." />

      <div className="card-hairline divide-y divide-border/60 rounded-3xl bg-card p-5 shadow-float">
        <div className="pb-3 pt-0">
          <ReviewRow
            label="Report"
            value={<p className="line-clamp-2 leading-snug">{title}</p>}
            onEdit={editToast}
          />
        </div>
        <div className="py-3">
          <ReviewRow label="Location" value={<p className="truncate">{locationLabel}</p>} onEdit={editToast} />
        </div>
        <div className="py-3">
          <ReviewRow label="Domain" value={<CategoryChip category={ai.category} />} onEdit={editToast} />
        </div>
        <div className="py-3">
          <ReviewRow
            label="Priority"
            value={
              <span className="flex items-center gap-2">
                <PriorityPill priority={ai.priority} />
                <span className="nums text-[12px] font-bold text-ink">{ai.priorityScore} / 100</span>
              </span>
            }
            onEdit={editToast}
          />
        </div>
        <div className="py-3">
          <ReviewRow label="Evidence" value={<p className="truncate">{evidenceLabel}</p>} onEdit={editToast} />
        </div>
        <div className="py-3">
          <ReviewRow
            label="Affected"
            value={<p className="nums">≈ {ai.affectedPopulation.toLocaleString("en-IN")} residents</p>}
            onEdit={editToast}
          />
        </div>
        <div className="pt-3 pb-0">
          <ReviewRow label="Handling" value={<p className="truncate">{handlingLabel}</p>} onEdit={editToast} />
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={submitting ? undefined : { scale: 0.97 }}
        onClick={() => { if (!submitting) onSubmit(); }}
        className={cn(
          "flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl text-[15px] font-bold transition-colors",
          submitting ? "bg-brand-deep text-white/80" : "bg-brand text-white shadow-float"
        )}
      >
        {submitting ? (
          <>
            <Loader2 size={17} strokeWidth={2.4} className="animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send size={17} strokeWidth={2.3} />
            Submit to JanSetu
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ================= STEP 8 — Success ================= */

const CONFETTI_COLORS = ["#0E8A6D", "#E0A538", "#96A33B", "#45B08C", "#C97B5A"];

export function StepSuccess({
  code, onViewActivity, onAnother, onPreview,
}: {
  code: string;
  onViewActivity: () => void;
  onAnother: () => void;
  onPreview: () => void;
}) {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: 6 + Math.random() * 88,
        delay: 0.1 + Math.random() * 0.7,
        duration: 1.7 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 70,
        rotate: (Math.random() - 0.5) * 420,
        size: 5 + Math.random() * 5,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        sparkle: i % 4 === 3,
      })),
    []
  );

  return (
    <div className="pt-2">
      {/* Confetti + animated check */}
      <div className="relative h-52">
        {pieces.map((p, i) => (
          <motion.span
            key={i}
            className="absolute top-0"
            style={{ left: `${p.left}%` }}
            initial={{ y: -16, x: 0, rotate: 0, opacity: 0 }}
            animate={{ y: 205, x: p.drift, rotate: p.rotate, opacity: [0, 1, 1, 0] }}
            transition={{ delay: p.delay, duration: p.duration, ease: "easeIn" }}
          >
            {p.sparkle ? (
              <Sparkles size={p.size + 4} strokeWidth={2} style={{ color: p.color }} />
            ) : (
              <span
                className="block rounded-full"
                style={{ width: p.size, height: p.size, background: p.color }}
              />
            )}
          </motion.span>
        ))}

        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="relative"
          >
            <span className="pulse-ring absolute inset-0 rounded-full" />
            <div className="grid h-24 w-24 place-items-center rounded-full bg-brand shadow-float-lg">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                <motion.path
                  d="M30 50 L43 62 L67 34"
                  stroke="#FFFFFF"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: 0.35 }}
        className="text-center"
      >
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          Challenge <span className="text-brand">{code}</span> submitted!
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-relaxed text-ink-soft">
          Your report is now visible to verified institutions.
        </p>
      </motion.div>

      {/* Tracking timeline preview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: 0.5 }}
        className="card-hairline mt-6 rounded-3xl bg-card p-5 shadow-float"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">Tracking</p>
          <StageBadge stage="Reported" />
        </div>

        <div className="relative">
          <div className="absolute left-[7px] right-[7px] top-[7px] h-[2px] rounded-full bg-secondary" />
          <div className="relative flex justify-between">
            {STAGES.map((s, i) => (
              <div key={s} className="flex w-[48px] flex-col items-center gap-1.5">
                <span className="relative flex h-3.5 w-3.5">
                  {i === 0 ? (
                    <>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand ring-4 ring-brand-mist" />
                    </>
                  ) : (
                    <span className="inline-flex h-3.5 w-3.5 rounded-full border-2 border-ink/15 bg-card" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-center text-[8px] font-bold uppercase tracking-wide",
                    i === 0 ? "text-brand" : "text-ink-soft/70"
                  )}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand-mist/60 py-2.5">
          <Clock size={14} strokeWidth={2.3} className="text-brand" />
          <span className="text-[12px] font-semibold text-brand-deep">Validation within 72 hrs (typical)</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: 0.62 }}
        className="mt-6 space-y-2.5"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onViewActivity}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[15px] font-semibold text-white shadow-float"
        >
          View in Activity
          <ArrowRight size={17} strokeWidth={2.4} />
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onAnother}
          className="tap flex h-11 w-full items-center justify-center rounded-2xl border border-border bg-card text-[13.5px] font-semibold text-ink"
        >
          Submit another
        </motion.button>
        <button
          type="button"
          onClick={onPreview}
          className="tap mx-auto flex h-9 items-center gap-1.5 text-[12.5px] font-semibold text-brand"
        >
          <Eye size={14} strokeWidth={2.3} />
          Preview challenge card
        </button>
      </motion.div>
    </div>
  );
}
