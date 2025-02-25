import { fetchFromOddsApi } from "./oddsApiFetcher"
import { fetchFromSportradar } from "./sportradarFetcher"
import { scrapeSportsData } from "./dataScraper"

export async function fetchSportsData() {
  try {
    // Try primary source
    const oddsApiData = await fetchFromOddsApi()
    if (oddsApiData) return oddsApiData

    // Try secondary source
    const sportradarData = await fetchFromSportradar()
    if (sportradarData) return sportradarData

    // Fall back to scraping
    const scrapedData = await scrapeSportsData()
    if (scrapedData) return scrapedData

    throw new Error("Unable to fetch sports data from any source")
  } catch (error) {
    console.error("Error fetching sports data:", error)
    throw error
  }
}

