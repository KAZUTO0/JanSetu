"use client";

/* ============================================================
   JanSetu Submit flow — 9-step citizen reporting experience.
   Orchestrates step state, draft data, mock AI triage and the
   final Challenge submission into the app store. (Task 2-b)
   ============================================================ */

import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/store";
import { CHALLENGES } from "@/lib/data/challenges";
import { compactIN } from "@/components/shared/AnimatedNumber";
import type { Category, Challenge, MediaItem, Priority } from "@/lib/types";
import {
  StepWelcome,
  StepDescribe,
  StepEvidence,
  StepLocation,
  StepProcessing,
  StepResult,
  StepSimilar,
  StepReview,
  StepSuccess,
  scrollFlowTop,
  type AiResult,
  type SimilarReport,
  type PopChoice,
} from "./steps";

/* ---------------- Mock AI configuration ---------------- */

const CATEGORY_KEYWORDS: ReadonlyArray<readonly [Category, readonly string[]]> = [
  ["Water", ["water", "pump", "well", "fluoride", "contaminat", "handpump", "hand pump", "tube well", "aquifer", "drinking"]],
  ["Agriculture", ["crop", "farm", "harvest", "paddy", "field", "pest", "insect", "blight", "wheat", "soil"]],
  ["Healthcare", ["health", "doctor", "hospital", "clinic", "medicine", "phc", "patient", "fever", "disease", "asha"]],
  ["Education", ["school", "class", "teacher", "student", "anganwadi", "education", "classroom", "book", "exam"]],
  ["Environment", ["waste", "plastic", "garbage", "dump", "trash", "pollut", "sewage", "drain", "river"]],
  ["Infrastructure", ["road", "bridge", "power", "electric", "street light", "pothole", "transport", "bus", "mud road"]],
];

const SEVERITY_TERMS = [
  "contaminated", "fluoride", "arsenic", "epidemic", "outbreak", "toxic", "sewage",
  "disease", "emergency", "collapsed", "eroded", "flood", "shortage", "spoiled", "dying", "wilt",
];

const EXPERTISE_MAP: Record<Category, string[]> = {
  Water: ["Hydrogeology", "Water Chemistry", "Environmental Engineering", "Public Health"],
  Agriculture: ["Agronomy", "Plant Pathology", "Remote Sensing", "Soil Science"],
  Healthcare: ["Public Health", "Community Medicine", "Health Informatics", "Supply Logistics"],
  Education: ["Education Technology", "Curriculum Design", "Digital Infrastructure", "Assessment"],
  Environment: ["Waste Management", "Environmental Science", "Material Recycling", "Community Outreach"],
  Infrastructure: ["Civil Engineering", "Structural Monitoring", "Power Systems", "Rural Roads"],
};

const TAGS_MAP: Record<Category, string[]> = {
  Water: ["water-quality", "hand-pump", "contamination", "community-health"],
  Agriculture: ["crop-disease", "yield-loss", "pest-outbreak", "kharif"],
  Healthcare: ["phc-access", "medicine-stock", "rural-health", "referral"],
  Education: ["school-infra", "digital-literacy", "teacher-gap", "classroom"],
  Environment: ["waste-segregation", "plastic", "drainage", "recycling"],
  Infrastructure: ["road-damage", "last-mile", "electrification", "safety"],
};

const CATEGORY_IMAGE: Record<Category, string> = {
  Water: "/images/water-groundwater.png",
  Agriculture: "/images/agriculture-crop.png",
  Healthcare: "/images/healthcare.png",
  Education: "/images/education.png",
  Environment: "/images/waste.png",
  Infrastructure: "/images/infrastructure-road.png",
};

const SIMILAR_REPORTERS = ["Sunita Devi", "Ramesh Mahato", "Anil Kisku"];
const SIMILAR_META = [
  { distanceKm: 2.4, similarity: 93, daysAgo: 4 },
  { distanceKm: 5.1, similarity: 88, daysAgo: 11 },
  { distanceKm: 8.7, similarity: 74, daysAgo: 15 },
];
const SIMILAR_TITLES: Record<Category, string[]> = {
  Water: ["White sediment in hand-pump water", "Tube-well water smells of chemicals", "Joint pain after drinking well water"],
  Agriculture: ["Tomato leaves curling and drying", "Paddy stems wilting in patches", "Crop yield halved after unseasonal rain"],
  Healthcare: ["No doctor at PHC for three weeks", "Medicine stock-out at village centre", "Fever outbreak among children"],
  Education: ["School roof leaks in rain", "No teacher for senior classes", "Classroom blackboards broken"],
  Environment: ["Garbage dumped beside the pond", "Plastic burning at the street corner", "Drain overflow into housing lane"],
  Infrastructure: ["Feeder road eroded after rains", "Street lights out for a month", "Bridge planks broken, risky crossing"],
};

