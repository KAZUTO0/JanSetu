"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Users, ThumbsUp, MapPin, Compass, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Challenge } from "@/lib/types";
import {
  FilterChips,
  ScoreRing,
  PriorityPill,
  StageBadge,
  FeedSkeleton,
  EmptyState,
} from "@/components/shared/kit";
import { compactIN } from "@/components/shared/AnimatedNumber";
import {
  bitMatchOf,
  topFactors,
  HeiPageHeader,
  CoverOrGradient,
  useDelayedReady,
  listStagger,
  riseItem,
  type BitMatch,
} from "./parts";

type RankedRow = { challenge: Challenge; match: BitMatch };

const FILTER_ITEMS: { id: string; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "All" },
  { id: "Water", label: "Water" },
  { id: "Agriculture", label: "Agriculture" },
  { id: "Healthcare", label: "Healthcare" },
  { id: "Education", label: "Education" },
  { id: "Environment", label: "Environment" },
  { id: "Infrastructure", label: "Infrastructure" },
  {
    id: "m85",
    label: "85%+ match",
    icon: <Sparkles size={13} strokeWidth={2.4} className="text-brand" />,
  },
];

export function HeiDiscoverView() {
  const push = useApp((s) => s.push);
  const challenges = useApp((s) => s.challenges);
  const acceptedIds = useApp((s) => s.acceptedChallengeIds);
  const ready = useDelayedReady(800);
  const [chip, setChip] = React.useState<string>("all");

  const ranked = React.useMemo<RankedRow[]>(
    () =>
      challenges
        .map((challenge) => ({ challenge, match: bitMatchOf(challenge) }))
        .sort((a, b) => b.match.percent - a.match.percent),
    [challenges]
  );

  const filtered = React.useMemo(() => {
    if (chip === "m85") return ranked.filter((r) => r.match.percent >= 85);
    if (chip !== "all") return ranked.filter((r) => r.challenge.category === chip);
    return ranked;
  }, [ranked, chip]);

  const open = (challenge: Challenge) =>
    push({ type: "challenge", challengeId: challenge.id });

  return (
    <div className="pt-1">
      <HeiPageHeader
        eyebrow="BIT Mesra · Coordination Cell"
        title="Discover"
        sub="Societal challenges ranked by your capability match"
      />

      {/* Matching cycle banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="px-4 pt-2"
      >
        <div className="rounded-3xl bg-brand-mist p-4 shadow-float">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-float">
              <RefreshCw size={18} strokeWidth={2.3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold leading-tight tracking-[-0.01em] text-brand-deep">
                Matching cycle #25 closes 05 Aug
              </p>
              <p className="mt-0.5 text-[11.5px] text-ink-soft">
                12 challenges awaiting review
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-card px-2.5 py-1 text-[10px] font-bold text-brand-deep shadow-float">
              18 days left
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/80">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="h-full rounded-full bg-brand"
              />
            </div>
            <span className="text-[10px] font-semibold text-ink-soft">
              Day 18 of 30
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="pt-3">
        <FilterChips
          items={FILTER_ITEMS}
          value={chip}
          onChange={(v) => setChip(v ?? "all")}
        />
      </div>

      {/* Ranked list */}
      {!ready ? (
        <FeedSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Compass size={22} strokeWidth={2.2} />}
          title="No challenges match"
          sub="No challenges fit this filter for your institution right now."
          action={
            <button
              onClick={() => setChip("all")}
              className="tap rounded-2xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="pt-2"
        >
          {filtered.map(({ challenge, match }, i) =>
            chip === "all" && i === 0 ? (
              <FlagshipCard
                key={challenge.id}
                challenge={challenge}
                match={match}
                accepted={acceptedIds.includes(challenge.id)}
                onOpen={() => open(challenge)}
              />
            ) : (
              <MatchCard
                key={challenge.id}
                challenge={challenge}
                match={match}
                accepted={acceptedIds.includes(challenge.id)}
                onOpen={() => open(challenge)}
              />
            )
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ---------------- Flagship (rank #1) card with cover ---------------- */

function FlagshipCard({
  challenge,
  match,
  accepted,
  onOpen,
}: {
  challenge: Challenge;
  match: BitMatch;
  accepted: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.article
      variants={riseItem}
      onClick={onOpen}
      className="tap mx-4 mb-4 cursor-pointer overflow-hidden rounded-3xl bg-card shadow-float"
    >
      <CoverOrGradient
        src={challenge.image}
        alt={challenge.title}
        category={challenge.category}
        ratio="aspect-[16/9]"
      >
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep backdrop-blur-sm">
            Top match
          </span>
          {accepted && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold text-white">
              Accepted
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="rounded-full bg-white/92 p-1 shadow-float backdrop-blur-sm">
            <ScoreRing
              value={match.percent}
              size={62}
              stroke={5}
              label="match"
              color="#0E8A6D"
            />
          </div>
        </div>
      </CoverOrGradient>

      <div className="p-4">
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-soft/70">
            {challenge.code}
          </p>
          {accepted && (
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Accepted
            </span>
          )}
        </div>
        <h3 className="mt-0.5 line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.01em] text-ink">
          {challenge.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[11.5px] text-ink-soft">
          <MapPin size={11} strokeWidth={2.4} className="shrink-0" />
          {challenge.district} · {challenge.block}
        </p>
        <p className="mt-1 flex items-center gap-3 text-[11px] text-ink-soft">
          <span className="flex items-center gap-1">
            <Users size={11} strokeWidth={2.4} className="shrink-0" />
            {compactIN(challenge.affectedPopulation)} affected
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp size={11} strokeWidth={2.4} className="shrink-0" />
            {compactIN(challenge.supporters)}
          </span>
        </p>
        <MatchCardBody challenge={challenge} match={match} />
      </div>
    </motion.article>
  );
}

/* ---------------- Regular ranked card ---------------- */

function MatchCard({
  challenge,
  match,
  accepted,
  onOpen,
}: {
  challenge: Challenge;
  match: BitMatch;
  accepted: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.article
      variants={riseItem}
      onClick={onOpen}
      className="tap mx-4 mb-3 cursor-pointer rounded-3xl bg-card p-4 shadow-float"
    >
      <div className="flex gap-3.5">
        <ScoreRing
          value={match.percent}
          size={56}
          stroke={5}
          label="match"
          color={match.percent >= 85 ? "#0E8A6D" : "#96A33B"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-soft/70">
              {challenge.code}
            </p>
            {accepted && (
              <span className="rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                Accepted
              </span>
            )}
          </div>
          <h3 className="mt-0.5 line-clamp-2 text-[15px] font-bold leading-snug tracking-[-0.01em] text-ink">
            {challenge.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11.5px] text-ink-soft">
            <MapPin size={11} strokeWidth={2.4} className="shrink-0" />
            {challenge.district} · {challenge.block}
          </p>
          <p className="mt-1 flex items-center gap-3 text-[11px] text-ink-soft">
            <span className="flex items-center gap-1">
              <Users size={11} strokeWidth={2.4} className="shrink-0" />
              {compactIN(challenge.affectedPopulation)} affected
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={11} strokeWidth={2.4} className="shrink-0" />
              {compactIN(challenge.supporters)}
            </span>
          </p>
        </div>
      </div>
      <MatchCardBody challenge={challenge} match={match} />
    </motion.article>
  );
}

/* ---------------- Shared card body (factors + status pills) ---------------- */

function MatchCardBody({
  challenge,
  match,
}: {
  challenge: Challenge;
  match: BitMatch;
}) {
  const factors = topFactors(match.factors, 2);
  return (
    <div className="mt-3">
      {factors.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-soft/60">
            Overlap
          </span>
          {factors.map((f) => (
            <span
              key={f.label}
              className="rounded-full bg-brand-mist px-2 py-1 text-[10px] font-semibold text-brand-deep"
            >
              {f.label} {f.value}%
            </span>
          ))}
        </div>
      )}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <PriorityPill priority={challenge.priority} />
        <StageBadge stage={challenge.stage} />
        <span className="ml-auto text-[10.5px] font-semibold text-ink-soft/70">
          {challenge.reportsCount} reports
        </span>
      </div>
    </div>
  );
}
