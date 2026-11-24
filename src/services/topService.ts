import { storageKey } from '../config/constants'
import type { Tops } from '../types/top'

export const topService = {
  /** Devuelve null cuando todavía no se guardó ningún ranking. */
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
}
