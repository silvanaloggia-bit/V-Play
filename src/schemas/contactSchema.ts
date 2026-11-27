import { z } from 'zod'

export const contactSchema = z.object({
  reason: z.enum(['plan', 'baja', 'tecnico', 'otro']),
  name: z
    .string()
    .trim()
    .min(2, 'Ingresá tu nombre.')
    .max(60, 'El nombre puede tener hasta 60 caracteres.'),
  email: z
    .string()
    .trim()
    .min(1, 'Ingresá tu correo electrónico.')
    .max(100, 'El correo electrónico puede tener hasta 100 caracteres.')
    .toLowerCase()
    .pipe(z.email('Ingresá un correo electrónico válido.')),
  message: z
    .string()
    .trim()
    .min(10, 'Contanos un poco más: el mensaje necesita al menos 10 caracteres.')
    .max(500, 'El mensaje puede tener hasta 500 caracteres.'),
})