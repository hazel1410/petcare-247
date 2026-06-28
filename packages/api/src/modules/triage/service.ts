import { v4 as uuid } from 'uuid';
import { contentFilter } from './contentFilter';
import { checkHardRules } from './keywordRules';
import { ClaudeAIScreener, AIScreener } from './aiScreen';
import { writeAIAuditLog } from './auditLog';
import { TriageResult, AIPreScreenInput } from './types';

export interface TriageConfig {
  modelVersion: string;
}

export class TriageService {
  private aiScreener: AIScreener;
  private config: TriageConfig;

  constructor(
    aiScreener?: AIScreener,
    config?: Partial<TriageConfig>,
  ) {
    this.aiScreener = aiScreener ?? new ClaudeAIScreener();
    this.config = { modelVersion: config?.modelVersion ?? 'claude-sonnet-4-v0.0.0' };
  }

  async evaluate(
    input: AIPreScreenInput,
    db: { from(table: string): { insert(data: Record<string, unknown>): Promise<{ error?: { message: string } }> } },
  ): Promise<TriageResult> {
    const sessionId = uuid();

    // 1. Content filter (server-side guard)
    const filterResult = contentFilter(input.description);
    if (filterResult.blocked) {
      await writeAIAuditLog(db, {
        sessionId,
        modelVersion: this.config.modelVersion,
        prompt: JSON.stringify(input),
        output: '',
        urgencyScore: null,
        contentBlocked: true,
        blockReason: filterResult.reason ?? 'Triggered content filter',
      });

      return {
        sessionId,
        urgency: '5_informational',
        keywordHit: false,
        keywordMatched: [],
        aiSummary: null,
        contentBlocked: true,
        erFallbackTriggered: false,
        shouldRouteToVet: false,
        guidance: filterResult.reason!,
        redFlags: [],
      };
    }

    // 2. Keyword hard-rules
    const keywordResult = checkHardRules(input.description);
    const combinedSymptoms = [...input.symptoms];
    for (const kw of keywordResult.matchedKeywords) {
      if (!combinedSymptoms.some((s) => s.toLowerCase().includes(kw))) {
        combinedSymptoms.push(kw);
      }
    }

    // 3. AI pre-screen
    const aiResult = await this.aiScreener.evaluate({ ...input, symptoms: combinedSymptoms });

    // 4. Merge: keyword emergency overrides AI
    const finalUrgency = keywordResult.hit ? keywordResult.score : aiResult.score;

    // 5. Audit log
    await writeAIAuditLog(db, {
      sessionId,
      modelVersion: this.config.modelVersion,
      prompt: JSON.stringify(input),
      output: JSON.stringify(aiResult),
      urgencyScore: finalUrgency,
      contentBlocked: false,
      blockReason: null,
    });

    const isEmergency = finalUrgency === '1_emergency';
    const isUrgent = finalUrgency === '2_urgent';

    return {
      sessionId,
      urgency: finalUrgency,
      keywordHit: keywordResult.hit,
      keywordMatched: keywordResult.matchedKeywords,
      aiSummary: aiResult.summary,
      contentBlocked: false,
      erFallbackTriggered: isEmergency,
      shouldRouteToVet: isEmergency || isUrgent || finalUrgency === '3_moderate',
      guidance: aiResult.guidance,
      redFlags: aiResult.redFlags,
    };
  }
}
