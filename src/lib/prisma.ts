import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (typeof window === 'undefined') {
  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  prismaInstance = null as any;
}

// Try to connect early in development to surface connectivity issues quickly.
// Do not block imports in production/runtime environments.
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  (async function connectWithRetry() {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await prismaInstance.$connect();
        // eslint-disable-next-line no-console
        console.log('[prisma] connected to database');
        break;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[prisma] connect attempt ${attempt} failed:`, (err as any)?.message ?? err);
        if (attempt < maxAttempts) {
          const backoff = attempt * 1000;
          // wait before retrying
          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, backoff));
        }
      }
    }
  })();
}

export const prisma = prismaInstance;
