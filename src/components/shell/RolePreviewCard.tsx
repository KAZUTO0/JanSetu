"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Landmark, GraduationCap, Factory, Check, MousePointerClick } from "lucide-react";
import { useApp, ROLE_META } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLE_LIST: { id: Role; icon: React.ElementType; blurb: string }[] = [
  { id: "citizen", icon: Users, blurb: "Report problems, follow progress" },
  { id: "government", icon: Landmark, blurb: "Dashboard, allocation & analytics" },
  { id: "hei", icon: GraduationCap, blurb: "Discover challenges, run projects" },
  { id: "industry", icon: Factory, blurb: "Fund, build & scale solutions" },
];

/**
 * "Prototype Role Preview" — instantly switches the entire app experience
 * between Citizen / Government / HEI / Industry. Prototype-only affordance.
 */
export function RolePreviewCard({ compact = false }: { compact?: boolean }) {
  const { role, setRole, toast } = useApp();

  return (
    <div className="px-4">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-[1px]">
        <div className="rounded-[23px] bg-card p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-mist text-brand">
                <MousePointerClick size={15} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[14.5px] font-bold tracking-[-0.01em] text-ink">
                  Prototype Role Preview
                </p>
                {!compact && (
                  <p className="text-[11.5px] text-ink-soft">
                    Instantly switch the full experience
                  </p>
                )}
              </div>
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-ink-soft">
              Demo
            </span>
          </div>

          <div className="space-y-1.5">
            {ROLE_LIST.map((r) => {
              const active = role === r.id;
              const Icon = r.icon;
              return (
                <motion.button
                  key={r.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (active) return;
                    setRole(r.id);
                    toast(
                      `${ROLE_META[r.id].label} view`,
                      `You are now previewing the ${ROLE_META[r.id].label.toLowerCase()} experience`
                    );
                  }}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    active ? "bg-brand-mist" : "hover:bg-secondary/70"
                  )}
                >
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="role-active-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-2xl bg-brand-mist"
                      />
                    )}
                  </AnimatePresence>
                  <span
                    className={cn(
                      "relative grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors",
                      active ? "bg-brand text-white" : "bg-secondary text-ink-soft"
                    )}
                  >
                    <Icon size={17} strokeWidth={2.1} />
                  </span>
                  <span className="relative flex-1">
                    <span
                      className={cn(
                        "block text-[13.5px] font-bold",
                        active ? "text-brand-deep" : "text-ink"
                      )}
                    >
                      {ROLE_META[r.id].label}
                    </span>
                    <span className="block text-[11px] leading-tight text-ink-soft">
                      {r.blurb}
                    </span>
                  </span>
                  {active && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="relative grid h-5 w-5 place-items-center rounded-full bg-brand text-white"
                    >
                      <Check size={11} strokeWidth={3.2} />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <p className="mt-3 text-center text-[10px] leading-relaxed text-ink-soft/80">
            Prototype only · navigation & data change with role · no real accounts
          </p>
        </div>
      </div>
    </div>
  );
}
