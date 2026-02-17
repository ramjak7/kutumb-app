import { requireAdmin } from '@/modules/admin/adminGuard';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    try {
      await requireAdmin();
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
