export function formatDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export function getDateInDays(days: number): string {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)
  const year = futureDate.getFullYear()
  const month = String(futureDate.getMonth() + 1).padStart(2, '0')
  const day = String(futureDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}