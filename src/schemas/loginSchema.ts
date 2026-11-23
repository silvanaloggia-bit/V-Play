import { z } from 'zod'
export const loginSchema = z.object({
email: z.email('Ingresá un correo electrónico válido.'),
password: z.string().min(1, 'La contraseña es obligatoria.'),
})
