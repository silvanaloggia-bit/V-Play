import { categories } from '../config/constants'

export type Category = (typeof categories)[number]

export interface Movie {
  id: string
  name: string
  description: string
  category: Category
  imageUrl: string
  published: boolean
  isFeatured: boolean
}
