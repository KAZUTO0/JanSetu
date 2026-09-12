"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Award, FlaskConical, Mail, Phone, Info, GraduationCap } from "lucide-react";
import { useApp } from "@/lib/store";
import { heiById } from "@/lib/data/heis";
import { SectionHeader } from "@/components/shared/kit";
import { AnimatedNumber, compactIN } from "@/components/shared/AnimatedNumber";
import { RolePreviewCard } from "@/components/shell/RolePreviewCard";
import { HeiPageHeader, InitialsTile, MY_HEI_ID } from "./parts";

export function HeiProfileView() {
  const toast = useApp((s) => s.toast);
  const hei = React.useMemo(() => heiById(MY_HEI_ID), []);

  const stats: { value: number; label: string; format?: (n: number) => string }[] = [
    { value: hei.facultyCount, label: "Faculty" },
    { value: hei.studentsCount, label: "Students", format: compactIN },
    { value: 6, label: "Active projects" },
    { value: 5, label: "Deployments" },
  ];

  return (
    <div className="pt-1">
      <HeiPageHeader eyebrow={hei.shortName} title="Profile" />

      {/* Institution card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="px-4 pt-2"
      >
        <div className="rounded-3xl bg-card p-5 shadow-float">
          <div className="flex items-center gap-4">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] text-[20px] font-extrabold tracking-tight text-white shadow-float"
              style={{ background: hei.color }}
            >
              BM
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-extrabold leading-tight tracking-[-0.015em] text-ink">
                {hei.name}
              </h2>
              <p className="mt-1 text-[12px] text-ink-soft">
                {hei.type} · {hei.city}
              </p>
              {hei.nirfRank && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#E0A538]/14 px-2 py-0.5 text-[10.5px] font-bold text-[#B07E1E]">
                  <Award size={11} strokeWidth={2.4} />
                  #{hei.nirfRank} NIRF
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border/70 pt-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="nums text-[16px] font-extrabold leading-none text-ink">
                  <AnimatedNumber value={s.value} format={s.format} duration={1.05} />
                </p>
                <p className="mt-1.5 text-[9px] font-bold uppercase leading-tight tracking-[0.05em] text-ink-soft">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Departments */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-soft/60">
              Departments
            </span>
            {hei.departments.map((d) => (
              <span
                key={d}
                className="rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-semibold text-ink-soft"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strengths */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.08 }}
        className="pt-5"
      >
        <SectionHeader title="Strengths" sub="Capability profile used for matching" />
        <div className="px-4">
          <div className="rounded-3xl bg-card p-4 shadow-float">
            <div className="flex flex-wrap gap-1.5">
              {hei.strengths.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-brand-mist px-2.5 py-1 text-[11px] font-semibold text-brand-deep"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-secondary/70 p-3">
              <FlaskConical size={16} strokeWidth={2.2} className="shrink-0 text-brand" />
              <p className="text-[11.5px] leading-snug text-ink-soft">
                Research facilities — central instrumentation lab, water-quality
                lab & drone survey unit on campus (simulated)
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prototype controls */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.16 }}
        className="pt-5"
      >
        <SectionHeader
          title="Prototype controls"
          sub="Switch the full experience between roles"
        />
        <RolePreviewCard />
      </motion.div>

      {/* Coordination cell */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.24 }}
        className="pt-5"
      >
        <SectionHeader title="Coordination cell" sub="Institutional interface for JanSetu" />
        <div className="px-4">
          <div className="rounded-3xl bg-card p-4 shadow-float">
            <div className="flex items-center gap-3">
              <InitialsTile initials="AS" color="#0E8A6D" size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-ink">Dr. Ananya Sen</p>
                <p className="text-[11.5px] text-ink-soft">
                  Coordination Lead · responds within 1 working day
                </p>
              </div>
              <GraduationCap size={18} strokeWidth={2.1} className="shrink-0 text-ink-soft/50" />
            </div>
            <div className="mt-3 flex gap-2.5">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  toast(
                    "Email simulated",
                    "Coordination cell email is mocked in this prototype"
                  )
                }
                className="tap flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand py-2.5 text-[12.5px] font-bold text-white"
              >
                <Mail size={14} strokeWidth={2.4} />
                Email
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  toast("Call simulated", "Contact number is mocked in this prototype")
                }
                className="tap flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-secondary py-2.5 text-[12.5px] font-bold text-ink"
              >
                <Phone size={14} strokeWidth={2.4} />
                Call
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* About / disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
        className="px-4 pt-5"
      >
        <div className="flex items-start gap-3 rounded-3xl bg-secondary/60 p-4">
          <Info size={15} strokeWidth={2.3} className="mt-0.5 shrink-0 text-ink-soft" />
          <p className="text-[11px] leading-relaxed text-ink-soft">
            JanSetu Innovation Hub is a UI prototype. Institution names —
            including BIT Mesra — are used for realism only; no actual
            partnership, endorsement or affiliation is implied. All challenges,
            projects, messages and metrics are simulated.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
