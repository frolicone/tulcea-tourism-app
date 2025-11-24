/**
 * Component tests for BusinessCard
 * Testing rendering with various business data configurations
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BusinessCard from '../BusinessCard';
import type { BusinessWithTranslation } from '../../types';

describe('BusinessCard', () => {
  const mockBusiness: BusinessWithTranslation = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    category_id: '456e7890-e89b-12d3-a456-426614174000',
    phone: '+40 123 456 789',
    latitude: 45.1768,
    longitude: 28.8049,
    images: ['https://example.com/image1.jpg'],
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    name: 'Test Business',
    description: 'A great business in Tulcea',
    address: '123 Main Street, Tulcea',
  };

  const mockOnPress = jest.fn();
  const noImageText = 'No image available';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render business with all information', () => {
    const { getByText } = render(
      <BusinessCard business={mockBusiness} onPress={mockOnPress} noImageText={noImageText} />
    );

    expect(getByText('Test Business')).toBeTruthy();
    expect(getByText('A great business in Tulcea')).toBeTruthy();
    expect(getByText('📞 +40 123 456 789')).toBeTruthy();
    expect(getByText('📍 123 Main Street, Tulcea')).toBeTruthy();
  });

  it('should render business without phone', () => {
    const businessWithoutPhone = { ...mockBusiness, phone: null };
    const { getByText, queryByText } = render(
      <BusinessCard business={businessWithoutPhone} onPress={mockOnPress} noImageText={noImageText} />
    );

    expect(getByText('Test Business')).toBeTruthy();
    expect(queryByText(/📞/)).toBeNull();
  });

  it('should render business without address', () => {
    const businessWithoutAddress = { ...mockBusiness, address: '' };
    const { getByText, queryByText } = render(
      <BusinessCard business={businessWithoutAddress} onPress={mockOnPress} noImageText={noImageText} />
    );

    expect(getByText('Test Business')).toBeTruthy();
    expect(queryByText(/📍/)).toBeNull();
  });

  it('should show placeholder when no images', () => {
    const businessWithoutImages = { ...mockBusiness, images: [] };
    const { getByText } = render(
      <BusinessCard business={businessWithoutImages} onPress={mockOnPress} noImageText={noImageText} />
    );

    expect(getByText(noImageText)).toBeTruthy();
  });

  it('should call onPress with business id when pressed', () => {
    const { getByA11yRole } = render(
      <BusinessCard business={mockBusiness} onPress={mockOnPress} noImageText={noImageText} />
    );

    const button = getByA11yRole('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockBusiness.id);
  });

  it('should have correct accessibility label', () => {
    const { getByA11yLabel } = render(
      <BusinessCard business={mockBusiness} onPress={mockOnPress} noImageText={noImageText} />
    );

    expect(
      getByA11yLabel('Test Business, located at 123 Main Street, Tulcea, phone +40 123 456 789')
    ).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(
      <BusinessCard business={mockBusiness} onPress={mockOnPress} noImageText={noImageText} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
