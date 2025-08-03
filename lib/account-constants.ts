// Account types with their default colors and icons
export const ACCOUNT_TYPES = [
  { value: "CHECKING", label: "Checking", color: "#3b82f6", icon: "🏦" },
  { value: "SAVINGS", label: "Savings", color: "#10b981", icon: "💰" },
  { value: "CREDIT", label: "Credit Card", color: "#ef4444", icon: "💳" },
  { value: "INVESTMENT", label: "Investment", color: "#8b5cf6", icon: "📈" },
  { value: "CASH", label: "Cash", color: "#f59e0b", icon: "💵" },
] as const;

// Predefined colors for accounts
export const ACCOUNT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#6366f1", // indigo
  "#f97316", // orange
] as const;

// Icon options for accounts
export const ACCOUNT_ICONS = [
  "🏦", // bank
  "💰", // money bag
  "💳", // credit card
  "📈", // trending up
  "💵", // dollar bills
  "💎", // diamond
  "🏠", // house
  "🚗", // car
  "🛒", // shopping cart
  "🎯", // target
  "💼", // briefcase
  "🎓", // graduation cap
  "⚕️", // medical
  "🍽️", // dining
  "🎬", // entertainment
  "🛡️", // insurance
] as const;

// Currency options (can be expanded)
export const CURRENCIES = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
] as const;

export type AccountType = typeof ACCOUNT_TYPES[number]["value"];
export type AccountColor = typeof ACCOUNT_COLORS[number];
export type AccountIcon = typeof ACCOUNT_ICONS[number];
