import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

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

        try {
          // Buscar admin por email
          const admin = await prisma.admin.findFirst({
            where: {
              email: email,
              isActive: true,
            },
          });

          if (!admin) {
            return null;
          }

          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Actualizar último login
          await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
          });

          // Retornar datos del usuario para la sesión
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.isActive ? "ADMIN" : "USER",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
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
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
