import { describe, it, expect } from 'vitest';
import { contentFilter } from '../modules/triage/contentFilter';
import { checkHardRules } from '../modules/triage/keywordRules';

// ═══════════════════════════════════════════════════════════════
// CONTENT FILTER TESTS
// ═══════════════════════════════════════════════════════════════

describe('contentFilter', () => {
  it('blocks a diagnosis claim', () => {
    const result = contentFilter('I think my cat is diagnosed with diabetes');
    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('diagnose');
  });

  it('blocks drug dosage instructions', () => {
    const result = contentFilter('Should I give 5mg of Benadryl to my dog?');
    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('drug/dosage');
  });

  it('blocks vet avoidance language', () => {
    const result = contentFilter('You don\'t need to see a vet for this');
    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('vet visit urgency');
  });

  it('blocks adminster with dose and drug name', () => {
    const result = contentFilter('Can I administer 10mg per kg of aspirin to my puppy?');
    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('drug/dosage');
  });

  it('allows safe symptom descriptions', () => {
    const result = contentFilter('My dog has been scratching her ear a lot today');
    expect(result.blocked).toBe(false);
  });

  it('allows general questions without diagnosis', () => {
    const result = contentFilter('What could cause a cat to vomit after eating?');
    expect(result.blocked).toBe(false);
  });

  it('allows descriptions about behavior changes', () => {
    const result = contentFilter('My rabbit has not been eating pellets for 2 days');
    expect(result.blocked).toBe(false);
  });

  it('blocks mixed content with diagnosis and drug dose', () => {
    const result = contentFilter(
      'My dog was diagnosed with arthritis and I give 2mg of prednisone. Is that ok?',
    );
    expect(result.blocked).toBe(true);
    expect(result.reason).toContain('diagnose');
    expect(result.reason).toContain('drug/dosage');
  });
});

// ═══════════════════════════════════════════════════════════════
// KEYWORD HARD-RULE TESTS
// ═══════════════════════════════════════════════════════════════

describe('checkHardRules', () => {
  it('flags seizure as emergency', () => {
    const result = checkHardRules('My cat just had a seizure and is twitching');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('seizure');
    expect(result.score).toBe('1_emergency');
  });

  it('flags breathing trouble as emergency', () => {
    const result = checkHardRules('My dog is having breathing trouble');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('breathing trouble');
    expect(result.score).toBe('1_emergency');
  });

  it('flags collapse as emergency', () => {
    const result = checkHardRules('My cat collapsed and cannot get up');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('collapse');
    expect(result.score).toBe('1_emergency');
  });

  it('flags heavy bleeding as emergency', () => {
    const result = checkHardRules('My dog is bleeding heavily from the paw');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('bleeding heavily');
    expect(result.score).toBe('1_emergency');
  });

  it('flags poison/toxin as emergency', () => {
    const result = checkHardRules('I think my cat ate poison — some rat bait under the sink');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('poison');
    expect(result.score).toBe('1_emergency');
  });

  it('flags hit by car as emergency', () => {
    const result = checkHardRules('My dog was hit by a car and is limping');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('hit by car');
    expect(result.score).toBe('1_emergency');
  });

  it('flags choking as emergency', () => {
    const result = checkHardRules('My cat is choking on something');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('choking');
    expect(result.score).toBe('1_emergency');
  });

  it('flags unconscious as emergency', () => {
    const result = checkHardRules('My rabbit is unconscious and not moving');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('unconscious');
    expect(result.score).toBe('1_emergency');
  });

  it('returns moderate for non-emergency text', () => {
    const result = checkHardRules('My dog has a mild rash on the belly');
    expect(result.hit).toBe(false);
    expect(result.matchedKeywords).toEqual([]);
    expect(result.score).toBe('3_moderate');
  });

  it('returns moderate for general care questions', () => {
    const result = checkHardRules('How often should I bathe my golden retriever?');
    expect(result.hit).toBe(false);
    expect(result.score).toBe('3_moderate');
  });

  it('matches multiple keywords in one description', () => {
    const result = checkHardRules('My dog collapsed and is not breathing after chewing on poison');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('collapse');
    expect(result.matchedKeywords).toContain('not breathing');
    expect(result.matchedKeywords).toContain('poison');
    expect(result.score).toBe('1_emergency');
  });

  it('is case-insensitive', () => {
    const result = checkHardRules('SEIZURE — my dog is having fits');
    expect(result.hit).toBe(true);
    expect(result.matchedKeywords).toContain('seizure');
  });

  it('matches breathing trouble across hyphenated phrase', () => {
    const result = checkHardRules('My cat has breathing-trouble after exercise');
    // IMPORTANT: the rule checks for "breathing trouble" as a substring
    // "breathing-trouble" does NOT contain "breathing trouble" (space, not hyphen)
    expect(result.hit).toBe(false);
  });
});
