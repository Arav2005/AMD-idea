import { BarChart3, ShieldCheck, ShieldAlert, ShieldX, Activity } from "lucide-react";
import type { AnalyticsData } from "@/hooks/useMessages";

interface AnalyticsProps {
  data: AnalyticsData;
}

export function DetectionAnalytics({ data }: AnalyticsProps) {
  const safePercent = data.total > 0 ? (data.safe / data.total) * 100 : 0;
  const suspPercent = data.total > 0 ? (data.suspicious / data.total) * 100 : 0;
  const highPercent = data.total > 0 ? (data.highRisk / data.total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <BarChart3 className="h-5 w-5" />
        <h2 className="font-display text-lg font-semibold">Detection Analytics</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Activity className="h-5 w-5" />} label="Total Scanned" value={data.total.toString()} color="text-foreground" />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Safe" value={data.safe.toString()} color="text-safe" />
        <StatCard icon={<ShieldAlert className="h-5 w-5" />} label="Suspicious" value={data.suspicious.toString()} color="text-suspicious" />
        <StatCard icon={<ShieldX className="h-5 w-5" />} label="High Risk" value={data.highRisk.toString()} color="text-high-risk" />
      </div>

      {data.total > 0 && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-display text-muted-foreground uppercase tracking-wider">Threat Distribution</p>
          <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
            {safePercent > 0 && <div className="bg-safe transition-all duration-500" style={{ width: `${safePercent}%` }} />}
            {suspPercent > 0 && <div className="bg-suspicious transition-all duration-500" style={{ width: `${suspPercent}%` }} />}
            {highPercent > 0 && <div className="bg-high-risk transition-all duration-500" style={{ width: `${highPercent}%` }} />}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Safe {safePercent.toFixed(0)}%</span>
            <span>Suspicious {suspPercent.toFixed(0)}%</span>
            <span>High Risk {highPercent.toFixed(0)}%</span>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Avg. Scam Score</p>
            <p className="font-display text-2xl font-bold text-foreground">{(data.avgScore * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className={`${color} mb-1`}>{icon}</div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
