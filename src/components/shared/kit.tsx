"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Category, Priority, Stage } from "@/lib/types";
import { CATEGORY_META, PRIORITY_META, STAGE_META } from "@/lib/data/categories";
import {
  Droplets, Sprout, HeartPulse, GraduationCap, Leaf, Route,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  droplets: Droplets,
  sprout: Sprout,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  leaf: Leaf,
  route: Route,
};

export function CategoryIcon({ category, size = 14, className }: { category: Category | string; size?: number; className?: string }) {
  const meta = CATEGORY_META[category as Category];
  const Icon = ICONS[meta?.icon ?? "droplets"] ?? Droplets;
  return <Icon size={size} strokeWidth={2.2} className={className} style={{ color: meta?.color }} />;
}

/** Small colored category chip with icon */
export function CategoryChip({ category, className, onClick }: { category: Category | string; className?: string; onClick?: () => void }) {
  const meta = CATEGORY_META[category as Category];
  if (!meta) return null;
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        onClick && "cursor-pointer tap",
        className
      )}
      style={{ background: meta.soft, color: meta.color }}
    >
      <CategoryIcon category={category} size={12} />
      {meta.name}
    </span>
  );
}

/** Priority pill (Critical / High / Medium / Low) */
export function PriorityPill({ priority, className }: { priority: Priority | string; className?: string }) {
  const meta = PRIORITY_META[priority as string] ?? PRIORITY_META.Medium;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", className)}
      style={{ background: meta.bg, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

/** Lifecycle stage badge with a subtle dot */
export function StageBadge({ stage, className }: { stage: Stage | string; className?: string }) {
  const meta = STAGE_META[stage as string] ?? STAGE_META.Reported;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        className
      )}
      style={{ background: `${meta.color}1A`, color: meta.color }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: meta.color }} />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      </span>
      {stage}
    </span>
  );
}

/** Circular animated score ring (priority score / match %) */
export function ScoreRing({
  value,
  size = 44,
  stroke = 4,
  color,
  label,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone = color ?? (value >= 85 ? "#D64524" : value >= 70 ? "#D98A1F" : "#0E8A6D");
  return (
    <div className={cn("relative grid place-items-center shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E7EAE3" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="nums text-[12px] font-bold leading-none" style={{ color: tone }}>
          {value}
        </span>
        {label && <span className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider text-ink-soft">{label}</span>}
      </div>
    </div>
  );
}

/** Cover image with elegant gradient fallback while loading */
export function CoverImage({
  src,
  alt,
  className,
  ratio = "aspect-[16/10]",
  overlay = true,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-secondary", ratio, className)}>
      {!loaded && <div className="absolute inset-0 shimmer bg-secondary" />}
      <motion.img
        src={src}
        alt={alt}
        initial={false}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.04 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onLoad={() => setLoaded(true)}
        className="h-full w-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
      )}
      {children}
    </div>
  );
}

/** Section header with optional action */
export function SectionHeader({
  title,
  action,
  onAction,
  sub,
  className,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between px-4", className)}>
      <div>
        <h2 className="text-[19px] font-bold tracking-[-0.02em] text-ink">{title}</h2>
        {sub && <p className="mt-0.5 text-[12.5px] text-ink-soft">{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction} className="tap text-[13px] font-semibold text-brand">
          {action}
        </button>
      )}
    </div>
  );
}

/** Filter chip row used across top filters */
export function FilterChips<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: { id: T; label: string; icon?: React.ReactNode }[];
  value: T | null;
  onChange: (v: T | null) => void;
  className?: string;
}) {
  return (
    <div className={cn("no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1", className)}>
      {items.map((item) => {
        const active = value === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(active ? null : item.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
              active
                ? "border-transparent bg-ink text-white"
                : "border-border bg-card text-ink-soft hover:text-ink"
            )}
          >
            {item.icon}
            {item.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/** Card skeleton loader */
export function CardSkeleton() {
  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-3xl bg-card">
      <div className="shimmer aspect-[16/10] bg-secondary" />
      <div className="space-y-2.5 p-4">
        <div className="shimmer h-3.5 w-2/3 rounded-full bg-secondary" />
        <div className="shimmer h-3 w-1/2 rounded-full bg-secondary" />
        <div className="flex gap-2 pt-1">
          <div className="shimmer h-6 w-16 rounded-full bg-secondary" />
          <div className="shimmer h-6 w-20 rounded-full bg-secondary" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Empty state */
export function EmptyState({
  icon,
  title,
  sub,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-14 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-ink-soft">
        {icon}
      </div>
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      {sub && <p className="mt-1 max-w-[240px] text-[12.5px] leading-relaxed text-ink-soft">{sub}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
