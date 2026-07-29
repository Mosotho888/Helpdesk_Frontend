import { z } from 'zod'

export const createTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject must be under 255 characters'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.string().max(100).optional(),
})

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>