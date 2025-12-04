/**
 * Server-side validation utilities
 * Wraps shared validation with server-specific error handling
 */

import {
  isValidUsername,
  isValidEmail,
  isValidUrl,
  sanitizeUsername,
} from '@shared/utils/validation';
import { UserRoleEnum } from '@shared/types';

/**
 * Validates username and returns error message if invalid
 */
export const validateUsername = (username: string): string | null => {
  if (!username || username.trim().length === 0) {
    return 'Username is required';
  }
  if (!isValidUsername(username)) {
    return 'Username must be 3-30 characters and contain only letters, numbers, dashes, and underscores';
  }
  return null;
};

/**
 * Validates email and returns error message if invalid
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Invalid email format';
  }
  return null;
};

/**
 * Validates URL and returns error message if invalid
 */
export const validateUrl = (url: string): string | null => {
  if (!url || url.trim().length === 0) {
    return 'URL is required';
  }
  if (!isValidUrl(url)) {
    return 'Invalid URL format';
  }
  return null;
};

/**
 * Validates and sanitizes username for database storage
 */
export const prepareUsername = (username: string): { valid: boolean; username?: string; error?: string } => {
  const error = validateUsername(username);
  if (error) {
    return { valid: false, error };
  }
  return {
    valid: true,
    username: sanitizeUsername(username),
  };
};

/**
 * Validates user role
 */
export const isValidRole = (role: string): role is UserRoleEnum => {
  return Object.values(UserRoleEnum).includes(role as UserRoleEnum);
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (password.length > 128) {
    return 'Password must be less than 128 characters';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

/**
 * Validates profile bio length
 */
export const validateBio = (bio: string, maxLength = 500): string | null => {
  if (bio.length > maxLength) {
    return `Bio must be less than ${maxLength} characters`;
  }
  return null;
};
