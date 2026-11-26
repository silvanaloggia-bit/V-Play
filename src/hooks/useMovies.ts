import { useState } from 'react'
import { movieService } from '../services/movieService'
import type { Movie } from '../types/movie'

export function useMovies() {
    const [movies, setMovies] = useState(() => movieService.getMovies())

    const nextId = movieService.getNextId(movies)

    function updateMovies(updatedMovieList: Movie[]): void {
      setMovies(updatedMovieList)
      movieService.saveMovies(updatedMovieList)
    }

    return {
      movies,
      nextId,
      updateMovies
    }
}
