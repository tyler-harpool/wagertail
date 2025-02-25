import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create user_preferences table
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        sport VARCHAR(255),
        timezone VARCHAR(255),
        show_upcoming_only BOOLEAN
      )
    `

    // Check if user_id column exists in user_preferences table
    const columnCheckResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'user_preferences' AND column_name = 'user_id'
      ) as column_exists
    `

    if (!columnCheckResult.rows[0].column_exists) {
      // Add user_id column if it doesn't exist
      await sql`
        ALTER TABLE user_preferences
        ADD COLUMN user_id INT REFERENCES users(id)
      `
    }

    // Verify table creation
    const usersTableResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as table_exists
    `

    const preferencesTableResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_preferences'
      ) as table_exists
    `

    const usersTableExists = usersTableResult.rows[0].table_exists
    const preferencesTableExists = preferencesTableResult.rows[0].table_exists

    return NextResponse.json({
      success: true,
      message: `Tables created or already exist. Users: ${usersTableExists}, Preferences: ${preferencesTableExists}`,
      usersTableExists,
      preferencesTableExists,
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: "Failed to set up database" }, { status: 500 })
  }
}

