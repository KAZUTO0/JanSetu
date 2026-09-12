"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FolderKanban, IndianRupee, CalendarClock, Building2, Info } from "lucide-react";
import { useApp } from "@/lib/store";
import { projectsForHei } from "@/lib/data/projects";
import { FeedSkeleton, EmptyState } from "@/components/shared/kit";
import {
  HeiPageHeader,
  StatTile,
  ProjectStageBadge,
  AvatarStack,
  Bar,
  useDelayedReady,
  listStagger,
  riseItem,
  MY_HEI_ID,
} from "./parts";

export function HeiProjectsView() {
  const push = useApp((s) => s.push);
  const ready = useDelayedReady(800);

  const projects = React.useMemo(() => projectsForHei(MY_HEI_ID), []);

  return (
    <div className="pt-1">
      <HeiPageHeader
        title="Projects"
        sub="Active research → deployment projects"
      />

      {/* Portfolio stat tiles (mock institution-wide totals) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="flex gap-3 px-4 pt-2"
      >
        <StatTile
          value={6}
          label="Active projects"
          accent
          icon={<FolderKanban size={15} strokeWidth={2.3} />}
        />
        <StatTile
          value={86}
          label="Sanctioned"
          format={(n) => `₹${Math.round(n)}L`}
        />
        <StatTile
          value={14}
          label="Industry partners"
          icon={<Building2 size={15} strokeWidth={2.3} />}
        />
      </motion.div>

      {/* Project cards */}
      {!ready ? (
        <FeedSkeleton count={2} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={22} strokeWidth={2.2} />}
          title="No live workspaces"
          sub="Accept a challenge and form a team to open your first project workspace."
        />
      ) : (
        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="pt-4"
        >
          {projects.map((p) => (
            <motion.article
              key={p.id}
              variants={riseItem}
              onClick={() => push({ type: "project", projectId: p.id })}
              className="tap mx-4 mb-3 cursor-pointer rounded-3xl bg-card p-4 shadow-float"
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] text-ink-soft">
                  {p.code}
                </span>
                <ProjectStageBadge stage={p.stage} />
              </div>

              <h3 className="mt-2 text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-ink">
                {p.title}
              </h3>

              {/* Progress */}
              <div className="mt-3">
                <Bar value={p.progress} />
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="nums font-bold text-brand-deep">
                    {p.progress}% · {p.stage}
                  </span>
                  <span className="flex items-center gap-1 text-ink-soft">
                    <CalendarClock size={11} strokeWidth={2.3} />
                    ETA {p.eta}
                  </span>
                </div>
              </div>

              {/* Team + funding */}
              <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-border/70 pt-3">
                <AvatarStack members={p.team} />
                <span className="flex items-center gap-1 text-[11px] font-semibold text-ink-soft">
                  <IndianRupee size={11} strokeWidth={2.4} />
                  Sanctioned ₹{p.funding.sanctioned}L · Spent ₹{p.funding.spent}L
                </span>
              </div>

              {/* Industry partners */}
              {p.industryPartners.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {p.industryPartners.map((ip) => (
                    <span
                      key={ip.name}
                      className="inline-flex items-center gap-1 rounded-full bg-[#E0A538]/14 px-2 py-1 text-[10px] font-semibold text-[#B07E1E]"
                    >
                      <Building2 size={10} strokeWidth={2.4} />
                      {ip.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}

          {/* Demo dataset note */}
          {projects.length < 6 && (
            <motion.div
              variants={riseItem}
              className="mx-4 mt-1 flex items-start gap-2.5 rounded-2xl bg-secondary/70 p-3"
            >
              <Info size={13} strokeWidth={2.3} className="mt-0.5 shrink-0 text-ink-soft" />
              <p className="text-[10.5px] leading-relaxed text-ink-soft">
                Demo dataset — a live workspace is available for {projects.length}{" "}
                of your 6 active projects. Totals above reflect the full
                institutional portfolio (simulated).
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
