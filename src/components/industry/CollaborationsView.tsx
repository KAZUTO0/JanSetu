"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Handshake,
  Link2,
  MessageCircle,
} from "lucide-react";
import type { Collaboration } from "@/lib/types";
import { COLLABORATIONS, MY_COMPANY } from "@/lib/data/opportunities";
import { useApp } from "@/lib/store";
import { EmptyState, FeedSkeleton } from "@/components/shared/kit";
import { BottomSheet, SPRING } from "@/components/shared/BottomSheet";
import {
  AMBER,
  AMBER_SOFT,
  IndustryHeader,
  LIST_VARIANTS,
  CARD_VARIANTS,
  SheetPortal,
  StatsRow,
  conversationForHei,
  initialsOf,
  SUPPORT_META,
  useSheetHost,
} from "@/components/industry/parts";
import { cn } from "@/lib/utils";

const SEGS = ["All", "In discussion", "MOU signed", "Active"] as const;
type Seg = (typeof SEGS)[number];

const STEPS = ["Discussion", "MOU", "Active"];

const STATUS_META: Record<Collaboration["status"], { chip: string; step: number }> = {
  "In discussion": { chip: "bg-secondary text-ink-soft", step: 1 },
  "MOU signed": { chip: "bg-[rgba(224,165,56,0.16)] text-[#D98A1F]", step: 2 },
  Active: { chip: "bg-brand-mist text-brand-deep", step: 3 },
};

/** Mock detail copy for the collaboration sheet. */
const COLLAB_DETAILS: Record<string, { description: string; steps: { label: string; done: boolean }[] }> = {
  "col-1": {
    description:
      "Co-manufacturing agreement for FluorideSafe sensor nodes and filter cartridges at 500-unit volume. Tooling costs are shared; BIT Mesra retains the design IP.",
    steps: [
      { label: "Site visit to Petarwar cluster", done: true },
      { label: "Finalise tooling cost split", done: false },
      { label: "First production batch of 50 nodes", done: false },
    ],
  },
  "col-2": {
    description:
      "Distribution and agronomy operations for the CropGuard farmer pilot across Ramgarh's tomato belt — training days, input-dealer linkage and usage analytics.",
    steps: [
      { label: "Onboard 10,000 farmers for kharif", done: false },
      { label: "Mandi integration pilot", done: false },
      { label: "Quarterly agronomy review", done: true },
    ],
  },
  "col-3": {
    description:
      "GreenGrid offtakes the segregated wet-waste stream from the Segrego network for its waste-to-energy line, with a guaranteed 210 T/month supply and revenue share to the collector cooperative.",
    steps: [
      { label: "Commission MRF line 2", done: true },
      { label: "Sign city replication MOUs", done: false },
      { label: "Publish offtake impact note", done: false },
    ],
  },
  "col-4": {
    description:
      "Proposed assembly and maintenance contract for MatriCare maternal health kits, covering calibration, spare parts and ASHA worker training support.",
    steps: [
      { label: "Share assembly cost sheet", done: false },
      { label: "Visit CU Jharkhand labs", done: true },
      { label: "Draft MOU text", done: false },
    ],
  },
  "col-5": {
    description:
      "Curriculum co-design for a youth skilling bridge connecting NIT Jamshedpur graduates with Adityapur industrial units, with shopfloor exposure and certification.",
    steps: [
      { label: "Map 12 pilot units", done: false },
      { label: "Define curriculum outline", done: false },
    ],
  },
};

