import { VetOnDuty, VetMatchRequest, VetMatchScore, ERFallback, MatchResult } from './types';
import { URGENCY_ORDER } from '../triage/types';
import type { UrgencyScore } from '../triage/types';

const REPUTATION_WEIGHT = 0.35;
const AVAILABILITY_WEIGHT = 0.25;
const RESPONSIVENESS_WEIGHT = 0.20;
const SPECIALTY_WEIGHT = 0.12;
const LANGUAGE_WEIGHT = 0.08;

const SLA_BY_URGENCY: Record<string, number> = {
  '1_emergency': 30,        // 30 seconds — immediate route to ER
  '2_urgent': 120,          // 2 minutes
  '3_moderate': 600,        // 10 minutes
  '4_low': 1800,            // 30 minutes
  '5_informational': 3600,  // 60 minutes
};

export function computeReputationScore(vet: VetOnDuty): number {
  if (vet.totalRatings === 0) return 0.5;
  const ratingNorm = vet.rating / 5;
  const countNorm = Math.min(vet.totalRatings / 100, 1);
  return ratingNorm * 0.6 + countNorm * 0.4;
}

export function computeAvailabilityScore(vet: VetOnDuty): number {
  if (vet.maxLoad <= 0) return 0;
  const loadRatio = vet.currentLoad / vet.maxLoad;
  // Exponential decay: as load approaches max, score drops sharply
  return Math.max(0, 1 - Math.pow(loadRatio, 2));
}

export function computeResponsivenessScore(vet: VetOnDuty): number {
  // Ideal: < 2 min response → score 1.0
  // At 30 min → score ~0
  const idealMinutes = 2;
  const decayRate = 0.15;
  return Math.max(0, Math.exp(-decayRate * Math.max(0, vet.responseTimeMinutes - idealMinutes)));
}

const EXOTIC_SPECIES = new Set(['reptile', 'bird', 'amphibian', 'ferret', 'rabbit', 'guinea pig', 'hamster', 'gerbil', 'mouse', 'rat', 'chinchilla', 'hedgehog', 'sugar glider', 'turtle', 'snake', 'lizard', 'parrot', 'cockatiel', 'chicken', 'duck']);
const LARGE_ANIMAL_SPECIES = new Set(['horse', 'cattle', 'goat', 'sheep', 'pig', 'llama', 'alpaca']);

export function computeSpecialtyScore(vet: VetOnDuty, request: VetMatchRequest): number {
  const species = request.petSpecies.toLowerCase();
  const isExotic = EXOTIC_SPECIES.has(species);
  const isLarge = LARGE_ANIMAL_SPECIES.has(species);

  const hasDirect = vet.specialties.some(
    (s) => s === 'general' || s === 'emergency' || s === species,
  );
  if (hasDirect) return 1.0;

  const hasExotic = vet.specialties.includes('exotic');
  const hasLarge = species === 'horse' || species === 'cattle' || species === 'goat' || species === 'sheep' || species === 'pig';

  if (isExotic && hasExotic) return 1.0;
  if (isLarge && hasLarge) return 1.0;

  const hasPartial = vet.specialties.some(
    (s) => species.includes(s) || s.includes(species),
  );
  if (hasPartial) return 0.6;

  if ((isExotic || isLarge) && (hasDirect || hasPartial)) return 0.6;

  return 0.2;
}

export function computeLanguageScore(vet: VetOnDuty, request: VetMatchRequest): number {
  if (!request.preferredLanguages || request.preferredLanguages.length === 0) return 1.0;
  const matches = request.preferredLanguages.filter((lang) =>
    vet.languages.some((vl) => vl.toLowerCase() === lang.toLowerCase()),
  ).length;
  if (matches >= request.preferredLanguages.length) return 1.0;
  return matches / request.preferredLanguages.length;
}

export function matchVets(
  vets: VetOnDuty[],
  request: VetMatchRequest,
): MatchResult {
  const requestId = request.triageSessionId;
  const now = new Date().toISOString();

  // 1. Filter vets by availability (not at max load)
  let candidates = vets.filter((v) => v.currentLoad < v.maxLoad);

  // 2. Filter by region (prefer same region)
  const sameRegion = candidates.filter((v) => v.region === request.ownerRegion);
  if (sameRegion.length > 0) {
    candidates = sameRegion;
  }

  // 3. If emergency urgency, only keep emergency-capable vets
  if (URGENCY_ORDER[request.urgencyScore as UrgencyScore] <= 1) {
    const emergencyVets = candidates.filter((v) => v.specialties.includes('emergency'));
    if (emergencyVets.length > 0) {
      candidates = emergencyVets;
    }
  }

  // 4. Score each candidate
  const scored: VetMatchScore[] = candidates.map((vet) => {
    const reputation = computeReputationScore(vet);
    const availability = computeAvailabilityScore(vet);
    const responsiveness = computeResponsivenessScore(vet);
    const specialty = computeSpecialtyScore(vet, request);
    const language = computeLanguageScore(vet, request);

    const totalScore =
      reputation * REPUTATION_WEIGHT +
      availability * AVAILABILITY_WEIGHT +
      responsiveness * RESPONSIVENESS_WEIGHT +
      specialty * SPECIALTY_WEIGHT +
      language * LANGUAGE_WEIGHT;

    return {
      vetId: vet.id,
      name: vet.name,
      totalScore: Math.round(totalScore * 100) / 100,
      reputationScore: Math.round(reputation * 100) / 100,
      availabilityScore: Math.round(availability * 100) / 100,
      responsivenessScore: Math.round(responsiveness * 100) / 100,
      specialtyScore: Math.round(specialty * 100) / 100,
      languageScore: Math.round(language * 100) / 100,
    };
  });

  // 5. Sort by total score descending, take top 3
  const topMatches = scored.sort((a, b) => b.totalScore - a.totalScore).slice(0, 3);

  // 6. Determine SLA from urgency
  const slaSeconds = SLA_BY_URGENCY[request.urgencyScore] ?? 600;

  // 7. ER fallback
  let erFallback: ERFallback | null = null;
  if (topMatches.length === 0) {
    erFallback = {
      triggered: true,
      reason: 'No available vets match the request criteria',
      suggestion: URGENCY_ORDER[request.urgencyScore as UrgencyScore] <= 1
        ? 'Take your pet to the nearest emergency veterinary clinic immediately'
        : 'No vets are currently available. Try again shortly or visit a local veterinary clinic',
    };
  }

  return {
    requestId,
    matches: topMatches,
    erFallback,
    slaSeconds,
    matchedAt: now,
  };
}
