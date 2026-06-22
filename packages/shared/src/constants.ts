export const APP_NAME = 'PetCare 24/7';
export const APP_DESCRIPTION = 'Global vet triage — ask a vet anytime, day or night';

export const SPECIES = ['dog', 'cat'] as const;
export type Species = (typeof SPECIES)[number];

export const USER_ROLES = ['owner', 'vet', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const QUESTION_STATUS = ['waiting', 'ai_screening', 'with_vet', 'answered', 'closed'] as const;
export type QuestionStatus = (typeof QUESTION_STATUS)[number];

export const URGENCY_LEVELS = ['critical', 'urgent', 'moderate', 'low'] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const PAYMENT_STATUS = ['free', 'paid', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const VET_VERIFICATION_STATUS = ['pending', 'approved', 'rejected'] as const;
export type VetVerificationStatus = (typeof VET_VERIFICATION_STATUS)[number];

export const FEATURE_FLAGS = [
  'symptom_checker',
  'telehealth',
  'community_board',
  'lost_pet_qr',
  'pet_friendly_places',
  'local_services',
  'poison_lookup',
  'reminders',
  'medical_records',
  'owner_dating',
  'kids_education',
  'creator_tools',
  'travel_planner',
  'treat_subscription',
  'grief_support',
  'ar_games',
  'exotic_pets',
] as const;
export type FeatureFlag = (typeof FEATURE_FLAGS)[number];

export const LAUNCH_FEATURES: FeatureFlag[] = [
  'symptom_checker',
  'telehealth',
  'community_board',
  'lost_pet_qr',
  'pet_friendly_places',
  'local_services',
  'poison_lookup',
  'reminders',
  'medical_records',
];

export const COMING_SOON_FEATURES: FeatureFlag[] = [
  'owner_dating',
  'kids_education',
  'creator_tools',
  'travel_planner',
  'treat_subscription',
  'grief_support',
  'ar_games',
  'exotic_pets',
];

export const DEFAULT_PRICE_CENTS = 299;
export const FREE_FIRST_QUESTIONS = 1;

export const PET_PHOTO_MAX_SIZE_MB = 10;
export const RECORD_FILE_MAX_SIZE_MB = 20;

export const VET_MIN_RATINGS_FOR_FEATURED = 10;
export const VET_AVG_RATING_MIN_FOR_FEATURED = 4.0;

export const EMERGENCY_KEYWORDS = [
  'not breathing', 'unconscious', 'seizure', 'bleeding heavily',
  'hit by car', 'poison', 'choking', 'collapsed',
];
