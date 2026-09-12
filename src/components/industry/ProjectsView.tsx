"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronRight, FolderKanban, IndianRupee, Sparkles } from "lucide-react";
import type { Project } from "@/lib/types";
import { PROJECTS } from "@/lib/data/projects";
import { CHALLENGES } from "@/lib/data/challenges";
import { heiById } from "@/lib/data/heis";
import { MY_COMPANY } from "@/lib/data/opportunities";
import { useApp } from "@/lib/store";
import { CoverImage, SectionHeader, StageBadge } from "@/components/shared/kit";
import { TeamStack } from "@/components/industry/parts";
import { cn } from "@/lib/utils";

/** Projects GreenGrid is powering as an industry partner. */
function PartnerProjectCard({ project, index }: { project: Project; index: number }) {
  const push = useApp((s) => s.push);
  const challenge = CHALLENGES.find((c) => c.id === project.challengeId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => push({ type: "project", projectId: project.id })}
      className="tap mx-4 mb-4 cursor-pointer overflow-hidden rounded-3xl bg-card shadow-float"
    >
      <CoverImage
        src={challenge?.image ?? "/images/hero-landscape.png"}
        alt={project.title}
        ratio="aspect-[16/8]"
      >
        <span className="glass absolute left-2.5 top-2.5 rounded-full p-0.5">
          <StageBadge stage={project.stage} />
        </span>
        <span className="glass absolute right-2.5 top-2.5 rounded-full px-2 py-1 text-[10px] font-bold text-ink">
          {project.code}
        </span>
      </CoverImage>

      <div className="p-4">
        <h3 className="text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-ink">
          {project.title}
        </h3>
        <p className="mt-1 text-[11.5px] font-semibold text-ink-soft">
          {heiById(project.heiId).shortName} · started {project.started} · ETA {project.eta}
        </p>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold text-ink-soft">{project.stage}</span>
            <span className="nums text-[12px] font-extrabold text-brand-deep">
              {project.progress}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ delay: 0.25 + index * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-brand-soft to-brand-deep"
            />
          </div>
        </div>

        {/* Partner chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.industryPartners.map((ip) => (
            <span
              key={ip.name}
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-semibold",
                ip.name === MY_COMPANY.name
                  ? "bg-brand-mist text-brand-deep"
                  : "bg-secondary/80 text-ink-soft"
              )}
            >
              {ip.name} · {ip.role}
            </span>
          ))}
        </div>

        {/* Funding + team */}
        <div className="mt-3.5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <IndianRupee size={14} strokeWidth={2.3} className="shrink-0 text-[#D98A1F]" />
            <p className="nums text-[13px] font-bold text-ink">
              ₹{project.funding.spent}L
              <span className="font-semibold text-ink-soft"> of ₹{project.funding.sanctioned}L</span>
            </p>
          </div>
          <TeamStack team={project.team} />
        </div>
      </div>
    </motion.article>
  );
}

/** Compact watchlist row for other live projects on the hub. */
function WatchRow({ project, index }: { project: Project; index: number }) {
  const push = useApp((s) => s.push);

  return (
    <motion.button
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => push({ type: "project", projectId: project.id })}
      className="tap mx-4 mb-2.5 flex w-[calc(100%-32px)] items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-float"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft">
        <FolderKanban size={16} strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-ink">{project.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-ink-soft">
          {heiById(project.heiId).shortName} · {project.stage} · {project.progress}%
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <span
            className="block h-full rounded-full bg-brand/70"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      <ChevronRight size={16} strokeWidth={2.4} className="shrink-0 text-ink-soft/60" />
    </motion.button>
  );
}

export function IndustryProjectsView() {
  const push = useApp((s) => s.push);

  const mine = PROJECTS.filter((p) =>
    p.industryPartners.some((ip) => ip.name === MY_COMPANY.name)
  );
  const others = PROJECTS.filter(
    (p) => !p.industryPartners.some((ip) => ip.name === MY_COMPANY.name)
  );

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="px-4 pb-3 pt-5">
        <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          Projects
        </h1>
        <p className="mt-1.5 text-[12.5px] text-ink-soft">Deployments you&apos;re powering</p>
      </div>

      {/* GreenGrid projects */}
      <div>
        <SectionHeader title="Your deployments" sub={`${mine.length} live with GreenGrid as partner`} />
        {mine.map((p, i) => (
          <PartnerProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* Impact teaser */}
      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.98 }}
        onClick={() => push({ type: "impact" })}
        className="tap mx-4 mb-5 flex w-[calc(100%-32px)] items-center gap-3 rounded-3xl bg-ink p-4 text-left shadow-float"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10">
          <Sparkles size={19} strokeWidth={2.2} className="text-[#E0A538]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold tracking-[-0.01em] text-white">
            See measurable outcomes
          </p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-white/60">
            Impact stories from deployed solutions
          </p>
        </div>
        <ChevronRight size={16} strokeWidth={2.4} className="shrink-0 text-white/50" />
      </motion.button>

      {/* Watchlist */}
      <div>
        <SectionHeader title="Watchlist" sub="Other live projects on the hub" />
        {others.map((p, i) => (
          <WatchRow key={p.id} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}
