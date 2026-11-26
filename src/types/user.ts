export type Role = 'admin' | 'editor' | 'subscriber'

export interface User {
  id: string
  name: string
  lastName: string
  email: string
  password: string
  role: Role
  planId?: string
  isActive?: boolean
  planEndDate?: string
  myListIds?: string 
}
