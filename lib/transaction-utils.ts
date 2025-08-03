// Utility functions for transaction handling

export function formatCurrency(cents: number | null, currency = "USD"): string {
  if (cents === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function parseCurrencyInput(input: string): number {
  // Remove currency symbols and non-numeric characters except decimal point and minus
  const cleaned = input.replace(/[^\d.-]/g, "");
  const amount = parseFloat(cleaned);
  if (isNaN(amount)) {
    throw new Error("Invalid amount");
  }
  return Math.round(amount * 100); // Convert to cents
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function isIncomeTransaction(amount: number): boolean {
  return amount > 0;
}

export function isExpenseTransaction(amount: number): boolean {
  return amount < 0;
}

export function getTransactionType(amount: number): "income" | "expense" {
  return amount > 0 ? "income" : "expense";
}

export function formatTransactionAmount(amount: number): { 
  formatted: string; 
  type: "income" | "expense";
  absolute: string;
} {
  const type = getTransactionType(amount);
  const absolute = formatCurrency(Math.abs(amount));
  const formatted = type === "income" ? `+${absolute}` : `-${absolute}`;
  
  return { formatted, type, absolute };
}
