import { z } from 'zod'

export const requestResetSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})
export type RequestResetFormValues = z.infer<typeof requestResetSchema>

export const confirmResetSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})
export type ConfirmResetFormValues = z.infer<typeof confirmResetSchema>