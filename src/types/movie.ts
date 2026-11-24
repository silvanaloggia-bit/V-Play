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
}
