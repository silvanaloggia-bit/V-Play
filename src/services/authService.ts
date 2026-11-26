import { storageKey } from '../config/constants'
import type { User } from '../types/user'
export const LOGGED_USER_CHANGE_EVENT = 'logged-user-change'
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

  isEmailTaken(email: string): boolean {
    const userList = authService.getUsers()
    return userList.some((user) => user.email === email)
  },

  registerUser(newUser: User): void {
    const userList = authService.getUsers()
    authService.saveUsers([...userList, newUser])
  },

  updateUser(updatedUser: User): void {
     const updatedUserList = authService
        .getUsers()
        .map((user) => (user.id === updatedUser.id ? updatedUser : user))
      authService.saveUsers(updatedUserList)

      const loggedUser = authService.getLoggedUser()
      if (loggedUser?.id === updatedUser.id) {
        authService.saveLoggedUser(updatedUser)
      }
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
    window.dispatchEvent(new Event(LOGGED_USER_CHANGE_EVENT))
  },

  removeLoggedUser(): void {
    localStorage.removeItem(storageKey.loggedUser)
    window.dispatchEvent(new Event(LOGGED_USER_CHANGE_EVENT))
  },
}