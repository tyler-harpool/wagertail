import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SportCardProps {
  sportKey: string
  acronym: string
  sportName: string
  fullName: string
  isActive?: boolean
}

export function SportCard({ sportKey, acronym, sportName, fullName, isActive = true }: SportCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-4 bg-gradient-to-br from-sea-light to-sea dark:from-abyss-dark dark:to-abyss">
        <h2 className="text-xl font-bold text-abyss-dark dark:text-sea-light mb-1">{acronym}</h2>
        <p className="text-sm text-abyss dark:text-sea">{sportName}</p>
      </CardHeader>
      <CardContent className="p-4 bg-white dark:bg-abyss-dark">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-abyss-dark dark:text-sea-light">{fullName}</p>
          {isActive && <Badge className="w-fit bg-coral dark:bg-coral-dark text-white font-normal">Active</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-sea-light dark:bg-abyss">
        <Link href={`/sports/${sportKey}`} passHref>
          <Button className="w-full bg-coral hover:bg-coral-dark text-white">View Odds</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

