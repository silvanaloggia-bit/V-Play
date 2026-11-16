import { useContext } from 'react'
import { MoviesContext } from '../context/MoviesContext'

export function useMovies() {
  return useContext(MoviesContext)
}
