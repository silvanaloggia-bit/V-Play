import { useState } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types/user'

export function useUsers() {
  const [users, setUsers] = useState(() => authService.getUsers())

  function updateUsers(updatedUserList: User[]): void {
    setUsers(updatedUserList)
    authService.saveUsers(updatedUserList)
  }

  return { users, updateUsers }
}