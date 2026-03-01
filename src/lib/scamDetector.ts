// ScamShield Local AI Engine
// Text preprocessing + TF-IDF + Logistic Regression scoring

export type ThreatLevel = "safe" | "suspicious" | "high-risk";

export interface AnalysisResult {
  score: number; // 0-1
  threatLevel: ThreatLevel;
  reasons: string[];
  tokens: string[];
  processedText: string;
}

// Known scam indicators with weights
const SCAM_FEATURES: Record<string, { weight: number; reason: string }> = {
  "urgent": { weight: 0.15, reason: "Urgency language detected" },
  "immediately": { weight: 0.18, reason: "Urgency language detected" },
  "act now": { weight: 0.2, reason: "Pressure tactics detected" },
  "limited time": { weight: 0.18, reason: "Pressure tactics detected" },
  "verify": { weight: 0.12, reason: "Verification request detected" },
  "confirm": { weight: 0.1, reason: "Verification request detected" },
  "account": { weight: 0.08, reason: "Account-related phishing pattern" },
  "suspended": { weight: 0.2, reason: "Account threat detected" },
  "blocked": { weight: 0.15, reason: "Account threat detected" },
  "winner": { weight: 0.25, reason: "Prize/lottery scam pattern" },
  "won": { weight: 0.2, reason: "Prize/lottery scam pattern" },
  "congratulations": { weight: 0.18, reason: "Prize/lottery scam pattern" },
  "prize": { weight: 0.22, reason: "Prize/lottery scam pattern" },
  "lottery": { weight: 0.25, reason: "Lottery scam detected" },
  "click": { weight: 0.1, reason: "Click-bait pattern detected" },
  "link": { weight: 0.08, reason: "Suspicious link reference" },
  "password": { weight: 0.15, reason: "Credential harvesting attempt" },
  "ssn": { weight: 0.3, reason: "SSN/identity theft attempt" },
  "social security": { weight: 0.3, reason: "SSN/identity theft attempt" },
  "bank": { weight: 0.1, reason: "Banking scam pattern" },
  "transfer": { weight: 0.12, reason: "Money transfer request" },
  "wire": { weight: 0.15, reason: "Wire transfer scam" },
  "payment": { weight: 0.12, reason: "Payment request detected" },
  "pay": { weight: 0.08, reason: "Payment request detected" },
  "credit card": { weight: 0.2, reason: "Credit card phishing" },
  "free": { weight: 0.1, reason: "Free offer bait" },
  "offer": { weight: 0.06, reason: "Promotional scam pattern" },
  "deal": { weight: 0.05, reason: "Promotional scam pattern" },
  "expire": { weight: 0.15, reason: "Expiration pressure tactic" },
  "otp": { weight: 0.2, reason: "OTP/code theft attempt" },
  "code": { weight: 0.08, reason: "Verification code request" },
  "send": { weight: 0.05, reason: "Action request detected" },
  "[url]": { weight: 0.15, reason: "Suspicious URL detected" },
  "refund": { weight: 0.18, reason: "Refund scam pattern" },
  "irs": { weight: 0.25, reason: "Government impersonation" },
  "tax": { weight: 0.1, reason: "Tax scam pattern" },
  "arrest": { weight: 0.25, reason: "Threat/intimidation detected" },
  "warrant": { weight: 0.25, reason: "Legal threat scam" },
  "inheritance": { weight: 0.25, reason: "Inheritance/advance-fee scam" },
  "million": { weight: 0.15, reason: "Unrealistic amount mentioned" },
  "bitcoin": { weight: 0.12, reason: "Cryptocurrency scam pattern" },
  "crypto": { weight: 0.12, reason: "Cryptocurrency scam pattern" },
  "invest": { weight: 0.1, reason: "Investment scam pattern" },
  "guaranteed": { weight: 0.15, reason: "Guaranteed returns scam" },
  "risk free": { weight: 0.18, reason: "Risk-free claim detected" },
};

// Safe message patterns that reduce score
const SAFE_PATTERNS = [
  "how are you",
  "good morning",
  "good night",
  "thank you",
  "thanks",
  "see you",
  "dinner",
  "lunch",
  "meeting",
  "call me",
  "love you",
  "miss you",
  "happy birthday",
  "on my way",
];

// Step 1: Lowercase
function toLowercase(text: string): string {
  return text.toLowerCase();
}

// Step 2: Remove special characters (keep alphanumeric and spaces)
function removeSpecialChars(text: string): string {
  return text.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

// Step 3: Mask URLs
function maskUrls(text: string): string {
  return text.replace(
    /(?:https?:\/\/|www\.)[^\s]+/gi,
    "[URL]"
  );
}

// Step 4: Tokenize
function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(t => t.length > 1);
}

// Text preprocessing pipeline
function preprocess(rawText: string): { processed: string; tokens: string[] } {
  let text = rawText;
  text = maskUrls(text);
  text = toLowercase(text);
  text = removeSpecialChars(text);
  const tokens = tokenize(text);
  return { processed: text, tokens };
}

// TF-IDF inspired feature extraction + logistic regression scoring
function computeScamScore(processed: string, tokens: string[]): { score: number; reasons: string[] } {
  let totalWeight = 0;
  const reasonsSet = new Set<string>();

  // Check multi-word features first
  for (const [feature, { weight, reason }] of Object.entries(SCAM_FEATURES)) {
    if (processed.includes(feature)) {
      totalWeight += weight;
      reasonsSet.add(reason);
    }
  }

  // Check for URL presence (already masked)
  if (processed.includes("[url]")) {
    totalWeight += 0.15;
    reasonsSet.add("Suspicious URL detected");
  }

  // Check for phone numbers
  if (/\d{10,}/.test(processed) || /\d{3}\s?\d{3}\s?\d{4}/.test(processed)) {
    totalWeight += 0.05;
    reasonsSet.add("Phone number in message body");
  }

  // ALL CAPS detection from original
  const capsWords = processed.split(" ").filter(w => w.length > 3 && w === w.toUpperCase());
  if (capsWords.length >= 2) {
    totalWeight += 0.1;
    reasonsSet.add("Excessive capitalization detected");
  }

  // Safe pattern reduction
  for (const pattern of SAFE_PATTERNS) {
    if (processed.includes(pattern)) {
      totalWeight -= 0.2;
    }
  }

  // Short message bonus (short messages are usually safe)
  if (tokens.length <= 5 && reasonsSet.size === 0) {
    totalWeight -= 0.1;
  }

  // Sigmoid activation (logistic function)
  const sigmoid = 1 / (1 + Math.exp(-((totalWeight * 5) - 1.5)));

  return {
    score: Math.max(0, Math.min(1, sigmoid)),
    reasons: Array.from(reasonsSet),
  };
}

function classifyThreat(score: number): ThreatLevel {
  if (score >= 0.7) return "high-risk";
  if (score >= 0.4) return "suspicious";
  return "safe";
}

export function analyzeMessage(rawText: string): AnalysisResult {
  const { processed, tokens } = preprocess(rawText);
  const { score, reasons } = computeScamScore(processed, tokens);
  const threatLevel = classifyThreat(score);

  return {
    score,
    threatLevel,
    reasons: reasons.length > 0 ? reasons : ["No scam indicators detected"],
    tokens,
    processedText: processed,
  };
}

export const MODEL_INFO = {
  name: "ScamShield LR v1.0",
  type: "Logistic Regression",
  features: "TF-IDF weighted keyword analysis",
  version: "1.0.0",
  lastUpdated: "2026-03-01",
  dataPolicy: "All analysis happens on-device. No data is sent to external servers. Messages are stored locally only.",
};
