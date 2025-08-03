"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";

export async function createCategory(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = {
    name: formData.get("name") as string,
    kind: formData.get("kind") as string,
  };

  const validatedData = createCategorySchema.parse(data);

  // Check for duplicate category name for this user
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: validatedData.name,
    },
  });

  if (existingCategory) {
    throw new Error("A category with this name already exists");
  }

  await prisma.category.create({
    data: {
      ...validatedData,
      userId: user.id,
    },
  });

  revalidateTag("categories");
  redirect("/categories");
}

export async function updateCategory(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    kind: formData.get("kind") as string,
  };

  const validatedData = updateCategorySchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Verify ownership
  const category = await prisma.category.findFirst({
    where: { id, userId: user.id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Check for duplicate name (excluding current category)
  if (updateData.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        name: updateData.name,
        id: { not: id },
      },
    });

    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }
  }

  await prisma.category.update({
    where: { id },
    data: updateData,
  });

  revalidateTag("categories");
  redirect("/categories");
}

export async function deleteCategory(categoryId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: user.id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Check if category has transactions
  const transactionCount = await prisma.transaction.count({
    where: { categoryId, userId: user.id },
  });

  if (transactionCount > 0) {
    throw new Error("Cannot delete category with existing transactions");
  }

  // Check if category has budgets
  const budgetCount = await prisma.budget.count({
    where: { categoryId, userId: user.id },
  });

  if (budgetCount > 0) {
    throw new Error("Cannot delete category with existing budgets");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidateTag("categories");
}

export async function getCategories() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: [
      { kind: "asc" }, // income first, then expense
      { name: "asc" },
    ],
    include: {
      _count: {
        select: { 
          txns: true,
          budgets: true,
        },
      },
    },
  });

  return categories;
}

export async function getCategory(categoryId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: user.id },
  });

  return category;
}
