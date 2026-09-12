"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Compass, MapPin, MessageCircle, Users } from "lucide-react";
import { OPPORTUNITIES } from "@/lib/data/opportunities";
import { CHALLENGES } from "@/lib/data/challenges";
import { useApp } from "@/lib/store";
import { DetailView } from "@/components/shell/DetailView";
import { CategoryChip, EmptyState } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import {
  ExpressInterestSheet,
  conversationForOpportunity,
  heiFor,
  initialsOf,
  renderAmounts,
  StageChip,
  SUPPORT_META,
  useSheetHost,
} from "@/components/industry/parts";

export function OpportunityDetailView({ opportunityId }: { opportunityId: string }) {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const toast = useApp((s) => s.toast);
  const expressed = useApp((s) => s.expressedInterestIds.includes(opportunityId));

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [rootRef, sheetHost] = useSheetHost();

  const opp = OPPORTUNITIES.find((o) => o.id === opportunityId);

  if (!opp) {
    return (
      <DetailView title="Opportunity" onBack={pop} bare>
        <EmptyState
          icon={<Compass size={22} />}
          title="Opportunity not found"
          sub="This opportunity is no longer available (mock data)."
          action={
            <button
              onClick={pop}
              className="tap h-10 rounded-2xl bg-ink px-5 text-[13px] font-semibold text-white"
            >
              Go back
            </button>
          }
        />
      </DetailView>
    );
  }

  const hei = heiFor(opp);
  const challenge = CHALLENGES.find((c) => c.code === opp.challengeCode);
  const conv = conversationForOpportunity(opp);

  const messageHei = () => {
    if (conv) {
      push({ type: "chat", conversationId: conv.id });
    } else {
      toast("Chat not available", `No synced conversation with ${opp.heiShort} yet (mock)`);
    }
  };

  const viewChallenge = () => {
    if (challenge) {
      push({ type: "challenge", challengeId: challenge.id });
    } else {
      toast("Challenge unavailable", "This challenge is not synced in the prototype yet");
    }
  };

  return (
    <DetailView title={opp.title} eyebrow={opp.challengeCode} onBack={pop}>
      <div ref={rootRef} className="pb-2">
        {/* Hero */}
        <section className="mx-4 mt-1 rounded-3xl bg-card p-5 shadow-float">
          <div className="flex flex-wrap items-center gap-2">
            <StageChip stage={opp.stage} />
            <CategoryChip category={opp.category} />
          </div>

          <h2 className="mt-3 text-[19px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {opp.title}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{opp.summary}</p>

          <div className="mt-4 flex items-center gap-3.5 rounded-2xl bg-brand-mist p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-white">
              <Users size={19} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-[24px] font-extrabold leading-none tracking-[-0.02em] text-brand-deep">
                <AnimatedNumber
                  value={opp.socialReach}
                  format={(n) => Math.round(n).toLocaleString("en-IN")}
                />
              </p>
              <p className="mt-1 text-[11.5px] font-semibold text-brand-deep/70">
                citizens stand to benefit
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-1.5">
            <MapPin size={13} strokeWidth={2.2} className="shrink-0 text-brand" />
            <p className="text-[12.5px] font-semibold text-ink-soft">
              {opp.district} · Jharkhand
            </p>
          </div>
        </section>

        {/* Needs */}
        <section className="mx-4 mt-4 rounded-3xl bg-card p-5 shadow-float">
          <p className="text-[15px] font-bold tracking-[-0.01em] text-ink">
            What this innovation needs
          </p>
          <div className="mt-3.5 space-y-4">
            {opp.needs.map((need) => {
              const Icon = SUPPORT_META[need.type].icon;
              return (
                <div key={need.type} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand-deep">
                    <Icon size={17} strokeWidth={2.1} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-ink">{need.type}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft">
                      {renderAmounts(need.detail)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* HEI partner */}
        <section className="mx-4 mt-4 rounded-3xl bg-card p-5 shadow-float">
          <p className="text-[15px] font-bold tracking-[-0.01em] text-ink">Research partner</p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[13px] font-bold text-white"
              style={{ background: hei?.color ?? "#0E8A6D" }}
            >
              {initialsOf(hei?.shortName ?? opp.heiShort)}
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold leading-tight text-ink">{opp.heiFull}</p>
              <p className="mt-0.5 text-[11.5px] text-ink-soft">
                {hei ? `${hei.city} · ${hei.type}` : "Jharkhand"}
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={messageHei}
            className="tap mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[13px] font-bold text-white shadow-float"
          >
            <MessageCircle size={15} strokeWidth={2.3} />
            Message HEI
          </motion.button>
        </section>

        {/* Challenge context */}
        <section className="mx-4 mt-4 rounded-3xl bg-card p-5 shadow-float">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand">
            From citizen challenge {opp.challengeCode}
          </p>
          <p className="mt-2 text-[13.5px] font-bold leading-snug text-ink">
            {challenge ? challenge.title : "Challenge sync pending"}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
            {challenge
              ? `${challenge.district} district · reported ${challenge.reportedAgo} · ${challenge.reportsCount} citizen reports`
              : "This challenge code is not synced in the prototype yet."}
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={viewChallenge}
            className="tap mt-3.5 flex h-10 w-full items-center justify-center gap-1.5 rounded-2xl bg-secondary text-[12.5px] font-bold text-ink"
          >
            View challenge
            <ChevronRight size={14} strokeWidth={2.5} />
          </motion.button>
        </section>

        <p className="mt-5 px-6 text-center text-[10.5px] leading-relaxed text-ink-soft/70">
          Simulated pipeline — no real partnership implied
        </p>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 z-20 mt-5">
          <div className="glass border-t border-border/70 px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-3">
            {expressed ? (
              <span className="flex h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-mist text-[13.5px] font-bold text-brand-deep">
                <Check size={16} strokeWidth={2.6} />
                Interest expressed
              </span>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setSheetOpen(true)}
                className="h-12 w-full rounded-2xl bg-brand text-[14px] font-bold text-white shadow-float"
              >
                Express Interest
              </motion.button>
            )}
          </div>
        </div>

        <ExpressInterestSheet
          opportunity={sheetOpen ? opp : null}
          onClose={() => setSheetOpen(false)}
          host={sheetHost}
        />
      </div>
    </DetailView>
  );
}
