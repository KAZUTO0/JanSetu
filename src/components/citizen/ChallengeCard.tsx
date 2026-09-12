"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Layers,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import type { Challenge } from "@/lib/types";
import { useApp } from "@/lib/store";
import { heiById } from "@/lib/data/heis";
import {
  CategoryChip,
  CoverImage,
  PriorityPill,
  StageBadge,
} from "@/components/shared/kit";
import { AnimatedNumber, compactIN } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils";

/** Initials tile for an HEI ("BIT Mesra" -> "BM"). */
function heiInitials(name: string): string {
  const words = name.split(" ").filter((w) => /^[A-Za-z]/.test(w));
  if (words.length === 0) return "HE";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Premium citizen-facing challenge card used in the Home feed.
 * Whole card opens the challenge detail; the support button toggles support.
 */
export function ChallengeCard({
  challenge,
  index = 0,
}: {
  challenge: Challenge;
  index?: number;
}) {
  const push = useApp((s) => s.push);
  const toggleSupport = useApp((s) => s.toggleSupport);
  const supported = useApp((s) => s.supportedIds.includes(challenge.id));
  const toast = useApp((s) => s.toast);

  const topMatch = challenge.heiMatches[0];
  const hei = topMatch ? heiById(topMatch.heiId) : null;
  const supporters = challenge.supporters + (supported ? 1 : 0);

  const open = () => push({ type: "challenge", challengeId: challenge.id });

  const onSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSupport(challenge.id);
    toast(
      supported ? "Support removed" : "Challenge supported",
      supported
        ? `${challenge.code} · you are no longer counted as a supporter`
        : `${challenge.code} · ${challenge.district} — thank you for adding your voice`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.06, 0.48),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mb-4 px-4"
    >
      <div className="card-hairline overflow-hidden rounded-3xl bg-card shadow-float">
        {/* Tappable body: image + meta */}
        <motion.div
          whileTap={{ scale: 0.985 }}
          onClick={open}
          className="cursor-pointer"
        >
          <CoverImage src={challenge.image} alt={challenge.title}>
            {/* Code chip */}
            <span className="glass-dark absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
              {challenge.code}
            </span>
            {/* Stage badge */}
            <span className="absolute right-2.5 top-2.5">
              <span className="glass rounded-full">
                <StageBadge stage={challenge.stage} />
              </span>
            </span>
            {/* District pin chip */}
            <span className="glass-dark absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white">
              <MapPin size={10} strokeWidth={2.4} />
              {challenge.district} · {challenge.block}
            </span>
          </CoverImage>

          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip category={challenge.category} />
              <PriorityPill priority={challenge.priority} />
            </div>

            <h3 className="mt-2.5 line-clamp-2 text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-ink">
              {challenge.title}
            </h3>

            {/* Stats row */}
            <div className="mt-2.5 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
                <Users size={13} strokeWidth={2.2} className="text-ink-soft/70" />
                <AnimatedNumber
                  value={challenge.affectedPopulation}
                  format={compactIN}
                  className="font-bold text-ink"
                />
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
                <Heart
                  size={13}
                  strokeWidth={2.2}
                  className={supported ? "text-brand" : "text-ink-soft/70"}
                  fill={supported ? "currentColor" : "none"}
                />
                <AnimatedNumber
                  value={supporters}
                  format={compactIN}
                  duration={0.7}
                  className="font-bold text-ink"
                />
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
                <Layers size={13} strokeWidth={2.2} className="text-ink-soft/70" />
                <span className="font-bold text-ink">{challenge.reportsCount}</span>
                reports
              </span>
            </div>

            {/* AI tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.08em] text-ink-soft/70">
                <Sparkles size={10} className="text-brand" />
                AI tags
              </span>
              {challenge.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-2 py-0.5 text-[10.5px] text-ink-soft"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* HEI match strip */}
            {hei && topMatch && (
              <div className="mt-3 flex w-full items-center gap-2.5 rounded-2xl bg-secondary/60 px-3 py-2.5">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-[10px] text-[10px] font-extrabold tracking-wide text-white"
                  style={{ background: hei.color }}
                >
                  {heiInitials(hei.shortName)}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] leading-tight">
                  <span className="font-bold text-ink">{hei.shortName}</span>
                  <span className="text-ink-soft"> · {topMatch.matchPercent}% match</span>
                </span>
                <ChevronRight size={15} className="shrink-0 text-ink-soft/60" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Support button (outside tappable body) */}
        <div className="px-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onSupport}
            className={cn(
              "flex h-11 w-full items-center justify-center gap-2 rounded-2xl border text-[13px] font-semibold transition-colors",
              supported
                ? "border-transparent bg-brand-mist text-brand-deep"
                : "border-border bg-card text-ink"
            )}
          >
            <motion.span
              key={supported ? "on" : "off"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="grid place-items-center"
            >
              <Heart
                size={15}
                strokeWidth={2.3}
                className={supported ? "text-brand" : "text-ink-soft"}
                fill={supported ? "currentColor" : "none"}
              />
            </motion.span>
            {supported ? (
              <span className="flex items-center gap-1.5">
                Supporting
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold">
                  <AnimatedNumber value={supporters} format={compactIN} duration={0.6} />
                </span>
              </span>
            ) : (
              "Support this challenge"
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
