import { NextResponse } from 'next/server'

// Minimal middleware — auth is handled by the (dashboard) layout.tsx server component.
// This file exists because Next.js requires it but we skip all routes.
export function middleware() {
  return NextResponse.next()
}

export const config = {
  // Only match routes that need auth — currently none since layout handles it
  matcher: [],
}
