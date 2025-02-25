import { NextResponse } from "next/server"
import { sendAlertToTeam } from "@/lib/notifications"

export async function GET(request: Request) {
  console.log("GET /api/games: Handler called")
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get("sport") || "upcoming"

  try {
    const apiKey = process.env.ODDS_API_KEY
    if (!apiKey) {
      console.error("ODDS_API_KEY is not set")
      await sendAlertToTeam("ODDS_API_KEY is missing in production")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american`

    console.log(`Fetching data from Odds API for ${sport}`)
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`API Error (${response.status}):`, errorBody)

      if (response.status === 401 || response.status === 403) {
        await sendAlertToTeam(`API authentication failed: ${errorBody}`)
        return NextResponse.json({ error: "API authentication failed" }, { status: 401 })
      }

      if (response.status === 429) {
        await sendAlertToTeam("Odds API rate limit exceeded")
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }

      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error("Unexpected API response format:", data)
      return NextResponse.json({ error: "Invalid API response format" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/games:", error)
    let errorMessage = "Failed to fetch games data. Please try again later."
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    }
    await sendAlertToTeam(`Error in /api/games: ${errorMessage}`)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