function CollabCard({
  collab,
  onOpen,
}: {
  collab: Collaboration;
  onOpen: () => void;
}) {
  const status = STATUS_META[collab.status];
  const SupportIcon = SUPPORT_META[collab.supportType].icon;
  const isYou = collab.partner === MY_COMPANY.name;

  return (
    <motion.article
      variants={CARD_VARIANTS}
      onClick={onOpen}
      className="tap mx-4 mb-3.5 cursor-pointer rounded-3xl bg-card p-4 shadow-float"
    >
      {/* Industry partner (you) */}
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-[10.5px] font-bold text-white">
          {initialsOf(collab.partner)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-[12.5px] font-bold text-ink">
            <span className="truncate">{collab.partner}</span>
            {isYou && (
              <span className="shrink-0 rounded-full bg-brand-mist px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-brand-deep">
                You
              </span>
            )}
          </p>
          <p className="text-[10.5px] text-ink-soft">Industry partner</p>
        </div>
      </div>

      {/* Link */}
      <div className="my-2.5 flex items-center gap-2">
        <span className="h-px flex-1 bg-border" />
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-mist text-brand">
          <Link2 size={12} strokeWidth={2.3} />
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* HEI */}
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-[10.5px] font-bold text-ink-soft">
          {initialsOf(collab.hei)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-bold text-ink">{collab.hei}</p>
          <p className="text-[10.5px] text-ink-soft">Research partner</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
            status.chip
          )}
        >
          {collab.status}
        </span>
      </div>

      <p className="mt-3 text-[14px] font-bold leading-snug tracking-[-0.01em] text-ink">
        {collab.title}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
          <SupportIcon size={11} strokeWidth={2.2} />
          {collab.supportType}
        </span>
        {collab.valueLakh !== undefined && (
          <span
            className="nums inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold"
            style={{ background: AMBER_SOFT, color: AMBER }}
          >
            ₹{collab.valueLakh.toFixed(1)}L
          </span>
        )}
        <span className="text-[10.5px] font-medium text-ink-soft/80">
          since {collab.since}
        </span>
      </div>

      {/* Progress mini-steps */}
      <div className="mt-3 flex items-center">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <span
                className={cn(
                  "mx-1.5 h-px flex-1",
                  i < status.step ? "bg-brand/40" : "bg-border"
                )}
              />
            )}
            <span className="flex items-center gap-1">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i < status.step ? "bg-brand" : "bg-border"
                )}
              />
              <span
                className={cn(
                  "text-[9.5px] font-bold",
                  i < status.step ? "text-brand-deep" : "text-ink-soft/50"
                )}
              >
                {label}
              </span>
            </span>
          </React.Fragment>
        ))}
      </div>
    </motion.article>
  );
}

