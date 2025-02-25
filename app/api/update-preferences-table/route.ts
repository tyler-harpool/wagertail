import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Drop the existing table if it exists
    await sql`DROP TABLE IF EXISTS user_preferences`
    console.log("Dropped existing user_preferences table")

    // Create the table with the correct structure
    await sql`
      CREATE TABLE user_preferences (
        user_id INTEGER PRIMARY KEY,
        sport VARCHAR(255),
        timezone VARCHAR(255),
        show_upcoming_only BOOLEAN
      )
    `
    console.log("Created user_preferences table with correct structure")

    return NextResponse.json({ success: true, message: "User preferences table updated successfully" })
  } catch (error) {
    console.error("Error updating user preferences table:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user preferences table",
        details: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}

