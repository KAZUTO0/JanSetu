"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle, Inbox } from "lucide-react";
import { useApp } from "@/lib/store";
import { HEI_CONVERSATIONS } from "@/lib/data/conversations";
import { EmptyState } from "@/components/shared/kit";
import {
  HeiPageHeader,
  InitialsTile,
  RowsSkeleton,
  useDelayedReady,
  listStagger,
  riseItem,
} from "./parts";

export function HeiMessagesView() {
  const push = useApp((s) => s.push);
  const ready = useDelayedReady(700);
  const [query, setQuery] = React.useState("");

  const totalUnread = HEI_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HEI_CONVERSATIONS;
    return HEI_CONVERSATIONS.filter((c) =>
      `${c.participant} ${c.subtitle} ${c.lastMessage}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="pt-1">
      <HeiPageHeader
        title="Messages"
        sub="District, industry & platform conversations"
        right={
          <span className="mb-1 shrink-0 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white">
            {totalUnread} unread
          </span>
        }
      />

      {/* Search */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 shadow-float">
          <Search size={15} strokeWidth={2.4} className="shrink-0 text-ink-soft/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="h-10 min-w-0 flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Conversation rows */}
      {!ready ? (
        <div className="pt-4">
          <RowsSkeleton count={5} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox size={22} strokeWidth={2.2} />}
          title="No conversations found"
          sub={`Nothing matches “${query.trim()}” in your messages.`}
        />
      ) : (
        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="space-y-3 px-4 pt-4"
        >
          {filtered.map((c) => (
            <motion.button
              key={c.id}
              variants={riseItem}
              onClick={() => push({ type: "chat", conversationId: c.id })}
              className="tap flex w-full items-center gap-3 rounded-3xl bg-card p-4 text-left shadow-float"
            >
              <span className="relative shrink-0">
                <InitialsTile initials={c.initials} color={c.color} size={46} />
                {c.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-brand" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] font-bold text-ink">
                    {c.participant}
                  </span>
                  <span className="shrink-0 text-[10.5px] font-semibold text-ink-soft/80">
                    {c.time}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-ink-soft/90">
                  {c.subtitle}
                </span>
                <span className="mt-1 block truncate text-[12px] text-ink-soft">
                  {c.lastMessage}
                </span>
              </span>

              {c.unread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.3 }}
                  className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1 text-[10.5px] font-bold text-white"
                >
                  {c.unread}
                </motion.span>
              )}
            </motion.button>
          ))}

          <motion.p
            variants={riseItem}
            className="flex items-center justify-center gap-1.5 pt-1 text-[10.5px] font-semibold text-ink-soft/60"
          >
            <MessageCircle size={11} strokeWidth={2.4} />
            {HEI_CONVERSATIONS.length} conversations · replies simulated
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
