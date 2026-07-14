import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'jojo-franchise-admin-dev-secret',
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPortal = nextUrl.pathname.startsWith('/portal');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnPortal) {
        if (isLoggedIn) {
          if (auth.user.role === 'FRANCHISE_OWNER') {
            return true;
          }
          // Logged in but not franchise owner (could be admin) -> redirect
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return false; // Redirect to login
      }

      if (isOnAdmin) {
        if (isLoggedIn) {
          if (auth.user.role === 'ADMIN') {
            return true;
          }
          // Logged in but not admin -> redirect
          return Response.redirect(new URL('/portal', nextUrl));
        }
        return false; // Redirect to login
      }

      return true;
    },
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
