"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Users, IndianRupee, Factory, Building2, Rocket, ArrowLeftRight, MapPin,
  Check, ChevronRight, type LucideIcon,
} from "lucide-react";
import type { Conversation, Opportunity, ProjectMember, SupportType } from "@/lib/types";
import { useApp } from "@/lib/store";
import { HEIS } from "@/lib/data/heis";
import { INDUSTRY_CONVERSATIONS } from "@/lib/data/conversations";
import { CHALLENGES } from "@/lib/data/challenges";
import { PROJECTS } from "@/lib/data/projects";
import { BottomSheet, SPRING } from "@/components/shared/BottomSheet";
import { AnimatedNumber, compactIN } from "@/components/shared/AnimatedNumber";
import { ScoreRing } from "@/components/shared/kit";
import { cn } from "@/lib/utils";

/* ============================================================
   Industry module — shared building blocks
   Persona: GreenGrid Energy LLP (mock clean-tech company)
   ============================================================ */

export type Need = Opportunity["needs"][number];

export const AMBER = "#D98A1F";
export const AMBER_SOFT = "rgba(224,165,56,0.16)";

/* ---------- Motion presets ---------- */

export const LIST_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ---------- Sheet host (portal into the phone content layer) ---------- */

/**
 * BottomSheet uses `absolute inset-0` positioning, which only behaves correctly
 * when the sheet's containing block is the phone's main content layer (not the
 * scrolling tab container). This hook climbs from the view root to that layer
 * and returns a ref + portal host element.
 */
export function useSheetHost(): [React.Ref<HTMLDivElement>, HTMLElement | null] {
  const ref = React.useRef<HTMLDivElement>(null);
  const [host, setHost] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const scroller = ref.current?.closest(".jansetu-scroll");
    if (!scroller) return;
    let el: HTMLElement | null = scroller.parentElement;
    // Pushed detail views nest one extra level (DetailView root is `absolute`).
    if (el && el.classList.contains("absolute")) el = el.parentElement;
    if (el) setHost(el);
  }, []);

  return [ref, host];
}

export function SheetPortal({ host, children }: { host: HTMLElement | null; children: React.ReactNode }) {
  return host ? createPortal(children, host) : null;
}

/* ---------- Header & stats ---------- */

export function IndustryHeader({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-5">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          {title}
        </h1>
        {sub && <p className="mt-1.5 text-[12.5px] leading-snug text-ink-soft">{sub}</p>}
      </div>
      {right && <div className="shrink-0 pt-1.5">{right}</div>}
    </div>
  );
}

export interface StatItem {
  value: number;
  label: string;
  format?: (n: number) => string;
  tone?: "ink" | "brand" | "amber";
}

const TONE_CLASS: Record<NonNullable<StatItem["tone"]>, string> = {
  ink: "text-ink",
  brand: "text-brand-deep",
  amber: "text-[#D98A1F]",
};

export function StatsRow({ items }: { items: StatItem[] }) {
  return (
    <motion.div
      variants={LIST_VARIANTS}
      initial="hidden"
      animate="show"
      className="flex gap-2.5 px-4"
    >
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          variants={CARD_VARIANTS}
          className="flex-1 rounded-2xl bg-card p-3 shadow-float"
        >
          <AnimatedNumber
            value={it.value}
            delay={0.1 + i * 0.08}
            format={it.format}
            className={cn("text-[19px] font-extrabold leading-none tracking-[-0.02em]", TONE_CLASS[it.tone ?? "ink"])}
          />
          <p className="mt-1.5 text-[10px] font-semibold leading-tight text-ink-soft">{it.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ---------- Opportunity stage / support-type chips ---------- */

const STAGE_TONE: Record<string, { color: string; bg: string }> = {
  "Prototype Stage": { color: "#2C8C99", bg: "rgba(44,140,153,0.12)" },
  "Pilot Stage": { color: "#D98A1F", bg: "rgba(224,165,56,0.16)" },
  "Development Stage": { color: "#96A33B", bg: "rgba(150,163,59,0.13)" },
  "Deployment Stage": { color: "#0A5C48", bg: "rgba(10,92,72,0.12)" },
};

export function StageChip({ stage, className }: { stage: string; className?: string }) {
  const tone = STAGE_TONE[stage] ?? { color: "#0E8A6D", bg: "rgba(14,138,109,0.12)" };
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", className)}
      style={{ background: tone.bg, color: tone.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone.color }} />
      {stage}
    </span>
  );
}

export const SUPPORT_TYPES: SupportType[] = [
  "Mentorship",
  "Funding",
  "Manufacturing",
  "Infrastructure",
  "Pilot Support",
  "Technology Transfer",
];

export const SUPPORT_META: Record<SupportType, { icon: LucideIcon; chipIcon: LucideIcon; chip: string }> = {
  Mentorship: { icon: Users, chipIcon: Users, chip: "Mentorship" },
  Funding: { icon: IndianRupee, chipIcon: IndianRupee, chip: "Funding" },
  Manufacturing: { icon: Factory, chipIcon: Factory, chip: "Manufacturing" },
  Infrastructure: { icon: Building2, chipIcon: Building2, chip: "Infrastructure" },
  "Pilot Support": { icon: Rocket, chipIcon: MapPin, chip: "Field deployment" },
  "Technology Transfer": { icon: ArrowLeftRight, chipIcon: ArrowLeftRight, chip: "Tech transfer" },
};

export function NeedChip({ need }: { need: Need }) {
  const meta = SUPPORT_META[need.type];
  const Icon = meta.chipIcon;
  const label =
    need.type === "Funding" ? (need.amount ? `${need.amount} funding` : "Funding") : meta.chip;
  const amber = need.type === "Funding" && !!need.amount;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold",
        amber ? "font-bold" : "bg-secondary/80 text-ink-soft"
      )}
      style={amber ? { background: AMBER_SOFT, color: AMBER } : undefined}
    >
      <Icon size={11} strokeWidth={2.2} />
      {label}
    </span>
  );
}

