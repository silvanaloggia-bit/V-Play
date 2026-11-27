import { useState } from 'react'
import { useLocation } from 'react-router'
import { categoryService } from '../services/categoryService'
import type { Category } from '../types/category'
import { slugify } from '../utils/slugify'

export type CategoryResult =
  | { ok: true; category: Category }
  | { ok: false; error: string }

function buildId(name: string, categories: Category[]): string {
  const base = slugify(name) || 'categoria'
  let id = base
  let suffix = 2
  while (categories.some((category) => category.id === id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }
  return id
}

export function useCategories() {
  const [categories, setCategories] = useState(() => categoryService.getCategories())
  const currentLocation = useLocation()
  const [previousPathname, setPreviousPathname] = useState(currentLocation.pathname)

  if (currentLocation.pathname !== previousPathname) {
    setPreviousPathname(currentLocation.pathname)
    setCategories(categoryService.getCategories())
  }

  function persist(next: Category[]): void {
    setCategories(next)
    categoryService.saveCategories(next)
  }

  function validate(name: string, currentId?: string): string | null {
    const trimmed = name.trim()
    if (!trimmed) {
      return 'El nombre de la categoría es obligatorio.'
    }

    const normalized = categoryService.normalizeName(trimmed)
    const duplicated = categories.some(
      (category) =>
        category.id !== currentId &&
        categoryService.normalizeName(category.name) === normalized,
    )
    if (duplicated) {
      return 'Ya existe una categoría con ese nombre.'
    }

    return null
  }

  function createCategory(name: string): CategoryResult {
    const error = validate(name)
    if (error) {
      return { ok: false, error }
    }

    const trimmed = name.trim()
    const category: Category = {
      id: buildId(trimmed, categories),
      name: trimmed,
    }
    persist([...categories, category])
    return { ok: true, category }
  }

  function updateCategory(id: string, name: string): CategoryResult {
    const current = categories.find((category) => category.id === id)
    if (!current) {
      return { ok: false, error: 'No se encontró la categoría.' }
    }

    const error = validate(name, id)
    if (error) {
      return { ok: false, error }
    }

    const trimmed = name.trim()
    const updated: Category = { ...current, name: trimmed }
    persist(categories.map((category) => (category.id === id ? updated : category)))
    return { ok: true, category: updated }
  }

  function deleteCategory(id: string): void {
    persist(categories.filter((category) => category.id !== id))
  }

  function moveCategory(id: string, direction: 'up' | 'down'): void {
    const index = categories.findIndex((category) => category.id === id)
    if (index === -1) return

    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= categories.length) return

    const next = [...categories]
    ;[next[index], next[target]] = [next[target], next[index]]
    persist(next)
  }

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
  }
}
