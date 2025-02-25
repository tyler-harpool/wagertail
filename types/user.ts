export interface User {
  id: string
  email: string
  name: string
  tails: number
  blubber: number
  rank: UserRank
  winStreak: number
  totalBets: number
  winRate: number
  lastLogin: Date
  createdAt: Date
}

export type UserRank = "Plankton" | "Guppy" | "Dolphin" | "Orca" | "Blue Whale" | "Leviathan"

export const userRanks: UserRank[] = ["Plankton", "Guppy", "Dolphin", "Orca", "Blue Whale", "Leviathan"]

export function calculateUserRank(tails: number): UserRank {
  if (tails < 100) return "Plankton"
  if (tails < 500) return "Guppy"
  if (tails < 1000) return "Dolphin"
  if (tails < 5000) return "Orca"
  if (tails < 10000) return "Blue Whale"
  return "Leviathan"
}

export function calculateWinRate(totalBets: number, wonBets: number): number {
  if (totalBets === 0) return 0
  return (wonBets / totalBets) * 100
}

