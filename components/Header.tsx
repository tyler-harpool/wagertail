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
    <header className="bg-sea-light dark:bg-abyss-dark border-b border-sea dark:border-abyss">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <WhaleLogo className="w-8 h-8 text-abyss-dark dark:text-sea-light" />
          <span className="text-2xl font-bold text-abyss-dark dark:text-sea-light">Wager Tail</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/leaderboard"
            className="text-abyss-dark hover:text-sea-dark dark:text-sea-light dark:hover:text-white"
          >
            Leaderboard
          </Link>
          <Link
            href="/my-bets"
            className="text-abyss-dark hover:text-sea-dark dark:text-sea-light dark:hover:text-white"
          >
            My Bets
          </Link>
          <Link
            href="/tail-bets"
            className="text-abyss-dark hover:text-sea-dark dark:text-sea-light dark:hover:text-white"
          >
            Tail Bets
          </Link>
          <Link
            href="/glossary"
            className="text-abyss-dark hover:text-sea-dark dark:text-sea-light dark:hover:text-white"
          >
            Glossary
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {loading ? (
            <Button disabled>Loading...</Button>
          ) : user ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-abyss-dark dark:text-sea-light">🐳 {user.tails} Tails</span>
                <span className="text-sm font-medium text-abyss-dark dark:text-sea-light">
                  🫧 {user.blubber} Blubber
                </span>
              </div>
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

