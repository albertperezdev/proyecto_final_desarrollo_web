import { NextRequest, NextResponse } from 'next/server'

const protectedPaths = ['/admin']
const authPaths = ['/auth/login', '/auth/sign-up']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('session')?.value

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  const isAuth = authPaths.some((p) => pathname.startsWith(p))

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && isAuth) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],
}
