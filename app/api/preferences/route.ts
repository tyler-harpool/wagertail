import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"

export const runtime = "nodejs"

async function authenticateRequest(request: Request) {
  console.log("authenticateRequest: Starting authentication")
  const authHeader = request.headers.get("Authorization")
  console.log("authenticateRequest: Authorization header:", authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("authenticateRequest: No Bearer token found in Authorization header")
    return null
  }

  const token = authHeader.split(" ")[1]
  try {
    console.log("authenticateRequest: Verifying JWT")
    const payload = await verifyJwt(token)
    console.log("authenticateRequest: JWT verified successfully", payload)
    return payload
  } catch (error) {
    console.error("authenticateRequest: Error verifying JWT:", error)
    return null
  }
}

export async function GET(request: Request) {
  console.log("GET /api/preferences: Handler called")

  const payload = await authenticateRequest(request)
  if (!payload) {
    console.log("GET /api/preferences: Authentication failed")
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    console.log("GET /api/preferences: Fetching preferences for user:", payload.userId)
    const result = await sql`
      SELECT * FROM user_preferences
      WHERE user_id = ${payload.userId}
    `

    if (result.rows.length === 0) {
      console.log("GET /api/preferences: No preferences found, returning default values")
      return NextResponse.json({
        sport: "upcoming",
        timezone: "Eastern Time",
        show_upcoming_only: false,
      })
    }

    console.log("GET /api/preferences: Preferences fetched successfully")
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("GET /api/preferences: Error:", error)
    return NextResponse.json(
      {
        error: "An error occurred while fetching user preferences",
        details: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  console.log("POST /api/preferences: Handler called")

  const payload = await authenticateRequest(request)
  if (!payload) {
    console.log("POST /api/preferences: Authentication failed")
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { sport, timezone, show_upcoming_only } = await request.json()
    console.log("POST /api/preferences: Saving preferences for user:", payload.userId, {
      sport,
      timezone,
      show_upcoming_only,
    })

    const result = await sql`
      INSERT INTO user_preferences (user_id, sport, timezone, show_upcoming_only)
      VALUES (${payload.userId}, ${sport}, ${timezone}, ${show_upcoming_only})
      ON CONFLICT (user_id) DO UPDATE SET
        sport = EXCLUDED.sport,
        timezone = EXCLUDED.timezone,
        show_upcoming_only = EXCLUDED.show_upcoming_only
    `

    console.log("POST /api/preferences: Preferences saved successfully", result)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("POST /api/preferences: Error saving user preferences:", error)
    return NextResponse.json(
      {
        error: "Failed to save user preferences",
        details: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}

