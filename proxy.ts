import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { checkSession } from './lib/api/serverApi';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      const user = sessionResponse.data;

      if (user) {
        isAuthenticated = true;

        const setCookieHeader = sessionResponse.headers['set-cookie'];
        if (setCookieHeader) {
          const response = NextResponse.next();

          if (Array.isArray(setCookieHeader)) {
            setCookieHeader.forEach((cookie) => response.headers.append('set-cookie', cookie));
          } else {
            response.headers.append('set-cookie', setCookieHeader);
          }

          if (isAuthRoute) {
            return NextResponse.redirect(new URL('/', request.url));
          }

          return response;
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
