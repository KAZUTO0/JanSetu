"use client";

import { motion } from "framer-motion";
import {
  Check,
  Compass,
  FileQuestion,
  Handshake,
  Info,
  MapPin,
  Quote,
  Share2,
  Star,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { impactById } from "@/lib/data/impact";
import type { ImpactStory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DetailView } from "@/components/shell/DetailView";
import { CategoryIcon, CoverImage, EmptyState, SectionHeader } from "@/components/shared/kit";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import {
  DemoChip,
  DeployedChip,
  EASE,
  ImageChip,
  MetricCard,
  parseHeadline,
  reveal,
  StorySkeleton,
  initialsOf,
  useSkeletonDelay,
} from "./parts";

/* ============================================================
   Impact story detail — before/after outcome view (demo data)
   ============================================================ */

type JourneyStep = ImpactStory["journey"][number];

function TimelineRow({ step, isImpact, index }: { step: JourneyStep; isImpact: boolean; index: number }) {
  return (
    <motion.div
      className="relative flex items-center gap-3.5"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: EASE }}
    >
      <span
        className={cn(
          "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white",
          isImpact ? "bg-[#E0A538]" : "bg-brand"
        )}
      >
        {isImpact ? (
          <Star size={12} strokeWidth={2.5} fill="currentColor" />
        ) : (
          <Check size={13} strokeWidth={3} />
        )}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="text-[13px] font-semibold text-ink">{step.stage}</p>
          {isImpact && (
            <span className="shrink-0 rounded-full bg-[#F6EDD8] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#B07E22]">
              Impact achieved
            </span>
          )}
        </div>
        <p className="nums shrink-0 text-[11px] font-medium text-ink-soft">{step.date}</p>
      </div>
    </motion.div>
  );
}

function PartnerTile({
  initials,
  name,
  role,
  tone,
}: {
  initials: string;
  name: string;
  role: string;
  tone: "brand" | "amber";
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-secondary/60 p-2.5">
      <span
        className={cn(
          "nums grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[12px] font-extrabold",
          tone === "brand" ? "bg-brand-mist text-brand-deep" : "bg-[#F6EDD8] text-[#B07E22]"
        )}
      >
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[12px] font-bold leading-tight text-ink">{name}</p>
        <p className="mt-0.5 text-[10px] font-medium leading-tight text-ink-soft">{role}</p>
      </div>
    </div>
  );
}

