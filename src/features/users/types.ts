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

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  timezone?: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  timezone?: string
}

export interface PageUserResponse {
  totalElements: number
  totalPages: number
  size: number
  content: UserResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}