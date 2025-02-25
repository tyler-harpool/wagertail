"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { DarkModeToggle } from "./DarkModeToggle"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { WhaleLogo } from "./WhaleLogo"

export default function Header() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await logout()
    router.push("/auth/signin")
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <WhaleLogo className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">Wager Tail</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/leaderboard"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            Leaderboard
          </Link>
          <Link
            href="/my-bets"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            My Bets
          </Link>
          <Link
            href="/tail-bets"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            Tail Bets
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {loading ? (
            <Button disabled>Loading...</Button>
          ) : user ? (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-300">{user.email}</span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => router.push("/auth/signin")}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

