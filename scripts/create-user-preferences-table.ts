import { sql } from "@vercel/postgres"

async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INT PRIMARY KEY,
        sport VARCHAR(255),
        timezone VARCHAR(255),
        show_upcoming_only BOOLEAN
      )
    `
    console.log("User preferences table created successfully")
  } catch (error) {
    console.error("Error creating user preferences table:", error)
  }
}

createTable()

