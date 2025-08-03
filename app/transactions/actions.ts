"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { 
  createTransactionSchema, 
  updateTransactionSchema, 
  quickAddTransactionSchema 
} from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";

export async function createTransaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = {
    accountId: formData.get("accountId") as string,
    categoryId: formData.get("categoryId") as string || undefined,
    amount: parseInt(formData.get("amount") as string),
    date: new Date(formData.get("date") as string),
    payee: formData.get("payee") as string || undefined,
    notes: formData.get("notes") as string || undefined,
    isRecurring: formData.get("isRecurring") === "true",
    rrule: formData.get("rrule") as string || undefined,
  };

  const validatedData = createTransactionSchema.parse(data);

  // Verify account ownership
  const account = await prisma.account.findFirst({
    where: { id: validatedData.accountId, userId: user.id },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  // Verify category ownership if provided
  if (validatedData.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: validatedData.categoryId, userId: user.id },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  await prisma.transaction.create({
    data: {
      ...validatedData,
      userId: user.id,
    },
  });

  revalidateTag("transactions");
  revalidateTag("accounts"); // Account balances might change
  redirect("/transactions");
}

export async function quickAddTransaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = {
    accountId: formData.get("accountId") as string,
    amount: formData.get("amount") as string,
    payee: formData.get("payee") as string,
    categoryId: formData.get("categoryId") as string || undefined,
  };

  const validatedData = quickAddTransactionSchema.parse(data);

  // Verify account ownership
  const account = await prisma.account.findFirst({
    where: { id: validatedData.accountId, userId: user.id },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  // Verify category ownership if provided
  if (validatedData.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: validatedData.categoryId, userId: user.id },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  await prisma.transaction.create({
    data: {
      accountId: validatedData.accountId,
      categoryId: validatedData.categoryId,
      amount: validatedData.amount,
      date: new Date(), // Today's date
      payee: validatedData.payee,
      userId: user.id,
    },
  });

  revalidateTag("transactions");
  revalidateTag("accounts");
}

export async function updateTransaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = {
    id: formData.get("id") as string,
    accountId: formData.get("accountId") as string,
    categoryId: formData.get("categoryId") as string || undefined,
    amount: parseInt(formData.get("amount") as string),
    date: new Date(formData.get("date") as string),
    payee: formData.get("payee") as string || undefined,
    notes: formData.get("notes") as string || undefined,
    isRecurring: formData.get("isRecurring") === "true",
    rrule: formData.get("rrule") as string || undefined,
  };

  const validatedData = updateTransactionSchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Verify ownership
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Verify account ownership if changing account
  if (updateData.accountId) {
    const account = await prisma.account.findFirst({
      where: { id: updateData.accountId, userId: user.id },
    });

    if (!account) {
      throw new Error("Account not found");
    }
  }

  // Verify category ownership if provided
  if (updateData.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: updateData.categoryId, userId: user.id },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  await prisma.transaction.update({
    where: { id },
    data: updateData,
  });

  revalidateTag("transactions");
  revalidateTag("accounts");
  redirect("/transactions");
}

export async function deleteTransaction(transactionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId: user.id },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  await prisma.transaction.delete({
    where: { id: transactionId },
  });

  revalidateTag("transactions");
  revalidateTag("accounts");
}

export async function getTransactions(page = 1, limit = 50) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const offset = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        account: true,
        category: true,
      },
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" },
      ],
      skip: offset,
      take: limit,
    }),
    prisma.transaction.count({
      where: { userId: user.id },
    }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTransaction(transactionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId: user.id },
    include: {
      account: true,
      category: true,
    },
  });

  return transaction;
}

export async function getAccountsForSelect() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return prisma.account.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, type: true, color: true, icon: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategoriesForSelect() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return prisma.category.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, kind: true },
    orderBy: [{ kind: "asc" }, { name: "asc" }],
  });
}
