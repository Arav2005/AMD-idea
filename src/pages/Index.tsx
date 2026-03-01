import { useState } from "react";
import { Shield, Inbox, Radio, BarChart3, Info } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { MessageSimulator } from "@/components/MessageSimulator";
import { MessageInbox } from "@/components/MessageInbox";
import { DetectionAnalytics } from "@/components/DetectionAnalytics";
import { PrivacyInfo } from "@/components/PrivacyInfo";
import { HighRiskAlert } from "@/components/AlertOverlay";

type Tab = "inbox" | "simulator" | "analytics" | "privacy";

const tabs: { id: Tab; label: string; Icon: typeof Shield }[] = [
  { id: "inbox", label: "Inbox", Icon: Inbox },
  { id: "simulator", label: "Simulate", Icon: Radio },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
  { id: "privacy", label: "Info", Icon: Info },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("simulator");
  const { messages, addMessage, activeAlert, dismissAlert, analytics, getByThreat } = useMessages();

  const handleSimulate = (sender: string, number: string, text: string) => {
    const msg = addMessage(sender, number, text);
    // Switch to inbox if safe/suspicious, stay for high-risk (overlay shows)
    if (msg.analysis.threatLevel !== "high-risk") {
      setActiveTab("inbox");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-foreground leading-tight">ScamShield</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Scam Detection</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-safe animate-pulse-glow" />
            <span className="font-display text-xs text-safe">Protected</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4">
        {activeTab === "inbox" && <MessageInbox messages={messages} getByThreat={getByThreat} />}
        {activeTab === "simulator" && <MessageSimulator onSimulate={handleSimulate} />}
        {activeTab === "analytics" && <DetectionAnalytics data={analytics} />}
        {activeTab === "privacy" && <PrivacyInfo />}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-40 border-t border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${
                activeTab === id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {id === "inbox" && messages.filter(m => m.analysis.threatLevel !== "safe").length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-high-risk text-[10px] font-bold text-high-risk-foreground">
                    {messages.filter(m => m.analysis.threatLevel !== "safe").length}
                  </span>
                )}
              </div>
              <span className="font-display text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* High Risk Alert Overlay */}
      {activeAlert && <HighRiskAlert message={activeAlert} onDismiss={dismissAlert} />}
    </div>
  );
};

export default Index;
