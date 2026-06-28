export { MatchingService } from './service';
export { matchingRouter } from './router';
export { matchVets, computeReputationScore, computeAvailabilityScore, computeResponsivenessScore, computeSpecialtyScore, computeLanguageScore } from './algorithm';
export { startSLATimer, getSLATimer, clearSLATimer, isSLAExpired } from './slaTimer';
export type {
  VetOnDuty,
  VetMatchRequest,
  VetMatchScore,
  MatchResult,
  ERFallback,
  SLATimer,
  MatchResponse,
  VetSpecialty,
} from './types';
