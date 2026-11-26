import { useSyncExternalStore } from 'react'
import { storageKey } from '../config/constants'
import { authService, LOGGED_USER_CHANGE_EVENT } from '../services/authService'
import type { User } from '../types/user'

function subscribeToLoggedUser(onLoggedUserChange: () => void): () => void {
  window.addEventListener(LOGGED_USER_CHANGE_EVENT, onLoggedUserChange)
  return () => window.removeEventListener(LOGGED_USER_CHANGE_EVENT, onLoggedUserChange)
}

function readSavedLoggedUser(): string | null {
  return localStorage.getItem(storageKey.loggedUser)
}

export function useMyList() {
  const savedLoggedUser = useSyncExternalStore(subscribeToLoggedUser, readSavedLoggedUser)
  const loggedUser: User | null = savedLoggedUser ? JSON.parse(savedLoggedUser) : null

  const isSubscriber = loggedUser?.role === 'subscriber'
  const myListIds = loggedUser?.myListIds ? loggedUser.myListIds : []

  function toggleMyList(movieId: string): void {
    if (!loggedUser) {
      return
    }

    const updatedMyListIds = myListIds.includes(movieId)
      ? myListIds.filter((savedMovieId) => savedMovieId !== movieId)
      : [...myListIds, movieId]

    authService.updateUser({ ...loggedUser, myListIds: updatedMyListIds })
  }

  return { isSubscriber, myListIds, toggleMyList }
}
