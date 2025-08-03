import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "./db";
import { compare } from "bcryptjs";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const parsed = credentialsSchema.safeParse(creds);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email } as { id: string; email: string };
      },
    }),
  ],
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  // For development: if no session, use the first user from seed data
  if (!session?.user) {
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
      console.log("⚠️ Using first user for development (no auth session)");
      return { id: firstUser.id, email: firstUser.email };
    }
  }
  
  return session?.user as { id: string; email: string } | null;
}
