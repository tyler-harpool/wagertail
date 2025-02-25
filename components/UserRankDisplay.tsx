import { Badge } from "@/components/ui/badge"
import type { UserRank } from "@/types/user"

interface UserRankDisplayProps {
  rank: UserRank
}

const rankColors: Record<UserRank, string> = {
  Plankton: "bg-gray-200 text-gray-800",
  Guppy: "bg-green-200 text-green-800",
  Dolphin: "bg-blue-200 text-blue-800",
  Orca: "bg-purple-200 text-purple-800",
  "Blue Whale": "bg-indigo-200 text-indigo-800",
  Leviathan: "bg-red-200 text-red-800",
}

export function UserRankDisplay({ rank }: UserRankDisplayProps) {
  return <Badge className={`${rankColors[rank]} font-semibold`}>{rank}</Badge>
}

