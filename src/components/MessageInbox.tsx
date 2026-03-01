import { useState } from "react";
import { Inbox as InboxIcon, Filter } from "lucide-react";
import type { Message } from "@/hooks/useMessages";
import type { ThreatLevel } from "@/lib/scamDetector";
import { ThreatBadge } from "./ThreatBadge";
import { SuspiciousBanner } from "./AlertOverlay";

interface InboxProps {
  messages: Message[];
  getByThreat: (level?: ThreatLevel) => Message[];
}

const filters: { label: string; value: ThreatLevel | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Safe", value: "safe" },
  { label: "Suspicious", value: "suspicious" },
  { label: "High Risk", value: "high-risk" },
];

export function MessageInbox({ messages, getByThreat }: InboxProps) {
  const [filter, setFilter] = useState<ThreatLevel | "all">("all");
  const filtered = filter === "all" ? messages : getByThreat(filter as ThreatLevel);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <InboxIcon className="h-5 w-5" />
          <h2 className="font-display text-lg font-semibold">Inbox</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 font-display text-xs text-secondary-foreground">{messages.length}</span>
        </div>
        <Filter className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 font-display text-xs transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Show suspicious banners at top */}
      {filtered.filter(m => m.analysis.threatLevel === "suspicious").slice(0, 2).map(m => (
        <SuspiciousBanner key={m.id + "-banner"} message={m} />
      ))}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <InboxIcon className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Use the simulator to test</p>
          </div>
        ) : (
          filtered.map(msg => (
            <div
              key={msg.id}
              className={`rounded-lg border bg-card p-3 transition-all animate-slide-in ${
                msg.analysis.threatLevel === "high-risk"
                  ? "border-high-risk/30 glow-danger"
                  : msg.analysis.threatLevel === "suspicious"
                  ? "border-suspicious/30"
                  : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-foreground">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">{msg.number}</span>
                  </div>
                  <p className="mt-1 text-sm text-secondary-foreground line-clamp-2">{msg.text}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{msg.timestamp.toLocaleTimeString()}</span>
                    <span>·</span>
                    <span className="font-display">{(msg.analysis.score * 100).toFixed(0)}% risk</span>
                  </div>
                </div>
                <ThreatBadge level={msg.analysis.threatLevel} size="sm" />
              </div>
              {msg.analysis.threatLevel !== "safe" && (
                <div className="mt-2 border-t border-border pt-2">
                  {msg.analysis.reasons.map((r, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {r}</p>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
