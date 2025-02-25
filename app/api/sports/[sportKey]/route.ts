import { NextResponse } from "next/server"
import { readCache, writeCache } from "@/lib/cache"

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET(request: Request, { params }: { params: { sportKey: string } }) {
  const sportKey = params.sportKey
  console.log(`GET /api/sports/${sportKey}: Handler called`)

  try {
    // Try to read from cache first
    const cachedData = readCache<{ data: any; timestamp: number }>(`sport_${sportKey}`)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Returning cached data for ${sportKey}`)
      return NextResponse.json(cachedData.data)
    }

    const apiKey = process.env.ODDS_API_KEY
    if (!apiKey) {
      console.error("ODDS_API_KEY is not set")
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    // First, try to fetch the sport details
    console.log(`Fetching sport details for ${sportKey} from The Odds API`)
    const sportsResponse = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`)

    if (!sportsResponse.ok) {
      const errorText = await sportsResponse.text()
      console.error("API Error response:", errorText)
      return NextResponse.json(
        { error: `API responded with status: ${sportsResponse.status}, body: ${errorText}` },
        { status: sportsResponse.status },
      )
    }

    const sports = await sportsResponse.json()
    const sport = sports.find((s: any) => s.key === sportKey)

    if (sport) {
      // If we found the sport, cache and return it
      writeCache(`sport_${sportKey}`, { data: sport, timestamp: Date.now() })
      return NextResponse.json(sport)
    }

    // If sport not found, try to fetch games for this sport
    console.log(`Fetching games for ${sportKey} from The Odds API`)
    const gamesResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american`,
    )

    if (!gamesResponse.ok) {
      const errorText = await gamesResponse.text()
      console.error("API Error response:", errorText)
      return NextResponse.json(
        { error: `API responded with status: ${gamesResponse.status}, body: ${errorText}` },
        { status: gamesResponse.status },
      )
    }

    const games = await gamesResponse.json()
    console.log(`Fetched ${games.length} games for ${sportKey}`)

    // Cache the fetched data with a timestamp
    writeCache(`sport_${sportKey}`, { data: games, timestamp: Date.now() })

    return NextResponse.json(games)
  } catch (error) {
    console.error(`Error in GET /api/sports/${sportKey}:`, error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: `Failed to fetch data: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

