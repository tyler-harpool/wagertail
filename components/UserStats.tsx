import type { User } from "@/types/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRankDisplay } from "./UserRankDisplay"

interface UserStatsProps {
  user: User
}

export function UserStats({ user }: UserStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{user.name}</span>
          <UserRankDisplay rank={user.rank} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tails</p>
            <p className="text-2xl font-bold">{user.tails}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blubber</p>
            <p className="text-2xl font-bold">{user.blubber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Win Streak</p>
            <p className="text-2xl font-bold">{user.winStreak}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold">{user.winRate.toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