function classifyCategory(text: string): Category {
  const t = text.toLowerCase();
  let best: Category = "Water";
  let bestHits = 0;
  for (const [cat, kws] of CATEGORY_KEYWORDS) {
    const hits = kws.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
    if (hits > bestHits) {
      best = cat;
      bestHits = hits;
    }
  }
  return best;
}

function severityOf(text: string): { boost: number; matched: string[] } {
  const t = text.toLowerCase();
  const matched = SEVERITY_TERMS.filter((k) => t.includes(k));
  return { boost: Math.min(8, matched.length * 2), matched };
}

function populationBoost(affected: number): number {
  if (affected >= 20000) return 12;
  if (affected >= 6000) return 9;
  if (affected >= 5000) return 8;
  if (affected >= 1000) return 4;
  return 0;
}

function priorityOf(score: number): Priority {
  if (score >= 85) return "Critical";
  if (score >= 75) return "High";
  return "Medium";
}

function newCode(): string {
  return `JS-25${40 + Math.floor(Math.random() * 59)}`;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/* ---------------- Step chrome ---------------- */

const STEP_LABELS = [
  "New report",
  "Step 1 of 4 · Describe",
  "Step 2 of 4 · Evidence",
  "Step 3 of 4 · Location",
  "AI processing",
  "AI result",
  "Duplicate check",
  "Step 4 of 4 · Review",
  "Submitted",
];

const SEGMENTS = ["Describe", "Evidence", "Location", "Review"];

function segmentState(step: number, i: number): "done" | "active" | "shimmer" | "idle" {
  if (step >= 5) return "done";
  if (step === 4) return i <= 2 ? "done" : "shimmer";
  const activeIdx = step - 1;
  if (i < activeIdx) return "done";
  if (i === activeIdx) return "active";
  return "idle";
}

/* ---------------- Main component ---------------- */

const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 56 : -56 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -56 : 56 }),
};

