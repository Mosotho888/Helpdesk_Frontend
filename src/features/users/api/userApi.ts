import apiClient from '../../../shared/lib/axiosClient'
import type { UserResponse, PageUserResponse, CreateUserRequest } from '../types'
import type { UpdateUserRequest } from '../types'

export async function getUsers(page = 0, size = 20): Promise<PageUserResponse> {
  const response = await apiClient.get<PageUserResponse>('/users', {
    params: { page, size },
  })
  return response.data
}

export async function createUser(payload: CreateUserRequest): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/users', payload)
  return response.data
}

export async function changeUserRole(userId: number, role: string): Promise<UserResponse> {
  const response = await apiClient.patch<UserResponse>(
    `/admin/users/${userId}/role`,
    null,
    { params: { role } }
  )
  return response.data
}

export async function deactivateUser(userId: number): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}`)
}

export async function reactivateUser(userId: number): Promise<void> {
  await apiClient.post(`/admin/users/${userId}/reactivate`)
}

export async function getMyProfile(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/users/me')
  return response.data
}

export async function updateMyProfile(userId: number, payload: UpdateUserRequest): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>(`/users/${userId}`, payload)
  return response.data
}

export async function changeOwnPassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.patch('/users/me/password', { currentPassword, newPassword })
}