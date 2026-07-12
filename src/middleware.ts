import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Apply middleware to protect portal and admin dashboard paths, excluding static files and API routes
  matcher: [
    '/portal/:path*',
    '/admin/:path*'
  ],
};
