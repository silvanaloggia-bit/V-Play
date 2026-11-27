export type ContactReason = 'plan' | 'baja' | 'tecnico' | 'otro'

export interface ContactMessage {
  id: string
  reason: ContactReason
  name: string
  email: string
  message: string
  sentAt: string
}
