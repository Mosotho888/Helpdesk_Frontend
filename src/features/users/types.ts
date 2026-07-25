export type UserRole = "USER" | "AGENT" | "ADMIN"

export interface UserResponse {
  id: number
  name: string
  email: string
  role: UserRole
  phone: string | null
  timezone: string | null
  active: boolean
  createdAt: string
}