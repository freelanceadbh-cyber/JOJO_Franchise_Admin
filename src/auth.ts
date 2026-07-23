import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'jojo-franchise-admin-dev-secret',
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('[auth] Authorizing credentials:', { email: credentials?.email });
        const cleanEmail = (credentials.email as string).trim();
        const cleanPassword = (credentials.password as string).trim();

        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: cleanEmail,
              mode: 'insensitive',
            },
          },
          include: { franchise: true },
        });

        if (!user) {
          console.log('[auth] User not found in database:', cleanEmail);
          return null;
        }

        if (user.status !== 'ACTIVE') {
          console.log('[auth] User is not active:', user.email, 'status:', user.status);
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          cleanPassword,
          user.passwordHash
        );

        console.log('[auth] Password check result:', isValidPassword);

        if (!isValidPassword) {
          console.log('[auth] Password mismatch for:', user.email);
          return null;
        }

        console.log('[auth] User authorized successfully:', user.email);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          franchiseId: user.franchise?.id || null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
});
