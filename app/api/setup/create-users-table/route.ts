import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Verify table creation
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as table_exists
    `

    const tableExists = result.rows[0].table_exists

    return NextResponse.json({
      success: true,
      message: tableExists ? "Users table created or already exists." : "Failed to create table.",
      tableExists,
    })
  } catch (error) {
    console.error("Error creating users table:", error)
    return NextResponse.json({ success: false, error: "Failed to create users table" }, { status: 500 })
  }
}

