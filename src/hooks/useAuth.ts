import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { authService } from '../services/authService'

export function useAuth() {
  const [loggedUser, setLoggedUser] = useState(() => authService.getLoggedUser())
  const currentLocation = useLocation()

  useEffect(() => {
    setLoggedUser(authService.getLoggedUser())
  }, [currentLocation.pathname])

  function login(email: string, password: string): boolean {
    const foundUser = authService.findUserByCredentials(email, password)
    if (!foundUser) {
      return false
    }
    authService.saveLoggedUser(foundUser)
    setLoggedUser(foundUser)
    return true
  }

  function logout(): void {
    authService.removeLoggedUser()
    setLoggedUser(null)
  }

  return { loggedUser, login, logout }
}