function CollabDetailSheet({
  collab,
  onClose,
  host,
}: {
  collab: Collaboration | null;
  onClose: () => void;
  host: HTMLElement | null;
}) {
  const push = useApp((s) => s.push);
  const toast = useApp((s) => s.toast);
  const detail = collab ? COLLAB_DETAILS[collab.id] : undefined;
  const SupportIcon = collab ? SUPPORT_META[collab.supportType].icon : null;

  const messageHei = () => {
    if (!collab) return;
    const conv = conversationForHei(collab.hei);
    if (conv) {
      onClose();
      push({ type: "chat", conversationId: conv.id });
    } else {
      toast("Chat not available", `No synced conversation with ${collab.hei} yet (mock)`);
    }
  };

  return (
    <SheetPortal host={host}>
      <BottomSheet
        open={!!collab}
        onClose={onClose}
        title={collab?.title}
        subtitle={collab ? `${collab.partner} · ${collab.hei}` : undefined}
      >
        {collab && (
          <div className="pb-2 pt-1">
            {/* Both parties */}
            <div className="rounded-2xl bg-secondary/50 p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                Industry partner
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[13.5px] font-bold text-ink">
                {collab.partner}
                {collab.partner === MY_COMPANY.name && (
                  <span className="rounded-full bg-brand-mist px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-brand-deep">
                    You
                  </span>
                )}
              </p>
              <div className="my-2.5 flex items-center gap-2">
                <span className="h-px flex-1 bg-border" />
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-mist text-brand">
                  <Link2 size={12} strokeWidth={2.3} />
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                Research partner
              </p>
              <p className="mt-1 text-[13.5px] font-bold text-ink">{collab.hei}</p>
            </div>

            {/* Description */}
            <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
              {detail?.description ?? `${collab.supportType} partnership on ${collab.title}.`}
            </p>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {SupportIcon && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                  <SupportIcon size={11} strokeWidth={2.2} />
                  {collab.supportType}
                </span>
              )}
              {collab.valueLakh !== undefined && (
                <span
                  className="nums inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold"
                  style={{ background: AMBER_SOFT, color: AMBER }}
                >
                  ₹{collab.valueLakh.toFixed(1)}L
                </span>
              )}
              <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                {collab.stage} stage
              </span>
              <span className="text-[10.5px] font-medium text-ink-soft/80">
                since {collab.since}
              </span>
            </div>

            {/* Next steps checklist */}
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Next steps
            </p>
            <div className="mt-2 space-y-2">
              {(detail?.steps ?? []).map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 rounded-2xl bg-secondary/50 px-3 py-2.5"
                >
                  {s.done ? (
                    <CheckCircle2 size={16} strokeWidth={2.2} className="shrink-0 text-brand" />
                  ) : (
                    <Circle size={16} strokeWidth={2.2} className="shrink-0 text-ink-soft/50" />
                  )}
                  <span
                    className={cn(
                      "text-[12.5px] font-semibold",
                      s.done ? "text-ink-soft" : "text-ink"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={messageHei}
              className="tap mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[13px] font-bold text-white shadow-float"
            >
              <MessageCircle size={15} strokeWidth={2.3} />
              Message HEI
            </motion.button>
          </div>
        )}
      </BottomSheet>
    </SheetPortal>
  );
}

export function IndustryCollaborationsView() {
  const [seg, setSeg] = React.useState<Seg>("All");
  const [loading, setLoading] = React.useState(true);
  const [openCollab, setOpenCollab] = React.useState<Collaboration | null>(null);
  const [rootRef, sheetHost] = useSheetHost();

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = React.useMemo(
    () => (seg === "All" ? COLLABORATIONS : COLLABORATIONS.filter((c) => c.status === seg)),
    [seg]
  );

  const activeCount = COLLABORATIONS.filter((c) => c.status === "Active").length;
  const activeValue = COLLABORATIONS.filter((c) => c.status === "Active").reduce(
    (sum, c) => sum + (c.valueLakh ?? 0),
    0
  );

  return (
    <div ref={rootRef} className="pb-2">
      <IndustryHeader
        title="Collaborations"
        sub="Your partnerships with institutions"
      />

      <StatsRow
        items={[
          { value: COLLABORATIONS.length, label: "Collaborations" },
          { value: activeCount, label: "Active", tone: "brand" },
          {
            value: activeValue,
            label: "Value (mock)",
            format: (n) => `₹${n.toFixed(1)}L`,
            tone: "amber",
          },
        ]}
      />

      {/* Segmented filter */}
      <div className="mx-4 mt-4 flex rounded-2xl bg-secondary/70 p-1">
        {SEGS.map((s) => {
          const active = seg === s;
          return (
            <button
              key={s}
              onClick={() => setSeg(s)}
              className="relative flex-1 rounded-xl px-1 py-2 text-[11px] font-bold"
            >
              {active && (
                <motion.span
                  layoutId="collab-seg-pill"
                  transition={SPRING}
                  className="absolute inset-0 rounded-xl bg-card shadow-float"
                />
              )}
              <span className={cn("relative", active ? "text-ink" : "text-ink-soft")}>{s}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        {loading ? (
          <FeedSkeleton count={3} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Handshake size={22} />}
            title="Nothing here yet"
            sub={`No collaborations under "${seg}" right now.`}
            action={
              <button
                onClick={() => setSeg("All")}
                className="tap h-10 rounded-2xl bg-ink px-5 text-[13px] font-semibold text-white"
              >
                Show all
              </button>
            }
          />
        ) : (
          <motion.div variants={LIST_VARIANTS} initial="hidden" animate="show">
            {filtered.map((c) => (
              <CollabCard key={c.id} collab={c} onOpen={() => setOpenCollab(c)} />
            ))}
          </motion.div>
        )}
      </div>

      <CollabDetailSheet
        collab={openCollab}
        onClose={() => setOpenCollab(null)}
        host={sheetHost}
      />
    </div>
  );
}
