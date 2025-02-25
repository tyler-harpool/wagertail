"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Dumbbell,
  ClubIcon as Football,
  ShoppingBasketIcon as Basketball,
  BeerIcon as Baseball,
  Snowflake,
  FlagTriangleRight,
  TurtleIcon as Tennis,
  Trophy,
  GuitarIcon as Golf,
} from "lucide-react"

const categories = [
  { key: "all", icon: Trophy, label: "All" },
  { key: "football", icon: Football, label: "Football" },
  { key: "basketball", icon: Basketball, label: "Basketball" },
  { key: "baseball", icon: Baseball, label: "Baseball" },
  { key: "hockey", icon: Snowflake, label: "Hockey" },
  { key: "soccer", icon: FlagTriangleRight, label: "Soccer" },
  { key: "tennis", icon: Tennis, label: "Tennis" },
  { key: "golf", icon: Golf, label: "Golf" },
  { key: "other", icon: Dumbbell, label: "Other" },
]

interface SportCategoryIconsProps {
  onSelectCategory: (category: string) => void
}

export function SportCategoryIcons({ onSelectCategory }: SportCategoryIconsProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onSelectCategory(category)
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-2 p-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={activeCategory === category.key ? "default" : "outline"}
            className={`flex-shrink-0 ${
              activeCategory === category.key
                ? "bg-purple text-white dark:bg-purple-dark"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
            onClick={() => handleCategoryClick(category.key)}
            aria-label={`Filter by ${category.label}`}
          >
            <category.icon className="h-4 w-4 mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">{category.label}</span>
            <span className="sm:hidden">{category.label.slice(0, 1)}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

