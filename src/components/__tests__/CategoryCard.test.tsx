/**
 * Component tests for CategoryCard
 * Testing rendering and user interactions
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoryCard from '../CategoryCard';
import type { Category } from '../../types';

describe('CategoryCard', () => {
  const mockCategory: Category & { name: string } = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name_key: 'restaurants',
    created_at: '2025-01-01T00:00:00Z',
    name: 'Restaurants',
  };

  const mockOnPress = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText } = render(<CategoryCard category={mockCategory} onPress={mockOnPress} />);

    expect(getByText('Restaurants')).toBeTruthy();
    expect(getByText('🍽️')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByA11yRole } = render(
      <CategoryCard category={mockCategory} onPress={mockOnPress} />
    );

    const button = getByA11yRole('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockCategory);
  });

  it('should have correct accessibility props', () => {
    const { getByA11yLabel, getByA11yHint } = render(
      <CategoryCard category={mockCategory} onPress={mockOnPress} />
    );

    expect(getByA11yLabel('Restaurants category')).toBeTruthy();
    expect(getByA11yHint('View all businesses in Restaurants category')).toBeTruthy();
  });

  it('should render different category icons', () => {
    const accommodationCategory = { ...mockCategory, name_key: 'accommodation' as any, name: 'Hotels' };
    const { getByText, rerender } = render(
      <CategoryCard category={mockCategory} onPress={mockOnPress} />
    );

    expect(getByText('🍽️')).toBeTruthy();

    rerender(<CategoryCard category={accommodationCategory} onPress={mockOnPress} />);
    expect(getByText('🏨')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<CategoryCard category={mockCategory} onPress={mockOnPress} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
