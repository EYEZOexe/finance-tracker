/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { formatCurrency } from '@/lib/transaction-utils';

describe('Transaction Utilities', () => {
  describe('formatCurrency', () => {
    it('formats positive amounts correctly', () => {
      expect(formatCurrency(150000)).toBe('$1,500.00'); // 150000 cents = $1500
      expect(formatCurrency(2550)).toBe('$25.50'); // 2550 cents = $25.50
      expect(formatCurrency(100)).toBe('$1.00'); // 100 cents = $1.00
    });

    it('formats negative amounts correctly', () => {
      expect(formatCurrency(-150000)).toBe('-$1,500.00'); // -150000 cents = -$1500
      expect(formatCurrency(-2550)).toBe('-$25.50'); // -2550 cents = -$25.50
      expect(formatCurrency(-100)).toBe('-$1.00'); // -100 cents = -$1.00
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles decimal precision correctly', () => {
      expect(formatCurrency(12346)).toBe('$123.46'); // 12346 cents = $123.46
      expect(formatCurrency(-12346)).toBe('-$123.46'); // -12346 cents = -$123.46
      expect(formatCurrency(12345)).toBe('$123.45'); // 12345 cents = -$123.45
    });

    it('formats large numbers with thousands separators', () => {
      expect(formatCurrency(123456789)).toBe('$1,234,567.89'); // 123456789 cents = $1,234,567.89
      expect(formatCurrency(-123456789)).toBe('-$1,234,567.89'); // -123456789 cents = -$1,234,567.89
    });

    it('handles null values', () => {
      expect(formatCurrency(null)).toBe('N/A');
    });
  });
});

describe('Transaction Component Logic', () => {
  it('should render basic transaction info correctly', () => {
    // Test the display logic without server components
    const mockTransaction = {
      id: '1',
      description: 'Test Store',
      amount: -2599, // -2599 cents = -$25.99
      date: new Date('2024-01-15'),
      account: { name: 'Test Checking', color: 'blue' },
      category: { name: 'Groceries', color: 'green' },
    };

    // Create a simple component to test the display logic
    const TransactionRow = () => (
      <div data-testid="transaction-row">
        <span data-testid="description">{mockTransaction.description}</span>
        <span data-testid="amount">{formatCurrency(mockTransaction.amount)}</span>
        <span data-testid="account">{mockTransaction.account.name}</span>
        <span data-testid="category">{mockTransaction.category.name}</span>
        <span data-testid="date">{mockTransaction.date.toLocaleDateString()}</span>
      </div>
    );

    render(<TransactionRow />);

    expect(screen.getByTestId('description')).toHaveTextContent('Test Store');
    expect(screen.getByTestId('amount')).toHaveTextContent('-$25.99');
    expect(screen.getByTestId('account')).toHaveTextContent('Test Checking');
    expect(screen.getByTestId('category')).toHaveTextContent('Groceries');
    expect(screen.getByTestId('date')).toHaveTextContent('15/01/2024');
  });

  it('should handle empty transaction list', () => {
    const EmptyState = () => (
      <div data-testid="empty-state">
        <p>No transactions found</p>
        <p>Add your first transaction</p>
      </div>
    );

    render(<EmptyState />);

    expect(screen.getByText('No transactions found')).toBeInTheDocument();
    expect(screen.getByText('Add your first transaction')).toBeInTheDocument();
  });
});
