import type { User } from '../types/user'

export const userSeed: User[] = [
  {
    id: 'u-1',
    name: 'Admin',
    lastName: 'Vplay',
    email: 'admin@vplay.com',
    password: 'Admin123',
    role: 'admin',
  },
  {
    id: 'u-2',
    name: 'Gestor',
    lastName: 'Vplay',
    email: 'gestor@vplay.com',
    password: 'Gestor123',
    role: 'editor',
  },
  {
    id: 'u-3',
    name: 'Diego',
    lastName: 'Pérez',
    email: 'diego@vplay.com',
    password: 'Diego12345',
    role: 'subscriber',
    planId: 'estandar',
  },
]