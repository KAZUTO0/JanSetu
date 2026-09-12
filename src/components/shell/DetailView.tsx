"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING } from "@/components/shared/BottomSheet";

/**
 * Chrome for pushed detail views: sticky frosted header with back button,
 * iOS-style collapsing large title, and own scroll container.
 */
export function DetailView({
  title,
  eyebrow,
  onBack,
  children,
  headerRight,
  bare = false,
}: {
  title: string;
  eyebrow?: string;
  onBack: () => void;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  bare?: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState(false);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCollapsed(el.scrollTop > 52);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={SPRING}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.7 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120 || info.velocity.x > 550) onBack();
      }}
      className="absolute inset-0 z-30 flex flex-col bg-background"
    >
      {/* Sticky frosted header */}
      <div
        className={cn(
          "relative z-20 shrink-0 border-b transition-all duration-200",
          collapsed ? "border-border glass" : "border-transparent bg-transparent"
        )}
      >
        <div className="flex items-center gap-2 px-3 pt-3 pb-2.5">
          <button
            onClick={onBack}
            aria-label="Back"
            className="tap flex h-9 items-center gap-0.5 rounded-full bg-card pl-1.5 pr-3 text-[14px] font-semibold text-brand shadow-float"
          >
            <ChevronLeft size={18} strokeWidth={2.6} />
            <span className="sr-only">Back</span>
          </button>
          <motion.div
            animate={{ opacity: collapsed ? 1 : 0, y: collapsed ? 0 : 6 }}
            transition={{ duration: 0.18 }}
            className="flex-1 truncate text-center text-[15px] font-bold tracking-[-0.01em] text-ink"
          >
            {title}
          </motion.div>
          <div className="min-w-[72px] text-right">{headerRight}</div>
        </div>
      </div>

      {/* Scroll content with large title */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="jansetu-scroll flex-1 overflow-y-auto overscroll-contain"
      >
        {!bare && (
          <div className="px-4 pb-2 pt-3">
            {eyebrow && (
              <p className="mb-1 text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand">
                {eyebrow}
              </p>
            )}
            <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
              {title}
            </h1>
          </div>
        )}
        {children}
        <div className="h-8" />
      </div>
    </motion.div>
  );
}
