import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX } from '@shared/constants';
import { z } from 'zod';

/**
 * Common reusable Zod validators for consistent validation across the app
 */

// MongoDB ObjectId regex pattern
const MONGO_ID_REGEX = /^[a-fA-F0-9]{24}$/;

// Username constraints
const USERNAME_MIN = USERNAME_MIN_LENGTH;
const USERNAME_MAX = USERNAME_MAX_LENGTH;

// ============================================
// Primitive Validators (building blocks)
// ============================================

/**
 * MongoDB ObjectId validator
 */
export const mongoId = z
  .string()
  .regex(MONGO_ID_REGEX, 'Invalid ID format');

/**
 * Email validator
 */
export const email = z
  .email('Please enter a valid email address')
  .trim()
  .toLowerCase();

/**
 * Username validator
 */
export const username = z
  .string()
  .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
  .max(USERNAME_MAX, `Username must not exceed ${USERNAME_MAX} characters`)
  .regex(USERNAME_REGEX, 'Username can only contain lowercase letters, numbers, underscores, and hyphens')
  .trim()
  .toLowerCase();

/**
 * URL validator
 */
export const url = z
  .url('Please enter a valid URL')
  .trim();

/**
 * Optional variants
 */
export const optionalUrl = url.optional();
export const optionalEmail = email.optional();
export const optionalUsername = username.optional();
export const optionalMongoId = mongoId.optional();

// ============================================
// Ready-to-Use Schemas (pass directly to validate())
// ============================================

/**
 * Schema for routes with :id param (e.g., DELETE /:id, GET /:id)
 * Usage: validate(mongoIdParamSchema)
 */
export const mongoIdParamSchema = z.object({
  params: z.object({
    id: mongoId,
  }),
});

/**
 * Schema for routes with :username param
 * Usage: validate(usernameParamSchema)
 */
export const usernameParamSchema = z.object({
  params: z.object({
    username,
  }),
});

/**
 * Schema for routes with only username in body
 */
export const usernameBodySchema = z.object({
  body: z.object({
    username,
  }),
});

// ============================================
// Array Validators
// ============================================

/**
 * Array of MongoDB ObjectIds
 */
export const mongoIdArray = z
  .array(mongoId)
  .min(1, 'At least one ID is required');

/**
 * Array of strings
 */
export const stringArray = z.array(z.string());

// ============================================
// Export constants for reuse
// ============================================
export const VALIDATION_CONSTANTS = {
  MONGO_ID_REGEX,
  USERNAME_REGEX,
} as const;