/* ---------- ₹ amount highlighting ---------- */

const AMOUNT_SPLIT = /(₹\d[\d,]*(?:\.\d+)?(?:[–-][\d,]+(?:\.\d+)?)?[LMk]?)/g;

/** Renders text with ₹ amounts highlighted in the money-amber accent. */
export function renderAmounts(text: string): React.ReactNode {
  return text.split(AMOUNT_SPLIT).map((part, i) =>
    part.startsWith("₹") ? (
      <span key={i} className="font-bold" style={{ color: AMBER }}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/* ---------- HEI helpers ---------- */

export function heiFor(opp: Opportunity) {
  return HEIS.find((h) => h.shortName === opp.heiShort || h.name === opp.heiFull);
}

export function initialsOf(name: string): string {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Finds an industry conversation whose participant matches the HEI. */
export function conversationForHei(hei: string): Conversation | undefined {
  return INDUSTRY_CONVERSATIONS.find(
    (c) => c.subtitle.includes(hei) || c.participant.includes(hei)
  );
}

/** Finds an industry conversation matching the opportunity's PI or HEI. */
export function conversationForOpportunity(opp: Opportunity): Conversation | undefined {
  const challenge = CHALLENGES.find((c) => c.code === opp.challengeCode);
  const project = PROJECTS.find((p) => p.challengeId === challenge?.id);
  const pi = project?.team.find((m) => m.type === "faculty")?.name;
  return INDUSTRY_CONVERSATIONS.find(
    (c) =>
      (pi !== undefined && c.participant.includes(pi)) ||
      c.subtitle.includes(opp.heiShort) ||
      c.participant.includes(opp.heiShort)
  );
}

/* ---------- Team avatar stack ---------- */

export function TeamStack({ team }: { team: ProjectMember[] }) {
  const shown = team.slice(0, 4);
  const extra = team.length - shown.length;
  return (
    <div className="flex shrink-0 -space-x-2">
      {shown.map((m) => (
        <span
          key={m.name}
          title={`${m.name} · ${m.role}`}
          className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-secondary text-[9px] font-bold text-ink-soft"
        >
          {m.initials}
        </span>
      ))}
      {extra > 0 && (
        <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-ink text-[9px] font-bold text-white">
          +{extra}
        </span>
      )}
    </div>
  );
}

/* ---------- Success check animation ---------- */

export function SuccessCheck({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 20 }}
        className="grid h-20 w-20 place-items-center rounded-full bg-brand-mist"
      >
        <svg viewBox="0 0 44 44" className="h-11 w-11" fill="none">
          <motion.path
            d="M12 23.5 L19 30.5 L32 15"
            stroke="#0E8A6D"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4 text-[16px] font-bold tracking-[-0.01em] text-ink"
      >
        {label}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.34 }}
        className="mt-0.5 text-[12px] text-ink-soft"
      >
        {sub}
      </motion.p>
    </div>
  );
}

/* ---------- Express Interest sheet (shared list + detail) ---------- */

