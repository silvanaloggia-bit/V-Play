import { z } from 'zod'

export const userPlanSchema = z
  .object({
    planId: z.string(),
    isActive: z.boolean(),
    planEndDate: z.string(),
  })
  .refine((userPlanData) => userPlanData.planId === '' || userPlanData.planEndDate !== '', {
    message: 'Si el usuario tiene un plan, poné la fecha de vencimiento.',
    path: ['planEndDate'],
  })