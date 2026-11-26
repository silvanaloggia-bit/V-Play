const FALLBACK_TMDB_API_KEY = '3dc58ec6873f3166e3888ab7046006a1'

export const TMDB_API_KEY =
  (import.meta.env.VITE_TMDB_API_KEY as string | undefined)?.trim() ||
  FALLBACK_TMDB_API_KEY
