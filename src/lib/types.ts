/* ============================================================
   JanSetu Innovation Hub — Core domain types
   Frontend-only prototype. All data is simulated/mock.
   ============================================================ */

export type Role = "citizen" | "government" | "hei" | "industry";

export type Category =
  | "Water"
  | "Agriculture"
  | "Healthcare"
  | "Education"
  | "Environment"
  | "Infrastructure";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type Stage =
  | "Reported"
  | "Validated"
  | "Matched"
  | "Development"
  | "Pilot"
  | "Deployment"
  | "Impact";

export const STAGES: Stage[] = [
  "Reported",
  "Validated",
  "Matched",
  "Development",
  "Pilot",
  "Deployment",
  "Impact",
];

export interface CategoryMeta {
  name: Category;
  color: string; // hex used for chips, charts, dots
  soft: string; // soft bg tint (hex with alpha ok)
  icon: string; // lucide icon name key
}

export interface MediaItem {
  type: "photo" | "video";
  url: string;
  caption: string;
}

export interface TimelineEvent {
  stage: Stage;
  date: string;
  note: string;
  done: boolean;
}

export interface MatchFactor {
  label: string; // e.g. "Faculty Expertise"
  value: number; // 0–100
}

export interface HEIMatch {
  heiId: string;
  matchPercent: number;
  reasons: string[];
  factors: MatchFactor[];
}

export interface DuplicateReport {
  id: string;
  title: string;
  district: string;
  distanceKm: number;
  similarity: number; // 0–100
  reporter: string;
  daysAgo: number;
  status: string;
}

export interface Challenge {
  id: string;
  code: string; // e.g. JS-2481
  title: string;
  summary: string; // one-line card summary
  description: string; // long description for detail view
  district: string;
  block: string;
  village?: string;
  category: Category;
  priority: Priority;
  priorityScore: number; // 0–100
  confidence: number; // 0–100
  affectedPopulation: number;
  supporters: number;
  reportsCount: number; // clustered citizen reports
  stage: Stage;
  reportedAgo: string;
  tags: string[]; // AI tags
  expertise: string[]; // required expertise
  image: string; // /images/xxx.png
  media: MediaItem[];
  location: { lat: number; lng: number; label: string };
  timeline: TimelineEvent[];
  heiMatches: HEIMatch[];
  duplicates: DuplicateReport[];
  whyScore: string[]; // bullets for "Why this score?" sheet
  verified: boolean;
  trending?: boolean;
  nearbyCount?: number; // citizens nearby
}

export interface HEI {
  id: string;
  name: string; // full name
  shortName: string; // e.g. "BIT Mesra"
  city: string;
  type: string; // institute type
  strengths: string[];
  color: string; // brand tint for logo tile
  facultyCount: number;
  studentsCount: number;
  nirfRank?: number;
  departments: string[];
}

/* ---------------- Projects / HEI workspace ---------------- */

export type ProjectStage =
  | "Research"
  | "Prototype"
  | "Testing"
  | "Pilot"
  | "Deployment";

export interface Milestone {
  id: string;
  title: string;
  stage: ProjectStage;
  status: "done" | "active" | "upcoming";
  date: string;
  note: string;
}

export interface ProjectMember {
  name: string;
  role: string;
  type: "faculty" | "student" | "industry" | "mentor";
  initials: string;
  dept?: string;
}

export interface ProjectUpdate {
  author: string;
  role: string;
  time: string;
  text: string;
}

export interface ProjectDocument {
  name: string;
  kind: string; // PDF / Sheet / Deck
  size: string;
}

export interface Project {
  id: string;
  code: string; // e.g. PRJ-1042
  challengeId: string;
  title: string;
  heiId: string;
  stage: ProjectStage;
  progress: number; // 0–100
  team: ProjectMember[];
  milestones: Milestone[];
  documents: ProjectDocument[];
  updates: ProjectUpdate[];
  industryPartners: { name: string; role: string }[];
  funding: { sanctioned: number; spent: number }; // in ₹ Lakh
  started: string;
  eta: string;
}

/* ---------------- Industry ---------------- */

export type SupportType =
  | "Mentorship"
  | "Funding"
  | "Manufacturing"
  | "Infrastructure"
  | "Pilot Support"
  | "Technology Transfer";

export interface Opportunity {
  id: string;
  title: string;
  heiShort: string; // "BIT Mesra"
  heiFull: string;
  challengeCode: string;
  stage: string; // "Prototype Stage" etc
  category: Category;
  district: string;
  socialReach: number;
  summary: string;
  needs: { type: SupportType; detail: string; amount?: string }[];
  matchScore?: number;
}

export interface Collaboration {
  id: string;
  partner: string; // industry name
  hei: string;
  title: string;
  status: "In discussion" | "MOU signed" | "Active";
  since: string;
  valueLakh?: number;
  supportType: SupportType;
  stage: string;
}

/* ---------------- Messages ---------------- */

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  participant: string;
  subtitle: string; // role / org
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  messages: ChatMessage[];
}

/* ---------------- Impact ---------------- */

export interface ImpactMetric {
  label: string;
  before: string;
  after: string;
  unit?: string;
  improvement: string; // "+124%" etc
  good: boolean;
}

export interface ImpactStory {
  id: string;
  title: string;
  challengeCode: string;
  district: string;
  category: Category;
  image: string;
  headlineMetric: string; // "42,000 citizens reached"
  summary: string;
  story: string; // narrative paragraph
  metrics: ImpactMetric[];
  journey: { stage: Stage; date: string }[];
  partners: { hei: string; industry: string };
  quote: { text: string; author: string; place: string };
  deployedAgo: string;
}

/* ---------------- Government analytics ---------------- */

export interface DistrictStat {
  name: string;
  challenges: number;
  validated: number;
  projects: number;
  topCategory: Category;
  density: number; // 0–100 for heatmap intensity
  x: number; // % position on stylized map
  y: number;
}

export interface FunnelStageData {
  label: string;
  value: number;
}

export interface DomainSliceData {
  category: Category;
  count: number;
  percent: number;
}

export interface MonthlyTrendPoint {
  month: string;
  challenges: number;
  validated: number;
}

export interface HEIRankingRow {
  heiId: string;
  shortName: string;
  accepted: number;
  projects: number;
  pilots: number;
  deployments: number;
  score: number;
}

export interface IndustryEngagementData {
  activePartners: number;
  mouSigned: number;
  fundingCommittedLakh: number;
  techTransfers: number;
}

export interface AllocationRow {
  id: string;
  projectCode: string;
  project: string;
  hei: string;
  district: string;
  sanctionedLakh: number;
  disbursedLakh: number;
  stage: ProjectStage;
  status: "Disbursed" | "Partially disbursed" | "Pending" | "Utilisation pending";
}

/* ---------------- Submit flow ---------------- */

export interface SubmitDraft {
  title: string;
  description: string;
  district: string;
  category: Category;
  priority: Priority;
  priorityScore: number;
  confidence: number;
  expertise: string[];
  mediaCount: number;
}
