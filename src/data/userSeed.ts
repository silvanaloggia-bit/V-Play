import type { User } from '../types/user'

export const userSeed: User[] = [
  {
    id: '1',
    name: 'Admin',
    lastName: 'Vplay',
    email: 'admin@vplay.com',
    password: 'Admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Editor',
    lastName: 'Vplay',
    email: 'editor@vplay.com',
    password: 'editor123',
    role: 'editor',
  },
  {
    id: '3',
    name: 'Diego',
    lastName: 'Pérez',
    email: 'diego@vplay.com',
    password: 'Diego12345',
    role: 'subscriber',
    planId: 'estandar',
    isActive: true,
    planEndDate: '2026-12-25',
  },
]