import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type Sport = {
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights: boolean
}

type SportCategoryTabsProps = {
  sports: Sport[]
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export default function SportCategoryTabs({ sports, activeCategory, setActiveCategory }: SportCategoryTabsProps) {
  const categories = [
    { key: "all", title: "All Sports" },
    { key: "football", title: "Football" },
    { key: "basketball", title: "Basketball" },
    { key: "baseball", title: "Baseball" },
    { key: "hockey", title: "Hockey" },
    { key: "soccer", title: "Soccer" },
    { key: "tennis", title: "Tennis" },
    { key: "mma", title: "MMA" },
  ]

  console.log("SportCategoryTabs: Rendering with categories", categories)
  console.log("SportCategoryTabs: Active category", activeCategory)

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="inline-flex w-full h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
          {categories.map((category) => (
            <TabsTrigger
              key={category.key}
              value={category.key}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

