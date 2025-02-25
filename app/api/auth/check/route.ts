import { NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { sql } from "@vercel/postgres"

export const runtime = "nodejs"

export async function GET(request: Request) {
  console.log("GET /api/auth/check: Handler called")
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      console.log("GET /api/auth/check: No token found")
      return NextResponse.json({ authenticated: false })
    }

    console.log("GET /api/auth/check: Verifying JWT")
    let payload
    try {
      payload = await verifyJwt(token)
      console.log("GET /api/auth/check: JWT payload:", payload)
    } catch (jwtError) {
      console.error("GET /api/auth/check: JWT verification failed:", jwtError)
      return NextResponse.json({ authenticated: false, error: "Invalid token" })
    }

    if (payload && payload.userId) {
      console.log("GET /api/auth/check: JWT verified, fetching user data for userId:", payload.userId)
      let result
      try {
        result = await sql`
          SELECT id, email, name, tails, blubber, rank, win_streak, total_bets, win_rate, last_login, created_at
          FROM users WHERE id = ${payload.userId}
        `
        console.log("GET /api/auth/check: SQL query result:", result)
      } catch (sqlError) {
        console.error("GET /api/auth/check: Database query failed:", sqlError)
        return NextResponse.json({ authenticated: false, error: "Database error", details: sqlError }, { status: 500 })
      }

      if (result.rows.length > 0) {
        const user = result.rows[0]
        console.log("GET /api/auth/check: User found", user)
        return NextResponse.json({
          authenticated: true,
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
      } else {
        console.log("GET /api/auth/check: No user found for userId:", payload.userId)
        return NextResponse.json({ authenticated: false, error: "User not found" })
      }
    } else {
      console.log("GET /api/auth/check: Invalid or missing payload")
      return NextResponse.json({ authenticated: false, error: "Invalid payload" })
    }
  } catch (error) {
    console.error("GET /api/auth/check: Unexpected error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { authenticated: false, error: "An unexpected error occurred", details: error },
      { status: 500 },
    )
  }
}

