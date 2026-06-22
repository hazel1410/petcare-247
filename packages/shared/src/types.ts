import type { z } from 'zod';
import type {
  signUpSchema, signInSchema, petProfileSchema, questionSchema,
  vetResponseSchema, reviewSchema, vetVerificationSchema, reminderSchema,
} from './schemas/index.js';
import type {
  UserRole, Species, UrgencyLevel, QuestionStatus, PaymentStatus,
  VetVerificationStatus, FeatureFlag,
} from './constants.js';

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type PetProfileInput = z.infer<typeof petProfileSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type VetResponseInput = z.infer<typeof vetResponseSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type VetVerificationInput = z.infer<typeof vetVerificationSchema>;
export type ReminderInput = z.infer<typeof reminderSchema>;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  photoUrl?: string;
  createdAt: string;
}

export interface VetProfile extends UserProfile {
  role: 'vet';
  verificationStatus: VetVerificationStatus;
  licenseNumber: string;
  licenseCountry: string;
  licenseState?: string;
  veterinarySchool: string;
  graduationYear: number;
  specialties: string[];
  rating: number;
  totalRatings: number;
  questionsAnswered: number;
  online: boolean;
  bio?: string;
}

export interface OwnerProfile extends UserProfile {
  role: 'owner';
  pets: Pet[];
  questionsAsked: number;
  credits: number;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed?: string;
  ageYears?: number;
  ageMonths?: number;
  weightKg?: number;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  photoUrl?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  ownerId: string;
  petId: string;
  vetId?: string;
  description: string;
  symptoms: string[];
  duration?: string;
  aiUrgency?: UrgencyLevel;
  status: QuestionStatus;
  paymentStatus: PaymentStatus;
  amountCents: number;
  createdAt: string;
  answeredAt?: string;
}

export interface VetResponse {
  id: string;
  questionId: string;
  vetId: string;
  urgencyAssessment: string;
  guidance: string;
  recommendation: 'emergency_now' | 'vet_today' | 'vet_soon' | 'monitor' | 'resolved';
  followUpQuestions: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  questionId: string;
  ownerId: string;
  vetId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  questionId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  petId: string;
  ownerId: string;
  type: 'medication' | 'feeding' | 'vaccine' | 'grooming' | 'other';
  title: string;
  description?: string;
  cronExpression: string;
  startDate: string;
  endDate?: string;
  assignees: string[];
  active: boolean;
  createdAt: string;
}

export interface VetAvailability {
  vetId: string;
  online: boolean;
  lastSeen: string;
  timezone: string;
  workingHours?: {
    day: number;
    start: string;
    end: string;
  }[];
}

export interface SymptomCheckResult {
  urgency: UrgencyLevel;
  immediateAction: string;
  guidance: string;
  redFlags: string[];
  recommendedForVet: boolean;
}

export interface ToxicFoodEntry {
  food: string;
  severity: 'toxic' | 'mild' | 'safe';
  symptoms: string[];
  actionRequired: string;
  species: Species[];
}

export interface EmergencyClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  openNow: boolean;
  distanceKm: number;
  latitude: number;
  longitude: number;
  rating?: number;
}

export interface LocalService {
  id: string;
  type: 'walker' | 'groomer' | 'sitter' | 'trainer' | 'boarding';
  name: string;
  description: string;
  phone: string;
  website?: string;
  rating: number;
  priceRange: 'low' | 'medium' | 'high';
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  type: 'lost' | 'found' | 'advice' | 'general';
  title: string;
  content: string;
  petPhotoUrl?: string;
  location?: string;
  createdAt: string;
  commentCount: number;
  moderated: boolean;
}

export interface FeatureFlagConfig {
  flag: FeatureFlag;
  enabled: boolean;
  rolloutPercentage?: number;
}