function StoryBody({ story }: { story: ImpactStory }) {
  const { pop, toast } = useApp();
  const head = parseHeadline(story.headlineMetric);
  const share = () =>
    toast("Story link ready to share", "Prototype demo — nothing was actually sent");

  return (
    <div className="space-y-5 pt-1">
      {/* Hero card */}
      <motion.section {...reveal(0)} className="px-4">
        <div className="card-hairline overflow-hidden rounded-3xl bg-card shadow-float">
          <CoverImage src={story.image} alt={story.title} ratio="aspect-[16/9]">
            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              <ImageChip icon={<CategoryIcon category={story.category} size={12} />}>
                {story.category}
              </ImageChip>
              <ImageChip icon={<MapPin size={11} strokeWidth={2.2} className="text-ink-soft" />}>
                {story.district}
              </ImageChip>
            </div>
            <div className="absolute bottom-3 left-3">
              <DeployedChip text={story.deployedAgo} onImage />
            </div>
          </CoverImage>
          <div className="p-5">
            <p className="flex flex-wrap items-baseline gap-x-2">
              {head.num !== null ? (
                <>
                  <span className="nums text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-brand">
                    <AnimatedNumber value={head.num} duration={1.3} />
                  </span>
                  <span className="text-[15px] font-bold text-brand/85">{head.suffix}</span>
                </>
              ) : (
                <span className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-brand">
                  {story.headlineMetric}
                </span>
              )}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{story.summary}</p>
          </div>
        </div>
      </motion.section>

      {/* Before → after metrics grid */}
      <motion.section {...reveal(0.08)}>
        <SectionHeader title="Before → after" sub="Ground measurements from this deployment" />
        <div className="grid grid-cols-2 gap-3 px-4">
          {story.metrics.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Journey timeline */}
      <motion.section {...reveal(0.1)}>
        <SectionHeader title="The journey" sub="From first report to verified impact" />
        <div className="px-4">
          <div className="card-hairline rounded-3xl bg-card p-5 shadow-float">
            <div className="relative">
              <motion.div
                className="absolute bottom-[14px] left-[13px] top-[14px] w-[2px] origin-top rounded-full bg-gradient-to-b from-[#C9D2CC] via-[#0E8A6D] to-[#E0A538]"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: 0.2, duration: 1.1, ease: EASE }}
              />
              <div className="space-y-[18px]">
                {story.journey.map((j, i) => (
                  <TimelineRow
                    key={j.stage}
                    step={j}
                    index={i}
                    isImpact={j.stage === "Impact"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Partners */}
      <motion.section {...reveal(0.1)}>
        <SectionHeader title="Solution team" sub="Research rigor, built with industrial scale" />
        <div className="px-4">
          <div className="card-hairline rounded-3xl bg-card p-4 shadow-float">
            <div className="flex items-stretch gap-2">
              <PartnerTile
                initials={initialsOf(story.partners.hei)}
                name={story.partners.hei}
                role="Research & prototype"
                tone="brand"
              />
              <div className="flex shrink-0 items-center justify-center px-0.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white shadow-float">
                  <Handshake size={15} strokeWidth={2.2} />
                </span>
              </div>
              <PartnerTile
                initials={initialsOf(story.partners.industry)}
                name={story.partners.industry}
                role="Scale & operations"
                tone="amber"
              />
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-snug text-ink-soft/80">
              <Info size={11} strokeWidth={2.2} className="mt-[1px] shrink-0" />
              Names used for realism — no actual partnership implied.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Quote */}
      <motion.section {...reveal(0.1)} className="px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#FBF7EE] p-5 shadow-float">
          <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#E0A538]/10" />
          <div className="relative flex items-start gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-mist text-brand">
              <Quote size={17} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium italic leading-relaxed text-ink">
                {`“${story.quote.text}”`}
              </p>
              <p className="mt-3 text-[12.5px] font-bold text-ink">{story.quote.author}</p>
              <p className="text-[11px] font-medium text-ink-soft">{story.quote.place}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Full narrative */}
      <motion.section {...reveal(0.1)}>
        <SectionHeader title="The full story" />
        <div className="px-4">
          <div className="card-hairline rounded-3xl bg-card p-5 shadow-float">
            <p className="text-[13.5px] leading-[1.7] text-ink/90">{story.story}</p>
          </div>
        </div>
      </motion.section>

      {/* Footer actions */}
      <motion.section {...reveal(0.1)} className="px-4">
        <div className="flex flex-col items-center gap-3.5">
          <DemoChip label="Prototype · demo data" />
          <div className="flex w-full gap-3">
            <button
              onClick={share}
              className="tap flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[13px] font-semibold text-ink shadow-float"
            >
              <Share2 size={15} strokeWidth={2.2} className="text-brand" />
              Share this story
            </button>
            <button
              onClick={pop}
              className="tap flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand text-[13px] font-semibold text-white shadow-float"
            >
              <Compass size={15} strokeWidth={2.2} />
              Explore all impact
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export function ImpactStoryDetailView({ storyId }: { storyId: string }) {
  const { pop, toast } = useApp();
  const ready = useSkeletonDelay();
  const story = impactById(storyId);

  if (!story) {
    return (
      <DetailView title="Impact story" eyebrow="Not found" onBack={pop}>
        <EmptyState
          icon={<FileQuestion size={22} className="text-ink-soft" />}
          title="Story not found"
          sub="This impact story is not part of the prototype dataset."
          action={
            <button
              onClick={pop}
              className="tap h-11 rounded-2xl bg-brand px-5 text-[13px] font-semibold text-white shadow-float"
            >
              Go back
            </button>
          }
        />
      </DetailView>
    );
  }

  return (
    <DetailView
      title={story.title}
      eyebrow={story.challengeCode}
      onBack={pop}
      headerRight={
        <button
          onClick={() => toast("Story link ready to share", "Prototype demo — nothing was actually sent")}
          aria-label="Share this story"
          className="tap ml-auto grid h-9 w-9 place-items-center rounded-full bg-card text-brand shadow-float"
        >
          <Share2 size={15} strokeWidth={2.3} />
        </button>
      }
    >
      {!ready ? <StorySkeleton /> : <StoryBody story={story} />}
    </DetailView>
  );
}
