import apiClient from '../../../shared/lib/axiosClient'
import type { UserResponse } from '../../users/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserResponse
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  email: string
  otp: string
  newPassword: string
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post('/auth/password-reset/request', { email })
}

export async function confirmPasswordReset(payload: PasswordResetConfirmRequest): Promise<void> {
  await apiClient.post('/auth/password-reset/confirm', payload)
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return response.data
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })
  return response.data
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken })
}