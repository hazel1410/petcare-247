import { describe, it, expect } from 'vitest';
import type { VetSpecialty } from '../modules/matching/types';
import {
  computeReputationScore,
  computeAvailabilityScore,
  computeResponsivenessScore,
  computeSpecialtyScore,
  computeLanguageScore,
  matchVets,
} from '../modules/matching/algorithm';
import { VetOnDuty, VetMatchRequest } from '../modules/matching/types';

// ═══════════════════════════════════════════════════════════════
// SCORING FUNCTIONS
// ═══════════════════════════════════════════════════════════════

describe('computeReputationScore', () => {
  it('returns 0.5 for vets with no ratings', () => {
    const vet = { totalRatings: 0, rating: 0 } as VetOnDuty;
    expect(computeReputationScore(vet)).toBe(0.5);
  });

  it('favors high rating and volume', () => {
    const excellent = { rating: 5, totalRatings: 200 } as VetOnDuty;
    const poor = { rating: 2, totalRatings: 5 } as VetOnDuty;
    expect(computeReputationScore(excellent)).toBeGreaterThan(computeReputationScore(poor));
  });

  it('caps volume benefit at 100 ratings', () => {
    const vet500 = { rating: 4, totalRatings: 500 } as VetOnDuty;
    const vet100 = { rating: 4, totalRatings: 100 } as VetOnDuty;
    expect(computeReputationScore(vet500)).toBe(computeReputationScore(vet100));
  });
});

describe('computeAvailabilityScore', () => {
  it('returns 1.0 when no current load', () => {
    const vet = { currentLoad: 0, maxLoad: 5 } as VetOnDuty;
    expect(computeAvailabilityScore(vet)).toBe(1);
  });

  it('returns 0 when at max capacity', () => {
    const vet = { currentLoad: 5, maxLoad: 5 } as VetOnDuty;
    expect(computeAvailabilityScore(vet)).toBe(0);
  });

  it('drops sharply as load approaches max', () => {
    const half = { currentLoad: 2, maxLoad: 5 } as VetOnDuty;
    const near = { currentLoad: 4, maxLoad: 5 } as VetOnDuty;
    const halfScore = computeAvailabilityScore(half);
    const nearScore = computeAvailabilityScore(near);
    expect(halfScore).toBeGreaterThan(nearScore);
    // Near max should be very low due to squared decay
    expect(nearScore).toBeLessThan(0.5);
  });
});

describe('computeResponsivenessScore', () => {
  it('is near 1.0 for very fast response', () => {
    const vet = { responseTimeMinutes: 0.5 } as VetOnDuty;
    expect(computeResponsivenessScore(vet)).toBeGreaterThan(0.9);
  });

  it('decays for slower response times', () => {
    const fast = { responseTimeMinutes: 1 } as VetOnDuty;
    const slow = { responseTimeMinutes: 15 } as VetOnDuty;
    expect(computeResponsivenessScore(fast)).toBeGreaterThan(computeResponsivenessScore(slow));
  });

  it('approaches 0 for very slow response', () => {
    const vet = { responseTimeMinutes: 60 } as VetOnDuty;
    expect(computeResponsivenessScore(vet)).toBeLessThan(0.01);
  });
});

describe('computeSpecialtyScore', () => {
  const baseRequest: VetMatchRequest = {
    triageSessionId: '00000000-0000-0000-0000-000000000001',
    ownerId: '00000000-0000-0000-0000-000000000002',
    ownerRegion: 'US',
    petSpecies: 'dog',
    urgencyScore: '3_moderate',
    symptoms: ['vomiting'],
    ownerTimezone: 'America/New_York',
  };

  it('returns 1.0 for general practice vet', () => {
    const vet = { specialties: ['general'] } as VetOnDuty;
    expect(computeSpecialtyScore(vet, baseRequest)).toBe(1);
  });

  it('returns 1.0 for emergency vet', () => {
    const vet = { specialties: ['emergency'] } as VetOnDuty;
    expect(computeSpecialtyScore(vet, baseRequest)).toBe(1);
  });

  it('returns 0.2 for unrelated specialty', () => {
    const vet = { specialties: ['cardiology'] } as VetOnDuty;
    expect(computeSpecialtyScore(vet, baseRequest)).toBe(0.2);
  });

  it('returns 1.0 when exotic specialty matches reptile species', () => {
    const exoticRequest = { ...baseRequest, petSpecies: 'reptile' };
    const vet = { specialties: ['exotic'] } as VetOnDuty;
    expect(computeSpecialtyScore(vet, exoticRequest)).toBe(1);
  });
});

