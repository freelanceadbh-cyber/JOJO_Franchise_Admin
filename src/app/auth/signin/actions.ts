'use server';

import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AuthError } from 'next-auth';

export async function authenticateUser(emailStr: string, passwordStr: string) {
  try {
    const cleanEmail = emailStr.trim();
    const cleanPassword = passwordStr.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // 1. Fetch user from database to verify existence and get role directly
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: 'insensitive',
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
    }

    // 2. Perform NextAuth sign in (which sets session cookies in response headers)
    await signIn('credentials', {
      email: cleanEmail,
      password: cleanPassword,
      redirect: false,
    });

    // 3. Return redirect URL directly based on user.role
    const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/portal';
    return { success: true, redirectUrl };
  } catch (error: any) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
    }
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('[authenticateUser] Server action auth error:', error);
    return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
  }
}
