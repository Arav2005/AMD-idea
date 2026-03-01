import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { ThreatLevel } from "@/lib/scamDetector";

interface ThreatBadgeProps {
  level: ThreatLevel;
  size?: "sm" | "md" | "lg";
}

const config: Record<ThreatLevel, { label: string; className: string; Icon: typeof Shield }> = {
  safe: {
    label: "Safe",
    className: "bg-safe/15 text-safe border-safe/30",
    Icon: ShieldCheck,
  },
  suspicious: {
    label: "Suspicious",
    className: "bg-suspicious/15 text-suspicious border-suspicious/30",
    Icon: ShieldAlert,
  },
  "high-risk": {
    label: "High Risk",
    className: "bg-high-risk/15 text-high-risk border-high-risk/30",
    Icon: ShieldX,
  },
};

const sizes = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

export function ThreatBadge({ level, size = "md" }: ThreatBadgeProps) {
  const { label, className, Icon } = config[level];
  return (
    <span className={`inline-flex items-center rounded-full border font-display font-medium ${className} ${sizes[size]}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5"} />
      {label}
    </span>
  );
}
