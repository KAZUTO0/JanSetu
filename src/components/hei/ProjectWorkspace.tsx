"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  UserPlus,
  Check,
  CheckCircle2,
  FileText,
  Table,
  Presentation,
  ChevronRight,
  Building2,
  CalendarCheck,
  CalendarClock,
  FolderKanban,
} from "lucide-react";
import { useApp } from "@/lib/store";
import type { Milestone, ProjectDocument } from "@/lib/types";
import { projectById } from "@/lib/data/projects";
import { challengeById } from "@/lib/data/challenges";
import { SectionHeader, ScoreRing, EmptyState, CategoryIcon } from "@/components/shared/kit";
import { DetailView } from "@/components/shell/DetailView";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import {
  ProjectStageBadge,
  MEMBER_TYPE_META,
  PROJECT_STAGE_ORDER,
  InitialsTile,
  Bar,
  memberTypeOf,
  initialsOf,
} from "./parts";
import { cn } from "@/lib/utils";

const DOC_ICONS: Record<string, React.ElementType> = {
  PDF: FileText,
  Sheet: Table,
  Deck: Presentation,
};

export function ProjectWorkspaceView({ projectId }: { projectId: string }) {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const toast = useApp((s) => s.toast);
  const teamFormedProjectIds = useApp((s) => s.teamFormedProjectIds);
  const formTeam = useApp((s) => s.formTeam);

  const project = projectById(projectId);

  if (!project) {
    return (
      <DetailView title="Project" eyebrow="Not found" onBack={pop}>
        <EmptyState
          icon={<FolderKanban size={22} strokeWidth={2.2} />}
          title="Project not found"
          sub="This project is not part of the demo dataset."
        />
      </DetailView>
    );
  }

  const challenge = challengeById(project.challengeId);
  const teamFormed = teamFormedProjectIds.includes(project.id);
  const doneCount = project.milestones.filter((m) => m.status === "done").length;
  const visibleUpdates = project.updates.slice(0, 3);
  const spentPct = Math.min(
    100,
    Math.round((project.funding.spent / project.funding.sanctioned) * 100)
  );

  const onFormTeam = () => {
    formTeam(project.id);
    toast(
      "Research team formed",
      `${project.team.length} members rostered for ${project.code} (simulated)`
    );
  };

  return (
    <DetailView title={project.title} eyebrow={project.code} onBack={pop}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        className="pt-1"
      >
        {/* 1 · Status hero */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          className="px-4 pt-1"
        >
          <div className="rounded-3xl bg-card p-5 shadow-float">
            <div className="flex items-center gap-4">
              <ScoreRing
                value={project.progress}
                size={84}
                stroke={7}
                label="done"
                color="#0E8A6D"
              />
              <div className="min-w-0 flex-1">
                <ProjectStageBadge stage={project.stage} />
                <div className="mt-2.5">
                  <Bar value={project.progress} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-soft">
                  <span className="flex items-center gap-1">
                    <CalendarCheck size={11} strokeWidth={2.3} />
                    Started {project.started}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarClock size={11} strokeWidth={2.3} />
                    ETA {project.eta}
                  </span>
                </div>
              </div>
            </div>

            {/* Funding strip */}
            <div className="mt-4 rounded-2xl bg-secondary/70 p-3.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-ink-soft">
                  Sanctioned{" "}
                  <span className="nums font-bold text-ink">
                    ₹
                    <AnimatedNumber
                      value={project.funding.sanctioned}
                      format={(n) => `${Math.round(n)}`}
                      duration={1}
                    />
                    L
                  </span>
                </span>
                <span className="text-ink-soft">
                  Spent{" "}
                  <span className="nums font-bold text-ink">
                    ₹
                    <AnimatedNumber
                      value={project.funding.spent}
                      format={(n) => (n % 1 === 0 ? `${n}` : n.toFixed(1))}
                      duration={1}
                    />
                    L
                  </span>
                </span>
              </div>
              <div className="mt-2.5">
                <Bar
                  value={spentPct}
                  height={4}
                  from="#E0A538"
                  to="#E0A538"
                  delay={0.3}
                />
              </div>
              <p className="mt-1.5 text-[10px] font-semibold text-ink-soft">
                {spentPct}% utilised
              </p>
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex gap-2.5">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  toast("Add update", "Update composer is simulated in this prototype")
                }
                className="tap flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand py-2.5 text-[13px] font-bold text-white"
              >
                <Plus size={15} strokeWidth={2.5} />
                Add update
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  toast("Invite member", "Invitations are simulated in this prototype")
                }
                className="tap flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-secondary py-2.5 text-[13px] font-bold text-ink"
              >
                <UserPlus size={15} strokeWidth={2.5} />
                Invite member
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* 2 · Research team */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          className="pt-5"
        >
          <SectionHeader
            title="Research team"
            sub={`${project.team.length} members`}
          />
          <div className="px-4">
            <div className="rounded-3xl bg-card p-4 shadow-float">
              {!teamFormed ? (
                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-brand-mist p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                    <UserPlus size={16} strokeWidth={2.3} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-bold text-brand-deep">
                      Team not formed yet
                    </p>
                    <p className="text-[10.5px] leading-snug text-ink-soft">
                      Roster the proposed members to activate this workspace
                    </p>
                  </div>
                  <button
                    onClick={onFormTeam}
                    className="tap shrink-0 rounded-full bg-brand px-3 py-1.5 text-[11.5px] font-bold text-white"
                  >
                    Form team
                  </button>
                </div>
              ) : (
                <div className="mb-3 flex items-center gap-1.5 text-[11.5px] font-semibold text-brand-deep">
                  <CheckCircle2 size={13} strokeWidth={2.4} className="text-brand" />
                  Team formed
                </div>
              )}

              <div className="space-y-3.5">
                {project.team.map((m) => {
                  const meta = MEMBER_TYPE_META[m.type];
                  return (
                    <div key={m.name} className="flex items-center gap-3">
                      <InitialsTile initials={m.initials} color={meta.color} size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-bold text-ink">
                          {m.name}
                        </p>
                        <p className="truncate text-[11.5px] text-ink-soft">
                          {m.role}
                          {m.dept ? ` · ${m.dept}` : ""}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold"
                        style={{ background: `${meta.color}1A`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 3 · Milestones */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          className="pt-5"
        >
          <SectionHeader
            title="Milestones"
            sub={`${doneCount}/${project.milestones.length} complete`}
          />
          <div className="px-4">
            <div className="rounded-3xl bg-card p-4 shadow-float">
              <MilestoneTimeline milestones={project.milestones} />
            </div>
          </div>
        </motion.section>

        {/* 4 · Documents */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          className="pt-5"
        >
          <SectionHeader
            title="Documents"
            sub={`${project.documents.length} files`}
          />
          <div className="px-4">
            <div className="rounded-3xl bg-card p-2 shadow-float">
              {project.documents.map((d) => (
                <DocumentRow key={d.name} doc={d} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* 5 · Updates feed */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          className="pt-5"
        >
          <SectionHeader
            title="Updates"
            action="View all"
            onAction={() =>
              toast("Updates archive", "Full history is simulated in this prototype")
            }
          />
          <div className="px-4">
            <div className="rounded-3xl bg-card p-4 shadow-float">
              {visibleUpdates.map((u, i) => {
                const type = memberTypeOf(project.team, u.author);
                const color = type ? MEMBER_TYPE_META[type].color : "#6E7A73";
                const initials = initialsOf(u.author);
                return (
                  <div
                    key={`${u.author}-${i}`}
                    className={cn(
                      "flex gap-3 py-3",
                      i > 0 && "border-t border-border/60",
                      i === 0 && "pt-0",
                      i === visibleUpdates.length - 1 && "pb-0"
                    )}
                  >
                    <InitialsTile initials={initials} color={color} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[12.5px] font-bold text-ink">
                          {u.author}
                        </p>
                        <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-ink-soft">
                          {u.role}
                        </span>
                        <span className="ml-auto shrink-0 text-[10px] text-ink-soft/80">
                          {u.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink">
                        {u.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* 6 · Industry partners */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          className="pt-5"
        >
          <SectionHeader title="Industry partners" />
          <div className="px-4">
            <div className="rounded-3xl bg-card p-4 shadow-float">
              <div className="space-y-3">
                {project.industryPartners.map((ip) => (
                  <div key={ip.name} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#E0A538]/14 text-[#B07E1E]">
                      <Building2 size={17} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-bold text-ink">
                        {ip.name}
                      </p>
                      <p className="truncate text-[11.5px] text-ink-soft">{ip.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-border/60 pt-3 text-[10.5px] text-ink-soft">
                Industry collaboration via JanSetu (demo)
              </p>
            </div>
          </div>
        </motion.section>

        {/* 7 · Linked challenge */}
        {challenge && (
          <motion.section
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            className="pt-5"
          >
            <SectionHeader title="Linked challenge" />
            <div className="px-4">
              <div className="rounded-3xl bg-card p-4 shadow-float">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary">
                    <CategoryIcon category={challenge.category} size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13.5px] font-bold leading-snug text-ink">
                      {challenge.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink-soft">
                      {challenge.code} · {challenge.district}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    push({ type: "challenge", challengeId: challenge.id })
                  }
                  className="tap mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-secondary py-2.5 text-[12.5px] font-bold text-ink"
                >
                  View challenge
                  <ChevronRight size={14} strokeWidth={2.6} />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>
    </DetailView>
  );
}

/* ---------------- Milestone timeline (grouped by project stage) ---------------- */

function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const groups = PROJECT_STAGE_ORDER.map((stage) => ({
    stage,
    items: milestones.filter((m) => m.stage === stage),
  })).filter((g) => g.items.length > 0);

  const total = milestones.length;

  return (
    <div>
      {groups.map((group) => (
        <div key={group.stage} className="mb-1 last:mb-0">
          <p className="mb-2.5 mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft/70">
            {group.stage}
          </p>
          <div className="space-y-0">
            {group.items.map((m) => {
              const isLastOverall = m.id === milestones[total - 1]?.id;
              return (
                <div key={m.id} className="flex gap-3.5">
                  {/* Rail */}
                  <div className="relative flex w-5 shrink-0 flex-col items-center">
                    {m.status === "done" && (
                      <span className="z-10 grid h-5 w-5 place-items-center rounded-full bg-brand text-white">
                        <Check size={11} strokeWidth={3.2} />
                      </span>
                    )}
                    {m.status === "active" && (
                      <span className="relative z-10 grid h-5 w-5 place-items-center">
                        <span className="absolute h-5 w-5 animate-ping rounded-full bg-[#E0A538]/50" />
                        <span className="relative h-3.5 w-3.5 rounded-full bg-[#E0A538]" />
                      </span>
                    )}
                    {m.status === "upcoming" && (
                      <span className="z-10 h-5 w-5 rounded-full border-2 border-border bg-card" />
                    )}
                    {!isLastOverall && (
                      <span
                        className={cn(
                          "absolute top-5 bottom-0 w-[2px]",
                          m.status === "done" ? "bg-brand/35" : "bg-border"
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn("min-w-0 flex-1", isLastOverall ? "pb-1" : "pb-5")}>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p
                        className={cn(
                          "text-[13.5px] font-bold leading-snug",
                          m.status === "upcoming" ? "text-ink-soft" : "text-ink"
                        )}
                      >
                        {m.title}
                      </p>
                      {m.status === "active" && (
                        <span className="rounded-full bg-[#E0A538]/14 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[#B07E1E]">
                          In progress
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] font-semibold text-ink-soft/80">
                      {m.date}
                    </p>
                    {m.note && (
                      <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
                        {m.note}
                      </p>
                    )}
                    {m.status === "active" && (
                      <div className="shimmer mt-2 h-1.5 w-full rounded-full bg-secondary" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Document row ---------------- */

function DocumentRow({ doc }: { doc: ProjectDocument }) {
  const Icon = DOC_ICONS[doc.kind] ?? FileText;
  const toast = useApp((s) => s.toast);
  return (
    <button
      onClick={() =>
        toast("Preview simulated", `${doc.name} would open in the viewer (demo)`)
      }
      className="tap flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-secondary/60"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-ink-soft">
        <Icon size={16} strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-ink">
          {doc.name}
        </span>
        <span className="block text-[10.5px] text-ink-soft">
          {doc.kind} · {doc.size}
        </span>
      </span>
      <ChevronRight size={15} strokeWidth={2.4} className="shrink-0 text-ink-soft/60" />
    </button>
  );
}
