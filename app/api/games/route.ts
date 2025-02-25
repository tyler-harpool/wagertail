import { NextResponse } from "next/server"
import { readCache, writeCache } from "@/lib/cache"

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get("sport")

  if (!sport) {
    return NextResponse.json({ error: "Sport parameter is required" }, { status: 400 })
  }

  console.log(`GET /api/games: Fetching games for sport: ${sport}`)

  try {
    // Try to read from cache first
    const cachedData = readCache<{ data: any[]; timestamp: number }>(`games_${sport}`)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Returning cached games data for ${sport}`)
      return NextResponse.json(cachedData.data)
    }

    const apiKey = process.env.ODDS_API_KEY
    if (!apiKey) {
      console.error("ODDS_API_KEY is not set")
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error response:", errorData)

      if (errorData.error_code === "OUT_OF_USAGE_CREDITS") {
        // If we're out of credits, return cached data if available, otherwise return an error
        if (cachedData) {
          console.log(`Returning stale cached data for ${sport} due to API quota limit`)
          return NextResponse.json(cachedData.data, {
            headers: { "X-Data-Source": "cache", "X-Cache-Date": new Date(cachedData.timestamp).toISOString() },
          })
        } else {
          return NextResponse.json({ error: "API quota reached. Please try again later." }, { status: 429 })
        }
      }

      return NextResponse.json(
        { error: errorData.message || "An error occurred while fetching data" },
        { status: response.status },
      )
    }

    const games = await response.json()
    console.log(`Fetched ${games.length} games for ${sport}`)

    // Cache the fetched data
    writeCache(`games_${sport}`, { data: games, timestamp: Date.now() })

    return NextResponse.json(games)
  } catch (error) {
    console.error(`Error in GET /api/games for ${sport}:`, error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: `Failed to fetch games: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

