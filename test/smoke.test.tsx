import { render, screen } from "@testing-library/react";
import React from "react";

// Test that our core data models and utilities work
import { ACCOUNT_TYPES, ACCOUNT_COLORS, CURRENCIES } from "@/lib/account-constants";
import { ALL_CATEGORIES, getCategoryVisual } from "@/lib/category-constants";
import { formatCurrency, parseCurrencyInput, isIncomeTransaction, isExpenseTransaction } from "@/lib/transaction-utils";

describe("Core Application Logic", () => {
  describe("Account System", () => {
    it("provides account types and colors", () => {
      expect(ACCOUNT_TYPES.length).toBeGreaterThan(0);
      expect(ACCOUNT_COLORS.length).toBeGreaterThan(0);
      expect(CURRENCIES.length).toBeGreaterThan(0);
      
      const checking = ACCOUNT_TYPES.find(t => t.value === "CHECKING");
      expect(checking).toHaveProperty("label", "Checking");
      expect(checking).toHaveProperty("icon");
      expect(checking).toHaveProperty("color");
    });
  });

  describe("Category System", () => {
    it("provides predefined categories", () => {
      expect(ALL_CATEGORIES.length).toBeGreaterThan(0);
      
      const groceries = getCategoryVisual("Groceries", "expense");
      expect(groceries).toHaveProperty("icon");
      expect(groceries).toHaveProperty("color");
    });
  });

  describe("Transaction Utilities", () => {
    it("formats currency correctly", () => {
      expect(formatCurrency(1000)).toBe("$10.00");
      expect(formatCurrency(-1000)).toBe("-$10.00");
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(null)).toBe("N/A");
    });

    it("parses currency input correctly", () => {
      expect(parseCurrencyInput("$10.00")).toBe(1000);
      expect(parseCurrencyInput("10")).toBe(1000);
      expect(parseCurrencyInput("-5.50")).toBe(-550);
    });

    it("identifies income and expense transactions", () => {
      expect(isIncomeTransaction(1000)).toBe(true);
      expect(isIncomeTransaction(-1000)).toBe(false);
      expect(isExpenseTransaction(-1000)).toBe(true);
      expect(isExpenseTransaction(1000)).toBe(false);
    });
  });
});