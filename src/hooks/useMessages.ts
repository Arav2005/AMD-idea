import { useState, useCallback } from "react";
import { analyzeMessage, type AnalysisResult, type ThreatLevel } from "@/lib/scamDetector";

export interface Message {
  id: string;
  sender: string;
  number: string;
  text: string;
  timestamp: Date;
  analysis: AnalysisResult;
}

export interface AnalyticsData {
  total: number;
  safe: number;
  suspicious: number;
  highRisk: number;
  avgScore: number;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAlert, setActiveAlert] = useState<Message | null>(null);

  const addMessage = useCallback((sender: string, number: string, text: string) => {
    const analysis = analyzeMessage(text);
    const msg: Message = {
      id: crypto.randomUUID(),
      sender,
      number,
      text,
      timestamp: new Date(),
      analysis,
    };

    setMessages(prev => [msg, ...prev]);

    if (analysis.threatLevel === "high-risk") {
      setActiveAlert(msg);
    }

    return msg;
  }, []);

  const dismissAlert = useCallback(() => setActiveAlert(null), []);

  const analytics: AnalyticsData = {
    total: messages.length,
    safe: messages.filter(m => m.analysis.threatLevel === "safe").length,
    suspicious: messages.filter(m => m.analysis.threatLevel === "suspicious").length,
    highRisk: messages.filter(m => m.analysis.threatLevel === "high-risk").length,
    avgScore: messages.length > 0
      ? messages.reduce((sum, m) => sum + m.analysis.score, 0) / messages.length
      : 0,
  };

  const getByThreat = (level?: ThreatLevel) =>
    level ? messages.filter(m => m.analysis.threatLevel === level) : messages;

  return { messages, addMessage, activeAlert, dismissAlert, analytics, getByThreat };
}
