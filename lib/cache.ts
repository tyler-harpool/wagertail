import fs from "fs"
import path from "path"

const CACHE_DIR = path.join(process.cwd(), ".cache")
const CACHE_FILE = path.join(CACHE_DIR, "sports_cache.json")

interface CacheData<T> {
  timestamp: number
  data: T
}

export function readCache<T>(): T | null {
  if (!fs.existsSync(CACHE_FILE)) {
    return null
  }

  const cacheContent = fs.readFileSync(CACHE_FILE, "utf-8")
  return JSON.parse(cacheContent) as T
}

export function writeCache<T>(data: T): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(data))
}

