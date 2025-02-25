"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle } from "lucide-react"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SportCategoryIcons } from "@/components/SportCategoryIcons"
import { useAuth } from "@/contexts/AuthContext"

interface Sport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights: boolean
}

const prestigiousSoccerLeagues = [
  "soccer_epl",
  "soccer_uefa_champs_league",
  "soccer_spain_la_liga",
  "soccer_germany_bundesliga",
  "soccer_italy_serie_a",
  "soccer_france_ligue_one",
]

const popularAmericanSports = [
  "americanfootball_nfl",
  "basketball_nba",
  "baseball_mlb",
  "icehockey_nhl",
  "americanfootball_ncaaf",
  "basketball_ncaab",
]

function sortSports(a: Sport, b: Sport): number {
  const aIndexAmerican = popularAmericanSports.indexOf(a.key)
  const bIndexAmerican = popularAmericanSports.indexOf(b.key)
  const aIndexSoccer = prestigiousSoccerLeagues.indexOf(a.key)
  const bIndexSoccer = prestigiousSoccerLeagues.indexOf(b.key)

  // First, sort by popular American sports
  if (aIndexAmerican !== -1 && bIndexAmerican !== -1) {
    return aIndexAmerican - bIndexAmerican
  } else if (aIndexAmerican !== -1) {
    return -1
  } else if (bIndexAmerican !== -1) {
    return 1
  }

  // Then, sort by prestigious soccer leagues
  if (aIndexSoccer !== -1 && bIndexSoccer !== -1) {
    return aIndexSoccer - bIndexSoccer
  } else if (aIndexSoccer !== -1) {
    return -1
  } else if (bIndexSoccer !== -1) {
    return 1
  }

  // Finally, sort alphabetically by title
  return a.title.localeCompare(b.title)
}

export default function OddsList() {
  const [sports, setSports] = useState<Sport[]>([])
  const [filteredSports, setFilteredSports] = useState<Sport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStaleData, setIsStaleData] = useState(false)
  const [cacheDate, setCacheDate] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/sports")

        // Check if we're getting cached data
        const isStaleData = response.headers.get("X-Data-Source") === "cache"
        const cacheDate = response.headers.get("X-Cache-Date")
        const isRateLimited = response.headers.get("X-Rate-Limited") === "true"

        if (isMounted) {
          setIsStaleData(isStaleData)
          if (cacheDate) {
            setCacheDate(cacheDate)
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log("Received data:", result)

        if (result.error) {
          throw new Error(result.error)
        }

        if (isMounted) {
          if (Array.isArray(result.sports)) {
            const sortedSports = result.sports.sort(sortSports)
            setSports(sortedSports)
            setFilteredSports(sortedSports)
          } else {
            throw new Error("Unexpected data format received from API")
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        if (isMounted) {
          setError(error instanceof Error ? error.message : "An error occurred while fetching data.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleCategorySelect = (category: string) => {
    if (category === "all") {
      setFilteredSports(sports)
    } else if (category === "other") {
      const mainCategories = ["football", "basketball", "baseball", "hockey", "soccer", "tennis", "golf"]
      setFilteredSports(
        sports.filter((sport) => !mainCategories.some((cat) => sport.group.toLowerCase().includes(cat))),
      )
    } else {
      const filtered = sports.filter((sport) => {
        if (category === "golf") {
          return sport.key.includes("golf") || sport.group.toLowerCase().includes("golf")
        }
        return sport.group.toLowerCase().includes(category)
      })
      setFilteredSports(filtered)
    }
  }

  const handleSportClick = (sportKey: string) => {
    router.push(`/sports/${sportKey}`)
  }

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return (
      <div>
        <h2>Please sign in to view odds</h2>
        <p>You need to be authenticated to access this content.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Sports List</h1>

        <div className="mb-6">
          <SportCategoryIcons onSelectCategory={handleCategorySelect} />
        </div>

        {isStaleData && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription>
              This data may be outdated. Last updated: {cacheDate ? new Date(cacheDate).toLocaleString() : "Unknown"}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <p className="text-slate-600 dark:text-slate-400">Loading data...</p>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredSports.length > 0 ? (
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSports.map((sport) => (
              <Card
                key={sport.key}
                className={`${
                  popularAmericanSports.includes(sport.key) || prestigiousSoccerLeagues.includes(sport.key)
                    ? "border-purple"
                    : "border-slate-200 dark:border-slate-700"
                } hover:shadow-md transition-shadow duration-200 bg-white dark:bg-slate-800 cursor-pointer`}
                onClick={() => handleSportClick(sport.key)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-slate-900 dark:text-slate-100">{sport.title}</CardTitle>
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {sport.group}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2 text-slate-600 dark:text-slate-300">{sport.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={sport.active ? "default" : "secondary"}>
                      {sport.active ? "Active" : "Inactive"}
                    </Badge>
                    {sport.has_outrights && <Badge variant="outline">Tournament Winner Bets</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-400">No sports available for the selected category</p>
        )}
      </div>
    </ErrorBoundary>
  )
}

