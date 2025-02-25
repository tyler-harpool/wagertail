"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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

export default function SportGamesPage() {
  const params = useParams()
  const sportKey = params.sportKey as string
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/games?sport=${sportKey}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (Array.isArray(data)) {
          setGames(data)
        } else {
          console.error("Unexpected data format:", data)
          throw new Error("Received invalid data format from API")
        }
      } catch (e) {
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

  if (games.length === 0) {
    return <div>No games available for this sport at the moment.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Games for {sportKey}</h1>
      <div className="space-y-4">
        {games.map((game) => (
          <Card key={game.id}>
            <CardHeader>
              <CardTitle>
                {game.away_team} @ {game.home_team}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Start time: {new Date(game.commence_time).toLocaleString()}</p>
              {game.bookmakers.length > 0 && game.bookmakers[0].markets.length > 0 && (
                <div>
                  <h3 className="font-semibold mt-2">Odds:</h3>
                  {game.bookmakers[0].markets[0].outcomes.map((outcome) => (
                    <p key={outcome.name}>
                      {outcome.name}: {outcome.price}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

