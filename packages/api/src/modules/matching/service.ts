import { VetOnDuty, VetMatchRequest, MatchResult, MatchResponse } from './types';
import { matchVets } from './algorithm';
import { startSLATimer, clearSLATimer, isSLAExpired } from './slaTimer';

// Stubbed data source — will be replaced with Supabase query
async function fetchAvailableVets(region: string): Promise<VetOnDuty[]> {
  const stubVets: VetOnDuty[] = [
    {
      id: 'vet-001',
      name: 'Dr. Sarah Chen',
      region: 'US',
      timezone: 'America/New_York',
      rating: 4.8,
      totalRatings: 234,
      specialties: ['general', 'emergency'],
      currentLoad: 2,
      maxLoad: 5,
      languages: ['English', 'Mandarin'],
      responseTimeMinutes: 1.5,
      currentEarningsCents: 1250000,
    },
    {
      id: 'vet-002',
      name: 'Dr. James Wilson',
      region: 'US',
      timezone: 'America/Chicago',
      rating: 4.5,
      totalRatings: 189,
      specialties: ['general', 'dental', 'surgery'],
      currentLoad: 1,
      maxLoad: 4,
      languages: ['English', 'Spanish'],
      responseTimeMinutes: 3.2,
      currentEarningsCents: 980000,
    },
    {
      id: 'vet-003',
      name: 'Dr. Priya Sharma',
      region: 'IN',
      timezone: 'Asia/Kolkata',
      rating: 4.9,
      totalRatings: 312,
      specialties: ['general', 'emergency', 'cardiology'],
      currentLoad: 3,
      maxLoad: 5,
      languages: ['Hindi', 'English', 'Bengali'],
      responseTimeMinutes: 0.8,
      currentEarningsCents: 450000,
    },
    {
      id: 'vet-004',
      name: 'Dr. Carlos Mendez',
      region: 'US',
      timezone: 'America/Los_Angeles',
      rating: 4.2,
      totalRatings: 95,
      specialties: ['general', 'exotic'],
      currentLoad: 4,
      maxLoad: 4,
      languages: ['English', 'Spanish'],
      responseTimeMinutes: 5.0,
      currentEarningsCents: 720000,
    },
    {
      id: 'vet-005',
      name: 'Dr. Emily Watson',
      region: 'UK',
      timezone: 'Europe/London',
      rating: 4.7,
      totalRatings: 178,
      specialties: ['general', 'dermatology'],
      currentLoad: 0,
      maxLoad: 4,
      languages: ['English', 'French'],
      responseTimeMinutes: 2.1,
      currentEarningsCents: 890000,
    },
  ];

  return stubVets.filter((v) => v.region === region || region === 'any');
}

export class MatchingService {
  async findMatch(request: VetMatchRequest): Promise<MatchResult> {
    const availableVets = await fetchAvailableVets(request.ownerRegion);
    const result = matchVets(availableVets, request);
    startSLATimer(result.requestId, result.slaSeconds);
    return result;
  }

  async recordResponse(requestId: string, response: MatchResponse): Promise<void> {
    clearSLATimer(requestId);
    // In production: persist to matches table
    // await db.from('matches').update({ status: response.accepted ? 'accepted' : 'declined', ... })
  }

  checkSLA(requestId: string): boolean {
    return isSLAExpired(requestId);
  }
}