export function SubmitFlow() {
  const addSubmitted = useApp((s) => s.addSubmitted);
  const setTab = useApp((s) => s.setTab);
  const toast = useApp((s) => s.toast);
  const push = useApp((s) => s.push);

  const [step, setStepState] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [code, setCode] = React.useState(newCode());

  /* Draft state */
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [pop, setPop] = React.useState<PopChoice | null>(null);
  const [selectedPhotos, setSelectedPhotos] = React.useState<string[]>([]);
  const [video, setVideo] = React.useState(false);
  const [district, setDistrict] = React.useState("");
  const [block, setBlock] = React.useState("");
  const [ai, setAi] = React.useState<AiResult | null>(null);
  const [mergeMode, setMergeMode] = React.useState<"new" | "merge">("new");
  const [mergeId, setMergeId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<{ id: string; code: string } | null>(null);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStepState(next);
  };

  const back = () => {
    if (step === 0) {
      toast("You're at the start", "Pick 'Start a report' to begin");
      return;
    }
    if (step === 8) {
      toast("Report already submitted", `${submitted?.code ?? code} is in the validation queue`);
      return;
    }
    if (step === 5) {
      go(3);
      return;
    }
    go(step - 1);
  };

  /* Keep the flow pinned to the top between steps */
  React.useEffect(() => {
    scrollFlowTop(rootRef.current);
  }, [step]);

  /* Derived mock data */
  const similar: SimilarReport[] = React.useMemo(() => {
    if (!ai) return [];
    return SIMILAR_TITLES[ai.category].map((t, i) => ({
      id: `sim-${i}`,
      title: t,
      reporter: SIMILAR_REPORTERS[i],
      ...SIMILAR_META[i],
    }));
  }, [ai]);

  const mergeOptions = React.useMemo(
    () => (ai ? CHALLENGES.filter((c) => c.category === ai.category).slice(0, 2) : []),
    [ai]
  );

  const handleMergeMode = (m: "new" | "merge") => {
    setMergeMode(m);
    if (m === "merge" && !mergeId && mergeOptions.length > 0) {
      setMergeId(mergeOptions[0].id);
    }
  };

  /* Run the mock AI triage, then enter the processing showpiece */
  const runAi = () => {
    const text = `${title} ${description}`;
    const category = classifyCategory(text);
    const severity = severityOf(text);
    const affected = pop?.value ?? 6800;
    const evidenceCount = selectedPhotos.length + (video ? 1 : 0);
    const score = clamp(
      65 + populationBoost(affected) + severity.boost + (evidenceCount > 0 ? 3 : 0),
      65,
      91
    );
    const confidence = clamp(
      84 + selectedPhotos.length * 3 + (video ? 4 : 0) + (description.trim().length >= 140 ? 3 : 0),
      84,
      96
    );

    setAi({
      category,
      priority: priorityOf(score),
      priorityScore: score,
      confidence,
      affectedPopulation: affected,
      expertise: EXPERTISE_MAP[category],
      tags: TAGS_MAP[category],
      evidenceCount,
      whyScore: [
        `Population exposure: ~${affected.toLocaleString("en-IN")} residents in the affected radius`,
        severity.matched.length > 0
          ? `Severity signals in your words: ${severity.matched.slice(0, 3).map((k) => `"${k}"`).join(", ")}`
          : "Severity signals: no acute keywords detected — baseline applied",
        `Evidence attached: ${selectedPhotos.length} photo${selectedPhotos.length === 1 ? "" : "s"}${video ? " + 1 video" : ""} — confidence ${confidence}%`,
        `District baseline: ${district} logs above-average ${category.toLowerCase()} complaints this quarter`,
      ],
    });
    go(4);
  };

  const handleAiDone = React.useCallback(() => {
    setDir(1);
    setStepState(5);
  }, []);

  /* Build the final Challenge and submit */
  const buildChallenge = (): Challenge | null => {
    if (!ai) return null;
    const target = mergeMode === "merge" ? CHALLENGES.find((c) => c.id === mergeId) : undefined;
    const merged = target !== undefined;
    const tSupporters = target?.supporters ?? 0;
    const tReports = target?.reportsCount ?? 0;
    const tCode = target?.code ?? "";
    const score = merged ? Math.min(96, ai.priorityScore + 4) : ai.priorityScore;
    const blockVal = block.trim() || "Sadar";
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const seed = district.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);

    const media: MediaItem[] = selectedPhotos.map((url) => ({
      type: "photo",
      url,
      caption: "Evidence attached by reporter",
    }));
    if (video) media.push({ type: "video", url: "", caption: "0:42 video recorded on-site" });

    return {
      id: `user-${Date.now()}`,
      code,
      title: title.trim(),
      summary: `AI-flagged ${ai.category} problem in ${blockVal}, ${district} — ~${compactIN(ai.affectedPopulation)} residents affected.`,
      description: `${description.trim()} Reported via the JanSetu citizen app; classified by simulated AI as ${ai.category} with ${ai.confidence}% confidence.`,
      district,
      block: blockVal,
      category: ai.category,
      priority: priorityOf(score),
      priorityScore: score,
      confidence: ai.confidence,
      affectedPopulation: ai.affectedPopulation,
      supporters: merged ? tSupporters + 1 : 1,
      reportsCount: merged ? tReports + 1 : 1,
      stage: "Reported",
      reportedAgo: "Just now",
      tags: ai.tags,
      expertise: ai.expertise,
      image: CATEGORY_IMAGE[ai.category],
      media,
      location: {
        lat: +(22.6 + (seed % 19) / 10).toFixed(4),
        lng: +(84.9 + (seed % 26) / 10).toFixed(4),
        label: `${blockVal}, ${district}, Jharkhand`,
      },
      timeline: [
        { stage: "Reported", date: today, note: "Reported by you via the JanSetu app", done: true },
        { stage: "Validated", date: "—", note: "District field verification pending", done: false },
        { stage: "Matched", date: "—", note: "Awaiting university match", done: false },
        { stage: "Development", date: "—", note: "Solution design after match", done: false },
        { stage: "Pilot", date: "—", note: "Community pilot planned", done: false },
        { stage: "Deployment", date: "—", note: "Scale-up after pilot review", done: false },
        { stage: "Impact", date: "—", note: "Outcomes measured and published", done: false },
      ],
      heiMatches: [],
      duplicates: similar.map((s) => ({
        id: s.id,
        title: s.title,
        district,
        distanceKm: s.distanceKm,
        similarity: s.similarity,
        reporter: s.reporter,
        daysAgo: s.daysAgo,
        status: merged ? `Merged into ${tCode}` : "Under review",
      })),
      whyScore: ai.whyScore,
      verified: false,
      trending: false,
      nearbyCount: Math.max(40, Math.round(ai.affectedPopulation / 12)),
    };
  };

  const handleSubmit = () => {
    if (submitting || !ai) return;
    setSubmitting(true);
    setTimeout(() => {
      const challenge = buildChallenge();
      if (challenge) {
        addSubmitted(challenge);
        toast("Report submitted", `${challenge.code} is now in the validation queue`);
        setSubmitted({ id: challenge.id, code: challenge.code });
      }
      setSubmitting(false);
      setDir(1);
      setStepState(8);
    }, 600);
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setPop(null);
    setSelectedPhotos([]);
    setVideo(false);
    setDistrict("");
    setBlock("");
    setAi(null);
    setMergeMode("new");
    setMergeId(null);
    setSubmitting(false);
    setSubmitted(null);
    setCode(newCode());
    setDir(-1);
    setStepState(0);
  };

  const mergeTarget = mergeMode === "merge" ? CHALLENGES.find((c) => c.id === mergeId) : undefined;
  const evidenceLabel = `${selectedPhotos.length} photo${selectedPhotos.length === 1 ? "" : "s"}${video ? " + 0:42 video" : ""}`;
  const handlingLabel = mergeTarget ? `Merge with ${mergeTarget.code}` : "New challenge";
  const locationLabel = `${block.trim() ? `${block.trim()}, ` : ""}${district}`;

  /* Step content */
  let content: React.ReactNode = null;
  switch (step) {
    case 0:
      content = (
        <StepWelcome
          onStart={() => go(1)}
          onHowItWorks={() =>
            toast("How JanSetu works", "Report → AI triage → university team → pilot → impact")
          }
        />
      );
      break;
    case 1:
      content = (
        <StepDescribe
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          pop={pop}
          onPopChange={setPop}
          onContinue={() => go(2)}
        />
      );
      break;
    case 2:
      content = (
        <StepEvidence
          selected={selectedPhotos}
          onSelectedChange={setSelectedPhotos}
          video={video}
          onVideoChange={setVideo}
          onContinue={() => go(3)}
        />
      );
      break;
    case 3:
      content = (
        <StepLocation
          district={district}
          onDistrictChange={setDistrict}
          block={block}
          onBlockChange={setBlock}
          onContinue={runAi}
        />
      );
      break;
    case 4:
      content = ai ? <StepProcessing ai={ai} onDone={handleAiDone} /> : null;
      break;
    case 5:
      content = ai ? <StepResult ai={ai} onContinue={() => go(6)} /> : null;
      break;
    case 6:
      content = ai ? (
        <StepSimilar
          category={ai.category}
          similar={similar}
          mergeMode={mergeMode}
          onMergeModeChange={handleMergeMode}
          options={mergeOptions}
          mergeId={mergeId}
          onMergeIdChange={setMergeId}
          onContinue={() => go(7)}
        />
      ) : null;
      break;
    case 7:
      content = ai ? (
        <StepReview
          title={title}
          locationLabel={locationLabel || "—"}
          ai={ai}
          evidenceLabel={evidenceLabel}
          handlingLabel={handlingLabel}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      ) : null;
      break;
    default:
      content = (
        <StepSuccess
          code={submitted?.code ?? code}
          onViewActivity={() => setTab("activity")}
          onAnother={reset}
          onPreview={() => {
            if (submitted) push({ type: "challenge", challengeId: submitted.id });
            else toast("Nothing to preview yet", "Submit a report first");
          }}
        />
      );
  }

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-[430px] pb-8">
      {/* Progress chrome */}
      <div className="sticky top-0 z-30 border-b border-border/50 bg-background/85 px-4 pb-3 pt-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={back}
            aria-label="Back"
            className="tap grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-ink shadow-float"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="truncate text-[12px] font-bold tracking-wide text-ink"
              >
                {STEP_LABELS[step]}
              </motion.p>
            </AnimatePresence>
          </div>
          <span className="nums shrink-0 text-[10px] font-bold text-ink-soft/60">{step + 1}/9</span>
        </div>

        <div className="mt-3 flex gap-1.5" aria-hidden>
          {SEGMENTS.map((label, i) => {
            const s = segmentState(step, i);
            return (
              <div key={label} className="relative h-[5px] flex-1 overflow-hidden rounded-full bg-secondary">
                {(s === "done" || s === "shimmer") && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    style={{ originX: 0 }}
                    className={cnSeg(s)}
                  />
                )}
                {s === "active" && (
                  <motion.div
                    initial={{ scaleX: 0.25 }}
                    animate={{ scaleX: [0.25, 0.6, 0.25] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: 0 }}
                    className="absolute inset-0 rounded-full bg-brand/70"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step body */}
      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={step}
          custom={dir}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 320, damping: 32 },
            opacity: { duration: 0.24 },
          }}
          className="px-4 pt-5"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function cnSeg(state: "done" | "active" | "shimmer" | "idle"): string {
  if (state === "shimmer") return "shimmer absolute inset-0 rounded-full bg-brand/50";
  return "absolute inset-0 rounded-full bg-brand";
}
