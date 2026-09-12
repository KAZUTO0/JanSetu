"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowRightLeft, BadgeCheck, CheckCircle2, Clock, FileSignature, FolderKanban, Handshake,
  IndianRupee, Inbox, Rocket, type LucideIcon,
} from "lucide-react";
import { AnimatedNumber, compactIN } from "@/components/shared/AnimatedNumber";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { CategoryChip, CategoryIcon, StageBadge } from "@/components/shared/kit";
import { CATEGORY_META } from "@/lib/data/categories";
import {
  DISTRICTS, DOMAIN_DISTRIBUTION, FUNNEL, GOV_KPIS, HEI_RANKING, INDUSTRY_ENGAGEMENT,
  MONTHLY_TREND, PROJECT_COMPLETION,
} from "@/lib/data/analytics";
import { HEIS } from "@/lib/data/heis";
import { useApp } from "@/lib/store";
import type { Category, DistrictStat, FunnelStageData } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ============================================================
   Government experience — shared building blocks
   All figures are simulated demo data.
   ============================================================ */

const BRAND = "#0E8A6D";
const BRAND_DEEP = "#0A5C48";
const BRAND_LIGHT = "#45B08C";

const TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid #E3E6DD",
  background: "#FFFFFF",
  fontSize: 12,
  padding: "8px 10px",
  boxShadow: "0 8px 24px -12px rgba(27,36,32,0.20)",
};
const TOOLTIP_LABEL: React.CSSProperties = {
  fontWeight: 700,
  color: "#1B2420",
  fontSize: 11,
  marginBottom: 2,
};

/* ---------------- sheet host (portal out of the scrolling tab container) ---------------- */

/**
 * BottomSheet positions itself `absolute inset-0`, which only behaves correctly when its
 * containing block is the phone's main content layer — not the scrolling tab container.
 * This hook climbs from the view root to that layer and returns a ref + portal host.
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

/* ---------------- small shared atoms ---------------- */

/** The recurring "Demo data" marker chip */
export function DemoChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full bg-secondary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-ink-soft",
        className
      )}
    >
      Demo data
    </span>
  );
}

/** Standard white card panel */
export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl bg-card p-4 shadow-float", className)}>{children}</div>;
}

/** Card header row with title / sub / right slot (defaults to a DemoChip) */
export function CardHead({
  title,
  sub,
  right,
  className,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-start justify-between gap-2", className)}>
      <div className="min-w-0">
        <h3 className="text-[15.5px] font-bold tracking-[-0.01em] text-ink">{title}</h3>
        {sub && <p className="mt-0.5 text-[11.5px] leading-snug text-ink-soft">{sub}</p>}
      </div>
      {right ?? <DemoChip />}
    </div>
  );
}

/* ---------------- KPI card ---------------- */

/** The five headline KPIs, shared between Overview and Command Centre */
export const GOV_KPI_CARDS: { icon: LucideIcon; label: string; value: number; delta: string }[] = [
  { icon: Inbox, label: "Challenges", value: GOV_KPIS.challenges, delta: "+14%" },
  { icon: BadgeCheck, label: "Validated", value: GOV_KPIS.validated, delta: "+9%" },
  { icon: FolderKanban, label: "Active projects", value: GOV_KPIS.activeProjects, delta: "+21%" },
  { icon: Rocket, label: "Pilots", value: GOV_KPIS.pilots, delta: "+8" },
  { icon: CheckCircle2, label: "Deployments", value: GOV_KPIS.deployments, delta: "+4" },
];

export function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  delay = 0,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  delta?: string;
  delay?: number;
  className?: string;
}) {
  const positive = delta?.startsWith("+") ?? false;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay }}
      className={cn("rounded-3xl bg-card p-4 shadow-float", className)}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-mist text-brand">
          <Icon size={17} strokeWidth={2.2} />
        </span>
        {delta && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[9.5px] font-bold nums",
              positive ? "bg-brand-mist text-brand-deep" : "bg-secondary text-ink-soft"
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <p className="mt-3 text-[26px] font-extrabold leading-none tracking-[-0.02em] text-ink">
        <AnimatedNumber value={value} delay={delay + 0.12} />
      </p>
      <p className="mt-1.5 text-[11.5px] font-semibold text-ink-soft">{label}</p>
    </motion.div>
  );
}

