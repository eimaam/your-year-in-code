import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX } from "@shared/constants";

// Username validation
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || !username.trim()) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return { isValid: false, error: `Username must be at least ${USERNAME_MIN_LENGTH} characters` };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return { isValid: false, error: `Username must not exceed ${USERNAME_MAX_LENGTH} characters` };
  }

  if (!USERNAME_REGEX.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain lowercase letters, numbers, underscores, or hyphens',
    };
  }

  return { isValid: true };
};

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

// URL validation
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url || !url.trim()) {
    return { isValid: true }; // URLs are often optional
  }

  if (!URL_REGEX.test(url)) {
    return { isValid: false, error: 'Please enter a valid URL' };
  }

  return { isValid: true };
};

/**
 * Format a URL to the full/valid URL format
 * 
 * @param url 
 * @returns 
 */

export const formatUrl = (url: string): string => {
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};


// Bio/text length validation
export const validateTextLength = (
  text: string,
  maxLength: number,
  fieldName: string = 'Text'
): { isValid: boolean; error?: string } => {
  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

// Required field validation
export const validateRequired = (
  value: string,
  fieldName: string = 'This field'
): { isValid: boolean; error?: string } => {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

// Normalize username (lowercase and trim)
export const normalizeUsername = (username: string): string => {
  return username.toLowerCase().trim();
};

