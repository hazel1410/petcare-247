import { HARD_RULE_KEYWORDS, KeywordCheckResult, UrgencyScore } from './types';

// For multi-word keywords, convert to a flexible regex that allows
// natural language variations (articles, prepositions between words).
// Single words are matched as exact substrings.
function keywordToRegex(keyword: string): RegExp {
  const parts = keyword.split(/\s+/);
  if (parts.length === 1) {
    return new RegExp(parts[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }
  const pattern = parts
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s+(?:a|an|the|)\\s*');
  return new RegExp(pattern, 'i');
}

export function checkHardRules(input: string): KeywordCheckResult {
  const matched: string[] = [];

  for (const keyword of HARD_RULE_KEYWORDS) {
    const re = keywordToRegex(keyword);
    if (re.test(input)) {
      matched.push(keyword);
    }
  }

  if (matched.length > 0) {
    return {
      hit: true,
      matchedKeywords: matched,
      score: '1_emergency' as UrgencyScore,
    };
  }

  return {
    hit: false,
    matchedKeywords: [],
    score: '3_moderate' as UrgencyScore,
  };
}
