/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES, getCategoryVisual } from '@/lib/category-constants';

describe('Category Constants', () => {
  describe('EXPENSE_CATEGORIES', () => {
    it('should have expense categories', () => {
      expect(EXPENSE_CATEGORIES.length).toBeGreaterThan(0);
      
      // Check that common expense categories exist
      const categoryNames = EXPENSE_CATEGORIES.map(cat => cat.name);
      expect(categoryNames).toContain('Groceries');
      expect(categoryNames).toContain('Transportation');
      expect(categoryNames).toContain('Entertainment');
    });

    it('should have required properties for each category', () => {
      EXPENSE_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('color');
        expect(category).toHaveProperty('icon');
        
        // Check that name and color are non-empty strings
        expect(typeof category.name).toBe('string');
        expect(category.name.length).toBeGreaterThan(0);
        expect(typeof category.color).toBe('string');
        expect(category.color.length).toBeGreaterThan(0);
        expect(typeof category.icon).toBe('string');
        expect(category.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('INCOME_CATEGORIES', () => {
    it('should have income categories', () => {
      expect(INCOME_CATEGORIES.length).toBeGreaterThan(0);
      
      // Check that common income categories exist
      const categoryNames = INCOME_CATEGORIES.map(cat => cat.name);
      expect(categoryNames).toContain('Salary');
      expect(categoryNames).toContain('Freelance');
    });

    it('should have required properties for each category', () => {
      INCOME_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('color');
        expect(category).toHaveProperty('icon');
        
        // Check that name and color are non-empty strings
        expect(typeof category.name).toBe('string');
        expect(category.name.length).toBeGreaterThan(0);
        expect(typeof category.color).toBe('string');
        expect(category.color.length).toBeGreaterThan(0);
        expect(typeof category.icon).toBe('string');
        expect(category.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('ALL_CATEGORIES', () => {
    it('should contain both expense and income categories', () => {
      expect(ALL_CATEGORIES.length).toBe(EXPENSE_CATEGORIES.length + INCOME_CATEGORIES.length);
      
      // Check that it contains categories from both types
      const allNames = ALL_CATEGORIES.map(cat => cat.name);
      expect(allNames).toContain('Groceries'); // expense
      expect(allNames).toContain('Salary'); // income
    });

    it('should have no duplicate names', () => {
      const names = ALL_CATEGORIES.map(cat => cat.name);
      const uniqueNames = [...new Set(names)];
      expect(names.length).toBe(uniqueNames.length);
    });
  });

  describe('getCategoryVisual', () => {
    it('should return visual info for existing categories', () => {
      const expenseVisual = getCategoryVisual('Groceries', 'expense');
      expect(expenseVisual).toEqual({
        icon: '🛒',
        color: '#10b981'
      });

      const incomeVisual = getCategoryVisual('Salary', 'income');
      expect(incomeVisual).toEqual({
        icon: '💼',
        color: '#059669'
      });
    });

    it('should return null for unknown categories', () => {
      const unknownVisual = getCategoryVisual('Unknown Category', 'expense');
      expect(unknownVisual).toBeNull();
    });
  });
});

describe('Category Component Integration', () => {
  // Mock a simple CategoryDisplay component for testing
  const CategoryDisplay = ({ name, kind }: { name: string; kind: 'income' | 'expense' }) => {
    const visual = getCategoryVisual(name, kind);
    const { icon, color } = visual || { icon: '📁', color: '#6b7280' };
    return (
      <div data-testid="category-display">
        <span style={{ color }}>{icon}</span>
        <span>{name}</span>
      </div>
    );
  };

  it('should render expense category with correct visual', () => {
    render(<CategoryDisplay name="Groceries" kind="expense" />);
    
    const display = screen.getByTestId('category-display');
    expect(display).toBeInTheDocument();
    expect(display).toHaveTextContent('🛒');
    expect(display).toHaveTextContent('Groceries');
  });

  it('should render income category with correct visual', () => {
    render(<CategoryDisplay name="Salary" kind="income" />);
    
    const display = screen.getByTestId('category-display');
    expect(display).toBeInTheDocument();
    expect(display).toHaveTextContent('💼');
    expect(display).toHaveTextContent('Salary');
  });

  it('should render unknown category with default visual', () => {
    render(<CategoryDisplay name="Unknown" kind="expense" />);
    
    const display = screen.getByTestId('category-display');
    expect(display).toBeInTheDocument();
    expect(display).toHaveTextContent('📁');
    expect(display).toHaveTextContent('Unknown');
  });
});
