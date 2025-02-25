import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-sea-light dark:bg-abyss-dark py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-abyss-dark dark:text-sea-light">
            © {new Date().getFullYear()} Wager Tail. All rights reserved.
          </p>
          <nav>
            <Link href="/glossary" className="text-sm text-coral-dark dark:text-coral-light hover:underline">
              Glossary
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

