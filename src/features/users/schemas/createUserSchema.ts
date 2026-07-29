import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter and one digit'),
  role: z.enum(['USER', 'AGENT', 'ADMIN']),
  phone: z.string().optional(),
  timezone: z.string().optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>