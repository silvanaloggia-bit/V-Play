import { z } from 'zod'

const optionalPositiveInteger = z.string().trim().refine(
  (value) => value === '' || (/^\d+$/.test(value) && Number(value) > 0),
  { message: 'Ingresá un número entero mayor a 0.' },
)

const optionalYear = z.string().trim().refine(
  (value) =>
    value === '' ||
    (/^\d+$/.test(value) && Number(value) >= 1888 && Number(value) <= 2100),
  { message: 'Ingresá un año entre 1888 y 2100.' },
)

const optionalRating = z.string().trim().refine(
  (value) =>
    value === '' ||
    (!Number.isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 10),
  { message: 'Tiene que estar entre 0 y 10.' },
)

export const movieSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),
  description: z.string().trim(),
  type: z.enum(['pelicula', 'serie']),
  category: z.string().trim().min(1, 'Elegí una categoría.'),
  imageUrl: z.string().trim().min(1, 'La imagen es obligatoria.'),
  bannerUrl: z.string().trim(),
  published: z.boolean(),
  isFeatured: z.boolean(),
  duration: optionalPositiveInteger,
  seasons: optionalPositiveInteger,
  episodes: optionalPositiveInteger,
  releaseYear: optionalYear,
  rating: optionalRating,
})

export type MovieFormValues = z.infer<typeof movieSchema>

export function getMovieFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && !errors[field]) {
      errors[field] = issue.message
    }
  }
  return errors
}
