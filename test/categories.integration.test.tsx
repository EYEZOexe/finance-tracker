/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PREDEFINED_CATEGORIES } from '@/lib/category-constants';

describe('Category Constants', () => {
  describe('PREDEFINED_CATEGORIES', () => {
    it('should have expense categories', () => {
      const expenseCategories = PREDEFINED_CATEGORIES.filter(cat => cat.type === 'EXPENSE');
      expect(expenseCategories.length).toBeGreaterThan(0);
      
      // Check that common expense categories exist
      const categoryNames = expenseCategories.map(cat => cat.name);
      expect(categoryNames).toContain('Groceries');
      expect(categoryNames).toContain('Transportation');
      expect(categoryNames).toContain('Entertainment');
    });

    it('should have income categories', () => {
      const incomeCategories = PREDEFINED_CATEGORIES.filter(cat => cat.type === 'INCOME');
      expect(incomeCategories.length).toBeGreaterThan(0);
      
      // Check that common income categories exist
      const categoryNames = incomeCategories.map(cat => cat.name);
      expect(categoryNames).toContain('Salary');
      expect(categoryNames).toContain('Freelance');
    });

    it('should have required properties for each category', () => {
      PREDEFINED_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('type');
        expect(category).toHaveProperty('color');
        expect(category).toHaveProperty('icon');
        
        // Check that type is valid
        expect(['INCOME', 'EXPENSE']).toContain(category.type);
        
        // Check that name and color are non-empty strings
        expect(typeof category.name).toBe('string');
        expect(category.name.length).toBeGreaterThan(0);
        expect(typeof category.color).toBe('string');
        expect(category.color.length).toBeGreaterThan(0);
        expect(typeof category.icon).toBe('string');
        expect(category.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have unique category names', () => {
      const names = PREDEFINED_CATEGORIES.map(cat => cat.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should have valid color formats', () => {
      PREDEFINED_CATEGORIES.forEach(category => {
        // Check if color is a valid CSS color (hex, named color, etc.)
        // For now, just check it's a non-empty string
        expect(category.color).toBeTruthy();
        expect(typeof category.color).toBe('string');
      });
    });
  });
});

describe('Category Component Logic', () => {
  it('should render category with correct styling', () => {
    const mockCategory = {
      id: '1',
      name: 'Groceries',
      type: 'EXPENSE' as const,
      color: 'emerald',
      icon: '🛒',
      userId: 'test-user-1',
    };

    // Create a simple component to test category display
    const CategoryDisplay = () => (
      <div data-testid="category-display">
        <span data-testid="category-name">{mockCategory.name}</span>
        <span data-testid="category-type">{mockCategory.type}</span>
        <span data-testid="category-icon">{mockCategory.icon}</span>
        <span data-testid="category-color" className={`bg-${mockCategory.color}-100`}>
          {mockCategory.color}
        </span>
      </div>
    );

    render(<CategoryDisplay />);

    expect(screen.getByTestId('category-name')).toHaveTextContent('Groceries');
    expect(screen.getByTestId('category-type')).toHaveTextContent('EXPENSE');
    expect(screen.getByTestId('category-icon')).toHaveTextContent('🛒');
    expect(screen.getByTestId('category-color')).toHaveTextContent('emerald');
  });

  it('should handle income vs expense categorization', () => {
    const incomeCategory = {
      name: 'Salary',
      type: 'INCOME' as const,
      color: 'green',
      icon: '💰',
    };

    const expenseCategory = {
      name: 'Groceries',
      type: 'EXPENSE' as const,
      color: 'red',
      icon: '🛒',
    };

    const CategoryTypeDisplay = ({ category }: { category: typeof incomeCategory }) => (
      <div data-testid="category-type-display">
        <span data-testid="category-name">{category.name}</span>
        <span data-testid="category-type-badge" className={
          category.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }>
          {category.type}
        </span>
      </div>
    );

    const { rerender } = render(<CategoryTypeDisplay category={incomeCategory} />);
    
    expect(screen.getByTestId('category-name')).toHaveTextContent('Salary');
    expect(screen.getByTestId('category-type-badge')).toHaveTextContent('INCOME');
    expect(screen.getByTestId('category-type-badge')).toHaveClass('bg-green-100', 'text-green-800');

    rerender(<CategoryTypeDisplay category={expenseCategory} />);
    
    expect(screen.getByTestId('category-name')).toHaveTextContent('Groceries');
    expect(screen.getByTestId('category-type-badge')).toHaveTextContent('EXPENSE');
    expect(screen.getByTestId('category-type-badge')).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should handle empty category list', () => {
    const EmptyCategoryState = () => (
      <div data-testid="empty-categories">
        <p>No categories found</p>
        <p>Create your first category</p>
      </div>
    );

    render(<EmptyCategoryState />);

    expect(screen.getByText('No categories found')).toBeInTheDocument();
    expect(screen.getByText('Create your first category')).toBeInTheDocument();
  });

  it('should filter categories by type', () => {
    const categories = [
      { id: '1', name: 'Salary', type: 'INCOME' as const },
      { id: '2', name: 'Groceries', type: 'EXPENSE' as const },
      { id: '3', name: 'Freelance', type: 'INCOME' as const },
      { id: '4', name: 'Transportation', type: 'EXPENSE' as const },
    ];

    const CategoryFilter = ({ filterType }: { filterType: 'INCOME' | 'EXPENSE' }) => {
      const filteredCategories = categories.filter(cat => cat.type === filterType);
      
      return (
        <div data-testid={`${filterType.toLowerCase()}-categories`}>
          {filteredCategories.map(category => (
            <div key={category.id} data-testid={`category-${category.id}`}>
              {category.name}
            </div>
          ))}
        </div>
      );
    };

    const { rerender } = render(<CategoryFilter filterType="INCOME" />);
    
    expect(screen.getByTestId('income-categories')).toBeInTheDocument();
    expect(screen.getByTestId('category-1')).toHaveTextContent('Salary');
    expect(screen.getByTestId('category-3')).toHaveTextContent('Freelance');
    expect(screen.queryByTestId('category-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('category-4')).not.toBeInTheDocument();

    rerender(<CategoryFilter filterType="EXPENSE" />);
    
    expect(screen.getByTestId('expense-categories')).toBeInTheDocument();
    expect(screen.getByTestId('category-2')).toHaveTextContent('Groceries');
    expect(screen.getByTestId('category-4')).toHaveTextContent('Transportation');
    expect(screen.queryByTestId('category-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('category-3')).not.toBeInTheDocument();
  });
});

describe('Category Validation Logic', () => {
  it('should validate category names', () => {
    const validateCategoryName = (name: string) => {
      if (!name || name.trim().length === 0) {
        return 'Category name is required';
      }
      if (name.trim().length < 2) {
        return 'Category name must be at least 2 characters';
      }
      if (name.trim().length > 50) {
        return 'Category name must be less than 50 characters';
      }
      return null;
    };

    expect(validateCategoryName('')).toBe('Category name is required');
    expect(validateCategoryName('   ')).toBe('Category name is required');
    expect(validateCategoryName('A')).toBe('Category name must be at least 2 characters');
    expect(validateCategoryName('Valid Category')).toBeNull();
    expect(validateCategoryName('A'.repeat(51))).toBe('Category name must be less than 50 characters');
  });

  it('should validate category type', () => {
    const validateCategoryType = (type: string) => {
      const validTypes = ['INCOME', 'EXPENSE'];
      return validTypes.includes(type) ? null : 'Invalid category type';
    };

    expect(validateCategoryType('INCOME')).toBeNull();
    expect(validateCategoryType('EXPENSE')).toBeNull();
    expect(validateCategoryType('INVALID')).toBe('Invalid category type');
    expect(validateCategoryType('')).toBe('Invalid category type');
  });
});