describe('computeLanguageScore', () => {
  const baseRequest: VetMatchRequest = {
    triageSessionId: '00000000-0000-0000-0000-000000000001',
    ownerId: '00000000-0000-0000-0000-000000000002',
    ownerRegion: 'US',
    petSpecies: 'dog',
    urgencyScore: '3_moderate',
    symptoms: ['vomiting'],
    ownerTimezone: 'America/New_York',
  };

  it('returns 1.0 when no language preference set', () => {
    const vet = { languages: ['English'] } as VetOnDuty;
    expect(computeLanguageScore(vet, baseRequest)).toBe(1);
  });

  it('returns 1.0 when all languages matched', () => {
    const vet = { languages: ['English', 'Spanish'] } as VetOnDuty;
    const req = { ...baseRequest, preferredLanguages: ['English', 'Spanish'] };
    expect(computeLanguageScore(vet, req)).toBe(1);
  });

  it('returns partial score for partial match', () => {
    const vet = { languages: ['English'] } as VetOnDuty;
    const req = { ...baseRequest, preferredLanguages: ['English', 'Spanish'] };
    expect(computeLanguageScore(vet, req)).toBe(0.5);
  });

  it('returns 0 when no languages match', () => {
    const vet = { languages: ['Mandarin'] } as VetOnDuty;
    const req = { ...baseRequest, preferredLanguages: ['Spanish'] };
    expect(computeLanguageScore(vet, req)).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// INTEGRATION: matchVets algorithm
// ═══════════════════════════════════════════════════════════════

describe('matchVets', () => {
  const sampleVets: VetOnDuty[] = [
    {
      id: 'vet-a', name: 'Dr. A', region: 'US', timezone: 'America/New_York',
      rating: 4.9, totalRatings: 300, specialties: ['general', 'emergency'],
      currentLoad: 1, maxLoad: 5, languages: ['English', 'Spanish'],
      responseTimeMinutes: 1.2, currentEarningsCents: 2000000,
    },
    {
      id: 'vet-b', name: 'Dr. B', region: 'US', timezone: 'America/Chicago',
      rating: 4.0, totalRatings: 50, specialties: ['general'],
      currentLoad: 4, maxLoad: 5, languages: ['English'],
      responseTimeMinutes: 8, currentEarningsCents: 500000,
    },
    {
      id: 'vet-c', name: 'Dr. C', region: 'UK', timezone: 'Europe/London',
      rating: 4.5, totalRatings: 150, specialties: ['general', 'dental'],
      currentLoad: 0, maxLoad: 4, languages: ['English'],
      responseTimeMinutes: 3, currentEarningsCents: 1200000,
    },
  ];

  const usRequest: VetMatchRequest = {
    triageSessionId: '00000000-0000-0000-0000-000000000001',
    ownerId: '00000000-0000-0000-0000-000000000002',
    ownerRegion: 'US',
    petSpecies: 'dog',
    urgencyScore: '3_moderate',
    symptoms: ['vomiting', 'lethargy'],
    ownerTimezone: 'America/New_York',
  };

  it('prioritizes same-region vets', () => {
    const result = matchVets(sampleVets, usRequest);
    // All matches should be US region
    expect(result.matches.every((m) => ['vet-a', 'vet-b'].includes(m.vetId))).toBe(true);
  });

  it('returns top 3 matches sorted by score', () => {
    const result = matchVets(sampleVets, usRequest);
    expect(result.matches.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < result.matches.length; i++) {
      expect(result.matches[i - 1].totalScore).toBeGreaterThanOrEqual(result.matches[i].totalScore);
    }
  });

  it('does not match overloaded vets', () => {
    const overloadedVets: VetOnDuty[] = [
      { ...sampleVets[0], currentLoad: 5, maxLoad: 5 },
      { ...sampleVets[1], currentLoad: 5, maxLoad: 5 },
    ];
    const result = matchVets(overloadedVets, usRequest);
    expect(result.matches).toHaveLength(0);
    expect(result.erFallback).not.toBeNull();
    expect(result.erFallback!.triggered).toBe(true);
  });

  it('filters to only emergency vets for emergency urgency', () => {
    const emergencyRequest: VetMatchRequest = { ...usRequest, urgencyScore: '1_emergency' };
    const vetsWithNonEmergency = [
      ...sampleVets,
      { id: 'vet-d', name: 'Dr. D', region: 'US', timezone: 'America/Denver',
        rating: 4.3, totalRatings: 80, specialties: ['dental'] as VetSpecialty[],
        currentLoad: 0, maxLoad: 3, languages: ['English'],
        responseTimeMinutes: 2, currentEarningsCents: 600000 },
    ];
    const result = matchVets(vetsWithNonEmergency, emergencyRequest);
    expect(result.matches.every((m) => m.vetId !== 'vet-d')).toBe(true);
  });

  it('returns ER fallback when no vets available', () => {
    const result = matchVets([], usRequest);
    expect(result.matches).toHaveLength(0);
    expect(result.erFallback).not.toBeNull();
    expect(result.erFallback!.triggered).toBe(true);
  });

  it('sets SLA based on urgency', () => {
    const lowUrgencyRequest: VetMatchRequest = { ...usRequest, urgencyScore: '5_informational' };
    const result = matchVets(sampleVets, lowUrgencyRequest);
    expect(result.slaSeconds).toBe(3600);
  });
});
