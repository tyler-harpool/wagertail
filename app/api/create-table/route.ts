import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        email VARCHAR(255) PRIMARY KEY,
        sport VARCHAR(255),
        timezone VARCHAR(255),
        show_upcoming_only BOOLEAN
      )
    `

    // Verify table creation
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_preferences'
      ) as table_exists
    `

    const tableExists = result.rows[0].table_exists

    return NextResponse.json({
      success: true,
      message: tableExists ? "Table 'user_preferences' created or already exists." : "Failed to create table.",
    })
  } catch (error) {
    console.error("Error creating table:", error)
    return NextResponse.json({ success: false, error: "Failed to create table" }, { status: 500 })
  }
}

