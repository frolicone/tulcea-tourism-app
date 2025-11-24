/**
 * Unit tests for validation utilities
 * Testing input sanitization and validation functions for security
 */
import {
  sanitizeInput,
  isValidPhoneNumber,
  isValidHttpUrl,
  sanitizeSearchQuery,
  isValidUUID,
} from '../validation';

describe('validation utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove special characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('should enforce maximum length', () => {
      const longString = 'a'.repeat(200);
      expect(sanitizeInput(longString, 50).length).toBe(50);
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
      expect(sanitizeInput(123 as any)).toBe('');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should accept valid phone numbers', () => {
      expect(isValidPhoneNumber('+1234567890')).toBe(true);
      expect(isValidPhoneNumber('123-456-7890')).toBe(true);
      expect(isValidPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isValidPhoneNumber('+40 123 456 789')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('abc')).toBe(false);
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('12345678901234567890123')).toBe(false);
    });

    it('should reject empty or non-string input', () => {
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber(null as any)).toBe(false);
      expect(isValidPhoneNumber(undefined as any)).toBe(false);
      expect(isValidPhoneNumber(123 as any)).toBe(false);
    });
  });

  describe('isValidHttpUrl', () => {
    it('should accept valid HTTP/HTTPS URLs', () => {
      expect(isValidHttpUrl('http://example.com')).toBe(true);
      expect(isValidHttpUrl('https://example.com')).toBe(true);
      expect(isValidHttpUrl('https://example.com/path?query=value')).toBe(true);
    });

    it('should reject non-HTTP protocols', () => {
      expect(isValidHttpUrl('ftp://example.com')).toBe(false);
      expect(isValidHttpUrl('javascript:alert("xss")')).toBe(false);
      expect(isValidHttpUrl('tel:+1234567890')).toBe(false);
    });

    it('should reject malformed URLs', () => {
      expect(isValidHttpUrl('not a url')).toBe(false);
      expect(isValidHttpUrl('//example.com')).toBe(false);
    });

    it('should reject empty or non-string input', () => {
      expect(isValidHttpUrl('')).toBe(false);
      expect(isValidHttpUrl(null as any)).toBe(false);
      expect(isValidHttpUrl(undefined as any)).toBe(false);
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should escape SQL wildcards', () => {
      expect(sanitizeSearchQuery('test%query')).toBe('test\\%query');
      expect(sanitizeSearchQuery('test_query')).toBe('test\\_query');
      expect(sanitizeSearchQuery('test\\query')).toBe('test\\\\query');
    });

    it('should remove special characters', () => {
      expect(sanitizeSearchQuery('<script>test</script>')).toBe('scripttest/script');
    });

    it('should trim and limit length', () => {
      const longQuery = 'a'.repeat(300);
      expect(sanitizeSearchQuery(longQuery).length).toBe(200);
      expect(sanitizeSearchQuery('  test query  ')).toBe('test query');
    });

    it('should handle empty or non-string input', () => {
      expect(sanitizeSearchQuery('')).toBe('');
      expect(sanitizeSearchQuery(null as any)).toBe('');
      expect(sanitizeSearchQuery(undefined as any)).toBe('');
    });
  });

  describe('isValidUUID', () => {
    it('should accept valid UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUUID('00000000-0000-0000-0000-000000000000')).toBe(true);
    });

    it('should accept UUIDs with uppercase letters', () => {
      expect(isValidUUID('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000-extra')).toBe(false);
      expect(isValidUUID('123e4567e89b12d3a456426614174000')).toBe(false);
    });

    it('should reject empty or non-string input', () => {
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID(null as any)).toBe(false);
      expect(isValidUUID(undefined as any)).toBe(false);
      expect(isValidUUID(123 as any)).toBe(false);
    });
  });
});
