import type { Movie } from '../types/movie'

/** Convierte 167 en "2 h 47 min" y 120 en "2 h". */
export function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return ''

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours} h`
  return `${hours} h ${rest} min`
}

/**
 * Texto secundario de un título según su tipo:
 * película → "2024 · 2 h 47 min · ★ 8.2"
 * serie    → "2011 · 8 temporadas · 73 episodios · ★ 8.4"
 */
export function formatTitleMeta(movie: Movie): string {
  const parts: string[] = []

  if (movie.releaseYear) parts.push(String(movie.releaseYear))

  if ((movie.type ?? 'pelicula') === 'serie') {
    if (movie.seasons) {
      parts.push(
        `${movie.seasons} temporada${movie.seasons === 1 ? '' : 's'}`,
      )
    }
    if (movie.episodes) {
      parts.push(
        `${movie.episodes} episodio${movie.episodes === 1 ? '' : 's'}`,
      )
    }
  } else {
    const duration = formatDuration(movie.duration)
    if (duration) parts.push(duration)
  }

  if (movie.rating) parts.push(`★ ${movie.rating.toFixed(1)}`)

  return parts.join(' · ')
}
