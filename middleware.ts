import { type NextRequest, NextResponse } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

/**
 * Next.js Middleware
 * 인증 가드 및 세션 관리
 */
export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  // 보호된 경로 정의
  const protectedPaths = ['/create', '/dashboard', '/settings'];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 보호된 경로 접근 시
  if (isProtectedPath) {
    // DEV 환경: localStorage 체크 (브라우저에서만 가능하므로 여기서는 패스)
    // 실제 DEV 로그인은 클라이언트 사이드에서 처리됨
    
    // 세션이 없으면 로그인 페이지로 리다이렉트
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 로그인한 사용자가 로그인/회원가입 페이지 접근 시
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/create/step1', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
