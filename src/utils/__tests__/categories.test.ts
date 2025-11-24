/**
 * Unit tests for category utilities
 * Testing category icon mapping functionality
 */
import { getCategoryIcon } from '../categories';
import type { CategoryKey } from '../../types';

describe('getCategoryIcon', () => {
  it('should return correct icon for travel_agencies', () => {
    expect(getCategoryIcon('travel_agencies' as CategoryKey)).toBe('✈️');
  });

  it('should return correct icon for accommodation', () => {
    expect(getCategoryIcon('accommodation' as CategoryKey)).toBe('🏨');
  });

  it('should return correct icon for restaurants', () => {
    expect(getCategoryIcon('restaurants' as CategoryKey)).toBe('🍽️');
  });

  it('should return correct icon for bank_atms', () => {
    expect(getCategoryIcon('bank_atms' as CategoryKey)).toBe('🏧');
  });

  it('should return default icon for unknown category', () => {
    expect(getCategoryIcon('unknown_category' as CategoryKey)).toBe('📍');
  });

  it('should return default icon for empty string', () => {
    expect(getCategoryIcon('' as CategoryKey)).toBe('📍');
  });

  it('should return default icon for invalid input', () => {
    expect(getCategoryIcon(null as any)).toBe('📍');
    expect(getCategoryIcon(undefined as any)).toBe('📍');
  });
});
