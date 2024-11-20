import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  // List of paths that require authentication
  const authRequiredPaths = [
    '/flashcards/create',
    '/flashcards/edit',
    '/flashcards/exam'
  ];

  // Check if the current path requires authentication
  const requiresAuth = authRequiredPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (requiresAuth && !session) {
    // Redirect to login if authentication is required but no session exists
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/flashcards/:path*',
    '/api/flashcards/:path*',
  ]
}; 