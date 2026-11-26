export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function matchesQuery(text: string, query: string): boolean {
  if (!query.trim()) return true
  return normalizeForSearch(text).includes(normalizeForSearch(query))
}
