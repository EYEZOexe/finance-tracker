/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  EXPENSE_CATEGORIES, 
  INCOME_CATEGORIES, 
  ALL_CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  getCategoryVisual,
  type CategoryKind
} from '@/lib/category-constants';

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
    it('should combine income and expense categories with correct kinds', () => {
      expect(ALL_CATEGORIES.length).toBe(EXPENSE_CATEGORIES.length + INCOME_CATEGORIES.length);
      
      const expenseCategories = ALL_CATEGORIES.filter(cat => cat.kind === 'expense');
      const incomeCategories = ALL_CATEGORIES.filter(cat => cat.kind === 'income');
      
      expect(expenseCategories.length).toBe(EXPENSE_CATEGORIES.length);
      expect(incomeCategories.length).toBe(INCOME_CATEGORIES.length);
    });

    it('should have unique category names within each kind', () => {
      const expenseNames = ALL_CATEGORIES
        .filter(cat => cat.kind === 'expense')
        .map(cat => cat.name);
      const incomeNames = ALL_CATEGORIES
        .filter(cat => cat.kind === 'income')
        .map(cat => cat.name);
      
      expect(new Set(expenseNames).size).toBe(expenseNames.length);
      expect(new Set(incomeNames).size).toBe(incomeNames.length);
    });
  });

  describe('getCategoryVisual helper', () => {
    it('should return visual info for existing categories', () => {
      const groceriesVisual = getCategoryVisual('Groceries', 'expense');
      expect(groceriesVisual).not.toBeNull();
      expect(groceriesVisual).toHaveProperty('icon');
      expect(groceriesVisual).toHaveProperty('color');

      const salaryVisual = getCategoryVisual('Salary', 'income');
      expect(salaryVisual).not.toBeNull();
      expect(salaryVisual).toHaveProperty('icon');
      expect(salaryVisual).toHaveProperty('color');
    });

    it('should return null for non-existing categories', () => {
      const nonExistentVisual = getCategoryVisual('Non-existent Category', 'expense');
      expect(nonExistentVisual).toBeNull();
    });

    it('should return null for wrong kind', () => {
      const wrongKindVisual = getCategoryVisual('Groceries', 'income'); // Groceries is expense
      expect(wrongKindVisual).toBeNull();
    });
  });

  describe('CATEGORY_ICONS and CATEGORY_COLORS', () => {
    it('should have icon options available', () => {
      expect(CATEGORY_ICONS.length).toBeGreaterThan(0);
      CATEGORY_ICONS.forEach(icon => {
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      });
    });

    it('should have color options available', () => {
      expect(CATEGORY_COLORS.length).toBeGreaterThan(0);
      CATEGORY_COLORS.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/); // Hex color format
      });
    });
  });
});

describe('Category Component Logic', () => {
  it('should render category with correct styling', () => {
    const mockCategory = {
      id: '1',
      name: 'Groceries',
      kind: 'expense' as CategoryKind,
      color: '#10b981',
      icon: '🛒',
      userId: 'test-user-1',
    };

    // Create a simple component to test category display
    const CategoryDisplay = () => (
      <div data-testid="category-display">
        <span data-testid="category-name">{mockCategory.name}</span>
        <span data-testid="category-kind">{mockCategory.kind}</span>
        <span data-testid="category-icon">{mockCategory.icon}</span>
        <span data-testid="category-color" style={{ backgroundColor: mockCategory.color }}>
          {mockCategory.color}
        </span>
      </div>
    );

    render(<CategoryDisplay />);

    expect(screen.getByTestId('category-name')).toHaveTextContent('Groceries');
    expect(screen.getByTestId('category-kind')).toHaveTextContent('expense');
    expect(screen.getByTestId('category-icon')).toHaveTextContent('🛒');
    expect(screen.getByTestId('category-color')).toHaveTextContent('#10b981');
  });

  it('should handle income vs expense categorization', () => {
    type CategoryDisplayType = {
      name: string;
      kind: CategoryKind;
      color: string;
      icon: string;
    };

    const incomeCategory: CategoryDisplayType = {
      name: 'Salary',
      kind: 'income',
      color: '#059669',
      icon: '💰',
    };

    const expenseCategory: CategoryDisplayType = {
      name: 'Groceries',
      kind: 'expense',
      color: '#ef4444',
      icon: '🛒',
    };

    const CategoryTypeDisplay = ({ category }: { category: CategoryDisplayType }) => (
      <div data-testid="category-type-display">
        <span data-testid="category-name">{category.name}</span>
        <span data-testid="category-type-badge" className={
          category.kind === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }>
          {category.kind}
        </span>
      </div>
    );

    const { rerender } = render(<CategoryTypeDisplay category={incomeCategory} />);
    
    expect(screen.getByTestId('category-name')).toHaveTextContent('Salary');
    expect(screen.getByTestId('category-type-badge')).toHaveTextContent('income');
    expect(screen.getByTestId('category-type-badge')).toHaveClass('bg-green-100', 'text-green-800');

    rerender(<CategoryTypeDisplay category={expenseCategory} />);
    
    expect(screen.getByTestId('category-name')).toHaveTextContent('Groceries');
    expect(screen.getByTestId('category-type-badge')).toHaveTextContent('expense');
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

  it('should filter categories by kind', () => {
    const categories = [
      { id: '1', name: 'Salary', kind: 'income' as CategoryKind },
      { id: '2', name: 'Groceries', kind: 'expense' as CategoryKind },
      { id: '3', name: 'Freelance', kind: 'income' as CategoryKind },
      { id: '4', name: 'Transportation', kind: 'expense' as CategoryKind },
    ];

    const CategoryFilter = ({ filterKind }: { filterKind: CategoryKind }) => {
      const filteredCategories = categories.filter(cat => cat.kind === filterKind);
      
      return (
        <div data-testid={`${filterKind}-categories`}>
          {filteredCategories.map(category => (
            <div key={category.id} data-testid={`category-${category.id}`}>
              {category.name}
            </div>
          ))}
        </div>
      );
    };

    const { rerender } = render(<CategoryFilter filterKind="income" />);
    
    expect(screen.getByTestId('income-categories')).toBeInTheDocument();
    expect(screen.getByTestId('category-1')).toHaveTextContent('Salary');
    expect(screen.getByTestId('category-3')).toHaveTextContent('Freelance');
    expect(screen.queryByTestId('category-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('category-4')).not.toBeInTheDocument();

    rerender(<CategoryFilter filterKind="expense" />);
    
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

  it('should validate category kind', () => {
    const validateCategoryKind = (kind: string): string | null => {
      const validKinds = ['income', 'expense'];
      return validKinds.includes(kind) ? null : 'Invalid category kind';
    };

    expect(validateCategoryKind('income')).toBeNull();
    expect(validateCategoryKind('expense')).toBeNull();
    expect(validateCategoryKind('INVALID')).toBe('Invalid category kind');
    expect(validateCategoryKind('')).toBe('Invalid category kind');
  });
});
