export type Category = string

export type MovieType = 'pelicula' | 'serie'

export interface Movie {
  id: string
  name: string
  description: string
  category: Category
  imageUrl: string
  bannerUrl?: string
  published: boolean
  isFeatured: boolean
  type?: MovieType
  duration?: number
  seasons?: number
  episodes?: number
  releaseYear?: number
  rating?: number
  tmdbId?: number
  trailerKey?: string
}
