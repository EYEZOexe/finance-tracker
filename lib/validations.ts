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