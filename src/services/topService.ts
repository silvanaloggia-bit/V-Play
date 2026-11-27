import { storageKey } from '../config/constants'
import type { Tops } from '../types/top'

const TOPS_VERSION_KEY = 'topsVersion'
export const TOPS_VERSION = 2

export const topService = {
  getTops(): Tops | null {
    const saved = localStorage.getItem(storageKey.tops)
    if (!saved) return null

    try {
      const parsed = JSON.parse(saved) as Partial<Tops>
      return {
        peliculas: Array.isArray(parsed.peliculas) ? parsed.peliculas : [],
        series: Array.isArray(parsed.series) ? parsed.series : [],
      }
    } catch {
      return null
    }
  },

  saveTops(tops: Tops): void {
    localStorage.setItem(storageKey.tops, JSON.stringify(tops))
  },

  getTopsVersion(): number {
    const saved = localStorage.getItem(TOPS_VERSION_KEY)
    if (saved === null) return 0
    const version = Number(saved)
    return Number.isFinite(version) ? version : 0
  },

  markTopsVersion(version: number): void {
    localStorage.setItem(TOPS_VERSION_KEY, String(version))
  },
}
