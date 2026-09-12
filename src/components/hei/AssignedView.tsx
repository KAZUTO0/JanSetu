"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Inbox, FolderKanban, Info, Users, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Challenge, TimelineEvent } from "@/lib/types";
import { STAGE_META } from "@/lib/data/categories";
import { PROJECTS } from "@/lib/data/projects";
import { StageBadge, EmptyState } from "@/components/shared/kit";
import {
  HeiPageHeader,
  StatTile,
  useDelayedReady,
  listStagger,
  riseItem,
} from "./parts";
import { cn } from "@/lib/utils";

export function HeiAssignedView() {
  const challenges = useApp((s) => s.challenges);
  const acceptedIds = useApp((s) => s.acceptedChallengeIds);
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);
  const toast = useApp((s) => s.toast);
  const ready = useDelayedReady(700);

  const accepted = React.useMemo<Challenge[]>(
    () =>
      acceptedIds
        .map((id) => challenges.find((c) => c.id === id))
        .filter((c): c is Challenge => Boolean(c))
        .reverse(),
    [acceptedIds, challenges]
  );

  const inDevelopment = accepted.filter((c) => c.stage === "Development").length;
  const pilots = accepted.filter((c) => c.stage === "Pilot").length;

  return (
    <div className="pt-1">
      <HeiPageHeader
        title="Assigned"
        sub="Challenges accepted by BIT Mesra"
      />

      {/* Summary tiles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="flex gap-3 px-4 pt-2"
      >
        <StatTile
          value={accepted.length}
          label="Accepted"
          accent
          icon={<Inbox size={15} strokeWidth={2.3} />}
        />
        <StatTile value={inDevelopment} label="In development" />
        <StatTile value={pilots} label="Pilots" />
      </motion.div>

      {/* List */}
      {!ready ? (
        <div className="space-y-3 px-4 pt-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="shimmer h-[168px] rounded-3xl bg-card shadow-float"
            />
          ))}
        </div>
      ) : accepted.length === 0 ? (
        <EmptyState
          icon={<Inbox size={22} strokeWidth={2.2} />}
          title="No challenges accepted yet"
          sub="Accept a challenge from Discover to reserve it for your institution."
          action={
            <button
              onClick={() => setTab("discover")}
              className="tap rounded-2xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white"
            >
              Browse Discover
            </button>
          }
        />
      ) : (
        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="pt-4"
        >
          {accepted.map((challenge) => (
            <AssignedCard
              key={challenge.id}
              challenge={challenge}
              onOpenChallenge={() =>
                push({ type: "challenge", challengeId: challenge.id })
              }
              onOpenProject={(projectId) => push({ type: "project", projectId })}
              onFormTeam={() =>
                toast(
                  "Form research team",
                  "Team roster sheet simulated — departments notified in demo"
                )
              }
            />
          ))}
        </motion.div>
      )}

      {/* Reservation info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="px-4 pt-1"
      >
        <div className="flex items-start gap-3 rounded-3xl bg-card p-4 shadow-float">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand-mist text-brand">
            <Info size={16} strokeWidth={2.3} />
          </span>
          <p className="text-[12px] leading-relaxed text-ink-soft">
            Accepting a challenge reserves it for your institution for{" "}
            <span className="font-bold text-ink">90 days</span> (simulated) —
            enough time to form a team and publish your first milestone plan.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Assigned challenge card ---------------- */

function AssignedCard({
  challenge,
  onOpenChallenge,
  onOpenProject,
  onFormTeam,
}: {
  challenge: Challenge;
  onOpenChallenge: () => void;
  onOpenProject: (projectId: string) => void;
  onFormTeam: () => void;
}) {
  const project = PROJECTS.find((p) => p.challengeId === challenge.id);

  return (
    <motion.article
      variants={riseItem}
      onClick={onOpenChallenge}
      className="tap mx-4 mb-3 cursor-pointer rounded-3xl bg-card p-4 shadow-float"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] text-ink-soft">
          {challenge.code}
        </span>
        <StageBadge stage={challenge.stage} />
      </div>

      <h3 className="mt-2 text-[15px] font-bold leading-snug tracking-[-0.01em] text-ink">
        {challenge.title}
      </h3>
      <p className="mt-1 text-[11.5px] text-ink-soft">
        {challenge.district} · {challenge.block}
      </p>

      {/* Mini 7-stage progress dots */}
      <div className="mt-3">
        <StageDots timeline={challenge.timeline} />
      </div>

      {project ? (
        <div
          className="mt-3.5 flex items-center justify-between gap-2 rounded-2xl bg-secondary/70 p-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex min-w-0 items-center gap-2 text-[11.5px] font-semibold text-ink">
            <FolderKanban size={14} strokeWidth={2.2} className="shrink-0 text-brand" />
            <span className="truncate">
              {project.code} · {project.stage}
            </span>
          </span>
          <button
            onClick={() => onOpenProject(project.id)}
            className="tap flex shrink-0 items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-[11.5px] font-bold text-white"
          >
            Open workspace
            <ChevronRight size={12} strokeWidth={2.6} />
          </button>
        </div>
      ) : (
        <div
          className="mt-3.5 flex items-center justify-between gap-2 rounded-2xl bg-brand-mist p-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex min-w-0 items-center gap-2 text-[11.5px] font-semibold text-brand-deep">
            <Users size={14} strokeWidth={2.2} className="shrink-0" />
            No project yet — team formation open
          </span>
          <button
            onClick={onFormTeam}
            className="tap shrink-0 rounded-full bg-brand px-3 py-1.5 text-[11.5px] font-bold text-white"
          >
            Form research team
          </button>
        </div>
      )}
    </motion.article>
  );
}

/* ---------------- 7-stage horizontal dot tracker ---------------- */

function StageDots({ timeline }: { timeline: TimelineEvent[] }) {
  const currentIndex = timeline.findIndex((ev) => !ev.done);
  return (
    <div className="flex items-center" aria-label="Challenge stage progress">
      {timeline.map((ev, i) => {
        const meta = STAGE_META[ev.stage];
        const isCurrent = i === currentIndex;
        return (
          <span key={ev.stage} className="flex items-center" title={ev.stage}>
            {i > 0 && (
              <span
                className={cn(
                  "h-[2px] w-2.5 rounded-full",
                  ev.done ? "bg-brand/45" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                !ev.done && !isCurrent && "bg-secondary",
                isCurrent && "animate-pulse"
              )}
              style={
                ev.done
                  ? { background: "#0E8A6D" }
                  : isCurrent
                    ? { background: meta.color }
                    : undefined
              }
            />
          </span>
        );
      })}
      <span className="ml-2 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-soft/60">
        7-stage lifecycle
      </span>
    </div>
  );
}
