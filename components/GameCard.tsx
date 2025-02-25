"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"

interface BetSectionProps {
  title: string
  homeTeam: string
  awayTeam: string
  homeOdds: string
  awayOdds: string
  points?: { home?: string; away?: string }
  onPlaceBet: (type: string, team: string, odds: string, amount: number) => void
  disabled?: boolean
}

const BetSection: React.FC<BetSectionProps> = ({
  title,
  homeTeam,
  awayTeam,
  homeOdds,
  awayOdds,
  points,
  onPlaceBet,
  disabled = false,
}) => {
  const [awayBetAmount, setAwayBetAmount] = useState<string>("")
  const [homeBetAmount, setHomeBetAmount] = useState<string>("")

  const hasValidOdds = homeOdds !== "N/A" && awayOdds !== "N/A"

  const renderOdds = (odds: string) => {
    const numOdds = Number.parseInt(odds)
    if (isNaN(numOdds)) return odds
    return numOdds > 0 ? `+${numOdds}` : numOdds.toString()
  }

  const handleBet = (team: string, odds: string, amount: string) => {
    const betAmount = Number.parseInt(amount, 10)
    if (!isNaN(betAmount) && betAmount > 0) {
      onPlaceBet(title, team, odds, betAmount)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-abyss shadow-md">
      <h3 className="font-semibold mb-3 text-center border-b pb-2 text-abyss-dark dark:text-sea-light">{title}</h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{awayTeam}</span>
            <div className="text-right">
              {points?.away && <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{points.away}</span>}
              <span className="font-mono font-bold text-coral-dark dark:text-coral-light">{renderOdds(awayOdds)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              placeholder="Tails"
              value={awayBetAmount}
              onChange={(e) => setAwayBetAmount(e.target.value)}
              className="w-24"
            />
            <Button
              variant={hasValidOdds ? "outline" : "ghost"}
              className="flex-grow hover:bg-sea hover:text-white dark:hover:bg-sea-dark dark:hover:text-white transition-colors"
              onClick={() => handleBet(awayTeam, awayOdds, awayBetAmount)}
              disabled={disabled || !hasValidOdds || awayBetAmount === ""}
            >
              {hasValidOdds ? `Cast ${renderOdds(awayOdds)}` : "Not Available"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{homeTeam}</span>
            <div className="text-right">
              {points?.home && <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{points.home}</span>}
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{renderOdds(homeOdds)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              placeholder="Tails"
              value={homeBetAmount}
              onChange={(e) => setHomeBetAmount(e.target.value)}
              className="w-24"
            />
            <Button
              variant={hasValidOdds ? "outline" : "ghost"}
              className="flex-grow hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
              onClick={() => handleBet(homeTeam, homeOdds, homeBetAmount)}
              disabled={disabled || !hasValidOdds || homeBetAmount === ""}
            >
              {hasValidOdds ? `Cast ${renderOdds(homeOdds)}` : "Not Available"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface GameCardProps {
  homeTeam: string
  awayTeam: string
  startTime: string
  moneyLine: { home: string; away: string }
  spread: { home: string; away: string; points?: { home?: string; away?: string } }
  overUnder: { over: string; under: string; total?: string }
  onPlaceBet: (type: string, team: string, odds: string, amount: number) => void
}

export function GameCard({ homeTeam, awayTeam, startTime, moneyLine, spread, overUnder, onPlaceBet }: GameCardProps) {
  const gameTime = new Date(startTime)
  const isGameStarted = gameTime < new Date()

  return (
    <Card className="overflow-hidden bg-sea-light dark:bg-abyss">
      <CardHeader className="bg-sea dark:bg-abyss-dark py-3">
        <CardTitle className="text-lg flex justify-between items-center text-white">
          <span>
            {awayTeam} @ {homeTeam}
          </span>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sea-light" />
            <time dateTime={gameTime.toISOString()} className="text-sm text-sea-light">
              {gameTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </time>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BetSection
            title="The Reef (Money Line)"
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeOdds={moneyLine.home}
            awayOdds={moneyLine.away}
            onPlaceBet={onPlaceBet}
            disabled={isGameStarted}
          />
          <BetSection
            title="The Abyss (Spread)"
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeOdds={spread.home}
            awayOdds={spread.away}
            points={spread.points}
            onPlaceBet={onPlaceBet}
            disabled={isGameStarted}
          />
          <BetSection
            title={`Coral Reef (Over/Under${overUnder.total ? ` ${overUnder.total}` : ""})`}
            homeTeam="Over"
            awayTeam="Under"
            homeOdds={overUnder.over}
            awayOdds={overUnder.under}
            onPlaceBet={onPlaceBet}
            disabled={isGameStarted}
          />
        </div>
      </CardContent>
    </Card>
  )
}

