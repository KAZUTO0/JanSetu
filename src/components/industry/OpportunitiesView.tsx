"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";
import type { Opportunity } from "@/lib/types";
import { COLLABORATIONS, OPPORTUNITIES } from "@/lib/data/opportunities";
import { useApp } from "@/lib/store";
import { EmptyState, FeedSkeleton, FilterChips } from "@/components/shared/kit";
import {
  ExpressInterestSheet,
  IndustryHeader,
  LIST_VARIANTS,
  OpportunityCard,
  StatsRow,
  useSheetHost,
} from "@/components/industry/parts";

const FILTERS: { id: string; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "All" },
  { id: "Water", label: "Water" },
  { id: "Agriculture", label: "Agriculture" },
  { id: "Healthcare", label: "Healthcare" },
  { id: "Education", label: "Education" },
  { id: "Environment", label: "Environment" },
  { id: "Infrastructure", label: "Infrastructure" },
  { id: "best", label: "Best match", icon: <Sparkles size={12} strokeWidth={2.4} /> },
];

export function IndustryOpportunitiesView() {
  const expressedInterestIds = useApp((s) => s.expressedInterestIds);

  const [filter, setFilter] = React.useState<string>("all");
  const [loading, setLoading] = React.useState(true);
  const [sheetOpp, setSheetOpp] = React.useState<Opportunity | null>(null);
  const [rootRef, sheetHost] = useSheetHost();

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(t);
  }, []);

  const ranked = React.useMemo(
    () => [...OPPORTUNITIES].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)),
    []
  );

  const filtered = React.useMemo(() => {
    if (filter === "all") return ranked;
    if (filter === "best") return ranked.filter((o) => (o.matchScore ?? 0) >= 85);
    return ranked.filter((o) => o.category === filter);
  }, [filter, ranked]);

  // Two expressions pre-date this prototype session (mock persona history),
  // so the tile starts at the persona's "3 Expressed" and grows live.
  const expressedCount = expressedInterestIds.length + 2;
  const committedLakh = COLLABORATIONS.reduce((sum, c) => sum + (c.valueLakh ?? 0), 0);

  return (
    <div ref={rootRef} className="pb-2">
      <IndustryHeader
        eyebrow="GreenGrid Energy LLP"
        title="Opportunities"
        sub="University innovations ready for industry partnership"
      />

      <StatsRow
        items={[
          { value: OPPORTUNITIES.length, label: "Open opportunities" },
          { value: expressedCount, label: "Expressed", tone: "brand" },
          {
            value: committedLakh,
            label: "Committed (mock)",
            format: (n) => `₹${n.toFixed(1)}L`,
            tone: "amber",
          },
        ]}
      />

      <div className="mt-4">
        <FilterChips
          items={FILTERS}
          value={filter}
          onChange={(v) => setFilter(v ?? "all")}
        />
      </div>

      <div className="mt-3">
        {loading ? (
          <FeedSkeleton count={3} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Compass size={22} />}
            title="No opportunities here yet"
            sub={`Nothing open under ${filter === "best" ? "best match" : filter} right now — try another filter.`}
            action={
              <button
                onClick={() => setFilter("all")}
                className="tap h-10 rounded-2xl bg-ink px-5 text-[13px] font-semibold text-white"
              >
                Show all
              </button>
            }
          />
        ) : (
          <motion.div variants={LIST_VARIANTS} initial="hidden" animate="show">
            {filtered.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                expressed={expressedInterestIds.includes(opp.id)}
                onExpress={setSheetOpp}
              />
            ))}
          </motion.div>
        )}
      </div>

      <ExpressInterestSheet
        opportunity={sheetOpp}
        onClose={() => setSheetOpp(null)}
        host={sheetHost}
      />
    </div>
  );
}
