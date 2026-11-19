import { storageKey } from '../config/constants'
import { initialData } from '../data/initialData'
import { userSeed } from '../data/userSeed'

export const storageService = {
  seedInitialData(): void {
    const savedMovies = localStorage.getItem(storageKey.movies)
    if (!savedMovies) {
      localStorage.setItem(storageKey.movies, JSON.stringify(initialData))
    }

    const savedUsers = localStorage.getItem(storageKey.users)
    if (!savedUsers) {
      localStorage.setItem(storageKey.users, JSON.stringify(userSeed))
    }
  },
}
