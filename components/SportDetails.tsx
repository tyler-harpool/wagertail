"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { GameCard } from "@/components/GameCard"

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

interface SportDetailsProps {
  sportKey: string
}

export function SportDetails({ sportKey }: SportDetailsProps) {
  const [sportData, setSportData] = useState<Game[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSportData() {
      try {
        const response = await fetch(`/api/sports/${sportKey}`)
        if (!response.ok) {
          throw new Error("Failed to fetch sport data")
        }
        const data = await response.json()
        setSportData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSportData()
  }, [sportKey])

  if (isLoading) return <div className="text-center p-4">Loading sport details...</div>
  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  if (!sportData || sportData.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No games available for this sport at the moment.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-sea-light dark:bg-abyss">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-abyss-dark dark:text-sea-light">
            {sportData[0].sport_title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="bg-coral dark:bg-coral-dark text-white">
            {sportData.length} {sportData.length === 1 ? "Game" : "Games"} Available
          </Badge>
        </CardContent>
      </Card>

      {sportData.map((game) => (
        <GameCard
          key={game.id}
          homeTeam={game.home_team}
          awayTeam={game.away_team}
          startTime={game.commence_time}
          moneyLine={extractMoneyLine(game)}
          spread={extractSpread(game)}
          overUnder={extractOverUnder(game)}
          onPlaceBet={(type, team, odds, amount) => {
            console.log("Bet placed:", { type, team, odds, amount })
            // Implement bet placement logic here
          }}
        />
      ))}
    </div>
  )
}

function extractMoneyLine(game: Game) {
  const moneylineMarket = game.bookmakers[0]?.markets.find((m) => m.key === "h2h")
  return {
    home: moneylineMarket?.outcomes.find((o) => o.name === game.home_team)?.price.toString() || "N/A",
    away: moneylineMarket?.outcomes.find((o) => o.name === game.away_team)?.price.toString() || "N/A",
  }
}

function extractSpread(game: Game) {
  const spreadMarket = game.bookmakers[0]?.markets.find((m) => m.key === "spreads")
  const homeOutcome = spreadMarket?.outcomes.find((o) => o.name === game.home_team)
  const awayOutcome = spreadMarket?.outcomes.find((o) => o.name === game.away_team)
  return {
    home: homeOutcome?.price.toString() || "N/A",
    away: awayOutcome?.price.toString() || "N/A",
    points: {
      home: homeOutcome?.point?.toString(),
      away: awayOutcome?.point?.toString(),
    },
  }
}

function extractOverUnder(game: Game) {
  const totalsMarket = game.bookmakers[0]?.markets.find((m) => m.key === "totals")
  const overOutcome = totalsMarket?.outcomes.find((o) => o.name === "Over")
  const underOutcome = totalsMarket?.outcomes.find((o) => o.name === "Under")
  return {
    over: overOutcome?.price.toString() || "N/A",
    under: underOutcome?.price.toString() || "N/A",
    total: overOutcome?.point?.toString(),
  }
}

