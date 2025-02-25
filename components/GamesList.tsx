"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface Game {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Array<{
    key: string
    title: string
    markets: Array<{
      key: string
      outcomes: Array<{
        name: string
        price: number
      }>
    }>
  }>
}

interface GamesListProps {
  sportKey: string
}

export function GamesList({ sportKey }: GamesListProps) {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStaleData, setIsStaleData] = useState(false)
  const [cacheDate, setCacheDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setIsStaleData(false)
        setCacheDate(null)

        const response = await fetch(`/api/games?sport=${sportKey}`)

        if (response.headers.get("X-Data-Source") === "cache") {
          setIsStaleData(true)
          setCacheDate(response.headers.get("X-Cache-Date"))
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Received data:", data)

        if (data.error) {
          throw new Error(data.error)
        }

        setGames(data)
      } catch (e) {
        console.error("Error fetching games:", e)
        setError(e instanceof Error ? e.message : "An error occurred while fetching games.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGames()
  }, [sportKey])

  if (isLoading) {
    return <div>Loading games...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {isStaleData && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>
            This data may be outdated. Last updated: {cacheDate ? new Date(cacheDate).toLocaleString() : "Unknown"}
          </AlertDescription>
        </Alert>
      )}
      {games.length === 0 ? (
        <div>No games available for this sport at the moment.</div>
      ) : (
        games.map((game) => (
          <Card key={game.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>
                  {game.away_team} @ {game.home_team}
                </span>
                <Badge variant="outline">{new Date(game.commence_time).toLocaleString()}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>{/* Add more game details here if needed */}</CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

