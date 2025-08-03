"use server";

import { hash } from "bcryptjs";
import { z } from "zod";
import { signOut } from "next-auth/react";
import prisma from "@/lib/db";
import { registerSchema, loginSchema } from "@/lib/auth-schemas";

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const parsed = registerSchema.parse(data);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    
    if (existingUser) {
      return { error: "User with this email already exists" };
    }
    
    // Hash password
    const passwordHash = await hash(parsed.password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        passwordHash,
      },
    });
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create account" };
  }
}

export async function loginUser(data: z.infer<typeof loginSchema>) {
  try {
    loginSchema.parse(data);
    
    // This will be handled by NextAuth in the actual login
    return { success: true };
  } catch (error) {
    console.error("Login validation error:", error);
    return { error: "Invalid input" };
  }
}

export async function logoutUser() {
  await signOut({ callbackUrl: "/auth/login" });
}
