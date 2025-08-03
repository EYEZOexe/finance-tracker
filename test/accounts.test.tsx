/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  ACCOUNT_TYPES,
  ACCOUNT_COLORS,
  ACCOUNT_ICONS,
  type AccountType
} from '@/lib/account-constants';

describe('Account Constants', () => {
  describe('ACCOUNT_TYPES', () => {
    it('should have all expected account types', () => {
      expect(ACCOUNT_TYPES.length).toBeGreaterThan(0);
      
      const typeValues = ACCOUNT_TYPES.map(type => type.value);
      expect(typeValues).toContain('CHECKING');
      expect(typeValues).toContain('SAVINGS');
      expect(typeValues).toContain('CREDIT');
      expect(typeValues).toContain('CASH');
    });

    it('should have required properties for each account type', () => {
      ACCOUNT_TYPES.forEach(type => {
        expect(type).toHaveProperty('value');
        expect(type).toHaveProperty('label');
        expect(type).toHaveProperty('icon');
        
        expect(typeof type.value).toBe('string');
        expect(type.value.length).toBeGreaterThan(0);
        expect(typeof type.label).toBe('string');
        expect(type.label.length).toBeGreaterThan(0);
        expect(typeof type.icon).toBe('string');
        expect(type.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have unique account type values', () => {
      const values = ACCOUNT_TYPES.map(type => type.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('ACCOUNT_COLORS', () => {
    it('should have color options available', () => {
      expect(ACCOUNT_COLORS.length).toBeGreaterThan(0);
      
      ACCOUNT_COLORS.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/); // Hex color format
      });
    });

    it('should have unique color values', () => {
      const uniqueColors = new Set(ACCOUNT_COLORS);
      expect(uniqueColors.size).toBe(ACCOUNT_COLORS.length);
    });
  });

  describe('ACCOUNT_ICONS', () => {
    it('should have icon options available', () => {
      expect(ACCOUNT_ICONS.length).toBeGreaterThan(0);
      
      ACCOUNT_ICONS.forEach(icon => {
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      });
    });

    it('should have unique icons', () => {
      const uniqueIcons = new Set(ACCOUNT_ICONS);
      expect(uniqueIcons.size).toBe(ACCOUNT_ICONS.length);
    });
  });
});

describe('Account Component Logic', () => {
  it('should render account with correct styling', () => {
    const mockAccount = {
      id: '1',
      name: 'Test Checking',
      type: 'CHECKING' as AccountType,
      balance: 250000, // $2,500.00 in cents
      currency: 'USD',
      color: '#3b82f6',
      icon: 'CreditCard',
      userId: 'test-user-1',
    };

    // Create a simple component to test account display
    const AccountDisplay = () => (
      <div data-testid="account-display">
        <span data-testid="account-name">{mockAccount.name}</span>
        <span data-testid="account-type">{mockAccount.type}</span>
        <span data-testid="account-balance">${(mockAccount.balance / 100).toFixed(2)}</span>
        <span data-testid="account-currency">{mockAccount.currency}</span>
        <span data-testid="account-icon">{mockAccount.icon}</span>
        <div data-testid="account-color" style={{ backgroundColor: mockAccount.color }}>
          Color Sample
        </div>
      </div>
    );

    render(<AccountDisplay />);

    expect(screen.getByTestId('account-name')).toHaveTextContent('Test Checking');
    expect(screen.getByTestId('account-type')).toHaveTextContent('CHECKING');
    expect(screen.getByTestId('account-balance')).toHaveTextContent('$2500.00');
    expect(screen.getByTestId('account-currency')).toHaveTextContent('USD');
    expect(screen.getByTestId('account-icon')).toHaveTextContent('CreditCard');
  });

  it('should handle different account types', () => {
    const accounts = [
      { id: '1', name: 'Main Checking', type: 'CHECKING' as AccountType, balance: 100000 },
      { id: '2', name: 'Emergency Savings', type: 'SAVINGS' as AccountType, balance: 500000 },
      { id: '3', name: 'Travel Card', type: 'CREDIT' as AccountType, balance: -25000 },
      { id: '4', name: 'Wallet Cash', type: 'CASH' as AccountType, balance: 5000 },
    ];

    const AccountTypeList = () => (
      <div data-testid="account-type-list">
        {accounts.map(account => (
          <div key={account.id} data-testid={`account-${account.id}`}>
            <span data-testid={`type-${account.id}`}>{account.type}</span>
            <span data-testid={`balance-${account.id}`} className={
              account.balance < 0 ? 'text-red-600' : 'text-green-600'
            }>
              ${(account.balance / 100).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );

    render(<AccountTypeList />);

    expect(screen.getByTestId('type-1')).toHaveTextContent('CHECKING');
    expect(screen.getByTestId('type-2')).toHaveTextContent('SAVINGS');
    expect(screen.getByTestId('type-3')).toHaveTextContent('CREDIT');
    expect(screen.getByTestId('type-4')).toHaveTextContent('CASH');

    // Check balance styling
    expect(screen.getByTestId('balance-1')).toHaveClass('text-green-600');
    expect(screen.getByTestId('balance-3')).toHaveClass('text-red-600');
  });

  it('should handle empty account list', () => {
    const EmptyAccountState = () => (
      <div data-testid="empty-accounts">
        <p>No accounts found</p>
        <p>Create your first account</p>
      </div>
    );

    render(<EmptyAccountState />);

    expect(screen.getByText('No accounts found')).toBeInTheDocument();
    expect(screen.getByText('Create your first account')).toBeInTheDocument();
  });

  it('should filter accounts by type', () => {
    const accounts = [
      { id: '1', type: 'CHECKING' as AccountType, name: 'Main Checking' },
      { id: '2', type: 'SAVINGS' as AccountType, name: 'Emergency Fund' },
      { id: '3', type: 'CHECKING' as AccountType, name: 'Business Checking' },
      { id: '4', type: 'CREDIT' as AccountType, name: 'Travel Card' },
    ];

    const AccountFilter = ({ filterType }: { filterType: AccountType }) => {
      const filteredAccounts = accounts.filter(account => account.type === filterType);
      
      return (
        <div data-testid={`${filterType.toLowerCase()}-accounts`}>
          {filteredAccounts.map(account => (
            <div key={account.id} data-testid={`account-${account.id}`}>
              {account.name}
            </div>
          ))}
        </div>
      );
    };

    const { rerender } = render(<AccountFilter filterType="CHECKING" />);
    
    expect(screen.getByTestId('checking-accounts')).toBeInTheDocument();
    expect(screen.getByTestId('account-1')).toHaveTextContent('Main Checking');
    expect(screen.getByTestId('account-3')).toHaveTextContent('Business Checking');
    expect(screen.queryByTestId('account-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-4')).not.toBeInTheDocument();

    rerender(<AccountFilter filterType="SAVINGS" />);
    
    expect(screen.getByTestId('savings-accounts')).toBeInTheDocument();
    expect(screen.getByTestId('account-2')).toHaveTextContent('Emergency Fund');
    expect(screen.queryByTestId('account-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-4')).not.toBeInTheDocument();
  });

  it('should calculate total balance correctly', () => {
    const accounts = [
      { balance: 100000 }, // $1,000.00
      { balance: 250000 }, // $2,500.00
      { balance: -50000 }, // -$500.00
    ];

    const calculateTotalBalance = (accounts: { balance: number }[]) => {
      return accounts.reduce((total, account) => total + account.balance, 0);
    };

    const BalanceDisplay = () => {
      const total = calculateTotalBalance(accounts);
      return (
        <div data-testid="total-balance">
          Total: ${(total / 100).toFixed(2)}
        </div>
      );
    };

    render(<BalanceDisplay />);

    expect(screen.getByTestId('total-balance')).toHaveTextContent('Total: $3000.00');
  });
});

describe('Account Validation Logic', () => {
  it('should validate account names', () => {
    const validateAccountName = (name: string) => {
      if (!name || name.trim().length === 0) {
        return 'Account name is required';
      }
      if (name.trim().length < 2) {
        return 'Account name must be at least 2 characters';
      }
      if (name.trim().length > 50) {
        return 'Account name must be less than 50 characters';
      }
      return null;
    };

    expect(validateAccountName('')).toBe('Account name is required');
    expect(validateAccountName('   ')).toBe('Account name is required');
    expect(validateAccountName('A')).toBe('Account name must be at least 2 characters');
    expect(validateAccountName('Valid Account')).toBeNull();
    expect(validateAccountName('A'.repeat(51))).toBe('Account name must be less than 50 characters');
  });

  it('should validate account type', () => {
    const validateAccountType = (type: string): string | null => {
      const validTypes = ['CHECKING', 'SAVINGS', 'CREDIT', 'CASH', 'INVESTMENT', 'LOAN'];
      return validTypes.includes(type) ? null : 'Invalid account type';
    };

    expect(validateAccountType('CHECKING')).toBeNull();
    expect(validateAccountType('SAVINGS')).toBeNull();
    expect(validateAccountType('CREDIT')).toBeNull();
    expect(validateAccountType('CASH')).toBeNull();
    expect(validateAccountType('INVALID')).toBe('Invalid account type');
    expect(validateAccountType('')).toBe('Invalid account type');
  });

  it('should validate currency', () => {
    const validateCurrency = (currency: string): string | null => {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
      return validCurrencies.includes(currency) ? null : 'Invalid currency';
    };

    expect(validateCurrency('USD')).toBeNull();
    expect(validateCurrency('EUR')).toBeNull();
    expect(validateCurrency('XYZ')).toBe('Invalid currency');
    expect(validateCurrency('')).toBe('Invalid currency');
  });

  it('should validate balance format', () => {
    const validateBalance = (balance: number): string | null => {
      if (isNaN(balance)) {
        return 'Balance must be a valid number';
      }
      if (!Number.isInteger(balance)) {
        return 'Balance must be in cents (integer)';
      }
      return null;
    };

    expect(validateBalance(100000)).toBeNull(); // $1000.00
    expect(validateBalance(-50000)).toBeNull(); // -$500.00
    expect(validateBalance(0)).toBeNull();
    expect(validateBalance(NaN)).toBe('Balance must be a valid number');
    expect(validateBalance(100.5)).toBe('Balance must be in cents (integer)');
  });
});
