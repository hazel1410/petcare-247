import { z } from 'zod';
import { SPECIES, USER_ROLES, URGENCY_LEVELS, FEATURE_FLAGS, VET_VERIFICATION_STATUS, PAYMENT_STATUS, QUESTION_STATUS } from '../constants.js';

export const emailSchema = z.string().email().max(255);
export const passwordSchema = z.string().min(8).max(128);
export const phoneSchema = z.string().regex(/^\+[1-9]\d{6,14}$/);
export const uuidSchema = z.string().uuid();

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(100),
  role: z.enum(USER_ROLES).default('owner'),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const petProfileSchema = z.object({
  name: z.string().min(1).max(100),
  species: z.enum(SPECIES),
  breed: z.string().max(100).optional(),
  ageYears: z.number().min(0).max(40).optional(),
  ageMonths: z.number().min(0).max(11).optional(),
  weightKg: z.number().min(0.1).max(200).optional(),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  medicalConditions: z.array(z.string()).default([]),
  photoUrl: z.string().url().optional(),
});

export const questionSchema = z.object({
  petId: uuidSchema,
  description: z.string().min(10).max(5000),
  symptoms: z.array(z.string()).default([]),
  duration: z.string().max(200).optional(),
  urgency: z.enum(URGENCY_LEVELS).optional(),
});

export const vetResponseSchema = z.object({
  questionId: uuidSchema,
  urgencyAssessment: z.string().min(1).max(5000),
  guidance: z.string().min(1).max(10000),
  recommendation: z.enum(['emergency_now', 'vet_today', 'vet_soon', 'monitor', 'resolved']),
  followUpQuestions: z.array(z.string()).default([]),
});

export const reviewSchema = z.object({
  questionId: uuidSchema,
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export const paymentIntentSchema = z.object({
  questionId: uuidSchema,
  amountCents: z.number().int().positive(),
});

export const vetVerificationSchema = z.object({
  licenseNumber: z.string().min(1).max(100),
  licenseCountry: z.string().min(2).max(100),
  licenseState: z.string().max(100).optional(),
  licenseFileUrl: z.string().url(),
  veterinarySchool: z.string().min(1).max(200),
  graduationYear: z.number().int().min(1980).max(2030),
  specialties: z.array(z.string()).default([]),
});

export const reminderSchema = z.object({
  petId: uuidSchema,
  type: z.enum(['medication', 'feeding', 'vaccine', 'grooming', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  cronExpression: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  assignees: z.array(uuidSchema).default([]),
});
