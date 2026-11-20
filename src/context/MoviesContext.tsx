
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Movie } from '../types/movie'
import { movieService } from '../services/movieService'

interface MoviesContextValue {
  movies: Movie[]
  updateMovies: (updatedMovieList: Movie[]) => void
}

interface MoviesProviderProps {
  children: ReactNode
}

const emptyMoviesContext: MoviesContextValue = {
  movies: [],
  updateMovies: () => {},
}

export const MoviesContext = createContext(emptyMoviesContext)

export function MoviesProvider({ children }: MoviesProviderProps) {
  const [movies, setMovies] = useState(() => movieService.getMovies())

  function updateMovies(updatedMovieList: Movie[]): void {
    setMovies(updatedMovieList)
    movieService.saveMovies(updatedMovieList)
  }

  return (
    <MoviesContext value={{ movies, updateMovies }}>
      {children}
    </MoviesContext>
  )
}