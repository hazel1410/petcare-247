export type UrgencyScore = '1_emergency' | '2_urgent' | '3_moderate' | '4_low' | '5_informational';

export const URGENCY_ORDER: Record<UrgencyScore, number> = {
  '1_emergency': 1,
  '2_urgent': 2,
  '3_moderate': 3,
  '4_low': 4,
  '5_informational': 5,
};

export const HARD_RULE_KEYWORDS = [
  'seizure',
  'breathing trouble',
  'not breathing',
  'collapse',
  'collapsed',
  'bleeding heavily',
  'uncontrolled bleeding',
  'toxin',
  'poison',
  'hit by car',
  'choking',
  'unconscious',
] as const;

export type HardRuleKeyword = (typeof HARD_RULE_KEYWORDS)[number];

export interface KeywordCheckResult {
  hit: boolean;
  matchedKeywords: string[];
  score: UrgencyScore;
}

export interface ContentFilterResult {
  blocked: boolean;
  reason?: string;
  sanitizedOutput?: string;
}

export interface AIPreScreenInput {
  description: string;
  symptoms: string[];
  species: string;
  ageYears?: number;
  ageMonths?: number;
  weightKg?: number;
  knownConditions?: string[];
  medications?: string[];
}

export interface AIPreScreenResult {
  score: UrgencyScore;
  summary: string;
  redFlags: string[];
  guidance: string;
  followUpQuestions: string[];
}

export interface AIAuditLogEntry {
  id: string;
  sessionId: string;
  modelVersion: string;
  prompt: string;
  output: string;
  urgencyScore: UrgencyScore | null;
  contentBlocked: boolean;
  blockReason: string | null;
  createdAt: string;
}

export interface TriageResult {
  sessionId: string;
  urgency: UrgencyScore;
  keywordHit: boolean;
  keywordMatched: string[];
  aiSummary: string | null;
  contentBlocked: boolean;
  erFallbackTriggered: boolean;
  shouldRouteToVet: boolean;
  guidance: string;
  redFlags: string[];
}

// Regex patterns for the content filter
export const DIAGNOSIS_PATTERN = /\bdiagnosed\s+(with|as)\s+[A-Z][a-z]+(?:\s+[a-zA-Z]+)*\b/i;
export const DRUG_DOSE_PATTERN = /\b(?:give|administer|prescribe|take|inject|apply)\s+(?:\d+\s*(?:mg|mcg|g|ml|cc|tablets?|capsules?|drops?)\s+)?(?:of\s+)?[A-Z][a-zA-Z]+(?:\s*\([^)]*\))?\s*(?:\d+\s*(?:mg|mcg|g|ml|cc|tablets?|capsules?|drops?)\s*(?:per\s+(?:kg|pound|day|dose))?)?\b/i;
export const VET_AVOIDANCE_PATTERN = /\byou\s+don('t|t)\s+need\s+(?:to\s+see\s+)?(?:a\s+)?(?:vet|veterinarian)\b/i;
