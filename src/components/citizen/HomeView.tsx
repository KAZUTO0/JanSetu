"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Flame,
  MapPin,
  Navigation,
  Search,
  SearchX,
  X,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { useApp } from "@/lib/store";
import { IMPACT_STORIES } from "@/lib/data/impact";
import {
  CategoryChip,
  CoverImage,
  EmptyState,
  FeedSkeleton,
  SectionHeader,
} from "@/components/shared/kit";
import { ChallengeCard } from "@/components/citizen/ChallengeCard";
import { cn } from "@/lib/utils";

type SortId = "nearby" | "priority" | "latest";

const SORT_CHIPS: { id: SortId; label: string; icon: React.ReactNode }[] = [
  { id: "nearby", label: "Nearby", icon: <Navigation size={13} strokeWidth={2.4} /> },
  { id: "priority", label: "High Priority", icon: <Flame size={13} strokeWidth={2.4} /> },
  { id: "latest", label: "Latest", icon: <Clock size={13} strokeWidth={2.4} /> },
];

const CATEGORY_CHIPS: Category[] = [
  "Water",
  "Agriculture",
  "Healthcare",
  "Education",
  "Environment",
  "Infrastructure",
];

/** Maps "3 weeks ago" -> a recency rank (smaller = more recent). */
function recencyDays(ago: string): number {
  const m = ago.match(/(\d+)\s*(day|week|month)/i);
  if (!m) return 9999;
  const n = parseInt(m[1], 10);
  if (m[2].toLowerCase().startsWith("week")) return n * 7;
  if (m[2].toLowerCase().startsWith("month")) return n * 30;
  return n;
}

export function HomeView() {
  const challenges = useApp((s) => s.challenges);
  const push = useApp((s) => s.push);

  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortId | null>(null);
  const [cats, setCats] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = challenges.filter((c) => {
      if (cats.length > 0 && !cats.includes(c.category)) return false;
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
    if (sort === "latest")
      return [...list].sort((a, b) => recencyDays(a.reportedAgo) - recencyDays(b.reportedAgo));
    return list;
  }, [challenges, query, cats, sort]);

  const hasFilters = query.trim() !== "" || sort !== null || cats.length > 0;

  const clearAll = () => {
    setQuery("");
    setSort(null);
    setCats([]);
  };

  const toggleCat = (cat: Category) =>
    setCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="px-4 pb-3 pt-5">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-brand">
          Namaste, Aarav
        </p>
        <h1 className="mt-1 text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          Innovation Feed
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-soft">
          <MapPin size={12} className="shrink-0 text-brand" />
          Ranchi · Jharkhand · live demo data
        </p>
      </div>

      {/* Sticky search + filter chips */}
      <div className="glass sticky top-0 z-20 border-b border-border/60 pb-2.5 pt-2.5">
        <div className="px-4">
          <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5">
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

        {/* Filter chips — sort options are single-select, categories multi-select */}
        <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1">
          {SORT_CHIPS.map((chip) => {
            const active = sort === chip.id;
            return (
              <motion.button
                key={chip.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSort(active ? null : chip.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "border-transparent bg-ink text-white"
                    : "border-border bg-card text-ink-soft"
                )}
              >
                {chip.icon}
                {chip.label}
              </motion.button>
            );
          })}
          <span className="mx-0.5 my-1 w-px shrink-0 bg-border" />
          {CATEGORY_CHIPS.map((cat) => {
            const active = cats.includes(cat);
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.94 }}
                onClick={() => toggleCat(cat)}
                className={cn(
                  "flex shrink-0 items-center rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "border-transparent bg-ink text-white"
                    : "border-border bg-card text-ink-soft"
                )}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <FeedSkeleton count={3} />
      ) : (
        <>
          {/* Impact Highlights carousel */}
          <div className="pt-5">
            <SectionHeader
              title="Impact Highlights"
              sub="Solutions deployed on the ground"
              action="See all"
              onAction={() => push({ type: "impact" })}
            />
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
              {IMPACT_STORIES.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: Math.min(i * 0.06, 0.36),
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => push({ type: "impact-story", storyId: s.id })}
                  className="w-[200px] shrink-0 text-left"
                >
                  <CoverImage
                    src={s.image}
                    alt={s.title}
                    ratio="aspect-[4/3]"
                    className="rounded-2xl"
                  >
                    <span className="glass absolute left-2 top-2 rounded-full p-0.5">
                      <CategoryChip category={s.category} />
                    </span>
                  </CoverImage>
                  <p className="mt-2 line-clamp-2 text-[13px] font-bold leading-snug tracking-[-0.01em] text-ink">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-[11.5px] font-bold text-brand">
                    {s.headlineMetric}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Trending Challenges */}
          <div className="pt-6">
            <SectionHeader
              title="Trending Challenges"
              sub={
                hasFilters
                  ? `${filtered.length} match${filtered.length === 1 ? "" : "es"} · filters on`
                  : `${challenges.length} live right now`
              }
            />
            {filtered.length === 0 ? (
              <EmptyState
                icon={<SearchX size={22} />}
                title="No challenges found"
                sub="Try a different search term or clear the active filters."
                action={
                  <button
                    onClick={clearAll}
                    className="tap h-10 rounded-2xl bg-ink px-5 text-[13px] font-semibold text-white"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <>
                {filtered.map((c, i) => (
                  <ChallengeCard key={c.id} challenge={c} index={i} />
                ))}
                <p className="px-8 pb-1 pt-1 text-center text-[11px] leading-relaxed text-ink-soft/70">
                  You&apos;ve reached the end — {challenges.length} live challenges ·
                  demo data
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
