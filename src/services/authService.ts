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
}