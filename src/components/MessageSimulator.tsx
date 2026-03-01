import { useState } from "react";
import { Send, Radio } from "lucide-react";

interface SimulatorProps {
  onSimulate: (sender: string, number: string, text: string) => void;
}

const PRESETS = [
  { label: "Safe", sender: "Mom", number: "+1234567890", text: "Hey! Are you coming for dinner tonight? Love you!" },
  { label: "Suspicious", sender: "Unknown", number: "+9876543210", text: "Your account has been locked. Click here to verify: http://scam-link.xyz" },
  { label: "High Risk", sender: "IRS Dept", number: "+1112223333", text: "URGENT: You owe $5,000 in unpaid taxes. Send payment immediately via wire transfer or a warrant will be issued for your arrest. Call now!" },
];

export function MessageSimulator({ onSimulate }: SimulatorProps) {
  const [sender, setSender] = useState("");
  const [number, setNumber] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!sender.trim() || !text.trim()) return;
    onSimulate(sender.trim(), number.trim() || "Unknown", text.trim());
    setSender("");
    setNumber("");
    setText("");
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setSender(preset.sender);
    setNumber(preset.number);
    setText(preset.text);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Radio className="h-5 w-5" />
        <h2 className="font-display text-lg font-semibold">Message Simulator</h2>
      </div>
      <p className="text-sm text-muted-foreground">Simulate an incoming notification to test the scam detection engine.</p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => loadPreset(p)}
            className="rounded-lg border border-border bg-secondary px-3 py-1.5 font-display text-xs text-secondary-foreground transition-colors hover:bg-accent"
          >
            Load {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-display text-muted-foreground uppercase tracking-wider">Sender Name</label>
            <input
              value={sender}
              onChange={e => setSender(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-display text-muted-foreground uppercase tracking-wider">Phone Number</label>
            <input
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-display text-muted-foreground uppercase tracking-wider">Message Content</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            placeholder="Type a message to analyze..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!sender.trim() || !text.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-display text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          Simulate Incoming Message
        </button>
      </div>
    </div>
  );
}
