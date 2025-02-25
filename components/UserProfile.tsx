import type { User } from "@/types/user"
import { UserRankDisplay } from "./UserRankDisplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{user.name}</span>
          <UserRankDisplay rank={user.rank} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Email: {user.email}</p>
          <p>Tails: {user.tails}</p>
          <p>Blubber: {user.blubber}</p>
        </div>
      </CardContent>
    </Card>
  )
}

