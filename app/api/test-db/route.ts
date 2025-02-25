import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    return NextResponse.json({ success: true, time: result.rows[0].current_time })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ success: false, error: "Failed to connect to the database" }, { status: 500 })
  }
}

