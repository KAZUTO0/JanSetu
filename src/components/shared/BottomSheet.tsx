"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const SPRING = { type: "spring" as const, stiffness: 380, damping: 34 };
export const SPRING_SOFT = { type: "spring" as const, stiffness: 260, damping: 26 };

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  maxH?: string;
}

/**
 * Premium iOS-style bottom sheet with drag-to-dismiss.
 * Rendered inside the phone frame container (.app-frame).
 */
export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
  maxH = "max-h-[82%]",
}: BottomSheetProps) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-ink/35 backdrop-blur-[3px]"
          />
          <motion.div
            initial={{ y: "104%" }}
            animate={{ y: 0 }}
            exit={{ y: "104%" }}
            transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 400, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 650) onClose();
            }}
            className={cn(
              "absolute inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[28px] bg-card shadow-float-lg",
              maxH,
              className
            )}
          >
            <div className="flex justify-center pt-2.5 pb-1 shrink-0 cursor-grab active:cursor-grabbing touch-none">
              <div className="h-1.5 w-10 rounded-full bg-ink/15" />
            </div>
            {(title || subtitle) && (
              <div className="relative px-5 pb-3 pt-1 shrink-0">
                {title && (
                  <h3 className="text-[17px] font-bold tracking-[-0.01em] text-ink">{title}</h3>
                )}
                {subtitle && (
                  <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{subtitle}</p>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-4 top-0 grid h-8 w-8 place-items-center rounded-full bg-secondary text-ink-soft tap"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              </div>
            )}
            <div className="jansetu-scroll overflow-y-auto overscroll-contain px-5 pb-8 flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
