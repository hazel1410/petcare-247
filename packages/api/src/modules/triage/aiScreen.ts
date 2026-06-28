import { AIPreScreenInput, AIPreScreenResult } from './types';

export interface AIScreener {
  evaluate(input: AIPreScreenInput): Promise<AIPreScreenResult>;
}

export class ClaudeAIScreener implements AIScreener {
  async evaluate(input: AIPreScreenInput): Promise<AIPreScreenResult> {
    // Stubbed: real integration requires Claude API credentials.
    // This returns a correctly typed response that simulates a low-urgency
    // case as a safe default. Production wiring will replace this.
    const hasEmergencyIndicators = /seizure|collapse|bleeding|not breathing|unconscious|choking|poison/i.test(
      input.description,
    );

    const redFlags: string[] = [];
    if (hasEmergencyIndicators) {
      redFlags.push('Description contains emergency indicators');
    }

    const score = hasEmergencyIndicators ? '1_emergency' : '3_moderate';

    return {
      score: score as AIPreScreenResult['score'],
      summary: `AI pre-screen evaluated ${input.species} with ${input.symptoms.length} reported symptoms.`,
      redFlags,
      guidance: hasEmergencyIndicators
        ? 'Seek emergency veterinary care immediately'
        : 'Monitor symptoms; consult a vet if they worsen',
      followUpQuestions: hasEmergencyIndicators
        ? []
        : ['How long have the symptoms been present?', 'Has there been any change in appetite or water intake?'],
    };
  }
}