/* ---------------- Funnel ---------------- */

export function FunnelBars({
  data = FUNNEL,
  className,
}: {
  data?: FunnelStageData[];
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className={cn("space-y-1", className)}>
      {data.map((stage, i) => {
        const pct = (stage.value / max) * 100;
        const conv =
          i < data.length - 1 ? Math.round((data[i + 1].value / stage.value) * 100) : null;
        return (
          <React.Fragment key={stage.label}>
            <div>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-semibold text-ink">{stage.label}</span>
                <span className="text-[12.5px] font-bold text-ink nums">
                  {stage.value.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary/70">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${BRAND_DEEP}, ${BRAND} 55%, ${BRAND_LIGHT})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            {conv !== null && (
              <p className="pb-1.5 pr-1 pt-1 text-right text-[10px] font-semibold nums text-ink-soft/80">
                ↓ {conv}% continue
              </p>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ---------------- District heatmap ---------------- */

/** Interpolate district density 0–100 into the low→high green ramp */
export function districtDotColor(d: number): string {
  const t = Math.min(1, Math.max(0, d / 100));
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(168, 10)}, ${mix(203, 92)}, ${mix(190, 72)})`;
}

export function DistrictMap({
  onSelect,
  title = "Challenge density by district",
  sub = "Citizen-reported challenges across Jharkhand",
  mapHeight = "h-[300px]",
  hint,
  className,
}: {
  onSelect?: (d: DistrictStat) => void;
  title?: string;
  sub?: string;
  mapHeight?: string;
  hint?: string | null;
  className?: string;
}) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const showHint = hint ?? (onSelect ? "Tap a district to inspect it" : null);

  return (
    <div className={cn("rounded-3xl bg-card p-5 shadow-float", className)}>
      <CardHead title={title} sub={sub} />

      {/* stylized map canvas */}
      <div className={cn("dot-grid relative overflow-hidden rounded-2xl bg-secondary/40", mapHeight)}>
        {/* abstract state boundary */}
        <div className="pointer-events-none absolute inset-[7%] rounded-[48%_52%_50%_50%/58%_50%_50%_42%] border border-dashed border-brand/20 bg-brand/[0.03]" />

        {DISTRICTS.map((d, i) => {
          const size = 10 + (d.density / 100) * 16; // 10–26px
          const hit = Math.max(size + 12, 30); // comfortable tap target
          const isSel = selected === d.name;
          return (
            <button
              key={d.name}
              onClick={() => {
                setSelected(isSel ? null : d.name);
                onSelect?.(d);
              }}
              aria-label={`${d.name} — ${d.challenges} challenges`}
              className="tap absolute grid place-items-center rounded-full"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: hit,
                height: hit,
                marginLeft: -hit / 2,
                marginTop: -hit / 2,
              }}
            >
              <motion.span
                className="block rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: districtDotColor(d.density),
                  boxShadow: isSel
                    ? "0 0 0 2.5px #FFFFFF, 0 0 0 5px #0E8A6D"
                    : undefined,
                }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: isSel ? 1.2 : 1, opacity: 1 }}
                transition={{
                  scale: { delay: 0.05 + i * 0.028, type: "spring", stiffness: 340, damping: 20 },
                  opacity: { delay: 0.05 + i * 0.028, duration: 0.25 },
                }}
              />
              {d.density >= 60 && (
                <span
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[8.5px] font-bold text-ink-soft"
                  style={{ top: hit / 2 + 3 }}
                >
                  {d.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* legend */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft/70">Low</span>
          {[10, 30, 50, 70, 92].map((v) => (
            <span key={v} className="h-2 w-2 rounded-full" style={{ background: districtDotColor(v) }} />
          ))}
          <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft/70">High</span>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-ink-soft">
          24 districts
        </span>
      </div>
      {showHint && (
        <p className="mt-2 text-center text-[10.5px] text-ink-soft/70">{showHint}</p>
      )}
    </div>
  );
}

/* ---------------- District detail sheet ---------------- */

const MIX_WEIGHTS = [34, 16, 14, 12, 13, 11];

/** Mock domain split centred on the district's top category (sums to 100) */
function districtMix(top: Category): { category: Category; percent: number }[] {
  const others = (Object.keys(CATEGORY_META) as Category[]).filter((c) => c !== top);
  return [
    { category: top, percent: MIX_WEIGHTS[0] },
    ...others.map((c, i) => ({ category: c, percent: MIX_WEIGHTS[i + 1] ?? 10 })),
  ];
}

export function DistrictSheet({
  district,
  onClose,
}: {
  district: DistrictStat | null;
  onClose: () => void;
}) {
  const challenges = useApp((s) => s.challenges);
  const push = useApp((s) => s.push);

  const list = React.useMemo(
    () => (district ? challenges.filter((c) => c.district === district.name) : []),
    [challenges, district]
  );
  const mix = React.useMemo(() => (district ? districtMix(district.topCategory) : []), [district]);

  return (
    <BottomSheet
      open={!!district}
      onClose={onClose}
      title={district?.name ?? ""}
      subtitle="District snapshot · simulated figures"
    >
      {district && (
        <div className="space-y-5">
          {/* headline stats */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Challenges", value: district.challenges },
              { label: "Validated", value: district.validated },
              { label: "Projects", value: district.projects },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary/60 p-3 text-center">
                <p className="text-[20px] font-extrabold leading-none text-ink nums">
                  <AnimatedNumber value={s.value} delay={0.1} />
                </p>
                <p className="mt-1 text-[9.5px] font-bold uppercase tracking-wider text-ink-soft">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* top domain */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Top domain</p>
            <CategoryChip category={district.topCategory} />
          </div>

          {/* domain mix */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Domain mix
            </p>
            <div className="space-y-2">
              {mix.map((m, i) => {
                const meta = CATEGORY_META[m.category];
                return (
                  <div key={m.category} className="flex items-center gap-2.5">
                    <span className="w-[92px] shrink-0 text-[11.5px] font-semibold text-ink">
                      {meta.name}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: meta.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.percent * 2.6}%` }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-[10.5px] font-bold nums text-ink-soft">
                      {m.percent}%
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[9.5px] text-ink-soft/70">
              Indicative split around the top domain — demo data
            </p>
          </div>

          {/* sampled challenges */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                Reported challenges
              </p>
              <span className="text-[10px] font-semibold nums text-ink-soft/70">
                {list.length} in demo set
              </span>
            </div>
            {list.length > 0 ? (
              <div className="space-y-2">
                {list.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onClose();
                      push({ type: "challenge", challengeId: c.id });
                    }}
                    className="tap flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-2.5 text-left"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                      style={{ background: CATEGORY_META[c.category].soft }}
                    >
                      <CategoryIcon category={c.category} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold nums text-ink-soft">{c.code}</span>
                      <span className="block truncate text-[13px] font-semibold text-ink">
                        {c.title}
                      </span>
                      <span className="text-[10.5px] text-ink-soft">
                        {c.block} · {compactIN(c.affectedPopulation)} affected
                      </span>
                    </span>
                    <StageBadge stage={c.stage} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-secondary/50 p-3 text-[11.5px] leading-relaxed text-ink-soft">
                No sampled challenges for this district in the demo set — the prototype carries 15
                of the 1,284 simulated challenges.
              </p>
            )}
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

/* ---------------- Domain donut ---------------- */

export function DomainDonut({ height = 190, className }: { height?: number; className?: string }) {
  const total = DOMAIN_DISTRIBUTION.reduce((a, b) => a + b.count, 0);
  return (
    <div className={className}>
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DOMAIN_DISTRIBUTION}
              dataKey="count"
              nameKey="category"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
              cornerRadius={6}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {DOMAIN_DISTRIBUTION.map((d) => (
                <Cell key={d.category} fill={CATEGORY_META[d.category].color} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL} itemStyle={{ fontSize: 11.5 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-[24px] font-extrabold leading-none text-ink nums">
              <AnimatedNumber value={total} />
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-ink-soft">
              challenges
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {DOMAIN_DISTRIBUTION.map((d) => {
          const meta = CATEGORY_META[d.category];
          return (
            <div key={d.category} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: meta.color }} />
              <span className="flex-1 text-[12px] font-semibold text-ink">{meta.name}</span>
              <span className="text-[11.5px] font-bold nums text-ink">
                {d.count.toLocaleString("en-IN")}
              </span>
              <span className="w-9 text-right text-[10.5px] font-semibold nums text-ink-soft">
                {d.percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Monthly trend ---------------- */

export function TrendChart({ height = 180, className }: { height?: number; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-2.5 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-ink-soft">
          <span className="h-2 w-2 rounded-full" style={{ background: BRAND }} />
          Reported
        </span>
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-ink-soft">
          <span className="h-2 w-2 rounded-full" style={{ background: BRAND_LIGHT }} />
          Validated
        </span>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MONTHLY_TREND} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
            <defs>
              <linearGradient id="jsTrendChallenges" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity={0.25} />
                <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="jsTrendValidated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND_LIGHT} stopOpacity={0.22} />
                <stop offset="100%" stopColor={BRAND_LIGHT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E7EAE3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9.5, fill: "#6E7A73", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis hide domain={[0, 180]} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={TOOLTIP_LABEL}
              itemStyle={{ fontSize: 11.5 }}
              cursor={{ stroke: "#E7EAE3" }}
            />
            <Area
              type="monotone"
              dataKey="challenges"
              name="Reported"
              stroke={BRAND}
              strokeWidth={2.2}
              fill="url(#jsTrendChallenges)"
            />
            <Area
              type="monotone"
              dataKey="validated"
              name="Validated"
              stroke={BRAND_LIGHT}
              strokeWidth={2}
              fill="url(#jsTrendValidated)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------- HEI ranking ---------------- */

const HEI_COLOR: Record<string, string> = Object.fromEntries(HEIS.map((h) => [h.id, h.color]));
const RANK_MEDALS = ["#E0A538", "#8A938C", "#C97B5A"]; // gold / silver / bronze
const METRIC_COLORS = {
  accepted: BRAND,
  projects: BRAND_LIGHT,
  pilots: "#E0A538",
  deployments: BRAND_DEEP,
};

function initialsOf(name: string): string {
  const words = name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

export function HeiRanking({ limit = 6, className }: { limit?: number; className?: string }) {
  const rows = HEI_RANKING.slice(0, limit);
  const legend: [string, string][] = [
    ["Accepted", METRIC_COLORS.accepted],
    ["Projects", METRIC_COLORS.projects],
    ["Pilots", METRIC_COLORS.pilots],
    ["Deployments", METRIC_COLORS.deployments],
  ];

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1.5">
        {legend.map(([label, color]) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      <div className="space-y-1">
        {rows.map((r, i) => {
          const color = HEI_COLOR[r.heiId] ?? BRAND;
          const total = r.accepted + r.projects + r.pilots + r.deployments;
          const segs = [
            { v: r.accepted, c: METRIC_COLORS.accepted },
            { v: r.projects, c: METRIC_COLORS.projects },
            { v: r.pilots, c: METRIC_COLORS.pilots },
            { v: r.deployments, c: METRIC_COLORS.deployments },
          ];
          const medal = i < 3;
          return (
            <motion.div
              key={r.heiId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 24 }}
              className="rounded-2xl p-2.5 transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10.5px] font-extrabold nums",
                    medal ? "text-white" : "bg-secondary text-ink-soft"
                  )}
                  style={medal ? { background: RANK_MEDALS[i] } : undefined}
                >
                  {i + 1}
                </span>
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold text-white"
                  style={{ background: color }}
                >
                  {initialsOf(r.shortName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold tracking-[-0.01em] text-ink">
                    {r.shortName}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] nums text-ink-soft">
                    {r.accepted} accepted · {r.projects} projects · {r.pilots} pilots ·{" "}
                    {r.deployments} deployed
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[15px] font-extrabold leading-none nums text-ink">{r.score}</p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-ink-soft/70">
                    score
                  </p>
                </div>
              </div>
              <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-secondary/70">
                {segs.map((s, si) => (
                  <motion.div
                    key={si}
                    className="h-full"
                    style={{ background: s.c }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.v / total) * 100}%` }}
                    transition={{
                      delay: 0.2 + i * 0.07 + si * 0.05,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-2.5 text-[9.5px] leading-relaxed text-ink-soft/70">
        Names used for realism — no actual partnership implied. Demo data.
      </p>
    </div>
  );
}

/* ---------------- Industry engagement ---------------- */

export function IndustryEngagementTiles({ className }: { className?: string }) {
  const tiles: {
    icon: LucideIcon;
    label: string;
    value: number;
    format?: (n: number) => string;
  }[] = [
    { icon: Handshake, label: "Active partners", value: INDUSTRY_ENGAGEMENT.activePartners },
    { icon: FileSignature, label: "MOUs signed", value: INDUSTRY_ENGAGEMENT.mouSigned },
    {
      icon: IndianRupee,
      label: "Funding committed",
      value: INDUSTRY_ENGAGEMENT.fundingCommittedLakh,
      format: (n) => `₹${(n / 100).toFixed(2)} Cr`,
    },
    { icon: ArrowRightLeft, label: "Tech transfers", value: INDUSTRY_ENGAGEMENT.techTransfers },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-3 xl:grid-cols-4", className)}>
      {tiles.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 22 }}
            className="rounded-2xl bg-secondary/50 p-3.5"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-card text-brand shadow-float">
              <Icon size={15} strokeWidth={2.2} />
            </span>
            <p className="mt-2.5 text-[20px] font-extrabold leading-none text-ink nums">
              <AnimatedNumber value={t.value} format={t.format} delay={0.15 + i * 0.06} />
            </p>
            <p className="mt-1.5 text-[10.5px] font-semibold text-ink-soft">{t.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------------- Project completion ---------------- */

export function CompletionMetrics({ className }: { className?: string }) {
  const { onTime, delayed, fastTracked, avgCycleMonths } = PROJECT_COMPLETION;
  const segs = [
    { label: "On time", v: onTime, c: BRAND },
    { label: "Delayed", v: delayed, c: "#E0A538" },
    { label: "Fast-tracked", v: fastTracked, c: "#96A33B" },
  ];

  return (
    <div className={className}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary/60">
        {segs.map((s, i) => (
          <motion.div
            key={s.label}
            className="h-full"
            style={{ background: s.c }}
            initial={{ width: 0 }}
            animate={{ width: `${s.v}%` }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {segs.map((s) => (
          <div key={s.label} className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.c }} />
            <span className="flex-1 text-[12px] font-semibold text-ink">{s.label}</span>
            <span className="text-[13px] font-extrabold nums text-ink">
              <AnimatedNumber value={s.v} format={(n) => `${Math.round(n)}%`} delay={0.2} />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[10.5px] font-bold nums text-ink-soft">
          <Clock size={11} strokeWidth={2.4} />
          Avg cycle {avgCycleMonths} months
        </span>
        <DemoChip />
      </div>
    </div>
  );
}

/* ---------------- shared fund aggregates ---------------- */

/** Sanctioned / disbursed / balance / utilisation % computed from allocation rows */
export function fundAggregates(allocations: { sanctionedLakh: number; disbursedLakh: number }[]) {
  const sanctionedLakh = allocations.reduce((a, r) => a + r.sanctionedLakh, 0);
  const disbursedLakh = allocations.reduce((a, r) => a + r.disbursedLakh, 0);
  return {
    sanctionedLakh,
    disbursedLakh,
    balanceLakh: Math.round((sanctionedLakh - disbursedLakh) * 10) / 10,
    utilisationPct: Math.round((disbursedLakh / sanctionedLakh) * 100),
  };
}
