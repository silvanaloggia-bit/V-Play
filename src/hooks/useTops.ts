import { useCallback, useEffect, useState } from 'react'
import { topService } from '../services/topService'
import type { Movie } from '../types/movie'
import type { Tops } from '../types/top'

export const TOP_LIMIT = 5

type Direction = 'up' | 'down'

function getTopKey(type: Movie['type']): keyof Tops {
  return type === 'serie' ? 'series' : 'peliculas'
}

function seedTops(movies: Movie[]): Tops {
  return {
    peliculas: movies
      .filter((movie) => (movie.type ?? 'pelicula') === 'pelicula')
      .slice(0, TOP_LIMIT)
      .map((movie) => movie.id),
    series: movies
      .filter((movie) => movie.type === 'serie')
      .slice(0, TOP_LIMIT)
      .map((movie) => movie.id),
  }
}

function toMovies(ids: string[], movies: Movie[]): Movie[] {
  return ids
    .map((id) => movies.find((movie) => movie.id === id))
    .filter((movie): movie is Movie => Boolean(movie))
}

/**
 * CRUD del ranking Top 5: alta, baja, reordenación y lectura.
 * El estado se persiste en localStorage a través de topService.
 */
export function useTops(movies: Movie[]) {
  const [tops, setTops] = useState<Tops>(
    () => topService.getTops() ?? seedTops(movies),
  )

  useEffect(() => {
    topService.saveTops(tops)
  }, [tops])

  const addToTop = useCallback((movie: Movie) => {
    setTops((previous) => {
      const key = getTopKey(movie.type)
      const current = previous[key]
      if (current.length >= TOP_LIMIT || current.includes(movie.id)) {
        return previous
      }
      return { ...previous, [key]: [...current, movie.id] }
    })
  }, [])

  const removeFromTop = useCallback((movie: Movie) => {
    setTops((previous) => {
      const key = getTopKey(movie.type)
      return {
        ...previous,
        [key]: previous[key].filter((id) => id !== movie.id),
      }
    })
  }, [])

  const removeById = useCallback((id: string) => {
    setTops((previous) => ({
      peliculas: previous.peliculas.filter((topId) => topId !== id),
      series: previous.series.filter((topId) => topId !== id),
    }))
  }, [])

  const moveInTop = useCallback((movie: Movie, direction: Direction) => {
    setTops((previous) => {
      const key = getTopKey(movie.type)
      const current = previous[key]
      const index = current.indexOf(movie.id)
      if (index === -1) return previous

      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= current.length) return previous

      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...previous, [key]: next }
    })
  }, [])

  return {
    topIds: tops.peliculas,
    topSerieIds: tops.series,
    topMovies: toMovies(tops.peliculas, movies),
    topSeries: toMovies(tops.series, movies),
    addToTop,
    removeFromTop,
    removeById,
    moveInTop,
  }
}
