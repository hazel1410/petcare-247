export type VetSpecialty = 'general' | 'surgery' | 'dental' | 'dermatology' | 'cardiology' | 'neurology' | 'orthopedics' | 'ophthalmology' | 'exotic' | 'emergency';

export interface VetOnDuty {
  id: string;
  name: string;
  region: string;
  timezone: string;
  rating: number;
  totalRatings: number;
  specialties: VetSpecialty[];
  currentLoad: number;       // number of active consults
  maxLoad: number;           // max concurrent consults
  languages: string[];
  responseTimeMinutes: number; // avg response time
  currentEarningsCents: number;
}

export interface VetMatchRequest {
  triageSessionId: string;
  ownerId: string;
  ownerRegion: string;
  petSpecies: string;
  petAgeYears?: number;
  urgencyScore: string;
  symptoms: string[];
  ownerTimezone: string;
  preferredLanguages?: string[];
}

export interface VetMatchScore {
  vetId: string;
  name: string;
  totalScore: number;
  reputationScore: number;
  availabilityScore: number;
  responsivenessScore: number;
  specialtyScore: number;
  languageScore: number;
}

export interface MatchResult {
  requestId: string;
  matches: VetMatchScore[];
  erFallback: ERFallback | null;
  slaSeconds: number;
  matchedAt: string;
}

export interface ERFallback {
  triggered: boolean;
  reason: string;
  suggestion: string;
}

export interface SLATimer {
  requestId: string;
  startedAt: string;
  slaSeconds: number;
  elapsedSeconds: number;
  expired: boolean;
}

export interface MatchResponse {
  accepted: boolean;
  vetId: string;
  respondedAt: string;
}
