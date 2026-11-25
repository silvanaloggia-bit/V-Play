import { storageKey } from '../config/constants'
import { initialData } from '../data/initialData'
import { userSeed } from '../data/userSeed'
import type { Movie } from '../types/movie'
import { movieService } from './movieService'

// Clave y versión propias de la migración de seeds. Se guardan aparte de
// localStorage["movies"] para no mezclarlas con los datos del usuario.
const SEED_VERSION_KEY = 'seedVersion'
const SEED_VERSION = 2

/** Agrega los seeds cuyo id no existe, sin pisar los títulos ya guardados. */
function mergeMissingSeeds(saved: Movie[], seeds: Movie[]): Movie[] {
  const savedIds = new Set(saved.map((movie) => movie.id))
  const missing = seeds.filter((seed) => !savedIds.has(seed.id))
  return missing.length > 0 ? [...saved, ...missing] : saved
}

/** Completa `type` solo donde falte y el seed lo conozca. */
function backfillType(saved: Movie[], seeds: Movie[]): Movie[] {
  const seedById = new Map(seeds.map((seed) => [seed.id, seed]))
  let changed = false

  const result = saved.map((movie) => {
    const seed = seedById.get(movie.id)
    if (!seed?.type || movie.type) return movie
    changed = true
    return { ...movie, type: seed.type }
  })

  return changed ? result : saved
}

export const storageService = {
  seedInitialData(): void {
    const savedRaw = localStorage.getItem(storageKey.movies)
    const version = Number(localStorage.getItem(SEED_VERSION_KEY) ?? 0)

    // Se ejecuta si no hay datos, o una sola vez por versión de seed.
    if (savedRaw === null || version < SEED_VERSION) {
      const saved = savedRaw ? movieService.getMovies() : []
      const merged = backfillType(mergeMissingSeeds(saved, initialData), initialData)

      movieService.saveMovies(merged)
      localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION))
    }

    const savedUsers = localStorage.getItem(storageKey.users)
    if (!savedUsers) {
      localStorage.setItem(storageKey.users, JSON.stringify(userSeed))
    }
  },
}
