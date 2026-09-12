"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  format?: (n: number) => string;
  className?: string;
  startOnView?: boolean;
}

/** Count-up number that animates with a spring-like ease when mounted / scrolled into view. */
export function AnimatedNumber({
  value,
  duration = 1.1,
  delay = 0,
  format,
  className,
  startOnView = true,
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = React.useState(0);

  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString("en-IN"));

  React.useEffect(() => {
    if (!startOnView || inView) {
      const controls = animate(0, value, {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setDisplay(v),
      });
      return () => controls.stop();
    }
  }, [value, inView, duration, delay, startOnView]);

  return (
    <span ref={ref} className={cn("nums", className)}>
      {fmt(display)}
    </span>
  );
}

/** Formats Indian-style compact numbers: 48200 -> "48.2K" */
export function compactIN(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${n}`;
}
