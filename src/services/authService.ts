import { storageKey } from '../config/constants'
import type { User } from '../types/user'

export const authService = {
  getUsers(): User[] {
    const savedUsers = localStorage.getItem(storageKey.users)
    if (!savedUsers) {
      return []
    }
    const userList: User[] = JSON.parse(savedUsers)
    return userList
  },

  saveUsers(userList: User[]): void {
    localStorage.setItem(storageKey.users, JSON.stringify(userList))
  },

  findUserByCredentials(email: string, password: string): User | undefined {
    const userList = authService.getUsers()
    const foundUser = userList.find(
      (user) => user.email === email && user.password === password,
    )
    return foundUser
  },

  getLoggedUser(): User | null {
    const savedLoggedUser = localStorage.getItem(storageKey.loggedUser)
    if (!savedLoggedUser) {
      return null
    }
    const loggedUser: User = JSON.parse(savedLoggedUser)
    return loggedUser
  },

  saveLoggedUser(loggedUser: User): void {
    localStorage.setItem(storageKey.loggedUser, JSON.stringify(loggedUser))
  },

  removeLoggedUser(): void {
    localStorage.removeItem(storageKey.loggedUser)
  },
}