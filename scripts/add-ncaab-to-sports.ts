import { sql } from "@vercel/postgres"

async function addNcaabToSports() {
  try {
    // Check if the sports table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'sports'
      ) as table_exists
    `

    if (!tableExists.rows[0].table_exists) {
      // Create the sports table if it doesn't exist
      await sql`
        CREATE TABLE sports (
          id SERIAL PRIMARY KEY,
          value VARCHAR(255) UNIQUE NOT NULL,
          label VARCHAR(255) NOT NULL
        )
      `
      console.log("Created sports table")
    }

    // Check if NCAA Men's Basketball already exists
    const sportExists = await sql`
      SELECT EXISTS (
        SELECT FROM sports
        WHERE value = 'basketball_ncaab'
      ) as sport_exists
    `

    if (!sportExists.rows[0].sport_exists) {
      // Insert NCAA Men's Basketball
      await sql`
        INSERT INTO sports (value, label)
        VALUES ('basketball_ncaab', 'NCAA Men''s Basketball')
      `
      console.log("Added NCAA Men's Basketball to sports table")
    } else {
      console.log("NCAA Men's Basketball already exists in sports table")
    }
  } catch (error) {
    console.error("Error adding NCAA Men's Basketball to sports:", error)
  }
}

addNcaabToSports()

