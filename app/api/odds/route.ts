import { NextResponse } from "next/server"

const ITEMS_PER_PAGE = 20

export async function GET(request: Request) {
  console.log("GET /api/odds: Handler called")
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get("sport")
  const live = searchParams.get("live") === "true"
  const page = Number.parseInt(searchParams.get("page") || "0", 10)
  const limit = Number.parseInt(searchParams.get("limit") || ITEMS_PER_PAGE.toString(), 10)

  console.log("Requested sport:", sport)
  console.log("Include live games:", live)
  console.log("Page:", page)
  console.log("Limit:", limit)

  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) {
    console.error("ODDS_API_KEY is not set")
    return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
  }

  try {
    let apiUrl: string
    if (sport === "upcoming") {
      apiUrl = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american`
    } else {
      apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american${live ? "&dateFormat=iso" : ""}`
    }

    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const allData = await response.json()
    const paginatedData = allData.slice(page * limit, (page + 1) * limit)

    console.log(
      `Fetched odds for ${sport === "upcoming" ? "all sports" : sport}. Total: ${allData.length}, Returned: ${paginatedData.length}`,
    )

    return NextResponse.json(paginatedData)
  } catch (error) {
    console.error("Error in GET /api/odds:", error)
    return NextResponse.json(
      { error: `Failed to fetch odds: ${error instanceof Error ? error.message : JSON.stringify(error)}` },
      { status: 500 },
    )
  }
}

