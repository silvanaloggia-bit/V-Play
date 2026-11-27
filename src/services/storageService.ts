import { storageKey } from '../config/constants'
import { initialData } from '../data/initialData'
import { userSeed } from '../data/userSeed'
import type { Movie } from '../types/movie'
import { movieService } from './movieService'
import { getTmdbTrailer } from './tmdbService'

const SEED_VERSION_KEY = 'seedVersion'
const SEED_VERSION = 3
const TRAILER_VERSION_KEY = 'trailerVersion'
const TRAILER_VERSION = 3
export const MOVIES_UPDATED_EVENT = 'vplay:movies-updated'

function mergeMissingSeeds(saved: Movie[], seeds: Movie[]): Movie[] {
  const savedIds = new Set(saved.map((movie) => movie.id))
  const missing = seeds.filter((seed) => !savedIds.has(seed.id))
  return missing.length > 0 ? [...saved, ...missing] : saved
}

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

function backfillTmdbId(saved: Movie[], seeds: Movie[]): Movie[] {
  const seedById = new Map(seeds.map((seed) => [seed.id, seed]))
  let changed = false

  const result = saved.map((movie) => {
    const seed = seedById.get(movie.id)
    if (!seed?.tmdbId || movie.tmdbId) return movie
    changed = true
    return { ...movie, tmdbId: seed.tmdbId }
  })

  return changed ? result : saved
}

async function migrateTrailers(): Promise<void> {
  const movies = movieService.getMovies()

  const updated = await Promise.all(
    movies.map(async (movie) => {
      if (movie.trailerKey || !movie.tmdbId) return movie
      const trailerKey = await getTmdbTrailer(movie.tmdbId, movie.type ?? 'pelicula')
      return trailerKey ? { ...movie, trailerKey } : movie
    }),
  )

  if (updated.some((movie, index) => movie !== movies[index])) {
    movieService.saveMovies(updated)
    window.dispatchEvent(new Event(MOVIES_UPDATED_EVENT))
  }
}

export const storageService = {
  seedInitialData(): void {
    const savedRaw = localStorage.getItem(storageKey.movies)
    const version = Number(localStorage.getItem(SEED_VERSION_KEY) ?? 0)

    if (savedRaw === null || version < SEED_VERSION) {
      const saved = savedRaw ? movieService.getMovies() : []
      const merged = backfillType(mergeMissingSeeds(saved, initialData), initialData)
      const withIds = backfillTmdbId(merged, initialData)

      movieService.saveMovies(withIds)
      localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION))
    }

    const savedUsers = localStorage.getItem(storageKey.users)
    if (!savedUsers) {
      localStorage.setItem(storageKey.users, JSON.stringify(userSeed))
    }

    if (Number(localStorage.getItem(TRAILER_VERSION_KEY) ?? 0) < TRAILER_VERSION) {
      localStorage.setItem(TRAILER_VERSION_KEY, String(TRAILER_VERSION))
      void migrateTrailers()
    }
  },
}
