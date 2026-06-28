import { ContentFilterResult, DIAGNOSIS_PATTERN, DRUG_DOSE_PATTERN, VET_AVOIDANCE_PATTERN } from './types';

const ALL_PATTERNS = [
  { pattern: DIAGNOSIS_PATTERN, reason: 'Contains a diagnosis claim — only a licensed vet can diagnose' },
  { pattern: DRUG_DOSE_PATTERN, reason: 'Contains a drug/dosage instruction — could be dangerous without vet oversight' },
  { pattern: VET_AVOIDANCE_PATTERN, reason: 'Discourages seeking veterinary care — must not undermine vet visit urgency' },
];

export function contentFilter(input: string): ContentFilterResult {
  const hits: string[] = [];

  for (const { pattern, reason } of ALL_PATTERNS) {
    if (pattern.test(input)) {
      hits.push(reason);
    }
  }

  if (hits.length > 0) {
    return {
      blocked: true,
      reason: hits.join('; '),
    };
  }

  return { blocked: false };
}
