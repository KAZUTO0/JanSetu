"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Compass, Activity, User, Inbox, FolderKanban, MessageCircle,
  Lightbulb, Handshake, LayoutDashboard, IndianRupee, BarChart3, Plus, Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useApp, type TabId } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SPRING, SPRING_SOFT } from "@/components/shared/BottomSheet";

/* Role views (filled by feature modules) */
import { HomeView } from "@/components/citizen/HomeView";
import { ExploreView } from "@/components/citizen/ExploreView";
import { SubmitFlow } from "@/components/submit/SubmitFlow";
import { ActivityView } from "@/components/citizen/ActivityView";
import { CitizenProfileView } from "@/components/citizen/ProfileView";

import { HeiDiscoverView } from "@/components/hei/DiscoverView";
import { HeiAssignedView } from "@/components/hei/AssignedView";
import { HeiProjectsView } from "@/components/hei/ProjectsView";
import { HeiMessagesView } from "@/components/hei/MessagesView";
import { HeiProfileView } from "@/components/hei/ProfileView";

import { IndustryOpportunitiesView } from "@/components/industry/OpportunitiesView";
import { IndustryCollaborationsView } from "@/components/industry/CollaborationsView";
import { IndustryProjectsView } from "@/components/industry/ProjectsView";
import { IndustryMessagesView } from "@/components/industry/MessagesView";
import { IndustryProfileView } from "@/components/industry/ProfileView";

import { GovOverviewView } from "@/components/government/OverviewView";
import { GovChallengesView } from "@/components/government/ChallengesView";
import { GovAllocationView } from "@/components/government/AllocationView";
import { GovAnalyticsView } from "@/components/government/AnalyticsView";
import { GovProfileView } from "@/components/government/ProfileView";

/* Pushed views */
import { ChallengeDetailView } from "@/components/challenge/ChallengeDetail";
import { ProjectWorkspaceView } from "@/components/hei/ProjectWorkspace";
import { ImpactView } from "@/components/impact/ImpactView";
import { ImpactStoryDetailView } from "@/components/impact/ImpactStoryDetail";
import { CommandCentreView } from "@/components/government/CommandCentre";
import { ChatView } from "@/components/shared/ChatView";
import { OpportunityDetailView } from "@/components/industry/OpportunityDetail";

interface TabDef {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const TABS: Record<Role, TabDef[]> = {
  citizen: [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "submit", label: "Submit", icon: Plus },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "profile", label: "Profile", icon: User },
  ],
  hei: [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "assigned", label: "Assigned", icon: Inbox },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ],
  industry: [
    { id: "opportunities", label: "Opps", icon: Lightbulb },
    { id: "collaborations", label: "Collabs", icon: Handshake },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ],
  government: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "challenges", label: "Challenges", icon: Inbox },
    { id: "allocation", label: "Funds", icon: IndianRupee },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
  ],
};

