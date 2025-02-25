import { Badge } from "@/components/ui/badge"

type BetSize = "Minnow" | "Sardine" | "Tuna" | "Whale" | "Megalodon"

interface BetSizeIndicatorProps {
  size: BetSize
}

const betSizeColors: Record<BetSize, string> = {
  Minnow: "bg-blue-200 text-blue-800",
  Sardine: "bg-green-200 text-green-800",
  Tuna: "bg-yellow-200 text-yellow-800",
  Whale: "bg-purple-200 text-purple-800",
  Megalodon: "bg-red-200 text-red-800",
}

export function BetSizeIndicator({ size }: BetSizeIndicatorProps) {
  return <Badge className={`${betSizeColors[size]} font-semibold`}>{size}</Badge>
}

export function getBetSize(amount: number): BetSize {
  if (amount < 10) return "Minnow"
  if (amount < 50) return "Sardine"
  if (amount < 100) return "Tuna"
  if (amount < 500) return "Whale"
  return "Megalodon"
}

