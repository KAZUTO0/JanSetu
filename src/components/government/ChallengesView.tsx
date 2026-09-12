"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronDown, MapPin, Search, SearchX, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { DISTRICTS } from "@/lib/data/analytics";
import { CATEGORY_META } from "@/lib/data/categories";
import type { Category, Stage } from "@/lib/types";
import {
  CategoryIcon, EmptyState, FilterChips, ScoreRing, StageBadge,
} from "@/components/shared/kit";
import { compactIN } from "@/components/shared/AnimatedNumber";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { DemoChip, SheetPortal, districtDotColor, useSheetHost } from "./parts";
import { cn } from "@/lib/utils";

const STAGE_FILTERS: Stage[] = [
  "Reported", "Validated", "Matched", "Development", "Pilot", "Deployment",
];

const CATEGORY_ITEMS = (Object.keys(CATEGORY_META) as Category[]).map((c) => ({
  id: c,
  label: CATEGORY_META[c].name,
  icon: <CategoryIcon category={c} size={13} />,
}));

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};
const rowVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-float">
      <div className="shimmer h-10 w-10 shrink-0 rounded-xl bg-secondary" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="shimmer h-2.5 w-14 rounded-full bg-secondary" />
        <div className="shimmer h-3.5 w-3/4 rounded-full bg-secondary" />
        <div className="shimmer h-2.5 w-1/2 rounded-full bg-secondary" />
      </div>
      <div className="shimmer h-8 w-14 shrink-0 rounded-full bg-secondary" />
    </div>
  );
}

