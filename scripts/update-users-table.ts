import { sql } from "@vercel/postgres"

async function updateUsersTable() {
  try {
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS tails INTEGER DEFAULT 100,
      ADD COLUMN IF NOT EXISTS blubber INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS rank VARCHAR(255) DEFAULT 'Plankton',
      ADD COLUMN IF NOT EXISTS win_streak INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_bets INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS win_rate FLOAT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `
    console.log("Users table updated successfully")
  } catch (error) {
    console.error("Error updating users table:", error)
  }
}

updateUsersTable()

