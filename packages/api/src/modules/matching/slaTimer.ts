import { SLATimer } from './types';

const activeTimers = new Map<string, { startedAt: number; slaSeconds: number }>();

export function startSLATimer(requestId: string, slaSeconds: number): void {
  activeTimers.set(requestId, {
    startedAt: Date.now(),
    slaSeconds,
  });
}

export function getSLATimer(requestId: string): SLATimer | null {
  const entry = activeTimers.get(requestId);
  if (!entry) return null;

  const elapsedSeconds = Math.floor((Date.now() - entry.startedAt) / 1000);
  return {
    requestId,
    startedAt: new Date(entry.startedAt).toISOString(),
    slaSeconds: entry.slaSeconds,
    elapsedSeconds,
    expired: elapsedSeconds >= entry.slaSeconds,
  };
}

export function clearSLATimer(requestId: string): void {
  activeTimers.delete(requestId);
}

export function isSLAExpired(requestId: string): boolean {
  const timer = getSLATimer(requestId);
  return timer?.expired ?? false;
}
