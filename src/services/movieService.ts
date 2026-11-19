
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

  saveMovies(movieList: Movie[]): void {
    localStorage.setItem(storageKey.movies, JSON.stringify(movieList))
  },
}