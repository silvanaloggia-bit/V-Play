import { useState } from 'react'
import { useLocation } from 'react-router'
import { authService } from '../services/authService'

export type LoginResult = 'success' | 'wrong-credentials' | 'inactive'

export function useAuth() {
  const [loggedUser, setLoggedUser] = useState(() => authService.getLoggedUser())
  const currentLocation = useLocation()
  const [previousLocationKey, setPreviousLocationKey] = useState(currentLocation.key)

  if (currentLocation.key !== previousLocationKey) {
    setPreviousLocationKey(currentLocation.key)
    setLoggedUser(authService.getLoggedUser())
  }

  function login(email: string, password: string): LoginResult {
    const foundUser = authService.findUserByCredentials(email, password)
    if (!foundUser) {
      return 'wrong-credentials'
    }
    if (foundUser.isActive === false) {
      return 'inactive'
    }
    authService.saveLoggedUser(foundUser)
    setLoggedUser(foundUser)
    return 'success'
  }

  function logout(): void {
    authService.removeLoggedUser()
    setLoggedUser(null)
  }

  return { loggedUser, login, logout }
}