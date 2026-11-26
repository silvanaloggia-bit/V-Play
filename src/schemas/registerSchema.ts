import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Ingresá tu nombre.')
      .max(40, 'El nombre puede tener hasta 40 caracteres.'),
    email: z
      .string()
      .trim()
      .min(1, 'Ingresá tu correo electrónico.')
      .max(100, 'El correo electrónico puede tener hasta 100 caracteres.')
      .toLowerCase()
      .pipe(z.email('Ingresá un correo electrónico válido.')),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .max(32, 'La contraseña puede tener hasta 32 caracteres.'),
    confirmPassword: z.string().min(1, 'Repetí la contraseña.'),
    acceptTerms: z
      .boolean()
      .refine((isAccepted) => isAccepted, 'Tenés que aceptar los términos y condiciones.'),
  })
  .refine((registerData) => registerData.password === registerData.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>