import { ShieldX, X, AlertTriangle } from "lucide-react";
import type { Message } from "@/hooks/useMessages";

interface HighRiskAlertProps {
  message: Message;
  onDismiss: () => void;
}

export function HighRiskAlert({ message, onDismiss }: HighRiskAlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-high-risk/20 backdrop-blur-sm animate-slide-in">
      <div className="mx-4 w-full max-w-md rounded-2xl border-2 border-high-risk/50 bg-card p-6 glow-danger">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-high-risk/20">
              <ShieldX className="h-6 w-6 text-high-risk animate-pulse-glow" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-high-risk">SCAM DETECTED</h3>
              <p className="text-sm text-muted-foreground">High-risk message intercepted</p>
            </div>
          </div>
          <button onClick={onDismiss} className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-background/50 p-3">
          <p className="text-xs text-muted-foreground font-display">From: {message.sender} ({message.number})</p>
          <p className="mt-1 text-sm text-foreground">{message.text}</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-display text-muted-foreground uppercase tracking-wider">Threat Analysis</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-display text-high-risk font-bold">{(message.analysis.score * 100).toFixed(0)}%</span>
            <span className="text-muted-foreground">scam probability</span>
          </div>
          {message.analysis.reasons.map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-high-risk/80">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {reason}
            </div>
          ))}
        </div>

        <button
          onClick={onDismiss}
          className="mt-5 w-full rounded-lg bg-high-risk py-2.5 font-display text-sm font-semibold text-high-risk-foreground transition-colors hover:bg-high-risk/90"
        >
          Dismiss & Block Sender
        </button>
      </div>
    </div>
  );
}

interface SuspiciousBannerProps {
  message: Message;
}

export function SuspiciousBanner({ message }: SuspiciousBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-suspicious/30 bg-suspicious/10 px-4 py-3 glow-warning animate-slide-in">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-suspicious" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-suspicious">Suspicious message from {message.sender}</p>
        <p className="text-xs text-muted-foreground truncate">{message.analysis.reasons[0]}</p>
      </div>
      <span className="font-display text-sm font-bold text-suspicious">{(message.analysis.score * 100).toFixed(0)}%</span>
    </div>
  );
}
