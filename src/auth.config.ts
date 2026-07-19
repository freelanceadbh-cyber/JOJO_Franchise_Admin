import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'jojo-franchise-admin-dev-secret',
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
        token.franchiseId = user.franchiseId as string | null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.franchiseId = token.franchiseId as string | null;
      }
      return session;
    },
  },
  providers: [], // Providers are populated in auth.ts
} satisfies NextAuthConfig;
