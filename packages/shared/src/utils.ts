import { URGENCY_LEVELS, EMERGENCY_KEYWORDS } from './constants.js';
import type { UrgencyLevel } from './constants.js';
import type { SymptomCheckResult, ToxicFoodEntry } from './types.js';

export function detectUrgency(description: string): UrgencyLevel {
  const lower = description.toLowerCase();
  const hasEmergencyKeyword = EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasEmergencyKeyword) return 'critical';
  return 'low';
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function generateSymptomCheckResult(
  species: string,
  symptoms: string[],
  description: string,
): SymptomCheckResult {
  const urgency = detectUrgency(description);
  const redFlags: string[] = [];
  const guidance: string[] = [];

  if (symptoms.some((s) => ['vomiting', 'diarrhea'].includes(s.toLowerCase()))) {
    redFlags.push('Persistent vomiting or diarrhea can lead to dehydration');
    guidance.push('Remove food for 12 hours (puppies/kittens 6 hours), then offer bland diet');
  }
  if (symptoms.some((s) => ['limping', 'not walking'].includes(s.toLowerCase()))) {
    redFlags.push('Inability to bear weight indicates possible fracture or serious injury');
    guidance.push('Keep your pet calm and confined. Do not manipulate the limb');
  }
  if (urgency === 'critical') {
    guidance.push('This appears to be an emergency. Please seek immediate veterinary care');
  } else {
    guidance.push('Monitor your pet closely. If symptoms worsen, seek veterinary care');
  }

  return {
    urgency,
    immediateAction: urgency === 'critical' ? 'Seek emergency veterinary care immediately' : 'Monitor and consult a vet if symptoms persist',
    guidance: guidance.join('. '),
    redFlags,
    recommendedForVet: urgency !== 'low',
  };
}

export const TOXIC_FOODS: ToxicFoodEntry[] = [
  { food: 'Chocolate', severity: 'toxic', symptoms: ['vomiting', 'diarrhea', 'hyperactivity', 'seizures'], actionRequired: 'Immediate veterinary attention', species: ['dog', 'cat'] },
  { food: 'Grapes & Raisins', severity: 'toxic', symptoms: ['vomiting', 'lethargy', 'kidney failure'], actionRequired: 'Immediate veterinary attention', species: ['dog'] },
  { food: 'Onions & Garlic', severity: 'toxic', symptoms: ['weakness', 'pale gums', 'red urine'], actionRequired: 'Veterinary attention within 24 hours', species: ['dog', 'cat'] },
  { food: 'Xylitol (artificial sweetener)', severity: 'toxic', symptoms: ['vomiting', 'weakness', 'seizures', 'liver failure'], actionRequired: 'Immediate emergency vet', species: ['dog'] },
  { food: 'Macadamia Nuts', severity: 'toxic', symptoms: ['weakness', 'vomiting', 'tremors', 'fever'], actionRequired: 'Veterinary attention', species: ['dog'] },
  { food: 'Avocado', severity: 'mild', symptoms: ['vomiting', 'diarrhea'], actionRequired: 'Monitor, call vet if symptoms persist', species: ['dog', 'cat'] },
  { food: 'Cooked Bones', severity: 'mild', symptoms: ['constipation', 'intestinal blockage'], actionRequired: 'Monitor stool, call vet if no bowel movement', species: ['dog'] },
  { food: 'Alcohol', severity: 'toxic', symptoms: ['vomiting', 'disorientation', 'seizures', 'coma'], actionRequired: 'Immediate emergency vet', species: ['dog', 'cat'] },
  { food: 'Coffee & Caffeine', severity: 'toxic', symptoms: ['restlessness', 'rapid breathing', 'tremors', 'seizures'], actionRequired: 'Immediate veterinary attention', species: ['dog', 'cat'] },
  { food: 'Raw Dough', severity: 'mild', symptoms: ['bloating', 'abdominal pain', 'alcohol poisoning'], actionRequired: 'Veterinary attention', species: ['dog', 'cat'] },
];

export function lookupFoodToxic(food: string): ToxicFoodEntry[] {
  const query = food.toLowerCase();
  return TOXIC_FOODS.filter(
    (entry) => entry.food.toLowerCase().includes(query) || query.includes(entry.food.toLowerCase()),
  );
}

export function getAgeLabel(years?: number, months?: number): string {
  if (years && months) return `${years}y ${months}m`;
  if (years) return `${years}y`;
  if (months) return `${months}m`;
  return 'Unknown';
}
