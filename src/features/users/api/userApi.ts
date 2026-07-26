import apiClient from '../../../shared/lib/axiosClient'
import type { UserResponse, PageUserResponse, CreateUserRequest } from '../types'

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