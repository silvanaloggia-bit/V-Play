import { z } from 'zod'
import { getCardDigits, isCardExpired, passesLuhnCheck } from '../utils/cardValidation'

export const subscriptionSchema = z.object({
  cardHolder: z
    .string()
    .trim()
    .min(3, 'Ingresá el nombre como figura en la tarjeta.')
    .max(40, 'El nombre puede tener hasta 40 caracteres.')
    .regex(/^[\p{L} ]+$/u, 'El nombre solo puede tener letras.'),
  cardNumber: z
    .string()
    .refine((cardNumber) => getCardDigits(cardNumber).length === 16, 'La tarjeta tiene 16 números.')
    .refine(passesLuhnCheck, 'El número de tarjeta no es válido.'),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Usá el formato MM/AA.')
    .refine((cardExpiry) => !isCardExpired(cardExpiry), 'La tarjeta está vencida.'),
  cardCode: z.string().regex(/^\d{3}$/, 'El código tiene 3 números.'),
})