import { Info, Lock, Cpu, Database } from "lucide-react";
import { MODEL_INFO } from "@/lib/scamDetector";

export function PrivacyInfo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Info className="h-5 w-5" />
        <h2 className="font-display text-lg font-semibold">Model & Privacy</h2>
      </div>

      <div className="space-y-3">
        <InfoRow icon={<Cpu className="h-4 w-4" />} label="Model" value={MODEL_INFO.name} />
        <InfoRow icon={<Database className="h-4 w-4" />} label="Type" value={MODEL_INFO.type} />
        <InfoRow icon={<Info className="h-4 w-4" />} label="Features" value={MODEL_INFO.features} />
        <InfoRow icon={<Info className="h-4 w-4" />} label="Version" value={MODEL_INFO.version} />
        <InfoRow icon={<Info className="h-4 w-4" />} label="Updated" value={MODEL_INFO.lastUpdated} />
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Lock className="h-4 w-4" />
          <p className="font-display text-sm font-semibold">Privacy Guarantee</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{MODEL_INFO.dataPolicy}</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2">How It Works</p>
        <ol className="space-y-2 text-sm text-secondary-foreground">
          <li className="flex gap-2"><span className="font-display text-primary font-bold">1.</span>Message intercepted from notification</li>
          <li className="flex gap-2"><span className="font-display text-primary font-bold">2.</span>Text preprocessed (lowercase, URL masking, tokenization)</li>
          <li className="flex gap-2"><span className="font-display text-primary font-bold">3.</span>TF-IDF feature extraction against scam patterns</li>
          <li className="flex gap-2"><span className="font-display text-primary font-bold">4.</span>Logistic regression generates scam probability</li>
          <li className="flex gap-2"><span className="font-display text-primary font-bold">5.</span>Threat classified: Safe / Suspicious / High-Risk</li>
        </ol>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
