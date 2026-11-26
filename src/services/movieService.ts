
import { storageKey } from '../config/constants'
import type { Movie } from '../types/movie'

export const movieService = {
  getMovies(): Movie[] {
    const savedMovies = localStorage.getItem(storageKey.movies)
    if (!savedMovies) {
      return []
    }
    const movieList: Movie[] = JSON.parse(savedMovies)
    return movieList
  },

  getNextId(movieList: Movie[]): string {
    const numericIds = movieList
      .map((movie) => Number(movie.id))
      .filter((id) => Number.isInteger(id) && id > 0)

    return String(numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1)
  },

  saveMovies(movieList: Movie[]): void {
    localStorage.setItem(storageKey.movies, JSON.stringify(movieList))
  },
}