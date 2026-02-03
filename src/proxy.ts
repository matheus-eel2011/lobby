import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/auth/login', '/auth/register', '/auth/callback', '/verify-email']
const protectedRoutes = ['/lobby', '/dashboard']

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // raiz sempre vai para /auth/login
  if (path === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (publicRoutes.some(route => path === route || path.startsWith(route))) {
    return NextResponse.next()
  }

  if (protectedRoutes.some(route => path.startsWith(route))) {
    const token = request.cookies.get('sb-access-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
