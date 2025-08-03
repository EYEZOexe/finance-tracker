// Predefined expense categories with icons and colors
export const EXPENSE_CATEGORIES = [
  { name: "Housing", icon: "🏠", color: "#3b82f6" },
  { name: "Transportation", icon: "🚗", color: "#ef4444" },
  { name: "Food & Dining", icon: "🍽️", color: "#f59e0b" },
  { name: "Groceries", icon: "🛒", color: "#10b981" },
  { name: "Shopping", icon: "🛍️", color: "#8b5cf6" },
  { name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { name: "Healthcare", icon: "⚕️", color: "#06b6d4" },
  { name: "Utilities", icon: "⚡", color: "#84cc16" },
  { name: "Insurance", icon: "🛡️", color: "#6366f1" },
  { name: "Education", icon: "📚", color: "#f97316" },
] as const;

// Predefined income categories with icons and colors
export const INCOME_CATEGORIES = [
  { name: "Salary", icon: "💼", color: "#059669" },
  { name: "Freelance", icon: "💻", color: "#7c3aed" },
  { name: "Investment Income", icon: "📊", color: "#dc2626" },
  { name: "Side Hustle", icon: "🚀", color: "#ea580c" },
  { name: "Gifts", icon: "🎁", color: "#be185d" },
] as const;

// All categories combined
export const ALL_CATEGORIES = [
  ...EXPENSE_CATEGORIES.map(cat => ({ ...cat, kind: "expense" as const })),
  ...INCOME_CATEGORIES.map(cat => ({ ...cat, kind: "income" as const })),
] as const;

// Additional category icons for custom categories
export const CATEGORY_ICONS = [
  "🏠", "🚗", "🍽️", "🛒", "🛍️", "🎬", "⚕️", "⚡", "🛡️", "📚",
  "💼", "💻", "📊", "🚀", "🎁", "🎯", "💰", "🎪", "🎨", "🧘",
  "💡", "🔧", "✈️", "🏋️", "📱", "🎵", "🧑‍💼", "🌟", "💳", "📈",
] as const;

// Category colors
export const CATEGORY_COLORS = [
  "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#6366f1", "#f97316",
  "#059669", "#7c3aed", "#dc2626", "#ea580c", "#be185d",
] as const;

export type CategoryKind = "income" | "expense";
export type CategoryIcon = typeof CATEGORY_ICONS[number];
export type CategoryColor = typeof CATEGORY_COLORS[number];

// Helper function to get visual info for a category
export function getCategoryVisual(name: string, kind: CategoryKind) {
  const found = ALL_CATEGORIES.find(cat => cat.name === name && cat.kind === kind);
  return found ? { icon: found.icon, color: found.color } : null;
}
