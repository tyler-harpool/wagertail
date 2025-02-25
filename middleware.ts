import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwt } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  // Check if we're in the preview environment
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"

  if (isPreview) {
    // In preview, check for client-side auth in localStorage
    return NextResponse.next()
  }

  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  try {
    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware JWT verification error:", error)
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/preferences/:path*", "/sports/:path*"],
}

