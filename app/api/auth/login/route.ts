import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import bcrypt from "bcryptjs"
import { signJwt } from "@/lib/jwt"

export const runtime = "nodejs"

const MAX_REQUESTS = 5
const WINDOW_MS = 60 * 1000 // 1 minute

const ipRequests = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: Request) {
  console.log("POST /api/auth/login: Handler called")
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const now = Date.now()

    // Check rate limit
    if (ipRequests.has(ip)) {
      const { count, resetTime } = ipRequests.get(ip)!
      if (now > resetTime) {
        ipRequests.set(ip, { count: 1, resetTime: now + WINDOW_MS })
      } else if (count >= MAX_REQUESTS) {
        console.log(`Rate limit exceeded for IP: ${ip}`)
        return NextResponse.json({ error: "Too many requests" }, { status: 429 })
      } else {
        ipRequests.set(ip, { count: count + 1, resetTime })
      }
    } else {
      ipRequests.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    }

    const { email, password } = await request.json()

    console.log("POST /api/auth/login: Login attempt for email:", email)

    // Find the user
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    const user = result.rows[0]

    if (!user) {
      console.log("POST /api/auth/login: User not found for email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log("POST /api/auth/login: Invalid password for email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("POST /api/auth/login: Password valid for email:", email)

    // Generate JWT
    const token = await signJwt({ userId: user.id, email: user.email })

    console.log("POST /api/auth/login: JWT generated for user:", user.id)

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    })

    return response
  } catch (error) {
    console.error("POST /api/auth/login: Login error:", error)
    return NextResponse.json(
      {
        error: "Login failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

