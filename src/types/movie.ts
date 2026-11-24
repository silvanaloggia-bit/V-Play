import { categories } from '../config/constants'

export type Category = (typeof categories)[number]

export type MovieType = 'pelicula' | 'serie'

export interface Movie {
  id: string
  name: string
  description: string
  category: Category
  imageUrl: string
  bannerUrl?:string
  published: boolean
  isFeatured: boolean
  type?: MovieType
  /** Duración en minutos (películas) */
  duration?: number
  /** Cantidad de temporadas (series) */
  seasons?: number
  /** Cantidad de episodios (series) */
  episodes?: number
  /** Año de estreno */
  releaseYear?: number
  /** Puntaje de 0 a 10 */
  rating?: number
  /** Id de TMDb, para evitar duplicados */
  tmdbId?: number
}
