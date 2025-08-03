"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createAccountSchema, updateAccountSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";

export async function createAccount(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    currency: formData.get("currency") as string,
    institution: formData.get("institution") as string || undefined,
    numberMasked: formData.get("numberMasked") as string || undefined,
    color: formData.get("color") as string,
    icon: formData.get("icon") as string,
  };

  const validatedData = createAccountSchema.parse(data);

  await prisma.account.create({
    data: {
      ...validatedData,
      userId: user.id,
    },
  });

  revalidateTag("accounts");
  redirect("/accounts");
}

export async function updateAccount(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    currency: formData.get("currency") as string,
    institution: formData.get("institution") as string || undefined,
    numberMasked: formData.get("numberMasked") as string || undefined,
    color: formData.get("color") as string,
    icon: formData.get("icon") as string,
  };

  const validatedData = updateAccountSchema.parse(data);
  const { id, ...updateData } = validatedData;

  // Verify ownership
  const account = await prisma.account.findFirst({
    where: { id, userId: user.id },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  await prisma.account.update({
    where: { id },
    data: updateData,
  });

  revalidateTag("accounts");
  redirect("/accounts");
}

export async function deleteAccount(accountId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId: user.id },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  // Check if account has transactions
  const transactionCount = await prisma.transaction.count({
    where: { accountId, userId: user.id },
  });

  if (transactionCount > 0) {
    throw new Error("Cannot delete account with existing transactions");
  }

  await prisma.account.delete({
    where: { id: accountId },
  });

  revalidateTag("accounts");
}

export async function getAccounts() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  return accounts;
}

export async function getAccount(accountId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const account = await prisma.account.findFirst({
    where: { id: accountId, userId: user.id },
  });

  return account;
}
