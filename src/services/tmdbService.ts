import { TMDB_API_TOKEN } from '../config/tmdb'
import type { MovieType } from '../types/movie'

const TOKEN = TMDB_API_TOKEN
const API_BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export interface TmdbResult {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface TmdbPicked {
  tmdbId: number
  name: string
  description: string
  type: MovieType
  category: string
  releaseYear?: number
  duration?: number
  seasons?: number
  episodes?: number
  rating?: number
  posterUrl?: string
  bannerUrl?: string
  trailerKey?: string
}

interface TmdbVideo {
  key: string
  site: string
  type: string
  official: boolean
}

const GENRE_TO_CATEGORY: Record<number, string> = {
  28: 'Acción',
  35: 'Comedia',
  18: 'Drama',
  27: 'Terror',
  878: 'Ciencia ficción',
  10759: 'Acción',
  10765: 'Ciencia ficción',
  10751: 'Comedia',
  9648: 'Terror',
}

function getHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${TOKEN}`,
    accept: 'application/json',
  }
}

export function hasTmdbToken(): boolean {
  return Boolean(TOKEN)
}

export function getTmdbErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo conectar con TMDb.'
}

function describeStatus(status: number): string {
  if (status === 401) return 'El token de TMDb no es válido.'
  if (status === 429) return 'TMDb limitó las consultas. Probá de nuevo en unos minutos.'
  return `TMDb devolvió el estado ${status} al buscar.`
}

export async function searchTmdb(term: string): Promise<TmdbResult[]> {
  if (!TOKEN) return []

  try {
    const response = await fetch(
      `${API_BASE}/search/multi?language=es-ES&include_adult=false&query=${encodeURIComponent(term)}`,
      { headers: getHeaders() },
    )

    if (!response.ok) throw new Error(describeStatus(response.status))

    const data = (await response.json()) as { results?: TmdbResult[] }

    return (data.results ?? []).filter(
      (result) => result.media_type !== 'person' && Boolean(result.poster_path),
    )
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('No se pudo conectar con TMDb. Revisá tu conexión.', {
      cause: error,
    })
  }
}

interface TmdbDetails {
  overview?: string
  genres?: { id: number }[]
  release_date?: string
  first_air_date?: string
  runtime?: number
  number_of_seasons?: number
  number_of_episodes?: number
  vote_average?: number
  poster_path?: string | null
  backdrop_path?: string | null
}

function firstYear(date?: string): number | undefined {
  if (!date) return undefined
  const year = Number(date.slice(0, 4))
  return Number.isInteger(year) && year >= 1888 ? year : undefined
}

function categoryFromGenres(genres: { id: number }[] | undefined): string {
  return genres?.map((genre) => GENRE_TO_CATEGORY[genre.id]).find(Boolean) ?? ''
}

export async function getTmdbTrailer(
  id: number,
  type: MovieType,
): Promise<string | undefined> {
  if (!TOKEN) return undefined

  const mediaPath = type === 'serie' ? 'tv' : 'movie'

  try {
    const response = await fetch(
      `${API_BASE}/${mediaPath}/${id}/videos?language=es-ES&include_video_language=es,en`,
      { headers: getHeaders() },
    )
    if (!response.ok) return undefined

    const data = (await response.json()) as { results?: TmdbVideo[] }
    const videos = (data.results ?? []).filter(
      (video) => video.site === 'YouTube' && Boolean(video.key),
    )

    const trailer =
      videos.find((video) => video.type === 'Trailer' && video.official) ??
      videos.find((video) => video.type === 'Trailer') ??
      videos.find((video) => video.type === 'Teaser') ??
      videos.find((video) => video.type === 'Clip')

    return trailer?.key
  } catch {
    return undefined
  }
}

export async function getTmdbDetails(result: TmdbResult): Promise<TmdbPicked> {
  const type: MovieType = result.media_type === 'tv' ? 'serie' : 'pelicula'
  const detailsPath = type === 'serie' ? 'tv' : 'movie'

  let details: TmdbDetails = {}
  if (TOKEN) {
    try {
      const response = await fetch(
        `${API_BASE}/${detailsPath}/${result.id}?language=es-ES`,
        { headers: getHeaders() },
      )
      if (response.ok) details = (await response.json()) as TmdbDetails
    } catch {
      details = {}
    }
  }

  const posterPath = details.poster_path ?? result.poster_path
  const backdropPath = details.backdrop_path ?? result.backdrop_path
  const rating = details.vote_average
  const releaseYear = firstYear(details.release_date ?? details.first_air_date)
  const trailerKey = await getTmdbTrailer(result.id, type)

  return {
    tmdbId: result.id,
    name: result.title ?? result.name ?? '',
    description: details.overview ?? '',
    type,
    category: categoryFromGenres(details.genres),
    releaseYear,
    duration: type === 'pelicula' && details.runtime ? details.runtime : undefined,
    seasons: type === 'serie' ? details.number_of_seasons : undefined,
    episodes: type === 'serie' ? details.number_of_episodes : undefined,
    rating: rating && rating > 0 ? Math.round(rating * 10) / 10 : undefined,
    posterUrl: posterPath ? `${TMDB_IMAGE_BASE}/w500${posterPath}` : undefined,
    bannerUrl: backdropPath ? `${TMDB_IMAGE_BASE}/w780${backdropPath}` : undefined,
    trailerKey,
  }
}
