import { NextResponse } from "next/server"
import { readCache, writeCache } from "@/lib/cache"
import { sendAlertToTeam } from "@/lib/notifications"

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const LOW_CREDIT_THRESHOLD = 100

export async function GET(request: Request) {
  console.log("GET /api/sports: Handler called")

  try {
    // Validate API key first
    const apiKey = process.env.ODDS_API_KEY
    if (!apiKey || apiKey.trim() === "") {
      console.error("ODDS_API_KEY is not properly configured")
      await sendAlertToTeam("ODDS_API_KEY is missing or empty")

      // Try to return cached data if available
      const cachedData = readCache<{ sports: any[]; timestamp: number }>("sports_list")
      if (cachedData) {
        console.log("Returning cached data due to missing API key")
        return NextResponse.json(cachedData, {
          headers: {
            "X-Data-Source": "cache",
            "X-Cache-Date": new Date(cachedData.timestamp).toISOString(),
            "X-Error": "API_KEY_MISSING",
          },
        })
      }

      return NextResponse.json({ error: "Service temporarily unavailable. Please try again later." }, { status: 503 })
    }

    // Check cache before making API call
    const cachedData = readCache<{ sports: any[]; timestamp: number }>("sports_list")
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log("Returning cached sports data")
      return NextResponse.json(cachedData, {
        headers: {
          "X-Data-Source": "cache",
          "X-Cache-Date": new Date(cachedData.timestamp).toISOString(),
        },
      })
    }

    console.log("Fetching fresh data from Odds API")
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`)

    if (!response.ok) {
      console.error(`API Error: ${response.status}`)

      if (response.status === 401 || response.status === 403) {
        await sendAlertToTeam("Invalid Odds API key")
        return NextResponse.json({ error: "API authentication failed" }, { status: 503 })
      }

      if (response.status === 429) {
        await sendAlertToTeam("Odds API rate limit exceeded")
        if (cachedData) {
          return NextResponse.json(cachedData, {
            headers: {
              "X-Data-Source": "cache",
              "X-Cache-Date": new Date(cachedData.timestamp).toISOString(),
              "X-Rate-Limited": "true",
            },
          })
        }
      }

      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const sports = await response.json()
    console.log(`Fetched ${sports.length} sports`)

    // Check remaining requests
    const remainingRequests = Number.parseInt(response.headers.get("x-requests-remaining") || "0", 10)
    if (remainingRequests < LOW_CREDIT_THRESHOLD) {
      await sendAlertToTeam(`Low API credits warning: ${remainingRequests} requests remaining`)
    }

    // Cache the fresh data
    const cacheData = { sports, timestamp: Date.now() }
    writeCache("sports_list", cacheData)

    return NextResponse.json(cacheData)
  } catch (error) {
    console.error("Error in GET /api/sports:", error)

    // Try to return cached data on error
    const cachedData = readCache<{ sports: any[]; timestamp: number }>("sports_list")
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          "X-Data-Source": "cache",
          "X-Cache-Date": new Date(cachedData.timestamp).toISOString(),
          "X-Error": "FALLBACK_TO_CACHE",
        },
      })
    }

    return NextResponse.json({ error: "An unexpected error occurred. Please try again later." }, { status: 500 })
  }
}

