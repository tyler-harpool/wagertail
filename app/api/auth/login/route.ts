import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import bcrypt from "bcryptjs"
import { signJwt } from "@/lib/jwt"

const DAILY_LOGIN_BONUS = 100
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

export const runtime = "nodejs"

export async function POST(request: Request) {
  console.log("POST /api/auth/login: Handler called")
  try {
    const { email, password } = await request.json()

    console.log("POST /api/auth/login: Login attempt for email:", email)

    // Find the user
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
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

    // Check if it's been more than 24 hours since last login
    const lastLoginDate = new Date(user.last_login)
    const currentDate = new Date()

    if (currentDate.getTime() - lastLoginDate.getTime() >= MILLISECONDS_IN_DAY) {
      // Add daily login bonus
      await sql`
        UPDATE users
        SET tails = tails + ${DAILY_LOGIN_BONUS},
            last_login = ${currentDate}
        WHERE id = ${user.id}
      `
      user.tails += DAILY_LOGIN_BONUS
      user.last_login = currentDate
    }

    // Generate JWT
    const token = await signJwt({ userId: user.id, email: user.email })

    console.log("POST /api/auth/login: JWT generated for user:", user.id)

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tails: user.tails,
        blubber: user.blubber,
        rank: user.rank,
        winStreak: user.win_streak,
        totalBets: user.total_bets,
        winRate: user.win_rate,
        lastLogin: user.last_login,
        createdAt: user.created_at,
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

