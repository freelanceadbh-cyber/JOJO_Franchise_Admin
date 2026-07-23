import { auth } from '@/auth';
import { NextResponse, type NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isOnPortal = pathname.startsWith('/portal');
  const isOnAdmin = pathname.startsWith('/admin');
  const isOnAuth = pathname.startsWith('/auth');

  if (isOnAuth) {
    return NextResponse.next();
  }

  if (isOnPortal || isOnAdmin) {
    if (!session?.user) {
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isOnPortal && session.user.role !== 'FRANCHISE_OWNER') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (isOnAdmin && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};
