import { APP_URL } from '@shared/constants';

/**
 * Gets the full profile URL for a username
 */
export const getProfileUrl = (username: string): string => {
  return `${APP_URL}/${username}`;
};

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Opens URL in a new tab
 */
export const openInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Shares profile using Web Share API (fallback to copy)
 */
export const shareProfile = async (username: string, title?: string): Promise<boolean> => {
  const url = getProfileUrl(username);
  const shareData = {
    title: title || `${username}'s Year in Code`,
    text: `Check out ${username}'s GitHub Wrapped on Your Year in Code`,
    url,
  };

  // Try Web Share API first (mobile browsers)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name === 'AbortError') {
        return false;
      }
    }
  }

  // Fallback to clipboard
  return copyToClipboard(url);
};

/**
 * Downloads a file from a URL
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Constructs a URL with query parameters
 */
export const buildUrl = (base: string, params: Record<string, string | number>): string => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
};

/**
 * Extracts username from profile URL
 */
export const extractUsernameFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('youryearincode.dev')) return null;
    const username = urlObj.pathname.split('/')[1];
    return username || null;
  } catch {
    return null;
  }
};
