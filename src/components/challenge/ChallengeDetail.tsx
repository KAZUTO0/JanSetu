"use client";

import * as React from "react";
import { SearchX, Share2 } from "lucide-react";
import type { HEIMatch, MediaItem } from "@/lib/types";
import { useApp } from "@/lib/store";
import { DetailView } from "@/components/shell/DetailView";
import { EmptyState, SectionHeader } from "@/components/shared/kit";
import {
  AboutCard,
  ActionBar,
  DetailSkeleton,
  DuplicatesCard,
  EvidenceCarousel,
  HeiMatchCard,
  HeroCard,
  ImpactStats,
  IntelligenceCard,
  JourneyCard,
  LocationCard,
  MatchSheet,
  PhotoSheet,
  Reveal,
  WhyScoreSheet,
} from "./parts";

/**
 * Challenge detail — pushed over every role's feed.
 * Rich dossier: hero, impact stats, evidence, location, lifecycle,
 * JanSetu Intelligence, duplicate detection and recommended HEIs.
 */
export function ChallengeDetailView({ challengeId }: { challengeId: string }) {
  const challenge = useApp((s) => s.challenges.find((c) => c.id === challengeId));
  const pop = useApp((s) => s.pop);
  const toast = useApp((s) => s.toast);
  const supported = useApp((s) => s.supportedIds.includes(challengeId));

  /* Mount skeleton (~700ms) before content staggers in */
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, [challengeId]);

  /* Bottom sheets */
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [matchOpen, setMatchOpen] = React.useState<HEIMatch | null>(null);
  const [photoOpen, setPhotoOpen] = React.useState<MediaItem | null>(null);

  /* Supporters count relative to the mount-time support state */
  const [initialSupported] = React.useState(supported);
  const supportersShown = challenge
    ? challenge.supporters + (supported ? 1 : 0) - (initialSupported ? 1 : 0)
    : 0;

  if (!challenge) {
    return (
      <DetailView title="Challenge" eyebrow="Not found" onBack={pop}>
        <EmptyState
          icon={<SearchX size={22} strokeWidth={2.2} />}
          title="Challenge not found"
          sub="This challenge may have been removed, or the link is no longer valid."
        />
      </DetailView>
    );
  }

  const doneStages = challenge.timeline.filter((e) => e.done).length;

  return (
    <DetailView
      title={challenge.title}
      eyebrow={challenge.code}
      onBack={pop}
      headerRight={
        <button
          onClick={() => toast("Link copied", `${challenge.code} · challenge link copied to clipboard`)}
          aria-label="Share challenge"
          className="tap grid h-9 w-9 place-items-center rounded-full bg-card text-brand shadow-float"
        >
          <Share2 size={16} strokeWidth={2.4} />
        </button>
      }
    >
      {!ready ? (
        <DetailSkeleton />
      ) : (
        <>
          {/* 1. Hero */}
          <Reveal>
            <HeroCard challenge={challenge} />
          </Reveal>

          {/* 2. Impact stats */}
          <Reveal delay={0.06}>
            <ImpactStats
              challenge={challenge}
              supportersShown={supportersShown}
              supported={supported}
            />
          </Reveal>

          {/* 3. About */}
          <Reveal delay={0.1}>
            <SectionHeader title="About this challenge" />
            <AboutCard challenge={challenge} />
          </Reveal>

          {/* 4. Evidence */}
          {challenge.media.length > 0 && (
            <Reveal delay={0.12}>
              <SectionHeader
                title="Field evidence"
                sub={`${challenge.media.length} citizen submissions`}
              />
              <EvidenceCarousel challenge={challenge} onOpenPhoto={setPhotoOpen} />
            </Reveal>
          )}

          {/* 5. Location */}
          <Reveal delay={0.14}>
            <LocationCard challenge={challenge} />
          </Reveal>

          {/* 6. Lifecycle timeline */}
          <Reveal delay={0.16}>
            <SectionHeader
              title="Journey"
              sub={`${doneStages} of ${challenge.timeline.length} stages complete`}
            />
            <JourneyCard challenge={challenge} />
          </Reveal>

          {/* 7. JanSetu Intelligence (premium dark) */}
          <Reveal delay={0.18}>
            <IntelligenceCard challenge={challenge} onWhy={() => setWhyOpen(true)} />
          </Reveal>

          {/* 8. Duplicate detection */}
          {challenge.duplicates.length > 0 && (
            <Reveal delay={0.2}>
              <SectionHeader
                title="Semantic duplicate detection"
                sub="How citizen reports were clustered"
              />
              <DuplicatesCard challenge={challenge} />
            </Reveal>
          )}

          {/* 9. Recommended HEIs */}
          {challenge.heiMatches.length > 0 && (
            <div>
              <SectionHeader title="Recommended institutions" sub="Capability-matched" />
              {challenge.heiMatches.map((m, i) => (
                <Reveal key={m.heiId} delay={0.06 * i}>
                  <HeiMatchCard
                    match={m}
                    best={i === 0}
                    onOpen={() => setMatchOpen(m)}
                  />
                </Reveal>
              ))}
            </div>
          )}

          {/* 10. Sticky action bar (role-aware) */}
          <ActionBar
            challenge={challenge}
            supportersShown={supportersShown}
            supported={supported}
          />
        </>
      )}

      {/* Sheets */}
      <WhyScoreSheet open={whyOpen} onClose={() => setWhyOpen(false)} challenge={challenge} />
      <MatchSheet open={matchOpen !== null} onClose={() => setMatchOpen(null)} match={matchOpen} />
      <PhotoSheet open={photoOpen !== null} onClose={() => setPhotoOpen(null)} photo={photoOpen} />
    </DetailView>
  );
}
