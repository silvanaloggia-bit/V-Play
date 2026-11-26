import { useEffect, useState } from 'react'
import { movieService } from '../services/movieService'
import { MOVIES_UPDATED_EVENT } from '../services/storageService'
import type { Movie } from '../types/movie'

export function useMovies() {
  const [movies, setMovies] = useState(() => movieService.getMovies())

  const nextId = movieService.getNextId(movies)

  useEffect(() => {
    function handleMoviesUpdated(): void {
      setMovies(movieService.getMovies())
    }

    window.addEventListener(MOVIES_UPDATED_EVENT, handleMoviesUpdated)
    return () => window.removeEventListener(MOVIES_UPDATED_EVENT, handleMoviesUpdated)
  }, [])

  function updateMovies(updatedMovieList: Movie[]): void {
    setMovies(updatedMovieList)
    movieService.saveMovies(updatedMovieList)
  }

  return {
    movies,
    nextId,
    updateMovies,
  }
}
