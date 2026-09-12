"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  MapPin,
  Search,
  SearchX,
  X,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { useApp } from "@/lib/store";
import { CATEGORY_META } from "@/lib/data/categories";
import {
  CategoryIcon,
  EmptyState,
  ScoreRing,
  SectionHeader,
} from "@/components/shared/kit";
import { compactIN } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils";

type SortId = "latest" | "priority" | "nearby";

const SORTS: { id: SortId; label: string }[] = [
  { id: "latest", label: "Latest" },
  { id: "priority", label: "Priority" },
  { id: "nearby", label: "Nearby" },
];

const DISTRICT_CHIPS = [
  "All districts",
  "Ranchi",
  "Dhanbad",
  "Bokaro",
  "Jamshedpur",
  "Giridih",
  "Simdega",
  "Gumla",
];

/** "Jamshedpur" is the common name for East Singhbhum district. */
function districtValue(chip: string): string | null {
  if (chip === "All districts") return null;
  return chip === "Jamshedpur" ? "East Singhbhum" : chip;
}

function recencyDays(ago: string): number {
  const m = ago.match(/(\d+)\s*(day|week|month)/i);
  if (!m) return 9999;
  const n = parseInt(m[1], 10);
  if (m[2].toLowerCase().startsWith("week")) return n * 7;
  if (m[2].toLowerCase().startsWith("month")) return n * 30;
  return n;
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-float">
      <div className="shimmer h-11 w-11 shrink-0 rounded-xl bg-secondary" />
      <div className="flex-1 space-y-2">
        <div className="shimmer h-3.5 w-3/4 rounded-full bg-secondary" />
        <div className="shimmer h-3 w-1/2 rounded-full bg-secondary" />
      </div>
      <div className="shimmer h-9 w-9 shrink-0 rounded-full bg-secondary" />
    </div>
  );
}

export function ExploreView() {
  const challenges = useApp((s) => s.challenges);
  const push = useApp((s) => s.push);

  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [cats, setCats] = React.useState<Category[]>([]);
  const [district, setDistrict] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<SortId>("latest");

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = challenges.filter((c) => {
      if (cats.length > 0 && !cats.includes(c.category)) return false;
      if (district && c.district !== district) return false;
      if (
        q &&
        !c.title.toLowerCase().includes(q) &&
        !c.district.toLowerCase().includes(q) &&
        !c.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
    if (sort === "priority")
      return [...list].sort((a, b) => b.priorityScore - a.priorityScore);
    if (sort === "nearby")
      return [...list].sort((a, b) => (b.nearbyCount ?? 0) - (a.nearbyCount ?? 0));
    return [...list].sort(
      (a, b) => recencyDays(a.reportedAgo) - recencyDays(b.reportedAgo)
    );
  }, [challenges, query, cats, district, sort]);

  const categoryCount = (cat: Category) =>
    challenges.filter((c) => c.category === cat).length;

  const toggleCat = (cat: Category) =>
    setCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const hasFilters =
    query.trim() !== "" || cats.length > 0 || district !== null;

  const clearAll = () => {
    setQuery("");
    setCats([]);
    setDistrict(null);
  };

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="px-4 pb-3 pt-5">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          Explore
        </h1>
        <p className="mt-1 text-[12px] text-ink-soft">
          Every societal challenge across Jharkhand
        </p>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 shadow-float">
          <Search size={16} className="shrink-0 text-ink-soft/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search challenges, districts, tags"
            className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-soft/60"
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

      {/* Browse by category */}
      <SectionHeader title="Browse by category" sub="Tap a tile to filter" />
      <div className="grid grid-cols-2 gap-3 px-4">
        {(Object.keys(CATEGORY_META) as Category[]).map((cat, i) => {
          const meta = CATEGORY_META[cat];
          const active = cats.includes(cat);
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: loading ? 0 : Math.min(i * 0.05, 0.3),
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleCat(cat)}
              className={cn(
                "flex items-center gap-3 rounded-3xl border bg-card p-3.5 text-left shadow-float transition-colors",
                active ? "border-ink" : "border-border"
              )}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
                style={{ background: meta.soft }}
              >
                <CategoryIcon category={cat} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-ink">
                  {meta.name}
                </span>
                <span className="block text-[11px] text-ink-soft">
                  {categoryCount(cat)} challenge{categoryCount(cat) === 1 ? "" : "s"}
                </span>
              </span>
              {active ? (
                <Check size={15} strokeWidth={2.6} className="shrink-0 text-brand" />
              ) : (
                <ChevronRight size={15} className="shrink-0 text-ink-soft/50" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Districts */}
      <div className="pt-5">
        <SectionHeader title="Districts" sub="Where challenges are reported" />
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1">
          {DISTRICT_CHIPS.map((d) => {
            const value = districtValue(d);
            const active = district === value;
            return (
              <motion.button
                key={d}
                whileTap={{ scale: 0.94 }}
                onClick={() => setDistrict(value)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "border-transparent bg-ink text-white"
                    : "border-border bg-card text-ink-soft"
                )}
              >
                {d !== "All districts" && (
                  <MapPin size={12} strokeWidth={2.4} />
                )}
                {d}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sort segmented control */}
      <div className="px-4 pb-2 pt-4">
        <div className="flex rounded-full bg-secondary p-1">
          {SORTS.map((s) => {
            const active = sort === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className="relative flex-1 rounded-full py-2 text-[12.5px] font-semibold"
              >
                {active && (
                  <motion.span
                    layoutId="explore-sort-thumb"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-card shadow-float"
                  />
                )}
                <span
                  className={cn(
                    "relative",
                    active ? "text-ink" : "text-ink-soft"
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col gap-2.5 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchX size={22} />}
          title="No challenges match"
          sub="Nothing found for this combination of search, category and district."
          action={
            <button
              onClick={clearAll}
              className="tap h-10 rounded-2xl bg-ink px-5 text-[13px] font-semibold text-white"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <>
          <p className="px-4 pb-3 text-[12px] text-ink-soft">
            <span className="font-bold text-ink">{results.length}</span> of{" "}
            {challenges.length} challenges
            {hasFilters && " · filters on"}
          </p>
          <div className="flex flex-col gap-2.5 px-4">
            {results.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(i * 0.05, 0.4),
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => push({ type: "challenge", challengeId: c.id })}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-float"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: CATEGORY_META[c.category].soft }}
                >
                  <CategoryIcon category={c.category} size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-bold tracking-[-0.01em] text-ink">
                    {c.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-ink-soft">
                    {c.district} · {compactIN(c.affectedPopulation)} affected ·{" "}
                    {c.code}
                  </span>
                </span>
                <ScoreRing value={c.priorityScore} size={38} stroke={3.5} />
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