function CurrentTabView() {
  const { role, tabs } = useApp();
  const tab = tabs[role];

  const view = React.useMemo(() => {
    if (role === "citizen") {
      switch (tab) {
        case "home": return <HomeView />;
        case "explore": return <ExploreView />;
        case "submit": return <SubmitFlow />;
        case "activity": return <ActivityView />;
        case "profile": return <CitizenProfileView />;
      }
    }
    if (role === "hei") {
      switch (tab) {
        case "discover": return <HeiDiscoverView />;
        case "assigned": return <HeiAssignedView />;
        case "projects": return <HeiProjectsView />;
        case "messages": return <HeiMessagesView />;
        case "profile": return <HeiProfileView />;
      }
    }
    if (role === "industry") {
      switch (tab) {
        case "opportunities": return <IndustryOpportunitiesView />;
        case "collaborations": return <IndustryCollaborationsView />;
        case "projects": return <IndustryProjectsView />;
        case "messages": return <IndustryMessagesView />;
        case "profile": return <IndustryProfileView />;
      }
    }
    if (role === "government") {
      switch (tab) {
        case "overview": return <GovOverviewView />;
        case "challenges": return <GovChallengesView />;
        case "allocation": return <GovAllocationView />;
        case "analytics": return <GovAnalyticsView />;
        case "profile": return <GovProfileView />;
      }
    }
    return null;
  }, [role, tab]);

  return (
    <motion.div
      key={`${role}-${tab}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="jansetu-scroll absolute inset-0 overflow-y-auto overscroll-contain"
    >
      {view}
      <div className="h-24" />
    </motion.div>
  );
}

function PushedViews() {
  const { stack, pop } = useApp();
  const top = stack[stack.length - 1];

  return (
    <AnimatePresence mode="popLayout">
      {top && (
        <React.Fragment key={`${top.type}-${JSON.stringify(top)}`}>
          {top.type === "challenge" && (
            <ChallengeDetailView challengeId={top.challengeId} />
          )}
          {top.type === "project" && (
            <ProjectWorkspaceView projectId={top.projectId} />
          )}
          {top.type === "impact" && <ImpactView />}
          {top.type === "impact-story" && (
            <ImpactStoryDetailView storyId={top.storyId} />
          )}
          {top.type === "command-centre" && <CommandCentreView />}
          {top.type === "chat" && <ChatView conversationId={top.conversationId} />}
          {top.type === "opportunity" && (
            <OpportunityDetailView opportunityId={top.opportunityId} />
          )}
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}

function TabBar() {
  const { role, tabs, setTab } = useApp();
  const tab = tabs[role];
  const defs = TABS[role];

  return (
    <div className="glass relative z-20 shrink-0 border-t border-border/70">
      <div className="flex items-stretch justify-around px-2 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))]">
        {defs.map((d) => {
          const active = tab === d.id;
          const isSubmit = d.id === "submit" && role === "citizen";
          const Icon = d.icon;
          if (isSubmit) {
            return (
              <div key={d.id} className="relative flex w-14 justify-center">
                <motion.button
                  whileTap={{ scale: 0.86 }}
                  onClick={() => setTab("submit")}
                  aria-label="Submit a challenge"
                  className={cn(
                    "absolute -top-[22px] grid h-12 w-12 place-items-center rounded-[18px] text-white shadow-float-lg transition-colors",
                    active ? "bg-brand-deep" : "bg-brand"
                  )}
                >
                  <motion.span
                    animate={active ? { rotate: 45 } : { rotate: 0 }}
                    transition={SPRING}
                  >
                    <Plus size={22} strokeWidth={2.6} />
                  </motion.span>
                </motion.button>
                <span
                  className={cn(
                    "mt-[38px] text-[9.5px] font-bold tracking-wide transition-colors",
                    active ? "text-brand" : "text-ink-soft/70"
                  )}
                >
                  {d.label}
                </span>
              </div>
            );
          }
          return (
            <button
              key={d.id}
              onClick={() => setTab(d.id)}
              aria-label={d.label}
              className="tap flex w-14 flex-col items-center gap-0.5 py-1"
            >
              <div className="relative grid h-7 w-11 place-items-center">
                {active && (
                  <motion.span
                    layoutId={`tab-pill-${role}`}
                    transition={SPRING}
                    className="absolute inset-0 rounded-full bg-brand-mist"
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.4 : 2}
                  className={cn(
                    "relative transition-colors",
                    active ? "text-brand-deep" : "text-ink-soft/70"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[9.5px] font-bold tracking-wide transition-colors",
                  active ? "text-brand-deep" : "text-ink-soft/70"
                )}
              >
                {d.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[88px] z-[60] flex flex-col items-center gap-2 px-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={SPRING_SOFT}
            onClick={() => dismissToast(t.id)}
            className="pointer-events-auto flex max-w-full items-center gap-2.5 rounded-2xl bg-ink/90 px-4 py-2.5 text-left shadow-float-lg backdrop-blur-md"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/90 text-white">
              <Sparkles size={12} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-bold text-white">
                {t.title}
              </span>
              {t.description && (
                <span className="block truncate text-[10.5px] text-white/70">
                  {t.description}
                </span>
              )}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function AppShell() {
  const role = useApp((s) => s.role);

  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:items-center lg:justify-center lg:overflow-hidden">
      {/* Desktop ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_500px_at_20%_10%,rgba(14,138,109,0.10),transparent_60%),radial-gradient(900px_500px_at_85%_85%,rgba(150,163,59,0.08),transparent_60%),radial-gradient(600px_400px_at_70%_20%,rgba(224,165,56,0.06),transparent_60%)]" />
        <div className="noise-bg absolute inset-0 opacity-[0.35]" />
      </div>

      {/* Desktop side caption */}
      <div className="pointer-events-none fixed left-[8%] top-1/2 hidden max-w-[340px] -translate-y-1/2 xl:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white shadow-float">
            <svg viewBox="0 0 64 64" className="h-6 w-6" fill="none">
              <path d="M32 12c-7 8-11 13-11 19a11 11 0 0 0 22 0c0-6-4-11-11-19z" fill="currentColor" opacity="0.92"/>
              <circle cx="32" cy="33" r="4.5" fill="#0E8A6D"/>
              <path d="M14 44h10M40 44h10" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="text-[15px] font-bold tracking-[-0.02em] text-ink">
            JanSetu <span className="font-medium text-ink-soft">Innovation Hub</span>
          </span>
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">
          Citizen problems → university research → industry scale → measurable
          impact. A prototype for a bridge (
          <em className="not-italic font-semibold text-brand">setu</em>) between
          people and institutions.
        </p>
        <div className="mt-5 flex items-center gap-2 text-[11.5px] font-semibold text-ink-soft/80">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Switch experiences from Profile → Prototype Role Preview
        </div>
        <p className="mt-8 text-[10.5px] text-ink-soft/60">
          UI prototype · simulated data · no real partnerships implied
        </p>
      </div>

      {/* Phone frame */}
      <div className="relative flex min-h-[100dvh] w-full flex-col lg:min-h-0 lg:h-[880px] lg:max-h-[94vh] lg:w-[430px] lg:overflow-hidden lg:rounded-[44px] lg:border-[10px] lg:border-ink lg:shadow-float-lg">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background lg:rounded-[34px]">
          {/* App identity bar */}
          <div className="glass relative z-20 flex shrink-0 items-center justify-between border-b border-border/60 px-4 pb-2 pt-[max(10px,env(safe-area-inset-top))]">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none">
                <path d="M32 12c-7 8-11 13-11 19a11 11 0 0 0 22 0c0-6-4-11-11-19z" fill="#0E8A6D" opacity="0.92"/>
                <circle cx="32" cy="33" r="4.5" fill="#0E8A6D"/>
                <path d="M14 44h10M40 44h10" stroke="#0E8A6D" strokeWidth="3.4" strokeLinecap="round"/>
              </svg>
              <span className="text-[13.5px] font-bold tracking-[-0.01em] text-ink">
                JanSetu
              </span>
              <span className="ml-1 rounded-full bg-brand-mist px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-brand">
                Hub
              </span>
            </div>
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft/60">
              Prototype
            </span>
          </div>

          {/* Main content */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <CurrentTabView />
            <PushedViews />
            <Toasts />
          </div>

          {/* Tab bar */}
          <TabBar />
        </div>
      </div>
    </div>
  );
}
