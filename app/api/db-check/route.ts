import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`
    return NextResponse.json({ success: true, timestamp: result.rows[0].now })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Failed to connect to the database: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}

