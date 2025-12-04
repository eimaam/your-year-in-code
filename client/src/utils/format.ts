/**
 * Formats a number with commas (e.g., 1000 -> "1,000")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formats large numbers with abbreviations (e.g., 1500 -> "1.5K")
 */
export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

/**
 * Formats bytes to human-readable size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats percentage (e.g., 0.755 -> "75.5%")
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formats profile completion percentage
 */
export const formatProfileCompletion = (percentage: number): string => {
  return `${Math.round(percentage)}% complete`;
};

/**
 * Pluralizes a word based on count
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
};

/**
 * Formats view count for display (e.g., "1.2K views", "153 views")
 */
export const formatViewCount = (count: number): string => {
  if (count === 0) return 'No views yet';
  if (count === 1) return '1 view';
  if (count < 1000) return `${count} views`;
  return `${formatCompactNumber(count)} views`;
};

/**
 * Formats click count for display
 */
export const formatClickCount = (count: number): string => {
  if (count === 0) return 'No clicks yet';
  if (count === 1) return '1 click';
  if (count < 1000) return `${count} clicks`;
  return `${formatCompactNumber(count)} clicks`;
};

/**
 * Formats array of strings as comma-separated list with "and"
 */
export const formatList = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

/**
 * Formats technologies/skills list for display
 */
export const formatTechStack = (technologies: string[]): string => {
  return technologies.join(' · ');
};
