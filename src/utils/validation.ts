/**
 * Validation and sanitization utilities for user inputs
 * Following OWASP Mobile Security best practices
 */

/**
 * Sanitizes user input by trimming whitespace, limiting length, and removing dangerous characters
 * @param input - The user input string to sanitize
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized string safe for use in queries
 */
export const sanitizeInput = (input: string, maxLength: number = 100): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>'"]/g, ''); // Remove potentially dangerous characters
};

/**
 * Validates phone number format
 * Accepts formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
 * @param phone - The phone number to validate
 * @returns True if valid phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (typeof phone !== 'string' || phone.length === 0) {
    return false;
  }

  // Allow international format with +, digits, spaces, hyphens, and parentheses
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates HTTP/HTTPS URL
 * @param url - The URL string to validate
 * @returns True if valid HTTP/HTTPS URL
 */
export const isValidHttpUrl = (url: string): boolean => {
  if (typeof url !== 'string' || url.length === 0) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Validates tel: URL for phone dialing
 * @param telUrl - The tel: URL to validate
 * @returns True if valid tel: URL
 */
export const isValidTelUrl = (telUrl: string): boolean => {
  if (typeof telUrl !== 'string' || !telUrl.startsWith('tel:')) {
    return false;
  }

  const phoneNumber = telUrl.replace('tel:', '');
  return isValidPhoneNumber(phoneNumber);
};

/**
 * Validates email address format
 * @param email - The email address to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  if (typeof email !== 'string' || email.length === 0) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321
};

/**
 * Validates GPS coordinates
 * @param latitude - Latitude value
 * @param longitude - Longitude value
 * @returns True if valid coordinates
 */
export const isValidCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
};

/**
 * Validates UUID format
 * @param uuid - The UUID string to validate
 * @returns True if valid UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  if (typeof uuid !== 'string') {
    return false;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Sanitizes search query for safe use in database queries
 * @param query - The search query string
 * @returns Sanitized query string
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (typeof query !== 'string') {
    return '';
  }

  return query
    .trim()
    .slice(0, 200) // Reasonable search query length
    .replace(/[%_\\]/g, '\\$&') // Escape SQL LIKE wildcards
    .replace(/[<>'"]/g, ''); // Remove potentially dangerous characters
};

/**
 * Validates image URL from Supabase storage
 * @param url - The image URL to validate
 * @param allowedDomains - Array of allowed domains (default: Supabase)
 * @returns True if valid and from allowed domain
 */
export const isValidImageUrl = (
  url: string,
  allowedDomains: string[] = ['supabase.co', 'supabase.in']
): boolean => {
  if (!isValidHttpUrl(url)) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return allowedDomains.some((domain) => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
};
