import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        table_name, 
        column_name, 
        data_type 
      FROM 
        information_schema.columns 
      WHERE 
        table_name = 'user_preferences'
    `
    return NextResponse.json({ success: true, schema: result.rows })
  } catch (error) {
    console.error("Error fetching database schema:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch database schema: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}

