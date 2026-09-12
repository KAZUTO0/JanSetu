"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Send, Phone, Video } from "lucide-react";
import { convById } from "@/lib/data/conversations";
import { useApp } from "@/lib/store";
import { SPRING } from "@/components/shared/BottomSheet";
import { cn } from "@/lib/utils";

/** Shared chat detail view used by HEI & Industry Messages. */
export function ChatView({ conversationId }: { conversationId: string }) {
  const { pop, toast } = useApp();
  const conv = convById(conversationId);
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState(conv?.messages ?? []);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!conv) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      {
        id: `local-${Date.now()}`,
        from: "me",
        text,
        time: "now",
      },
    ]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `reply-${Date.now()}`,
          from: "them",
          text: "Noted — I'll circle back shortly with details.",
          time: "now",
        },
      ]);
      toast("Message sent", "This is a simulated reply (prototype)");
    }, 1400);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={SPRING}
      className="absolute inset-0 z-30 flex flex-col bg-background"
    >
      {/* Chat header */}
      <div className="glass sticky top-0 z-20 shrink-0 border-b border-border px-3 pt-3 pb-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={pop}
            aria-label="Back"
            className="tap grid h-9 w-9 place-items-center rounded-full bg-card text-brand shadow-float"
          >
            <ChevronLeft size={18} strokeWidth={2.6} />
          </button>
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white"
            style={{ background: conv.color }}
          >
            {conv.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-bold leading-tight text-ink">
              {conv.participant}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-ink-soft">
              {conv.online && (
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              )}
              {conv.online ? "Active now" : conv.subtitle}
            </p>
          </div>
          <button
            onClick={() => toast("Voice call", "Calling is simulated in this prototype")}
            className="tap grid h-9 w-9 place-items-center rounded-full bg-secondary text-ink-soft"
            aria-label="Voice call"
          >
            <Phone size={15} />
          </button>
          <button
            onClick={() => toast("Video call", "Calling is simulated in this prototype")}
            className="tap grid h-9 w-9 place-items-center rounded-full bg-secondary text-ink-soft"
            aria-label="Video call"
          >
            <Video size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="jansetu-scroll flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        <p className="mb-2 text-center text-[10.5px] font-semibold uppercase tracking-wider text-ink-soft/70">
          Today
        </p>
        {messages.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i < 4 ? i * 0.03 : 0, duration: 0.22 }}
            className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                m.from === "me"
                  ? "rounded-br-md bg-brand text-white"
                  : "rounded-bl-md bg-card text-ink shadow-float"
              )}
            >
              {m.text}
              <span
                className={cn(
                  "mt-1 block text-[9.5px]",
                  m.from === "me" ? "text-white/60" : "text-ink-soft/70"
                )}
              >
                {m.time}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="glass shrink-0 border-t border-border px-3 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message…"
            className="h-10 flex-1 rounded-full border border-border bg-card px-4 text-[13.5px] text-ink placeholder:text-ink-soft/60 focus:border-brand/40 focus:outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={send}
            disabled={!draft.trim()}
            aria-label="Send"
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full transition-colors",
              draft.trim() ? "bg-brand text-white" : "bg-secondary text-ink-soft/50"
            )}
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
