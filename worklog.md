# JanSetu Innovation Hub — Worklog

## Project
Frontend-only prototype of "JanSetu Innovation Hub": citizens report societal problems,
simulated AI classifies/prioritizes/dedupes, HEIs pick them up, industry collaborates,
government tracks problem → prototype → deployment → impact. Mobile-first (~430px),
premium native feel, Next.js 16 + TS + Tailwind 4 + Framer Motion + Recharts. Mock data only.

## Roles & Tabs
- Citizen: Home / Explore / Submit / Activity / Profile
- HEI: Discover / Assigned / Projects / Messages / Profile
- Industry: Opportunities / Collaborations / Projects / Messages / Profile
- Government: Overview / Challenges / Allocation(Funds) / Analytics / Profile
- "Prototype Role Preview" card (in every Profile tab) instantly switches roles.
- Roles are NOT in the tab bar.

## Foundation (Task 1, done by main agent)
- `src/app/globals.css`: warm off-white theme (#F4F4EF bg), teal-emerald brand (#0E8A6D),
  ink text (#1B2420), utilities: .glass, .shadow-float, .tap, .jansetu-scroll, .nums,
  .card-hairline, .dot-grid, .shimmer, .pulse-ring, SPRING constants.
- `src/lib/types.ts`: all domain types (Challenge, HEI, Project, Opportunity, ImpactStory,
  DistrictStat, analytics types, etc.).
- `src/lib/store.ts`: Zustand store — useApp: role, per-role tabs, stack (push/pop of
  ViewItem), challenges list, supportedIds, acceptedChallengeIds, teamFormedProjectIds,
  expressedInterestIds, toasts, govDistrict/govCategoryFilter.
- `src/lib/data/`: categories.ts (category colors/icons), challenges.ts (15 Jharkhand
  challenges w/ full detail), heis.ts (6 HEIs), projects.ts (6 projects), opportunities.ts,
  conversations.ts (HEI + industry chats), analytics.ts (KPIs, funnel, districts, allocations),
  impact.ts (5 impact stories).
- `src/components/shared/`: BottomSheet.tsx (drag-to-dismiss iOS sheet), AnimatedNumber.tsx,
  kit.tsx (CategoryChip, PriorityPill, StageBadge, ScoreRing, CoverImage, SectionHeader,
  FilterChips, CardSkeleton/FeedSkeleton, EmptyState, CategoryIcon), ChatView.tsx.
- `src/components/shell/`: AppShell.tsx (phone frame on desktop, tab bar w/ center Submit
  button, toasts), DetailView.tsx (push chrome w/ collapsing title + swipe-back),
  RolePreviewCard.tsx.
- Stub files created for ALL feature views (exact export names) so app compiles:
  see `src/components/{citizen,submit,challenge,hei,industry,government,impact}/`.
- Images: `public/images/*.png` generated via z-ai CLI (water, agriculture, waterlogging,
  waste, healthcare, education, road, solar, river-plastic, maternal, hero-landscape).

## Component contracts (STABLE — subagents must keep these)
Every view is a client component, no props (except detail views), fills an absolutely
positioned scroll container provided by shell. Views render their own large title block.
- Citizen: HomeView, ExploreView, SubmitFlow, ActivityView, CitizenProfileView
- Challenge: ChallengeDetailView({ challengeId })
- HEI: HeiDiscoverView, HeiAssignedView, HeiProjectsView, HeiMessagesView, HeiProfileView,
  ProjectWorkspaceView({ projectId })
- Industry: IndustryOpportunitiesView, IndustryCollaborationsView, IndustryProjectsView,
  IndustryMessagesView, IndustryProfileView, OpportunityDetailView({ opportunityId })
- Government: GovOverviewView, GovChallengesView, GovAllocationView, GovAnalyticsView,
  GovProfileView, CommandCentreView (full-viewport overlay)
- Impact: ImpactView, ImpactStoryDetailView({ storyId })

## Style guide for feature modules
- Cards: bg-card rounded-3xl shadow-float, p-4/p-5, gap-4.
- Large titles: text-[30-32px] font-extrabold tracking-[-0.03em] text-ink.
- Body: text-[13-14px], secondary text-ink-soft text-[12px].
- Accent: bg-brand text-white; soft: bg-brand-mist text-brand-deep.
- Buttons: rounded-2xl h-11 font-semibold, tap class for press feedback.
- Horizontal carousels: no-scrollbar flex gap-3 px-4 overflow-x-auto.
- Bottom sheets via shared BottomSheet; skeletons via kit; animated numbers via AnimatedNumber.
- Use lucide-react icons; Recharts for charts. NO blue/indigo colors.
- Every list/detail interaction must work (local state via useApp store or local useState).

---
Task ID: 1
Agent: main (Z.ai Code orchestrator)
Task: Foundation — theme, types, mock data, store, shared kit, app shell, stubs, images

Work Log:
- Designed theme (off-white/teal-emerald) in globals.css; Inter font in layout.tsx.
- Wrote full type system + 8 mock-data modules (15 challenges, 6 HEIs, 6 projects,
  6 opportunities, 5 collaborations, 9 conversations, 24-district analytics, 5 impact stories).
- Built Zustand store with role switching, per-role tabs, push stack, interactions, toasts.
- Built shared kit: BottomSheet (drag-dismiss), AnimatedNumber, chips/badges/ScoreRing/
  CoverImage/skeletons/FilterChips, ChatView, DetailView push chrome, RolePreviewCard.
- Built AppShell: desktop ambient + phone frame, identity bar, tab bar (citizen center
  Submit button w/ rotating +), pushed views with AnimatePresence, toasts.
- Created stubs for all 27 feature components; page.tsx renders AppShell.
- Started background image generation (11 images via z-ai CLI).

Stage Summary:
- App compiles with stubs; foundation contracts frozen. Ready for parallel feature agents:
  2-a Citizen, 2-b SubmitFlow, 2-c ChallengeDetail, 2-d HEI, 2-e Industry, 2-f Government,
  2-g Impact. Each agent must read this worklog first and append its section when done.

---
Task ID: 2-a
Agent: general-purpose (Citizen views)
Task: Built the full Citizen experience — HomeView, ExploreView, ActivityView, CitizenProfileView + shared ChallengeCard.

Work Log:
- Read worklog, types, store, all data modules, kit/AnimatedNumber/RolePreviewCard contracts, AppShell rendering context.
- Created src/components/citizen/ChallengeCard.tsx: premium card with CoverImage + glass-dark code chip / StageBadge / district pin chip, CategoryChip+PriorityPill row, animated stats (Users/Heart/Layers via AnimatedNumber+compactIN), AI-tag chips with Sparkles label, HEI match strip (initials tile + "% match" + chevron via heiById), full-width ghost support button that toggles support (filled heart, brand tint, animated count +1, toast). Card body taps push challenge detail; support button stopPropagation.
- HomeView: Namaste/Aarav eyebrow + "Innovation Feed" large title, sticky glass search (title/district/tags filter, clear button), custom filter chip row (Nearby/High Priority/Latest single-select sorts + 6 category chips multi-select; recency parser maps reportedAgo strings to day counts), Impact Highlights carousel (5 IMPACT_STORIES, 200px mini cards, CategoryChip on image, 2-line clamp title, brand headlineMetric, push impact-story; "See all" pushes impact), Trending Challenges list with dynamic count sub, FeedSkeleton ~900ms on mount, EmptyState (SearchX + Clear filters), end note "15 live challenges · demo data".
- ExploreView: large title + search, 2-col category tile grid (soft tinted CategoryIcon tiles, per-category counts, toggle filter w/ Check state), district chip row (All + 7 chips; Jamshedpur maps to East Singhbhum), Latest/Priority/Nearby segmented control with layoutId thumb, compact result rows (icon tile, 1-line title, district · compactIN affected · code, ScoreRing mini), result count line, RowSkeleton on mount, staggered entrance, empty state + Reset filters.
- ActivityView: My Reports / Notifications segmented control (layoutId pill). My Reports = c-ranchi-waterlogging + any user-* from store.challenges; card shows code + StageBadge + title + 7-stage progress dots (filled to current, current pulses, x/7 label), "+2.1K this week" for trending, View progress chevron pushes detail; hint card routes to Submit tab. Notifications = 8 static events with tinted lucide icon tiles, times (2h…6d), unread dots on first 3; tap → toast "Opening related challenge" + push (challenge / impact-story where obvious, else info toast).
- CitizenProfileView: identity card (AX avatar, name, role, "Reporting since Mar 2024" chip, 3 animated stat tiles 3/12/48), Community badges carousel (Water Guardian / First Reporter / Crowd Voice), "Prototype controls" section + RolePreviewCard (my-5), settings card (functional Switch for notifications w/ toasts; Language/Privacy/Offline cache rows → demo toasts), About card with Prototype v0.1 chip.
- Verified in running dev server via headless browser + VLM screenshot QA: search/sort/filters/district mapping/support toggle/toasts/pushes/empty states/reset all pass; SSR renders 200; bun run lint exits 0; tsc shows no errors in citizen files.

Stage Summary:
- Files written: src/components/citizen/{HomeView,ExploreView,ActivityView,ProfileView,ChallengeCard}.tsx. No shared/contract files touched.
- Decisions: (1) kit FilterChips supports only a single T|null value, so Home uses a custom chip row with identical styling to allow multi-select categories + single-select sorts. (2) STAGES imported from @/lib/types (categories.ts only exports STAGE_META). (3) Notification taps that have no obvious target show an informative toast instead of pushing. (4) compactIN imported from AnimatedNumber.tsx (not kit).
- Contract observations for other agents (NOT fixed by me): AppShell imports TabId from @/lib/types but it is exported from @/lib/store; detail-view stubs (ChallengeDetail, ProjectWorkspace, ImpactStoryDetail, OpportunityDetail) declare positional string params (e.g. ChallengeDetailView(challengeId: string)) so AppShell's prop-passing shows pre-existing tsc errors until those agents land destructured props.

---
Task ID: 2-c
Agent: general-purpose (Challenge Detail)
Task: Build the full Challenge Detail pushed view (hero, stats, about, evidence, location, lifecycle, JanSetu Intelligence, duplicates, HEI matches, role-aware action bar).

Work Log:
- Read worklog + all frozen contracts (types, store, challenges/heis/projects/categories data, kit, BottomSheet, AnimatedNumber, DetailView, AppShell).
- Created src/components/challenge/parts.tsx with all 10 sections + 3 bottom sheets + skeleton + Reveal stagger wrapper:
  HeroCard (CoverImage w/ glass-dark code chip, StageBadge, MapPin chip, BadgeCheck verified chip, CategoryChip/PriorityPill/Flame row, 19px title, summary),
  ImpactStats (3 animated tiles: affected/supporters/reports + support-momentum bar vs 2,000 goal),
  AboutCard (13.5px description + Sparkles "AI tags" chips),
  EvidenceCarousel (photo cards w/ captions -> BottomSheet lightbox; dark video tile w/ Play + parsed duration),
  LocationCard (dot-grid h-36 map, pulse-ring brand pin, coords chip, "3 nearby reports this week", Get directions -> toast),
  JourneyCard (7-stage vertical timeline; current keyed off challenge.stage w/ first-not-done fallback; measured gradient fill line animating to current dot; pulsing current dot + chip),
  IntelligenceCard (bg-ink dark, Sparkles tile, "simulated AI" chip, 76px ScoreRing #45B08C + custom white caption, Domain/Confidence/Affected rows, expertise chips, "Why this score?" -> sheet w/ whyScore bullets + simulated-explainability footer),
  DuplicatesCard (merged-reports intro, colored initial tiles, meta lines, animated similarity bars + % match, Merged/Under review chips),
  HeiMatchCard (HEI tile from heiById color, match ScoreRing, top-3 factor mini bars, check-icon reasons, "Best match" corner ribbon on first, "Full match breakdown" -> sheet w/ all 5 animated factor bars + Send-to-HEI toast),
  ActionBar (sticky bottom-0 glass bar: citizen support toggle w/ AnimatedNumber count + share; hei Accept Challenge/accepted state + Form Team -> project push or toast; industry/gov Follow + share).
- Rewrote src/components/challenge/ChallengeDetail.tsx: DetailView chrome (title/code eyebrow/share headerRight), 700ms mount skeleton, not-found EmptyState, per-section staggered Reveals, sheets state; supporters count delta vs mount-time support state.
- Fixed lint hit: replaced ref-during-render with useState initial-value capture; removed unused eslint-disable.
- Verified live in headless browser (temp auto-push in AppShell, reverted byte-identical afterwards): all sections render, why-score sheet bullets, photo lightbox, match sheet + Send-to-HEI toast + auto-close, support toggle (1,247 -> 1,248 + toast), sticky bar flush at scroller bottom (833px), HEI role bar (Accepted + Form Team states). tsc + eslint clean for the module; bun run lint passes project-wide.

Stage Summary:
- Files written: src/components/challenge/ChallengeDetail.tsx (export ChallengeDetailView({challengeId})), src/components/challenge/parts.tsx (internal sections). No other files touched (AppShell temp test edit reverted, md5-verified).
- Key decisions: current timeline stage derived from challenge.stage (data has done:true on the "in progress" stage, e.g. c-bokaro-water Development); sticky bar uses -mb-8 to cancel DetailView's h-8 spacer so it rests flush at scroll end; supporters count normalised against mount-time supportedIds; ScoreRing "priority" caption rendered manually under the ring (kit label color is illegible on bg-ink).
- Contract gaps noticed (for orchestrator): (1) AppShell imports TabId from @/lib/types but it is exported from @/lib/store -> TS2305 (pre-existing). (2) Only 2/11 public/images exist yet (water-groundwater, hero-landscape); other heroes/media 404 -> CoverImage shimmer fallback is graceful but images should land. (3) OpportunityDetailView stub signature still (opportunityId: string) instead of ({opportunityId}) — AppShell TS2322 until 2-e fixes. (4) Dev server died/restarted several times during the session (EADDRINUSE from a second `next dev` attempt; serving again on 127.0.0.1:3000 — note `localhost` may resolve IPv6 and refuse).

---
Task ID: 3 (integration & verification)
Agent: main (Z.ai Code orchestrator)
Task: Integrate all feature modules, fix contract bugs, full browser verification, polish

Work Log:
- All 7 subagents (2-a..2-g) delivered their modules despite late transport errors; verified all
  files complete (27 components + parts.tsx helpers + submit steps.tsx).
- Fixed AppShell bug: TabId imported from @/lib/types -> now imported from @/lib/store.
- Fixed Challenge Detail title duplication (removed h2 from HeroCard; large title owns it).
- agent-browser end-to-end verification at 430x900 + 1280x800:
  * Citizen Home feed: 15 challenge cards render (image, code, stage, category, priority,
    affected/supporters/reports animated, AI tags, HEI match strip), Impact carousel, search,
    filter chips. Support toggle works with toast + count animation.
  * Challenge Detail (JS-2481): hero, stats, about, evidence carousel, location map, journey
    timeline, JanSetu Intelligence dark card (87 score ring), Why-this-score bottom sheet,
    duplicate detection, 3 HEI match cards w/ breakdown sheets, back navigation (swipe +
    button), role-aware action bar.
  * Submit flow FULL: welcome -> describe (validated) -> evidence picker -> district sheet +
    location scan mock -> AI processing animation (5 sequential steps) -> Intelligence result
    -> duplicate merge choice -> review -> success (JS-2590) -> appears in Activity My Reports
    with 1/7 Reported progress.
  * Role switching via Profile -> Prototype Role Preview: instant, all 4 roles.
  * Government: KPI cards animated, district heatmap tap -> Bokaro stats sheet with challenge
    list, funnel, trend chart, Command Centre full-viewport overlay (mobile + desktop 1280w),
    Analytics view (funnel, donut, trend, HEI ranking, industry engagement, completion).
  * HEI: Discover ranked matches (92% flagship), Projects cards, Project Workspace (team,
    milestones, documents, updates, industry partners, funding), Messages -> Chat with
    simulated replies.
  * Industry: Opportunities (flagship Smart Groundwater Monitoring / BIT Mesra / Prototype
    Stage / ₹3–5L + manufacturing + deployment), Express Interest sheet (6 support types +
    funding amount chips) -> sent state, Collaborations w/ status filters.
  * Impact: view with journey strip + aggregate KPIs + story cards; story detail with
    before/after metric cards, journey timeline, quote, partners.
- VLM design review: Home 8/10, Challenge Detail 8.5/10, Command Centre desktop 9/10,
  Impact story 9/10, Desktop frame 9/10, Explore 9/10, Analytics 9/10. No blocking issues.
- bun run lint: clean. No console errors. Dev server healthy on :3000.
- Images: 5/11 generated (water, agriculture, waterlogging, waste, hero-landscape); remaining
  6 (healthcare, education, road, solar, river-plastic, maternal) regenerating in background
  (gen-images2.sh); CoverImage shimmers gracefully until they land.

Stage Summary:
- App is fully interactive end-to-end across all 4 roles; all required interactions work.
- Remaining: wait for 6 images; optional micro-polish. Next phase (cron reviewer): continue
  styling/detail improvements + feature additions per task description.

---
Task ID: 4 (final)
Agent: main (Z.ai Code orchestrator)
Task: Complete image set, final verification, handover

Work Log:
- Generated all 11 category images into public/images/ (water-groundwater, agriculture-crop,
  waterlogging, waste, healthcare, education, infrastructure-road, solar, river-plastic,
  maternal, hero-landscape) — all serve HTTP 200.
- Final browser reload: home feed renders with photos; no console errors; lint clean.
- VLM final review: 8/10 home (image repetition flagged is intentional storyline reuse;
  tab-bar overlap is the iOS frosted pattern by design).
- Created recurring cron job (webDevReview, every 15 min) to continue QA + development.
- Moved verification screenshots to .verify/ for reference.

Stage Summary:
- JanSetu Innovation Hub prototype is COMPLETE and fully interactive:
  * 4 role experiences with instant switching (Prototype Role Preview in every Profile tab)
  * 15 Jharkhand challenges, 6 HEIs, 6 projects, 6 industry opportunities, 5 impact stories
  * Full Submit flow with simulated AI processing; Challenge Detail w/ Intelligence card,
    duplicate detection, explainable HEI matching; HEI workspace; Industry express-interest;
  * Government KPIs, funnel, charts, interactive district heatmap, full-viewport Command
    Centre; Impact before/after outcomes.
- Suggested next-phase items for the cron reviewer: dark mode pass, pull-to-refresh gesture,
  haptic-style micro-interactions, more per-district data depth, additional challenge
  clustering visual, share-sheet mock, onboarding carousel on first visit.
