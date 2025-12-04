import {
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

/**
 * Formats a date to a readable format
 * @param date - Date string or Date object
 * @param formatString - Optional format string (default: "MMM yyyy")
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, formatString = 'MMM yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, formatString);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Formats a date for display in profiles (e.g., "Jan 2023")
 */
export const formatProfileDate = (date: Date | string): string => {
  return formatDate(date, 'MMM yyyy');
};

/**
 * Formats a full date (e.g., "January 15, 2023")
 */
export const formatFullDate = (date: Date | string): string => {
  return formatDate(date, 'MMMM d, yyyy');
};

/**
 * Formats a date for joined/member since display (e.g., "Joined Mar 2023")
 */
export const formatJoinedDate = (date: Date | string): string => {
  return `Joined ${formatDate(date, 'MMM yyyy')}`;
};

/**
 * Formats a date range for work experience or projects
 * @param startDate - Start date
 * @param endDate - End date (null/undefined for current)
 * @returns Formatted date range (e.g., "Jan 2020 - Present" or "Jan 2020 - Dec 2022")
 */
export const formatDateRange = (
  startDate: Date | string,
  endDate?: Date | string | null
): string => {
  const start = formatProfileDate(startDate);
  if (!endDate) {
    return `${start} - Present`;
  }
  const end = formatProfileDate(endDate);
  return `${start} - ${end}`;
};

/**
 * Calculates and formats duration between two dates
 * @param startDate - Start date
 * @param endDate - End date (null/undefined for current date)
 * @returns Formatted duration (e.g., "2 yrs 3 mos", "6 mos")
 */
export const formatDuration = (
  startDate: Date | string,
  endDate?: Date | string | null
): string => {
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = endDate
      ? typeof endDate === 'string'
        ? parseISO(endDate)
        : endDate
      : new Date();

    if (!isValid(start) || !isValid(end)) return '';

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;

    if (years === 0 && months === 0) return '1 mo';
    if (years === 0) return `${months} ${months === 1 ? 'mo' : 'mos'}`;
    if (months === 0) return `${years} ${years === 1 ? 'yr' : 'yrs'}`;

    return `${years} ${years === 1 ? 'yr' : 'yrs'} ${months} ${months === 1 ? 'mo' : 'mos'}`;
  } catch {
    return '';
  }
};

/**
 * Formats work period with duration (e.g., "Jan 2020 - Present · 2 yrs 3 mos")
 */
export const formatWorkPeriod = (
  startDate: Date | string,
  endDate?: Date | string | null
): string => {
  const range = formatDateRange(startDate, endDate);
  const duration = formatDuration(startDate, endDate);
  return duration ? `${range} · ${duration}` : range;
};

/**
 * Formats relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return '';
  }
};

/**
 * Formats ISO date string for datetime input
 */
export const formatForInput = (date: Date | string): string => {
  return formatDate(date, 'yyyy-MM-dd');
};

/**
 * Checks if a date is in the future
 */
export const isFutureDate = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj > new Date();
  } catch {
    return false;
  }
};

/**
 * Gets current date formatted as "Member since [Month Year]"
 */
export const getMemberSinceText = (date: Date | string): string => {
  return `Member since ${formatDate(date, 'MMM yyyy')}`;
};