export function ExpressInterestSheet({
  opportunity,
  onClose,
  host,
}: {
  opportunity: Opportunity | null;
  onClose: () => void;
  host: HTMLElement | null;
}) {
  const expressInterest = useApp((s) => s.expressInterest);
  const toast = useApp((s) => s.toast);

  const [selected, setSelected] = React.useState<SupportType[]>([]);
  const [amount, setAmount] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    setSelected([]);
    setAmount("");
    setMessage("");
    setSent(false);
  }, [opportunity?.id]);

  React.useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const toggle = (t: SupportType) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const submit = () => {
    if (!opportunity || selected.length === 0 || sent) return;
    expressInterest(opportunity.id);
    setSent(true);
    timer.current = window.setTimeout(() => {
      toast("Interest expressed", `Sent to ${opportunity.heiShort} coordination cell (simulated)`);
      onClose();
    }, 500);
  };

  const content = sent ? (
    <SuccessCheck label="Interest sent" sub="Routing to the coordination cell" />
  ) : (
    <>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">
        Choose how you can support
      </p>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {SUPPORT_TYPES.map((t) => {
          const active = selected.includes(t);
          const Icon = SUPPORT_META[t].icon;
          return (
            <motion.button
              key={t}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(t)}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-colors",
                active
                  ? "border-transparent bg-brand-mist ring-2 ring-brand"
                  : "border-border bg-card"
              )}
            >
              <motion.span
                animate={active ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                transition={{ duration: 0.32 }}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-xl",
                  active ? "bg-brand text-white" : "bg-secondary text-ink-soft"
                )}
              >
                <Icon size={15} strokeWidth={2.2} />
              </motion.span>
              <span
                className={cn(
                  "text-[12.5px] font-bold leading-tight",
                  active ? "text-brand-deep" : "text-ink"
                )}
              >
                {t}
              </span>
              <AnimatePresence>
                {active && (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={SPRING}
                    className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-white"
                  >
                    <Check size={11} strokeWidth={3.2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {selected.includes("Funding") && (
          <motion.div
            key="funding-amount"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl bg-secondary/60 p-3">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-soft">
                Funding amount (₹ lakh)
              </p>
              <div className="mt-2 flex items-center gap-2">
                {["3", "5"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setAmount(l)}
                    className={cn(
                      "tap h-10 shrink-0 rounded-xl border px-3.5 text-[12.5px] font-bold",
                      amount === l
                        ? "border-brand bg-brand-mist text-brand-deep"
                        : "border-border bg-card text-ink-soft"
                    )}
                  >
                    ₹{l}L
                  </button>
                ))}
                <div className="relative h-10 flex-1">
                  <IndianRupee
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/60"
                  />
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="Custom"
                    aria-label="Custom funding amount in lakh"
                    className="nums h-10 w-full rounded-xl border border-border bg-card pl-8 pr-3 text-[13px] font-semibold text-ink placeholder:font-normal placeholder:text-ink-soft/50 focus:border-brand/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-soft">Message</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="How can GreenGrid help?"
          className="mt-2 w-full resize-none rounded-2xl border border-border bg-card p-3 text-[13px] leading-relaxed text-ink placeholder:text-ink-soft/50 focus:border-brand/50 focus:outline-none"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={selected.length === 0}
        onClick={submit}
        className={cn(
          "mt-4 h-12 w-full rounded-2xl text-[14px] font-bold",
          selected.length > 0 ? "bg-brand text-white shadow-float" : "bg-secondary text-ink-soft/60"
        )}
      >
        Send expression of interest
      </motion.button>
      {selected.length === 0 && (
        <p className="mt-2 text-center text-[11px] text-ink-soft/80">
          Select at least one support type
        </p>
      )}
    </>
  );

  return (
    <SheetPortal host={host}>
      <BottomSheet
        open={!!opportunity}
        onClose={onClose}
        title="Express interest"
        subtitle={opportunity?.title ?? undefined}
        maxH="max-h-[86%]"
      >
        {content}
      </BottomSheet>
    </SheetPortal>
  );
}

/* ---------- Opportunity card ---------- */

export function OpportunityCard({
  opportunity: opp,
  expressed,
  onExpress,
}: {
  opportunity: Opportunity;
  expressed: boolean;
  onExpress: (opp: Opportunity) => void;
}) {
  const push = useApp((s) => s.push);
  const hei = heiFor(opp);

  return (
    <motion.article
      variants={CARD_VARIANTS}
      onClick={() => push({ type: "opportunity", opportunityId: opp.id })}
      className="tap mx-4 mb-4 cursor-pointer rounded-3xl bg-card p-4 shadow-float"
    >
      <div className="flex items-start justify-between gap-3">
        <StageChip stage={opp.stage} />
        <ScoreRing value={opp.matchScore ?? 0} size={42} stroke={4} color="#0E8A6D" label="match" />
      </div>

      <h3 className="mt-2.5 text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-ink">
        {opp.title}
      </h3>

      <div className="mt-2.5 flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-white"
          style={{ background: hei?.color ?? "#0E8A6D" }}
        >
          {initialsOf(hei?.shortName ?? opp.heiShort)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-semibold leading-tight text-ink">
            {opp.heiFull}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-soft">{hei?.city ?? "Jharkhand"}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <Users size={13} strokeWidth={2.2} className="shrink-0 text-brand" />
        <AnimatedNumber
          value={opp.socialReach}
          format={(n) => compactIN(n)}
          className="text-[13px] font-bold text-ink"
        />
        <span className="text-[11.5px] text-ink-soft">citizens reached</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {opp.needs.slice(0, 3).map((n) => (
          <NeedChip key={n.type} need={n} />
        ))}
      </div>

      <div className="mt-3.5 flex items-center gap-2.5">
        {expressed ? (
          <span className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand-mist text-[12.5px] font-bold text-brand-deep">
            <Check size={15} strokeWidth={2.6} />
            Interest expressed
          </span>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onExpress(opp);
            }}
            className="h-11 flex-1 rounded-2xl bg-brand text-[12.5px] font-bold text-white shadow-float"
          >
            Express Interest
          </motion.button>
        )}
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-ink-soft">
          <ChevronRight size={17} strokeWidth={2.4} />
        </span>
      </div>
    </motion.article>
  );
}