export function GovChallengesView() {
  const challenges = useApp((s) => s.challenges);
  const push = useApp((s) => s.push);
  const category = useApp((s) => s.govCategoryFilter);
  const setCategory = useApp((s) => s.setGovCategoryFilter);

  const [query, setQuery] = React.useState("");
  const [stage, setStage] = React.useState<Stage | null>(null);
  const [district, setDistrict] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [hostRef, sheetHost] = useSheetHost();

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return challenges.filter(
      (c) =>
        (!category || c.category === (category as Category)) &&
        (!stage || c.stage === stage) &&
        (!district || c.district === district) &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.block.toLowerCase().includes(q))
    );
  }, [challenges, category, stage, district, query]);

  const topDistricts = React.useMemo(
    () => [...DISTRICTS].sort((a, b) => b.challenges - a.challenges).slice(0, 5),
    []
  );

  const hasFilters = !!category || !!stage || !!district || !!query.trim();
  const clearAll = () => {
    setCategory(null);
    setStage(null);
    setDistrict(null);
    setQuery("");
  };

  return (
    <div ref={hostRef} className="pb-2 pt-3">
      {/* Header */}
      <div className="px-4">
        <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          Challenges
        </h1>
        <p className="mt-1 text-[13px] text-ink-soft">All citizen-reported challenges · live demo</p>
      </div>

      {/* District heat strip */}
      <div className="no-scrollbar mt-3.5 flex gap-2 overflow-x-auto px-4 pb-1">
        {topDistricts.map((d) => {
          const active = district === d.name;
          return (
            <button
              key={d.name}
              onClick={() => setDistrict(active ? null : d.name)}
              className={cn(
                "tap flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors",
                active
                  ? "border-transparent bg-ink text-white"
                  : "border-border bg-card text-ink-soft hover:text-ink"
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: active ? "#45B08C" : districtDotColor(d.density) }}
              />
              {d.name}
              <span className={cn("nums", active ? "text-white/60" : "text-ink-soft/60")}>
                {d.challenges}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setSheetOpen(true)}
          className="tap flex shrink-0 items-center gap-1 rounded-full bg-brand-mist px-3 py-1.5 text-[11.5px] font-bold text-brand-deep"
        >
          <MapPin size={12} strokeWidth={2.4} />
          All 24
        </button>
      </div>

      {/* Search */}
      <div className="mt-3 px-4">
        <div className="flex h-11 items-center gap-2 rounded-2xl border border-border bg-card px-3.5 shadow-float">
          <Search size={16} strokeWidth={2.2} className="shrink-0 text-ink-soft/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search challenges, codes, districts…"
            className="h-full w-full bg-transparent text-[13.5px] font-medium text-ink outline-none placeholder:text-ink-soft/60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="tap grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-ink-soft"
            >
              <X size={12} strokeWidth={2.6} />
            </button>
          )}
        </div>
      </div>

      {/* Category + stage filters */}
      <div className="mt-3">
        <FilterChips items={CATEGORY_ITEMS} value={(category as Category | null) ?? null} onChange={(v) => setCategory(v)} />
        <FilterChips
          className="mt-1.5"
          items={STAGE_FILTERS.map((s) => ({ id: s, label: s }))}
          value={stage}
          onChange={setStage}
        />
      </div>

      {/* District picker */}
      <div className="mt-2.5 px-4">
        <button
          onClick={() => setSheetOpen(true)}
          className="tap flex h-11 w-full items-center justify-between rounded-2xl border border-border bg-card px-4 shadow-float"
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <MapPin size={15} strokeWidth={2.2} className="text-brand" />
            {district ?? "All 24 districts"}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-brand">
            Change <ChevronDown size={14} strokeWidth={2.6} />
          </span>
        </button>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="no-scrollbar mt-2.5 flex items-center gap-2 overflow-x-auto px-4">
          {category && (
            <button
              onClick={() => setCategory(null)}
              className="tap flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              {category} <X size={11} strokeWidth={2.8} />
            </button>
          )}
          {district && (
            <button
              onClick={() => setDistrict(null)}
              className="tap flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              {district} <X size={11} strokeWidth={2.8} />
            </button>
          )}
          {stage && (
            <button
              onClick={() => setStage(null)}
              className="tap flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              {stage} <X size={11} strokeWidth={2.8} />
            </button>
          )}
          {query.trim() && (
            <button
              onClick={() => setQuery("")}
              className="tap flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              “{query.trim()}” <X size={11} strokeWidth={2.8} />
            </button>
          )}
          <button
            onClick={clearAll}
            className="tap shrink-0 rounded-full px-2 py-1 text-[11.5px] font-bold text-brand"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Result count */}
      <div className="mt-3.5 flex items-center justify-between px-4">
        <p className="text-[12px] font-semibold nums text-ink-soft">
          Showing {filtered.length} of {challenges.length}
        </p>
        <DemoChip />
      </div>

      {/* List */}
      <div className="mt-2.5">
        {loading ? (
          <div className="space-y-2.5 px-4">
            {[0, 1, 2, 3].map((i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX size={22} strokeWidth={2} />}
            title="No challenges match"
            sub="Try removing a filter or searching for a different district or code."
            action={
              <button
                onClick={clearAll}
                className="tap rounded-2xl bg-brand px-5 py-2.5 text-[13px] font-bold text-white"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <motion.div
            key={`${category}-${district}-${stage}-${query}`}
            variants={listContainer}
            initial="hidden"
            animate="show"
          >
            {filtered.map((c) => (
              <div key={c.id} className="px-4 pb-2.5">
                <motion.button
                  variants={rowVariant}
                  onClick={() => push({ type: "challenge", challengeId: c.id })}
                  className="tap flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 text-left shadow-float"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                    style={{ background: CATEGORY_META[c.category].soft }}
                  >
                    <CategoryIcon category={c.category} size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold nums tracking-wide text-ink-soft">
                      {c.code}
                    </span>
                    <span className="mt-0.5 block truncate text-[13.5px] font-semibold leading-snug text-ink">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] nums text-ink-soft">
                      {c.district} · {compactIN(c.affectedPopulation)} affected
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <StageBadge stage={c.stage} />
                    <ScoreRing value={c.priorityScore} size={32} stroke={3.5} />
                  </span>
                </motion.button>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* District picker sheet (portaled to the content layer) */}
      <SheetPortal host={sheetHost}>
        <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filter by district"
        subtitle="Challenge volume per district · demo data"
      >
        <div className="space-y-1.5 pb-2">
          <button
            onClick={() => {
              setDistrict(null);
              setSheetOpen(false);
            }}
            className={cn(
              "tap flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition-colors",
              !district ? "bg-brand-mist" : "bg-secondary/50 hover:bg-secondary"
            )}
          >
            <span className="flex items-center gap-2 text-[13.5px] font-bold text-ink">
              <MapPin size={15} className="text-brand" />
              All districts
            </span>
            <span className="text-[11px] font-bold nums text-ink-soft">
              {challenges.length} sampled
            </span>
          </button>
          {[...DISTRICTS]
            .sort((a, b) => b.challenges - a.challenges)
            .map((d) => {
              const active = district === d.name;
              return (
                <button
                  key={d.name}
                  onClick={() => {
                    setDistrict(active ? null : d.name);
                    setSheetOpen(false);
                  }}
                  className={cn(
                    "tap flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition-colors",
                    active ? "bg-brand-mist" : "hover:bg-secondary/60"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: districtDotColor(d.density) }} />
                    <span className="truncate text-[13px] font-semibold text-ink">{d.name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] nums text-ink-soft">{d.challenges} reported</span>
                    <span className="text-[10px] nums text-ink-soft/60">
                      {d.validated} valid
                    </span>
                  </span>
                </button>
              );
            })}
        </div>
      </BottomSheet>
      </SheetPortal>
    </div>
  );
}
