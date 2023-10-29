// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const adminRoutes = ['/create-project', '/manage-projects'];
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    if (
      adminRoutes.includes(request.nextUrl.pathname) &&
      request.nextauth.token?.role !== 'admin'
    ) {

      return NextResponse.rewrite(new URL('/denied', request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|auth).*)',
};
