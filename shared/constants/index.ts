/**
 * Shared constants used across client and server
 * Constants for Your Year in Code - GitHub Wrapped
 */

export const APP_NAME = 'Your Year in Code';
export const APP_DOMAIN = 'youryearincode.dev';
export const APP_URL = `https://${APP_DOMAIN}`;

// Default year for GitHub Wrapped (current year or previous year based on timing)
export const DEFAULT_YEAR = new Date().getMonth() < 11 
  ? new Date().getFullYear() - 1 
  : new Date().getFullYear();

// GitHub API constants
export const GITHUB_API_BASE_URL = 'https://api.github.com';
export const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

// Rate limiting
export const MAX_REQUESTS_PER_MINUTE = 60;

// Wrapped generation
export const WRAPPED_CACHE_DURATION_HOURS = 24;

export const USERNAME_REGEX = /^[a-z0-9_-]{3,39}$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 39;

