import { storageKey } from '../config/constants'
import type { Category } from '../types/category'
import { slugify } from '../utils/slugify'

const seedCategories: Category[] = [
  { id: slugify('Acción'), name: 'Acción' },
  { id: slugify('Comedia'), name: 'Comedia' },
  { id: slugify('Drama'), name: 'Drama' },
  { id: slugify('Terror'), name: 'Terror' },
  { id: slugify('Ciencia ficción'), name: 'Ciencia ficción' },
]

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function isCategory(value: unknown): value is Category {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' && typeof candidate.name === 'string'
  )
}

function saveCategories(categories: Category[]): void {
  localStorage.setItem(storageKey.categories, JSON.stringify(categories))
}

function getSeededCategories(): Category[] {
  const seeded = seedCategories.map((category) => ({ ...category }))
  saveCategories(seeded)
  return seeded
}

export const categoryService = {
  normalizeName,

  getCategories(): Category[] {
    const stored = localStorage.getItem(storageKey.categories)
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored)
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every(isCategory)
        ) {
          return parsed
        }
      } catch {
        return getSeededCategories()
      }
    }

    return getSeededCategories()
  },

  saveCategories,
}
