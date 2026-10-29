import NextAuth, { CredentialsSignin } from "next-auth";
import { rateLimiters } from "@/lib/rateLimit";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

// Surfaces as `code: "locked"` on the client so the form can explain it
class AccountLockedError extends CredentialsSignin {
  code = "locked";
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Five failed attempts lock the account for 15 minutes
        const loginKey = email.toLowerCase();
        if (await rateLimiters.login.isBlocked(loginKey)) {
          throw new AccountLockedError();
        }

        try {
          // Admin is the only role; there is no client login
          const admin = await prisma.admin.findFirst({
            where: {
              email: email,
              isActive: true,
            },
          });

          // Unknown or inactive accounts count as failed attempts too, so an
          // attacker cannot tell which emails exist
          if (!admin) {
            await rateLimiters.login.hit(loginKey);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
          );

          if (!isPasswordValid) {
            await rateLimiters.login.hit(loginKey);
            return null;
          }

          await rateLimiters.login.reset(loginKey);

          // Actualizar último login
          await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
          });

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: "ADMIN",
          };
        } catch (error) {
          if (error instanceof AccountLockedError) throw error;
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 días sin actividad (NextAuth renueva el JWT al usarlo, updateAge 24 h)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
