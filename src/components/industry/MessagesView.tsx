"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, SearchX, X } from "lucide-react";
import { INDUSTRY_CONVERSATIONS } from "@/lib/data/conversations";
import { useApp } from "@/lib/store";
import { EmptyState } from "@/components/shared/kit";
import { cn } from "@/lib/utils";

function ConversationRow({
  index,
  participant,
  subtitle,
  initials,
  color,
  lastMessage,
  time,
  unread,
  online,
  onOpen,
}: {
  index: number;
  participant: string;
  subtitle: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <span
        className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[13.5px] font-bold text-white"
        style={{ background: color }}
      >
        {initials}
        {online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-brand" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-[14px] font-bold tracking-[-0.01em] text-ink">
            {participant}
          </p>
          <span className="nums shrink-0 text-[10.5px] font-semibold text-ink-soft/70">
            {time}
          </span>
        </div>
        <p className="truncate text-[11px] font-semibold text-ink-soft/90">{subtitle}</p>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-[12px]",
              unread > 0 ? "font-semibold text-ink" : "text-ink-soft"
            )}
          >
            {lastMessage}
          </p>
          {unread > 0 && (
            <span className="nums grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="shimmer h-12 w-12 shrink-0 rounded-2xl bg-secondary" />
      <div className="flex-1 space-y-2">
        <div className="shimmer h-3.5 w-2/3 rounded-full bg-secondary" />
        <div className="shimmer h-3 w-1/2 rounded-full bg-secondary" />
        <div className="shimmer h-3 w-5/6 rounded-full bg-secondary" />
      </div>
    </div>
  );
}

export function IndustryMessagesView() {
  const push = useApp((s) => s.push);

  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INDUSTRY_CONVERSATIONS;
    return INDUSTRY_CONVERSATIONS.filter(
      (c) =>
        c.participant.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [query]);

  const unreadThreads = INDUSTRY_CONVERSATIONS.filter((c) => c.unread > 0).length;

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-5">
        <div>
          <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Messages
          </h1>
          <p className="mt-1.5 text-[12.5px] text-ink-soft">
            HEI coordinators &amp; platform desk
          </p>
        </div>
        {unreadThreads > 0 && (
          <span
            className="mt-1.5 shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
            style={{ background: "rgba(224,165,56,0.16)", color: "#D98A1F" }}
          >
            {unreadThreads} unread
          </span>
        )}
      </div>

      {/* Search */}
      <div className="glass sticky top-0 z-20 border-b border-border/60 pb-2.5 pt-2.5">
        <div className="px-4">
          <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5">
            <Search size={16} className="shrink-0 text-ink-soft/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people & messages"
              className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-soft/60"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="tap grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-ink-soft"
              >
                <X size={12} strokeWidth={2.6} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversations */}
      <div className="pt-3">
        {loading ? (
          <div className="mx-4 overflow-hidden rounded-3xl bg-card shadow-float">
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX size={22} />}
            title="No conversations found"
            sub="Try a different name, role or message text."
            action={
              <button
                onClick={() => setQuery("")}
                className="tap h-10 rounded-2xl bg-ink px-5 text-[13px] font-semibold text-white"
              >
                Clear search
              </button>
            }
          />
        ) : (
          <div className="mx-4 divide-y divide-border/60 overflow-hidden rounded-3xl bg-card shadow-float">
            {filtered.map((c, i) => (
              <ConversationRow
                key={c.id}
                index={i}
                participant={c.participant}
                subtitle={c.subtitle}
                initials={c.initials}
                color={c.color}
                lastMessage={c.lastMessage}
                time={c.time}
                unread={c.unread}
                online={c.online}
                onOpen={() => push({ type: "chat", conversationId: c.id })}
              />
            ))}
          </div>
        )}

        {!loading && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft/70">
            <MessageCircle size={11} />
            Simulated conversations · replies are mocked
          </p>
        )}
      </div>
    </div>
  );
}
