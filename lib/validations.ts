import { z } from "zod";

// Account validations
export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT", "INVESTMENT", "CASH"]),
  currency: z.string().length(3, "Currency must be 3 characters (ISO 4217)"),
  institution: z.string().max(100).optional(),
  numberMasked: z.string().max(20).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format"),
  icon: z.string().min(1, "Icon is required"),
});

export const createAccountSchema = accountSchema;
export const updateAccountSchema = accountSchema.partial().extend({
  id: z.string().cuid(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

// Category validations
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  kind: z.enum(["income", "expense"]),
});

export const createCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial().extend({
  id: z.string().cuid(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// Transaction validations
export const transactionSchema = z.object({
  accountId: z.string().cuid("Invalid account"),
  categoryId: z.string().cuid("Invalid category").optional(),
  amount: z.number().int().min(-999999999, "Amount too small").max(999999999, "Amount too large"),
  date: z.string().pipe(z.coerce.date()),
  payee: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  isRecurring: z.boolean().default(false),
  rrule: z.string().optional(),
});

export const createTransactionSchema = transactionSchema;
export const updateTransactionSchema = transactionSchema.partial().extend({
  id: z.string().cuid(),
});

// Quick-add transaction schema (simplified)
export const quickAddTransactionSchema = z.object({
  accountId: z.string().cuid("Please select an account"),
  amount: z.string().min(1, "Amount is required").transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error("Invalid amount");
    return Math.round(num * 100); // Convert to cents
  }),
  payee: z.string().min(1, "Payee is required").max(100),
  categoryId: z.string().cuid("Please select a category").optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type QuickAddTransactionInput = z.infer<typeof quickAddTransactionSchema>;