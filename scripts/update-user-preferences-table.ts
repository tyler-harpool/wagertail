import { sql } from "@vercel/postgres"

async function updateUserPreferencesTable() {
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

    console.log("User preferences table updated successfully")
  } catch (error) {
    console.error("Error updating user preferences table:", error)
  }
}

updateUserPreferencesTable()

