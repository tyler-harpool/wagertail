"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const glossaryItems = [
  { term: "Tails", definition: "The main betting currency. New users start with 100 Tails." },
  { term: "Blubber", definition: "Bonus currency that can be earned or converted from Tails." },
  { term: "Cast", definition: "To place a bet." },
  { term: "Reel In", definition: "To collect winnings." },
  { term: "The Reef", definition: "The main betting area (Money Line bets)." },
  { term: "The Abyss", definition: "The spread betting area." },
  { term: "Coral Reef", definition: "The over/under betting area." },
  { term: "Minnow", definition: "A small bet." },
  { term: "Sardine", definition: "A moderate bet." },
  { term: "Tuna", definition: "A large bet." },
  { term: "Whale", definition: "A very large bet." },
  { term: "Megalodon", definition: "An enormous, rare bet." },
  { term: "Plankton", definition: "Beginner user rank." },
  { term: "Guppy", definition: "Novice user rank." },
  { term: "Dolphin", definition: "Intermediate user rank." },
  { term: "Orca", definition: "Advanced user rank." },
  { term: "Blue Whale", definition: "Expert user rank." },
  { term: "Leviathan", definition: "Legendary user rank." },
]

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = glossaryItems.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wager Tail Glossary</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search glossary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Term</TableHead>
            <TableHead>Definition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.term}>
              <TableCell className="font-medium">{item.term}</TableCell>
              <TableCell>{item.definition}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredItems.length === 0 && <p className="text-center mt-4 text-gray-500">No matching terms found.</p>}
    </div>
  )
}

